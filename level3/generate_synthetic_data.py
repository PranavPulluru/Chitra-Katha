"""
generate_synthetic_data.py
==========================
Builds a training CSV from your art-form image folders by:
  1. Sampling up to MAX_REFS_PER_FORM images per art form as "references"
  2. Running ContourPreprocessor on each → clean 128×128 binary contour
  3. Applying 5 quality-tier augmentations → synthetic "student drawings"
  4. Writing training.csv + validation.csv (ready for train.py --no-preprocess)

Output layout
-------------
  level3/training_data/
    synthetic/
      refs/      ← pre-processed reference contours
      students/  ← synthetic student contours at each quality tier
    training.csv
    validation.csv

No albumentations required — uses only cv2 + numpy.
"""

from __future__ import annotations

import csv
import random
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image as PILImage

_HERE = Path(__file__).parent
if str(_HERE) not in sys.path:
    sys.path.insert(0, str(_HERE))

from data.preprocessing import ContourPreprocessor

# ── config ─────────────────────────────────────────────────────────────────────
TRAINING_DATA_DIR  = _HERE / "training_data"
SYNTH_DIR          = TRAINING_DATA_DIR / "synthetic"
REFS_DIR           = SYNTH_DIR / "refs"
STUDENTS_DIR       = SYNTH_DIR / "students"
TRAIN_CSV          = TRAINING_DATA_DIR / "training.csv"
VAL_CSV            = TRAINING_DATA_DIR / "validation.csv"

MAX_REFS_PER_FORM  = 20     # max reference images sampled per art form
SAMPLES_PER_TIER   = 5      # synthetic students generated per quality tier
VAL_FRACTION       = 0.20
RANDOM_SEED        = 42

SUPPORTED_EXTS     = {".jpg", ".jpeg", ".png", ".webp"}   # .avif/.jxl skipped

# ── quality tiers ──────────────────────────────────────────────────────────────
# (tier_label, score_range, augmentation_params)
TIERS = [
    ("q95", (88, 98), dict(
        elastic_alpha=6,   elastic_sigma=4,
        shift=0.02, scale=0.03, rotate=2,
        n_holes=0,  hole_size=0, erode=0,
    )),
    ("q75", (68, 82), dict(
        elastic_alpha=25,  elastic_sigma=5,
        shift=0.04, scale=0.08, rotate=6,
        n_holes=2,  hole_size=10, erode=0,
    )),
    ("q52", (45, 62), dict(
        elastic_alpha=55,  elastic_sigma=6,
        shift=0.07, scale=0.12, rotate=12,
        n_holes=5,  hole_size=14, erode=1,
    )),
    ("q30", (22, 40), dict(
        elastic_alpha=90,  elastic_sigma=7,
        shift=0.10, scale=0.18, rotate=18,
        n_holes=8,  hole_size=18, erode=1,
    )),
    ("q10", (5, 18), dict(
        elastic_alpha=140, elastic_sigma=8,
        shift=0.14, scale=0.25, rotate=25,
        n_holes=12, hole_size=20, erode=2,
    )),
]

# ── preprocessor ──────────────────────────────────────────────────────────────
_preprocessor = ContourPreprocessor(
    output_size       = 128,
    blur_kernel       = 3,
    min_contour_area  = 2,
    contour_thickness = 1,
    auto_canny        = True,
    direct_edges      = True,
)


# ── image loading ──────────────────────────────────────────────────────────────

def _load_bgr(path: Path):
    """Load image as BGR numpy array. Tries cv2 first, falls back to PIL."""
    bgr = cv2.imread(str(path))
    if bgr is not None:
        return bgr
    try:
        pil = PILImage.open(str(path)).convert("RGB")
        return cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)
    except Exception:
        return None


def _extract_contour(bgr: np.ndarray):
    """
    BGR image → 128×128 white-bg/black-stroke binary contour.
    Returns None if the contour is empty (< 50 stroke pixels).
    """
    result = _preprocessor.process(bgr)          # white-bg, black-stroke uint8
    n_stroke = np.sum(result < 128)
    if n_stroke < 50:
        return None
    return result                                 # (128, 128) uint8


# ── pure-OpenCV augmentation pipeline ─────────────────────────────────────────

def _elastic(img: np.ndarray, alpha: float, sigma: float, rng: np.random.Generator):
    h, w = img.shape[:2]
    noise_x = rng.random((h, w)).astype(np.float32) * 2 - 1
    noise_y = rng.random((h, w)).astype(np.float32) * 2 - 1
    dx = cv2.GaussianBlur(noise_x, (0, 0), sigma) * alpha
    dy = cv2.GaussianBlur(noise_y, (0, 0), sigma) * alpha
    grid_x, grid_y = np.meshgrid(np.arange(w, dtype=np.float32),
                                   np.arange(h, dtype=np.float32))
    map_x = np.clip(grid_x + dx, 0, w - 1)
    map_y = np.clip(grid_y + dy, 0, h - 1)
    return cv2.remap(img, map_x, map_y, cv2.INTER_LINEAR,
                     borderMode=cv2.BORDER_CONSTANT, borderValue=255)


def _affine(img: np.ndarray, shift: float, scale: float, rotate: float,
            rng: np.random.Generator):
    h, w = img.shape[:2]
    tx    = rng.uniform(-shift, shift) * w
    ty    = rng.uniform(-shift, shift) * h
    sc    = 1.0 + rng.uniform(-scale, scale)
    angle = rng.uniform(-rotate, rotate)
    M = cv2.getRotationMatrix2D((w / 2, h / 2), angle, sc)
    M[0, 2] += tx
    M[1, 2] += ty
    return cv2.warpAffine(img, M, (w, h),
                          borderMode=cv2.BORDER_CONSTANT, borderValue=255)


def _dropout(img: np.ndarray, n_holes: int, hole_size: int,
             rng: np.random.Generator):
    """Erase random rectangular patches (simulates missing strokes)."""
    out = img.copy()
    h, w = out.shape[:2]
    for _ in range(n_holes):
        cx = int(rng.integers(0, w))
        cy = int(rng.integers(0, h))
        hs = int(rng.integers(max(1, hole_size // 2), hole_size + 1))
        x1, x2 = max(0, cx - hs // 2), min(w, cx + hs // 2)
        y1, y2 = max(0, cy - hs // 2), min(h, cy + hs // 2)
        out[y1:y2, x1:x2] = 255          # fill with background (white)
    return out


def _erode_strokes(img: np.ndarray, iters: int):
    """Thin strokes to simulate a light pencil touch."""
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    # strokes are black (0); dilate the inverted image = erode strokes
    inv = cv2.bitwise_not(img)
    inv = cv2.erode(inv, kernel, iterations=iters)
    return cv2.bitwise_not(inv)


def _augment(contour_wb: np.ndarray, params: dict, rng: np.random.Generator):
    """
    Apply tier-specific degradation to a white-bg/black-stroke contour.
    Returns same format.
    """
    out = contour_wb.copy()
    out = _elastic(out, params["elastic_alpha"], params["elastic_sigma"], rng)
    out = _affine(out, params["shift"], params["scale"], params["rotate"], rng)
    if params["n_holes"] > 0:
        out = _dropout(out, params["n_holes"], params["hole_size"], rng)
    if params["erode"] > 0:
        out = _erode_strokes(out, params["erode"])
    return out


# ── main ───────────────────────────────────────────────────────────────────────

def main():
    rng_py  = random.Random(RANDOM_SEED)
    rng_np  = np.random.default_rng(RANDOM_SEED)

    REFS_DIR.mkdir(parents=True, exist_ok=True)
    STUDENTS_DIR.mkdir(parents=True, exist_ok=True)

    art_form_dirs = sorted(
        d for d in TRAINING_DATA_DIR.iterdir()
        if d.is_dir() and d.name not in {"synthetic"}
    )

    if not art_form_dirs:
        print(f"No art-form folders found in {TRAINING_DATA_DIR}")
        return

    print(f"Art forms found: {[d.name for d in art_form_dirs]}\n")

    all_rows: list[dict] = []
    total_skipped = 0

    for art_dir in art_form_dirs:
        subject_id = art_dir.name

        # Collect loadable image paths
        candidates = [
            p for p in art_dir.iterdir()
            if p.is_file() and p.suffix.lower() in SUPPORTED_EXTS
        ]
        rng_py.shuffle(candidates)

        # Process up to MAX_REFS_PER_FORM images as references
        refs_processed = 0
        skipped = 0
        for img_path in candidates:
            if refs_processed >= MAX_REFS_PER_FORM:
                break

            bgr = _load_bgr(img_path)
            if bgr is None:
                skipped += 1
                continue

            contour = _extract_contour(bgr)
            if contour is None:
                skipped += 1
                continue

            # Save reference contour
            ref_stem  = f"{subject_id}_{img_path.stem[:40]}_ref"
            ref_stem  = ref_stem.replace(" ", "_")
            ref_out   = REFS_DIR / f"{ref_stem}.png"
            cv2.imwrite(str(ref_out), contour)

            # Generate synthetic students for each quality tier
            for tier_label, (score_lo, score_hi), tier_params in TIERS:
                for s_idx in range(SAMPLES_PER_TIER):
                    score  = rng_py.uniform(score_lo, score_hi)
                    student = _augment(contour, tier_params, rng_np)

                    stu_name = f"{subject_id}_{img_path.stem[:30]}_{tier_label}_s{s_idx:02d}.png"
                    stu_name = stu_name.replace(" ", "_")
                    stu_out  = STUDENTS_DIR / stu_name
                    cv2.imwrite(str(stu_out), student)

                    all_rows.append({
                        "ref_path":     str(ref_out),
                        "student_path": str(stu_out),
                        "score":        round(score, 2),
                        "subject_id":   subject_id,
                    })

            refs_processed += 1

        total_skipped += skipped
        print(f"  {subject_id:22s}  {refs_processed} refs  "
              f"-> {refs_processed * len(TIERS) * SAMPLES_PER_TIER} pairs"
              + (f"  ({skipped} images skipped)" if skipped else ""))

    # ── train / val split ─────────────────────────────────────────────────────
    # Shuffle and split at the art-form level to avoid data leakage:
    # all rows from a given (art_form, reference) land in the same split.
    from collections import defaultdict
    ref_groups: dict[str, list[dict]] = defaultdict(list)
    for row in all_rows:
        ref_groups[row["ref_path"]].append(row)

    groups = list(ref_groups.values())
    rng_py.shuffle(groups)
    n_val  = max(1, int(len(groups) * VAL_FRACTION))
    val_groups   = groups[:n_val]
    train_groups = groups[n_val:]

    train_rows = [r for g in train_groups for r in g]
    val_rows   = [r for g in val_groups   for r in g]

    fieldnames = ["ref_path", "student_path", "score", "subject_id"]

    with open(TRAIN_CSV, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(train_rows)

    with open(VAL_CSV, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(val_rows)

    sep = "-" * 55
    print(f"\n{sep}")
    print(f"Total pairs      : {len(all_rows)}")
    print(f"  Train          : {len(train_rows)}  ->  {TRAIN_CSV}")
    print(f"  Validation     : {len(val_rows)}   ->  {VAL_CSV}")
    if total_skipped:
        print(f"  Images skipped : {total_skipped}  (unreadable / empty contour)")
    print(f"{'-'*55}")
    print(f"\nNow run:\n")
    print(f"  conda activate stt_gpu")
    print(f"  cd \"{_HERE}\"")
    print(f"  pip install \"albumentations>=1.3,<2.0\"    # one-time")
    print(f"  python train.py \\")
    print(f"    --csv         training_data/training.csv \\")
    print(f"    --val-csv     training_data/validation.csv \\")
    print(f"    --no-preprocess \\")
    print(f"    --ckpt        checkpoints/ \\")
    print(f"    --pretrained \\")
    print(f"    --device      cuda \\")
    print(f"    --epochs      100 \\")
    print(f"    --P           14 \\")
    print(f"    --K           4 \\")
    print(f"    --batches     300")


if __name__ == "__main__":
    main()
