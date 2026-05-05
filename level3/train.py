"""
train.py — DTSiameseNet training script
========================================
Trains the DTSiameseNet model for structural drawing evaluation.

Expected data layout
--------------------
A CSV file with columns:

    ref_path, student_path, score, subject_id

  ref_path     : path to the reference contour image
  student_path : path to the student's drawing (same subject)
  score        : float quality score in [0, 100] (100 = perfect match)
  subject_id   : string grouping a reference with all its student drawings
                 (e.g. "sohrai_fish"). Used by the P-K batch sampler.

Images can be:
  • Raw photos (BGR) — the ContourPreprocessor pipeline will extract contours.
  • Pre-processed binary contours (white-stroke/black-bg or the inverse).
    Set --no-preprocess to skip the OpenCV pipeline.

Quick start
-----------
    python -m level3.train \\
        --csv    data/training.csv \\
        --ckpt   checkpoints/ \\
        --epochs 80 \\
        --device cpu

Curriculum
----------
  Stage 1 (epochs  1–20) : regression loss only  — warm up the score head
  Stage 2 (epochs 21–50) : + ranking loss        — learn pairwise ordering
  Stage 3 (epochs 51+  ) : regression weight ×0.4 — sharpen discrimination
"""

from __future__ import annotations

import argparse
import csv
import os
import random
import sys
from pathlib import Path

import cv2
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from scipy.stats import spearmanr
from torch.utils.data import DataLoader, Dataset, Sampler

# Make the level3 package importable when running from the repo root.
_HERE = Path(__file__).parent
if str(_HERE) not in sys.path:
    sys.path.insert(0, str(_HERE))

import albumentations as A
from model.model import DTSiameseNet
from data.preprocessing import ContourPreprocessor, to_distance_transform


# ── augmentation ───────────────────────────────────────────────────────────────

def build_augmentation() -> A.Compose:
    """
    Drawing-specific augmentations applied to the student image only.

    These simulate real student errors:
      ElasticTransform  — shaky hand / wavering stroke paths
      ShiftScaleRotate  — misaligned canvas, different drawing scale
      CoarseDropout     — missing strokes (student forgot a detail)

    NOT included: color jitter, random flips, normalization shifts.
    These make no sense for binary contour data.
    """
    return A.Compose([
        A.ElasticTransform(
            alpha=15.0, sigma=4.0, p=0.5,
        ),
        A.ShiftScaleRotate(
            shift_limit=0.05,
            scale_limit=0.10,
            rotate_limit=8,
            border_mode=cv2.BORDER_CONSTANT,
            value=0,
            p=0.6,
        ),
        A.CoarseDropout(
            max_holes=6,
            max_height=12,
            max_width=12,
            fill_value=0,
            p=0.3,
        ),
    ])


# ── dataset ────────────────────────────────────────────────────────────────────

class DrawingDataset(Dataset):
    """
    CSV-based dataset of (reference, student, score) drawing triples.

    The reference image is loaded without augmentation — it is the fixed
    ground truth. Augmentation is applied to the student image only, to
    prevent the model from over-fitting to exact stroke positions.

    Both images are converted to distance-transform tensors (float32, [0,1])
    before being returned.

    Parameters
    ----------
    csv_path   : path to the CSV file (see module docstring for format)
    preprocess : run ContourPreprocessor on raw BGR images (True by default).
                 Set False if your images are already binary contours.
    augment    : apply drawing-specific augmentations to student images
    dt_sigma   : Gaussian falloff for the distance transform (pixels)
    """

    def __init__(
        self,
        csv_path:   str | Path,
        preprocess: bool  = True,
        augment:    bool  = False,
        dt_sigma:   float = 5.0,
    ) -> None:
        self.dt_sigma = dt_sigma
        self.aug      = build_augmentation() if augment else None

        self.preprocessor = (
            ContourPreprocessor(
                output_size       = 128,
                blur_kernel       = 3,
                min_contour_area  = 2,
                contour_thickness = 1,
                auto_canny        = True,
                direct_edges      = True,
            )
            if preprocess
            else None
        )

        self.rows: list[dict] = []
        self.subject_to_indices: dict[str, list[int]] = {}

        with open(csv_path, newline="") as f:
            for i, row in enumerate(csv.DictReader(f)):
                self.rows.append({
                    "ref":     row["ref_path"],
                    "student": row["student_path"],
                    "score":   float(row["score"]),
                    "subject": row["subject_id"],
                })
                self.subject_to_indices.setdefault(row["subject_id"], []).append(i)

    # ── private helpers ───────────────────────────────────────────────────────

    def _load_binary(self, path: str) -> np.ndarray:
        """
        Load an image and return a white-stroke/black-bg binary contour.
        Handles both raw BGR images (via preprocessor) and pre-made contours.
        """
        bgr = cv2.imread(path)
        if bgr is None:
            raise FileNotFoundError(f"Image not found: {path}")

        if self.preprocessor is not None:
            binary = self.preprocessor.process(bgr)   # white-bg, black-stroke
            binary = cv2.bitwise_not(binary)           # → white-stroke, black-bg
        else:
            gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
            binary = gray if gray.mean() < 127 else cv2.bitwise_not(gray)

        return binary   # uint8, 255 = stroke

    def _binary_to_dt(self, binary: np.ndarray, augment: bool = False) -> torch.Tensor:
        """Apply optional augmentation then compute DT → (1, H, W) float32."""
        img = binary
        if augment and self.aug is not None:
            img = self.aug(image=binary)["image"]
        dt = to_distance_transform(img, sigma=self.dt_sigma)
        return torch.from_numpy(dt).unsqueeze(0)   # (1, H, W)

    # ── public API ────────────────────────────────────────────────────────────

    def __len__(self) -> int:
        return len(self.rows)

    def __getitem__(self, idx: int) -> tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        """Return (ref_dt, student_dt, score)."""
        row     = self.rows[idx]
        ref_bin = self._load_binary(row["ref"])
        stu_bin = self._load_binary(row["student"])
        ref_t   = self._binary_to_dt(ref_bin, augment=False)
        stu_t   = self._binary_to_dt(stu_bin, augment=True)
        score_t = torch.tensor(row["score"], dtype=torch.float32)
        return ref_t, stu_t, score_t


# ── P-K batch sampler ──────────────────────────────────────────────────────────

class PKBatchSampler(Sampler):
    """
    P-subjects × K-students batch sampler for metric learning.

    Each yielded batch contains exactly P*K sample indices: P distinct subjects
    with K student drawings per subject.  Having multiple students per subject
    in the same batch enables meaningful within-subject comparisons for both
    the ranking loss and the embedding triplet loss.

    Parameters
    ----------
    dataset     : DrawingDataset
    P           : subjects per batch
    K           : students per subject per batch
    num_batches : total batches per epoch
    """

    def __init__(
        self,
        dataset:     DrawingDataset,
        P:           int = 8,
        K:           int = 4,
        num_batches: int = 200,
    ) -> None:
        self.subject_to_indices = dataset.subject_to_indices
        self.subjects    = list(self.subject_to_indices.keys())
        self.P           = P
        self.K           = K
        self.num_batches = num_batches

    def __iter__(self):
        for _ in range(self.num_batches):
            subjects = random.choices(self.subjects, k=self.P)
            batch: list[int] = []
            for sid in subjects:
                idxs = self.subject_to_indices[sid]
                batch.extend(random.choices(idxs, k=self.K))
            yield batch

    def __len__(self) -> int:
        return self.num_batches


# ── loss function ──────────────────────────────────────────────────────────────

class DrawingLoss(nn.Module):
    """
    Combined loss for structural drawing quality learning.

    Components
    ----------
    regression  : Huber loss (predicted score vs GT score)
                  Huber with delta=10 tolerates the ±10-point inter-rater
                  variance typical in human quality judgements.

    ranking     : Soft-margin pairwise ranking loss.
                  For every (i, j) pair in the batch where the GT quality
                  gap exceeds `min_gap`, penalise incorrect score ordering.
                  Uses F.softplus for a smooth, everywhere-differentiable
                  alternative to max(0, ...).

    alignment   : L2 regularisation of the STN theta toward the identity
                  transform.  Prevents the spatial transformer from learning
                  a degenerate warp that hides all structural differences.

    Parameters
    ----------
    margin         : ranking margin (score units, default 5.0)
    min_gap        : minimum GT score difference to form a valid ranking pair
                     (filters near-equal-quality pairs with noisy labels)
    lambda_reg     : weight on regression loss
    lambda_align   : weight on alignment regulariser
    """

    def __init__(
        self,
        margin:       float = 5.0,
        min_gap:      float = 5.0,
        lambda_reg:   float = 1.0,
        lambda_align: float = 0.01,
    ) -> None:
        super().__init__()
        self.margin       = margin
        self.min_gap      = min_gap
        self.lambda_reg   = lambda_reg
        self.lambda_align = lambda_align

    def regression_loss(
        self,
        pred: torch.Tensor,
        gt:   torch.Tensor,
    ) -> torch.Tensor:
        return F.huber_loss(pred, gt, delta=10.0)

    def ranking_loss(
        self,
        scores:    torch.Tensor,   # (B,)
        gt_scores: torch.Tensor,   # (B,)
    ) -> torch.Tensor:
        """
        Vectorised pairwise ranking loss.

        For each pair (i, j) where gt_scores[i] - gt_scores[j] >= min_gap,
        penalise: softplus(scores[j] - scores[i] + margin)
        """
        # diff_gt[i,j] = gt_i - gt_j  (positive → i should score higher)
        diff_gt = gt_scores.unsqueeze(1) - gt_scores.unsqueeze(0)   # (B, B)
        valid   = diff_gt >= self.min_gap                            # (B, B) bool mask

        if not valid.any():
            return torch.tensor(0.0, device=scores.device)

        # pred_diff[i,j] = score_i - score_j
        diff_pred = scores.unsqueeze(1) - scores.unsqueeze(0)        # (B, B)

        # Penalise pairs where predicted ordering is wrong
        # loss[i,j] = softplus(-(diff_pred[i,j]) + margin)
        #           = softplus(margin - (score_i - score_j))
        pair_loss = F.softplus(self.margin - diff_pred)              # (B, B)
        return pair_loss[valid].mean()

    def alignment_loss(self, theta: torch.Tensor) -> torch.Tensor:
        """Pull STN parameters toward the identity transform."""
        identity = torch.tensor(
            [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0]],
            dtype=theta.dtype, device=theta.device,
        ).unsqueeze(0)
        return ((theta - identity) ** 2).mean()

    def forward(
        self,
        scores:    torch.Tensor,   # (B,)
        gt_scores: torch.Tensor,   # (B,)
        theta:     torch.Tensor,   # (B, 2, 3)
        use_ranking: bool = True,
    ) -> dict[str, torch.Tensor]:
        L_reg   = self.regression_loss(scores, gt_scores)
        L_align = self.alignment_loss(theta)
        L_rank  = self.ranking_loss(scores, gt_scores) if use_ranking else torch.tensor(0.0, device=scores.device)

        total = (
            self.lambda_reg   * L_reg
            + L_rank
            + self.lambda_align * L_align
        )

        return {
            "total":      total,
            "regression": L_reg.detach(),
            "ranking":    L_rank.detach(),
            "alignment":  L_align.detach(),
        }


# ── train / eval loops ─────────────────────────────────────────────────────────

def train_epoch(
    model:       DTSiameseNet,
    loader:      DataLoader,
    criterion:   DrawingLoss,
    optimiser:   torch.optim.Optimizer,
    device:      torch.device,
    use_ranking: bool,
    freeze_stn:  bool = False,
    scaler:      torch.cuda.amp.GradScaler | None = None,
) -> dict[str, float]:
    # Freeze or unfreeze the STN for this epoch
    for p in model.stn.parameters():
        p.requires_grad_(not freeze_stn)

    model.train()
    totals: dict[str, float] = {
        "total": 0.0, "regression": 0.0, "ranking": 0.0, "alignment": 0.0
    }
    n_batches = 0

    for ref_t, stu_t, scores_gt in loader:
        ref_t      = ref_t.to(device)
        stu_t      = stu_t.to(device)
        scores_gt  = scores_gt.to(device)

        optimiser.zero_grad()

        if scaler is not None:
            with torch.cuda.amp.autocast():
                out  = model(ref_t, stu_t)
                loss = criterion(out["score"], scores_gt, out["theta"], use_ranking)
            scaler.scale(loss["total"]).backward()
            scaler.unscale_(optimiser)
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            scaler.step(optimiser)
            scaler.update()
        else:
            out  = model(ref_t, stu_t)
            loss = criterion(out["score"], scores_gt, out["theta"], use_ranking)
            loss["total"].backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimiser.step()

        for k in totals:
            totals[k] += loss[k].item()
        n_batches += 1

    return {k: v / max(n_batches, 1) for k, v in totals.items()}


@torch.no_grad()
def eval_epoch(
    model:  DTSiameseNet,
    loader: DataLoader,
    device: torch.device,
) -> dict[str, float]:
    """Evaluate Spearman rank correlation between predicted and GT scores."""
    model.eval()
    all_pred, all_gt = [], []

    for ref_t, stu_t, scores_gt in loader:
        ref_t = ref_t.to(device)
        stu_t = stu_t.to(device)
        out   = model(ref_t, stu_t)
        all_pred.extend(out["score"].cpu().tolist())
        all_gt.extend(scores_gt.tolist())

    if len(all_pred) < 2:
        return {"spearman_rho": 0.0, "n_samples": len(all_pred)}

    rho, _ = spearmanr(all_pred, all_gt)
    return {"spearman_rho": float(rho), "n_samples": len(all_pred)}


# ── curriculum helpers ─────────────────────────────────────────────────────────

def get_curriculum_params(epoch: int) -> dict:
    """
    Three-stage curriculum:
      Stage 1 (1–20)  : STN frozen at identity. Regression only.
                        Score head learns clean features without STN noise.
      Stage 2 (21–50) : STN unfrozen with strong alignment constraint.
                        Add ranking loss. STN learns small corrections only.
      Stage 3 (51+)   : Reduce regression weight. Ranking dominates.
                        Loosen alignment slightly for fine-grained warps.
    """
    if epoch <= 20:
        # STN frozen. Regression only — calibrate the score head.
        return {"use_ranking": False, "lambda_reg": 1.0,  "lambda_align": 1.0,  "freeze_stn": True}
    elif epoch <= 50:
        # STN unfrozen. Ranking drives gradients; regression is a light anchor.
        # lambda_reg=0.05: 0.05×55≈2.8 vs rank≈1.5 → ranking is ~35% of loss.
        return {"use_ranking": True,  "lambda_reg": 0.05, "lambda_align": 0.5,  "freeze_stn": False}
    else:
        # Ranking dominates completely. Regression is a tiny calibration signal.
        return {"use_ranking": True,  "lambda_reg": 0.02, "lambda_align": 0.20, "freeze_stn": False}


# ── main ───────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="Train DTSiameseNet")

    # Data
    parser.add_argument("--csv",          required=True,         help="Training CSV")
    parser.add_argument("--val-csv",      default=None,          help="Validation CSV (optional)")
    parser.add_argument("--no-preprocess",action="store_true",   help="Skip ContourPreprocessor (images already contours)")
    parser.add_argument("--dt-sigma",     type=float, default=5.0, help="DT Gaussian sigma (px)")

    # Batch construction
    parser.add_argument("--P",            type=int,   default=8,   help="Subjects per batch (P-K sampler)")
    parser.add_argument("--K",            type=int,   default=4,   help="Students per subject per batch")
    parser.add_argument("--batches",      type=int,   default=200, help="Batches per epoch")

    # Training
    parser.add_argument("--epochs",       type=int,   default=80)
    parser.add_argument("--lr",           type=float, default=1e-4)
    parser.add_argument("--weight-decay", type=float, default=1e-4)
    parser.add_argument("--pretrained",   action="store_true",    help="Init backbone from ImageNet ResNet18")
    parser.add_argument("--resume",       default=None,           help="Checkpoint to resume from")

    # Output
    parser.add_argument("--ckpt",         default="level3/checkpoints", help="Checkpoint output directory")
    parser.add_argument("--device",       default="cpu")
    parser.add_argument("--seed",         type=int,   default=42)

    args = parser.parse_args()

    # ── reproducibility ───────────────────────────────────────────────────────
    random.seed(args.seed)
    np.random.seed(args.seed)
    torch.manual_seed(args.seed)

    device = torch.device(args.device)
    ckpt_dir = Path(args.ckpt)
    ckpt_dir.mkdir(parents=True, exist_ok=True)

    # ── datasets & loaders ───────────────────────────────────────────────────
    preprocess = not args.no_preprocess

    train_ds = DrawingDataset(
        args.csv,
        preprocess = preprocess,
        augment    = True,
        dt_sigma   = args.dt_sigma,
    )
    pk_sampler = PKBatchSampler(
        train_ds,
        P           = args.P,
        K           = args.K,
        num_batches = args.batches,
    )
    train_loader = DataLoader(
        train_ds,
        batch_sampler = pk_sampler,
        num_workers   = 0,
        pin_memory    = (device.type == "cuda"),
    )

    val_loader = None
    if args.val_csv:
        val_ds = DrawingDataset(
            args.val_csv,
            preprocess = preprocess,
            augment    = False,
            dt_sigma   = args.dt_sigma,
        )
        val_loader = DataLoader(
            val_ds,
            batch_size  = 16,
            shuffle     = False,
            num_workers = 0,
        )

    # ── model, optimiser, scheduler ──────────────────────────────────────────
    model = DTSiameseNet(pretrained=args.pretrained).to(device)

    start_epoch = 1
    if args.resume:
        ckpt = torch.load(args.resume, map_location=device, weights_only=True)
        model.load_state_dict(ckpt.get("state_dict", ckpt))
        start_epoch = ckpt.get("epoch", 0) + 1
        print(f"Resumed from {args.resume} (epoch {start_epoch})")

    optimiser = torch.optim.AdamW(
        model.parameters(),
        lr           = args.lr,
        weight_decay = args.weight_decay,
    )
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(
        optimiser,
        T_max  = args.epochs,
        eta_min = args.lr * 0.05,
    )
    # If resuming, fast-forward the scheduler
    for _ in range(start_epoch - 1):
        scheduler.step()

    criterion = DrawingLoss()

    use_amp   = (device.type == "cuda")
    scaler    = torch.cuda.amp.GradScaler() if use_amp else None

    best_rho  = -1.0
    best_loss = float("inf")

    print(f"\nTraining DTSiameseNet for {args.epochs} epochs on {device}")
    print(f"  Train samples : {len(train_ds)}")
    print(f"  Batch size    : {args.P * args.K}  (P={args.P}, K={args.K})")
    print(f"  Pretrained    : {args.pretrained}\n")

    # ── training loop ─────────────────────────────────────────────────────────
    for epoch in range(start_epoch, args.epochs + 1):
        cur = get_curriculum_params(epoch)
        criterion.lambda_reg   = cur["lambda_reg"]
        criterion.lambda_align = cur["lambda_align"]

        train_metrics = train_epoch(
            model, train_loader, criterion, optimiser, device,
            use_ranking = cur["use_ranking"],
            freeze_stn  = cur["freeze_stn"],
            scaler      = scaler,
        )
        scheduler.step()

        stage = 1 if epoch <= 20 else (2 if epoch <= 50 else 3)
        log   = (
            f"Epoch {epoch:3d}/{args.epochs} [stage {stage}] "
            f"loss={train_metrics['total']:.4f} "
            f"reg={train_metrics['regression']:.4f} "
            f"rank={train_metrics['ranking']:.4f} "
            f"align={train_metrics['alignment']:.4f}"
        )

        if val_loader is not None:
            val_metrics = eval_epoch(model, val_loader, device)
            log += f"  |  val_rho={val_metrics['spearman_rho']:.4f}"
            is_best = val_metrics["spearman_rho"] > best_rho
            if is_best:
                best_rho = val_metrics["spearman_rho"]
        else:
            is_best = train_metrics["total"] < best_loss
            if is_best:
                best_loss = train_metrics["total"]

        print(log)

        # ── checkpoint saving ─────────────────────────────────────────────────
        save_payload = {
            "epoch":      epoch,
            "state_dict": model.state_dict(),
            "optimiser":  optimiser.state_dict(),
        }
        if is_best:
            torch.save(save_payload, ckpt_dir / "best.pt")
            print(f"  → saved best checkpoint")

        if epoch % 10 == 0:
            torch.save(save_payload, ckpt_dir / f"epoch_{epoch:04d}.pt")

    print(f"\nTraining complete. Best checkpoint: {ckpt_dir / 'best.pt'}")


if __name__ == "__main__":
    main()
