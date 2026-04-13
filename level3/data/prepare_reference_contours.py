"""
data/prepare_reference_contours.py
====================================
Converts raw Sohrai art images into clean reference contour PNGs ready for
training with SyntheticPairDataset.

Pipeline per image
------------------
  1. Load BGR image
  2. ContourPreprocessor  →  white-background / black-stroke (as per existing
                              preprocessing.py convention)
  3. Invert               →  white-stroke / black-background
                              (required by SyntheticPairGenerator and _to_tensor)
  4. Dilate               →  fatten the 1-px Canny lines slightly so DINOv2
                              patch tokens see enough signal
  5. Save as PNG to output_dir at 224×224

Usage
-----
    python level3/data/prepare_reference_contours.py

    # or override paths/settings:
    python level3/data/prepare_reference_contours.py \\
        --input_dir  "images/sohrai/filtered" \\
        --output_dir "level3/data/reference_contours" \\
        --output_size 224 \\
        --canny_low 40 --canny_high 120 \\
        --dilate_px 2 \\
        --preview
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import cv2
import numpy as np

# ── make project root importable regardless of cwd ────────────────────────────
_REPO_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(_REPO_ROOT))

from level3.data.preprocessing import ContourPreprocessor


# ── defaults ───────────────────────────────────────────────────────────────────

INPUT_DIR   = _REPO_ROOT / "images" / "sohrai" / "filtered"
OUTPUT_DIR  = _REPO_ROOT / "level3" / "data" / "reference_contours"

# Supported source extensions
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".tif", ".webp"}


# ── processing ─────────────────────────────────────────────────────────────────

def process_image(
    path:          Path,
    preprocessor:  ContourPreprocessor,
    output_size:   int,
    dilate_px:     int,
) -> np.ndarray | None:
    """
    Load one image, extract a clean contour, and return a white-on-black
    uint8 array of shape (output_size, output_size).

    Returns None if no contour was found (blank or unreadable image).
    """
    bgr = cv2.imread(str(path))
    if bgr is None:
        return None

    # ContourPreprocessor → (output_size, output_size) white-bg black-stroke
    contour_img = preprocessor.process(bgr)   # uint8

    # Invert: white-on-black is required by SyntheticPairGenerator + _to_tensor
    contour_inv = cv2.bitwise_not(contour_img)

    # Skip blank results (no contour pixels survived the pipeline)
    if contour_inv.max() == 0:
        return None

    # Dilate to thicken 1-px Canny lines → more visible in 14×14 DINOv2 patches
    if dilate_px > 0:
        kernel      = cv2.getStructuringElement(
            cv2.MORPH_ELLIPSE, (dilate_px * 2 + 1, dilate_px * 2 + 1)
        )
        contour_inv = cv2.dilate(contour_inv, kernel, iterations=1)

    # Resize to the target output size (ContourPreprocessor already resizes to
    # its own output_size; this step brings it to 224×224 for DINOv2)
    if contour_inv.shape[0] != output_size:
        contour_inv = cv2.resize(
            contour_inv, (output_size, output_size), interpolation=cv2.INTER_LINEAR
        )
        # Re-binarise after interpolation artefacts
        _, contour_inv = cv2.threshold(contour_inv, 127, 255, cv2.THRESH_BINARY)

    return contour_inv


def save_preview_grid(
    samples:     list[np.ndarray],
    output_path: Path,
    grid_cols:   int = 8,
    cell_size:   int = 112,
) -> None:
    """Save a grid of up to len(samples) contour thumbnails as a single PNG."""
    n        = len(samples)
    cols     = min(grid_cols, n)
    rows     = (n + cols - 1) // cols
    canvas   = np.zeros((rows * cell_size, cols * cell_size), dtype=np.uint8)

    for i, img in enumerate(samples):
        r, c    = divmod(i, cols)
        thumb   = cv2.resize(img, (cell_size, cell_size), interpolation=cv2.INTER_AREA)
        canvas[r * cell_size:(r + 1) * cell_size,
               c * cell_size:(c + 1) * cell_size] = thumb

    cv2.imwrite(str(output_path), canvas)
    print(f"Preview grid saved → {output_path}")


# ── main ───────────────────────────────────────────────────────────────────────

def main(args: argparse.Namespace) -> None:
    input_dir  = Path(args.input_dir)
    output_dir = Path(args.output_dir)

    if not input_dir.exists():
        sys.exit(f"ERROR: input_dir does not exist: {input_dir}")

    output_dir.mkdir(parents=True, exist_ok=True)

    # Collect source images
    sources = sorted(
        p for p in input_dir.iterdir()
        if p.suffix.lower() in IMAGE_EXTS
    )
    if not sources:
        sys.exit(f"ERROR: no images found in {input_dir}")

    print(f"Found {len(sources)} source images in {input_dir}")
    print(f"Output → {output_dir}  (size={args.output_size}px, dilate={args.dilate_px}px)")
    print()

    preprocessor = ContourPreprocessor(
        output_size       = args.output_size,   # preprocess at target size directly
        blur_kernel       = args.blur_kernel,
        canny_low         = args.canny_low,
        canny_high        = args.canny_high,
        min_contour_area  = args.min_contour_area,
        contour_thickness = args.contour_thickness,
    )

    n_ok      = 0
    n_blank   = 0
    n_error   = 0
    previews: list[np.ndarray] = []

    for idx, src_path in enumerate(sources):
        stem = src_path.stem
        out_path = output_dir / f"{stem}.png"

        try:
            result = process_image(src_path, preprocessor, args.output_size, args.dilate_px)
        except Exception as exc:
            print(f"  [ERROR]  {src_path.name}: {exc}")
            n_error += 1
            continue

        if result is None:
            print(f"  [BLANK]  {src_path.name}  — no contour detected, skipping")
            n_blank += 1
            continue

        cv2.imwrite(str(out_path), result)
        n_ok += 1

        if args.preview and len(previews) < 64:
            previews.append(result)

        # Progress every 50 images
        if (idx + 1) % 50 == 0 or (idx + 1) == len(sources):
            print(f"  {idx + 1:4d}/{len(sources)}  saved={n_ok}  blank={n_blank}  error={n_error}")

    print()
    print("=" * 50)
    print(f"Done.  Saved: {n_ok}  |  Blank: {n_blank}  |  Errors: {n_error}")
    print(f"Reference contours ready in: {output_dir}")

    if args.preview and previews:
        save_preview_grid(previews, output_dir / "_preview_grid.png")


# ── CLI ────────────────────────────────────────────────────────────────────────

def _parse() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Prepare Sohrai reference contours for Chitra Katha training"
    )
    p.add_argument("--input_dir",        default=str(INPUT_DIR),  type=str)
    p.add_argument("--output_dir",       default=str(OUTPUT_DIR), type=str)
    p.add_argument("--output_size",      default=224,  type=int,
                   help="Output image size in pixels (default: 224 for DINOv2)")
    p.add_argument("--blur_kernel",      default=5,    type=int)
    p.add_argument("--canny_low",        default=30,   type=int,
                   help="Lower Canny threshold (lower = pick up finer strokes)")
    p.add_argument("--canny_high",       default=120,  type=int,
                   help="Upper Canny threshold")
    p.add_argument("--min_contour_area", default=2,   type=int,
                   help="Min contour area in px² (smaller = keep finer detail)")
    p.add_argument("--contour_thickness",default=1,    type=int,
                   help="Stroke thickness when re-drawing contours")
    p.add_argument("--dilate_px",        default=0,    type=int,
                   help="Dilation radius in px to thicken Canny lines (0=off)")
    p.add_argument("--preview",          action="store_true",
                   help="Save a _preview_grid.png to output_dir for quick QA")
    return p.parse_args()


if __name__ == "__main__":
    main(_parse())
