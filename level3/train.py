"""
train.py — Chitra Katha training loop
=======================================
Trains only the ProjectionHead on top of the frozen DINOv2 backbone.

Usage
-----
    python level3/train.py --ref_dir path/to/reference_contours/ [options]

All reference contours must be PNG files (white-on-black or black-on-white —
the dataset normalises orientation automatically).

Typical workflow
----------------
1.  Extract reference contours with data/preprocessing.py.
2.  Run this script.  Checkpoints are saved to --ckpt_dir.
3.  Use model/inference.py to score new child drawings.
"""

from __future__ import annotations

import argparse
import time
from pathlib import Path

import torch
import torch.nn as nn
from torch.utils.data import DataLoader, random_split

# ── project imports ────────────────────────────────────────────────────────────
import sys
sys.path.insert(0, str(Path(__file__).parent))

from model.model import ChitraKathaModel
from model.loss  import ChitraKathaLoss
from data.data_gen import SyntheticPairDataset


# ── defaults ───────────────────────────────────────────────────────────────────

DEFAULTS = dict(
    ref_dir         = "level3/data/reference_contours",
    ckpt_dir        = "level3/checkpoints",
    epochs          = 40,
    batch_size      = 16,
    lr              = 3e-4,
    weight_decay    = 1e-4,
    pairs_per_image = 30,
    val_split       = 0.15,
    num_workers     = 0,       # 0 is required on Windows; increase on Linux/Mac
    amp             = False,   # mixed-precision (CUDA only; CPU builds ignore this)
    log_every       = 20,      # steps between console log lines
    save_every      = 5,       # epochs between checkpoint saves
    lambda_cls      = 0.5,
    margin          = 1.5,
)


# ── epoch functions ────────────────────────────────────────────────────────────

def train_one_epoch(
    model:     ChitraKathaModel,
    loader:    DataLoader,
    criterion: ChitraKathaLoss,
    optimiser: torch.optim.Optimizer,
    scaler:    torch.cuda.amp.GradScaler,
    device:    torch.device,
    amp:       bool,
    log_every: int,
    epoch:     int,
) -> dict[str, float]:

    model.train()
    # Backbone stays frozen — force eval mode on it to disable dropout/BN
    model.backbone.eval()

    totals: dict[str, float] = {"patch": 0.0, "cls": 0.0, "total": 0.0}
    n_steps = 0
    t0 = time.time()

    for step, (ref, child, similarity) in enumerate(loader):
        ref        = ref.to(device)
        child      = child.to(device)
        similarity = similarity.to(device)

        optimiser.zero_grad()

        with torch.autocast(device_type=device.type, enabled=amp):
            out = model(ref, child)

            # CLS tokens come straight from the backbone (no grad through
            # backbone, but proj_head receives grad via patch embeddings)
            cls_ref_enc, _   = model.encode_single(ref)
            cls_child_enc, _ = model.encode_single(child)

            loss, breakdown = criterion(
                patch_ref   = out["patch_ref"],
                patch_child = out["patch_child"],
                cls_ref     = cls_ref_enc,
                cls_child   = cls_child_enc,
                similarity  = similarity,
            )

        scaler.scale(loss).backward()
        scaler.unscale_(optimiser)
        nn.utils.clip_grad_norm_(model.proj_head.parameters(), max_norm=1.0)
        scaler.step(optimiser)
        scaler.update()

        for k, v in breakdown.items():
            totals[k] += v
        n_steps += 1

        if (step + 1) % log_every == 0:
            elapsed = time.time() - t0
            print(
                f"  epoch {epoch:3d} | step {step+1:4d}/{len(loader)} "
                f"| loss {breakdown['total']:.4f} "
                f"(patch {breakdown['patch']:.4f}, cls {breakdown['cls']:.4f}) "
                f"| {elapsed:.1f}s"
            )

    return {k: v / max(n_steps, 1) for k, v in totals.items()}


@torch.no_grad()
def validate(
    model:     ChitraKathaModel,
    loader:    DataLoader,
    criterion: ChitraKathaLoss,
    device:    torch.device,
    amp:       bool,
) -> dict[str, float]:

    model.eval()
    totals: dict[str, float] = {"patch": 0.0, "cls": 0.0, "total": 0.0}
    n_steps = 0

    for ref, child, similarity in loader:
        ref        = ref.to(device)
        child      = child.to(device)
        similarity = similarity.to(device)

        with torch.autocast(device_type=device.type, enabled=amp):
            out = model(ref, child)
            cls_ref_enc,   _ = model.encode_single(ref)
            cls_child_enc, _ = model.encode_single(child)

            _, breakdown = criterion(
                patch_ref   = out["patch_ref"],
                patch_child = out["patch_child"],
                cls_ref     = cls_ref_enc,
                cls_child   = cls_child_enc,
                similarity  = similarity,
            )

        for k, v in breakdown.items():
            totals[k] += v
        n_steps += 1

    return {k: v / max(n_steps, 1) for k, v in totals.items()}


# ── checkpoint helpers ─────────────────────────────────────────────────────────

def save_checkpoint(
    path:      Path,
    epoch:     int,
    model:     ChitraKathaModel,
    optimiser: torch.optim.Optimizer,
    scheduler: torch.optim.lr_scheduler._LRScheduler,
    val_loss:  float,
) -> None:
    torch.save(
        {
            "epoch":           epoch,
            "proj_head_state": model.proj_head.state_dict(),
            "optimiser_state": optimiser.state_dict(),
            "scheduler_state": scheduler.state_dict(),
            "val_loss":        val_loss,
        },
        path,
    )


def load_checkpoint(
    path:      Path,
    model:     ChitraKathaModel,
    optimiser: torch.optim.Optimizer | None = None,
    scheduler: torch.optim.lr_scheduler._LRScheduler | None = None,
) -> int:
    """Load projection head weights (+ optional optimiser/scheduler state).
    Returns the epoch number stored in the checkpoint."""
    ckpt = torch.load(path, map_location="cpu")
    model.proj_head.load_state_dict(ckpt["proj_head_state"])
    if optimiser is not None and "optimiser_state" in ckpt:
        optimiser.load_state_dict(ckpt["optimiser_state"])
    if scheduler is not None and "scheduler_state" in ckpt:
        scheduler.load_state_dict(ckpt["scheduler_state"])
    return ckpt.get("epoch", 0)


# ── main ───────────────────────────────────────────────────────────────────────

def main(cfg: argparse.Namespace) -> None:
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}")

    # ── dataset ──────────────────────────────────────────────────────────────
    full_dataset = SyntheticPairDataset(
        ref_dir         = cfg.ref_dir,
        pairs_per_image = cfg.pairs_per_image,
        image_size      = 224,
        augment_ref     = True,
    )
    n_val   = max(1, int(len(full_dataset) * cfg.val_split))
    n_train = len(full_dataset) - n_val
    train_ds, val_ds = random_split(
        full_dataset, [n_train, n_val],
        generator=torch.Generator().manual_seed(42),
    )
    train_loader = DataLoader(
        train_ds,
        batch_size  = cfg.batch_size,
        shuffle     = True,
        num_workers = cfg.num_workers,
        pin_memory  = device.type == "cuda",
        drop_last   = True,
    )
    val_loader = DataLoader(
        val_ds,
        batch_size  = cfg.batch_size * 2,
        shuffle     = False,
        num_workers = cfg.num_workers,
        pin_memory  = device.type == "cuda",
    )
    print(f"Train pairs: {n_train}  |  Val pairs: {n_val}")

    # ── model ─────────────────────────────────────────────────────────────────
    model = ChitraKathaModel(pretrained=True).to(device)
    criterion = ChitraKathaLoss(
        lambda_cls = cfg.lambda_cls,
        margin     = cfg.margin,
        normalise  = True,
    )

    # Only the projection head is trained
    trainable_params = list(model.proj_head.parameters())
    optimiser = torch.optim.AdamW(
        trainable_params,
        lr           = cfg.lr,
        weight_decay = cfg.weight_decay,
    )
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(
        optimiser, T_max=cfg.epochs, eta_min=cfg.lr * 0.01
    )
    use_amp = cfg.amp and device.type == "cuda"
    scaler  = torch.amp.GradScaler("cuda", enabled=use_amp)

    # ── optional resume ───────────────────────────────────────────────────────
    ckpt_dir = Path(cfg.ckpt_dir)
    ckpt_dir.mkdir(parents=True, exist_ok=True)
    start_epoch = 0
    best_ckpt   = ckpt_dir / "best.pt"
    resume_ckpt = ckpt_dir / "last.pt"
    if resume_ckpt.exists():
        start_epoch = load_checkpoint(resume_ckpt, model, optimiser, scheduler)
        print(f"Resumed from epoch {start_epoch}")

    # ── training loop ─────────────────────────────────────────────────────────
    best_val_loss = float("inf")

    for epoch in range(start_epoch + 1, cfg.epochs + 1):
        train_metrics = train_one_epoch(
            model, train_loader, criterion, optimiser, scaler,
            device, use_amp, cfg.log_every, epoch,
        )
        val_metrics = validate(model, val_loader, criterion, device, use_amp)

        scheduler.step()

        print(
            f"Epoch {epoch:3d}/{cfg.epochs} "
            f"| train {train_metrics['total']:.4f} "
            f"| val {val_metrics['total']:.4f} "
            f"| lr {scheduler.get_last_lr()[0]:.2e}"
        )

        # Save last checkpoint every epoch
        save_checkpoint(resume_ckpt, epoch, model, optimiser, scheduler, val_metrics["total"])

        # Save periodic + best checkpoints
        if epoch % cfg.save_every == 0:
            save_checkpoint(ckpt_dir / f"epoch_{epoch:03d}.pt", epoch, model, optimiser, scheduler, val_metrics["total"])

        if val_metrics["total"] < best_val_loss:
            best_val_loss = val_metrics["total"]
            save_checkpoint(best_ckpt, epoch, model, optimiser, scheduler, best_val_loss)
            print(f"  ✓ New best val loss: {best_val_loss:.4f}")

    print(f"\nTraining complete. Best checkpoint: {best_ckpt}")


# ── CLI ────────────────────────────────────────────────────────────────────────

def _parse() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Train Chitra Katha projection head")
    for key, val in DEFAULTS.items():
        kwargs: dict = {"default": val}
        if isinstance(val, bool):
            kwargs["action"] = "store_true" if not val else "store_false"
        else:
            kwargs["type"] = type(val)
        p.add_argument(f"--{key}", **kwargs)
    return p.parse_args()


if __name__ == "__main__":
    main(_parse())
