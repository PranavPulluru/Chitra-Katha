"""
data/prepare_dataset.py — Sohrai contour dataset builder
=========================================================
Walks raw Sohrai reference images, runs ContourPreprocessor on each,
saves clean contour PNGs, and writes labels.json.

Input folder layout
-------------------
    raw/
        step_0/   ← body outline reference images
        step_1/   ← head/neck added
        step_2/   ← limbs added
        step_3/   ← decorative fill added

All images in each folder are treated as correct reference examples
(shape_score = 1.0, errors = [0, 0, 0, 0]).

Output folder layout
--------------------
    processed/
        images/
            0001.png
            0002.png
            ...
        labels.json

Usage
-----
    python prepare_dataset.py                  # uses paths below
    python prepare_dataset.py --preview        # show before/after, no write
    python prepare_dataset.py --edge adaptive  # for wall-photo references
    python prepare_dataset.py --dry-run
"""

import argparse
import json
import sys
from pathlib import Path

import cv2
import numpy as np

from preprocessing import ContourPreprocessor, PREPROCESS_CFG


RAW_DIR = "raw"
OUT_DIR = "processed"
IMG_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"}
NUM_STAGES = 4   # must match MODEL_CFG["num_stages"]


def _iter_images(raw_dir: Path):
    """Yield (stage, image_path) for every image across step_0 … step_N."""
    for stage in range(NUM_STAGES):
        step_dir = raw_dir / f"step_{stage}"
        if not step_dir.exists():
            print(f"  [warn] missing folder: {step_dir} — skipping stage {stage}")
            continue
        for img_path in sorted(step_dir.iterdir()):
            if img_path.suffix.lower() in IMG_EXTS:
                yield stage, img_path


def build(raw_dir: Path, out_dir: Path, edge_mode: str, dry_run: bool):
    if not raw_dir.exists():
        sys.exit(f"[error] raw dir not found: {raw_dir.resolve()}")

    images_out = out_dir / "images"
    if not dry_run:
        images_out.mkdir(parents=True, exist_ok=True)

    preprocessor = ContourPreprocessor(edge_mode=edge_mode)
    labels = []
    skipped = 0

    items = list(_iter_images(raw_dir))
    if not items:
        sys.exit(f"[error] no images found under {raw_dir.resolve()}")

    print(f"Found {len(items)} image(s)  |  edge mode: {edge_mode}")
    if dry_run:
        print("[dry-run] no files will be written\n")

    for idx, (stage, img_path) in enumerate(items):
        bgr = cv2.imread(str(img_path))
        if bgr is None:
            print(f"  [skip] unreadable: {img_path}")
            skipped += 1
            continue

        contour = preprocessor.process(bgr)

        # Warn if nearly blank — usually means thresholds need tuning or
        # the source image is a low-contrast wall photo (try --edge adaptive)
        if np.sum(contour == 0) / contour.size < 0.005:
            print(f"  [warn] almost no strokes detected: {img_path.name}")

        filename = f"{idx + 1:04d}.png"
        if not dry_run:
            cv2.imwrite(str(images_out / filename), contour)

        labels.append({
            "file":        filename,
            "motif":       "sohrai",
            "stage":       stage,
            "shape_score": 1.0,
            "errors":      [0, 0, 0, 0],
        })

    if not dry_run:
        labels_path = out_dir / "labels.json"
        with open(labels_path, "w") as f:
            json.dump(labels, f, indent=2)
        n = len(labels)
        print(f"\nDone. {n} images → {out_dir.resolve()}")
        if skipped:
            print(f"Skipped {skipped} unreadable file(s).")
    else:
        print(f"\nDry-run: would write {len(labels)} images.")


def preview(raw_dir: Path, edge_mode: str, n: int = 3):
    preprocessor = ContourPreprocessor(edge_mode=edge_mode)
    shown = 0
    for stage, img_path in _iter_images(raw_dir):
        if shown >= n:
            break
        bgr = cv2.imread(str(img_path))
        if bgr is None:
            continue
        contour = preprocessor.process(bgr)
        cv2.imshow(f"original – stage {stage}", cv2.resize(bgr, (400, 400)))
        cv2.imshow(f"contour  – stage {stage}", cv2.resize(contour, (400, 400)))
        print(f"{img_path.name}  |  press any key for next")
        cv2.waitKey(0)
        cv2.destroyAllWindows()
        shown += 1
    if shown == 0:
        print(f"[error] no images found under {raw_dir.resolve()}")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--raw",     default=RAW_DIR)
    p.add_argument("--out",     default=OUT_DIR)
    p.add_argument("--edge",    default=PREPROCESS_CFG["edge_mode"],
                   choices=["canny", "adaptive"])
    p.add_argument("--preview", action="store_true")
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()

    raw = Path(args.raw)
    if args.preview:
        preview(raw, args.edge)
    else:
        build(raw, Path(args.out), args.edge, args.dry_run)
