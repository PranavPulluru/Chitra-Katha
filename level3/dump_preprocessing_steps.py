"""
dump_preprocessing_steps.py
===========================
Save an image at every stage of the preprocessing pipeline, using the same
ContourPreprocessor settings as server.py.

Usage
-----
    python level3/dump_preprocessing_steps.py <image> [--ref] [--out DIR]

  --ref : use the reference-image config (no background removal, blur 5)
          instead of the student-photo config.
"""

from __future__ import annotations

import argparse
import os
import sys

import cv2
import numpy as np
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from data.background_removal import remove_background
from data.preprocessing import ContourPreprocessor, to_distance_transform

# Mirrors server.py
STUDENT_CFG = dict(
    output_size=224, blur_kernel=3, min_contour_area=2,
    auto_canny=True, direct_edges=True,
    strip_background=True, center_subject=True,
)
REF_CFG = dict(
    output_size=224, blur_kernel=5, min_contour_area=2,
    auto_canny=True, direct_edges=True,
    strip_background=False, center_subject=True,
)


def dump_steps(bgr: np.ndarray, proc: ContourPreprocessor, out_dir: str) -> list[str]:
    os.makedirs(out_dir, exist_ok=True)
    written = []

    def save(name: str, img: np.ndarray) -> None:
        path = os.path.join(out_dir, f"{len(written):02d}_{name}.png")
        cv2.imwrite(path, img)
        written.append(path)

    save("original", bgr)

    img = bgr
    if proc.strip_background:
        img = remove_background(img)
        save("background_removed", img)

    if proc.center_subject:
        img = proc._crop_to_subject(img)
        save("cropped_to_subject", img)

    # Same sequence as ContourPreprocessor._to_edges
    resized = cv2.resize(img, (proc.output_size, proc.output_size))
    save("resized", resized)

    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
    save("grayscale", gray)

    blurred = proc._blur(gray)
    save("blurred", blurred)

    edges = proc._edges(blurred)          # white strokes on black
    save("canny_edges", edges)

    # server._to_contour inverts process() output back to white-on-black,
    # which is what infer() receives; it's identical to `edges` here.
    dt = to_distance_transform(edges, sigma=5.0)
    save("distance_transform", (dt * 255).astype(np.uint8))
    save("distance_transform_color",
         cv2.applyColorMap((dt * 255).astype(np.uint8), cv2.COLORMAP_INFERNO))

    return written


def main() -> None:
    p = argparse.ArgumentParser(description="Dump every preprocessing step as a PNG")
    p.add_argument("image", help="Path to input image")
    p.add_argument("--ref", action="store_true", help="Use the reference-image config")
    p.add_argument("--out", default=None, help="Output folder")
    args = p.parse_args()

    bgr = cv2.cvtColor(np.array(Image.open(args.image).convert("RGB")), cv2.COLOR_RGB2BGR)
    proc = ContourPreprocessor(**(REF_CFG if args.ref else STUDENT_CFG))

    stem = os.path.splitext(os.path.basename(args.image))[0]
    out_dir = args.out or os.path.join(BASE_DIR, "preprocessing_steps", stem)

    for path in dump_steps(bgr, proc, out_dir):
        print(path)


if __name__ == "__main__":
    main()
