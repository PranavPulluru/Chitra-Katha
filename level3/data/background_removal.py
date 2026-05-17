"""
data/background_removal.py
===========================
GrabCut-based background removal for student-uploaded folk art photos.

Assumes the painting is the primary subject, roughly centred and occupying
at least 60 % of the frame — a fair assumption for close-up student uploads.

Call remove_background(bgr) before ContourPreprocessor.process() so the
edge detector only sees painting strokes, not table / wall edges.
"""

import cv2
import numpy as np


def remove_background(
    bgr: np.ndarray,
    margin_frac: float = 0.05,
    iterations: int = 5,
    min_fg_fraction: float = 0.15,
) -> np.ndarray:
    """
    Isolate the painting from its background using GrabCut.

    Parameters
    ----------
    bgr              : input BGR image (any resolution)
    margin_frac      : fraction of image dimensions to treat as definite
                       background border; everything outside the inset rect
                       is seeded as background for GrabCut (default 5 %)
    iterations       : GrabCut EM iterations — more iterations = sharper mask
                       at the cost of speed (5 is a good balance)
    min_fg_fraction  : if recovered foreground covers less than this fraction
                       of total pixels, GrabCut likely failed (e.g. the
                       painting bleeds to the image border) — return the
                       original image unchanged so we degrade gracefully

    Returns
    -------
    BGR image the same size as input with background pixels set to white
    (matching the white-background convention expected by ContourPreprocessor).
    Returns the original image unchanged if GrabCut produces an implausible mask.
    """
    h, w = bgr.shape[:2]

    # Inset rectangle: everything outside is seeded as definite background.
    mx = max(1, int(w * margin_frac))
    my = max(1, int(h * margin_frac))
    rect = (mx, my, w - 2 * mx, h - 2 * my)

    mask    = np.zeros((h, w), np.uint8)
    bgd_mdl = np.zeros((1, 65), np.float64)
    fgd_mdl = np.zeros((1, 65), np.float64)

    cv2.grabCut(bgr, mask, rect, bgd_mdl, fgd_mdl, iterations, cv2.GC_INIT_WITH_RECT)

    # Both definite (GC_FGD) and probable (GC_PR_FGD) foreground become the mask.
    fg = np.where(
        (mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0
    ).astype(np.uint8)

    # Sanity check: if foreground is suspiciously small, GrabCut probably
    # confused the painting's cream/off-white paper with the background.
    # In that case pass through unchanged — contour extractor handles it fine.
    if fg.sum() / 255 < min_fg_fraction * h * w:
        return bgr

    # Morphological close: fills holes where GrabCut punched through uniform
    # light-coloured areas inside the painting (cream paper, off-white regions).
    close_r = max(1, int(min(h, w) * 0.03))   # ~3 % of shorter dimension
    kernel  = cv2.getStructuringElement(
        cv2.MORPH_ELLIPSE, (close_r * 2 + 1, close_r * 2 + 1)
    )
    fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, kernel)

    result = bgr.copy()
    result[fg == 0] = 255   # outer background → white

    # Second pass: strip the paper layer.
    # Paper is low-saturation + high-brightness (gray/cream/off-white).
    # Actual painting content is either dark (black outlines) or colourful.
    # We flood-fill the paper from the foreground mask border inward so we
    # only remove connected paper regions, not light areas inside the figure.
    hsv = cv2.cvtColor(result, cv2.COLOR_BGR2HSV)
    sat = hsv[:, :, 1]   # 0 = grey, 255 = fully saturated
    val = hsv[:, :, 2]   # 0 = black, 255 = bright

    # Paper pixels: saturation < 40 AND brightness > 140
    paper_mask = ((sat < 40) & (val > 140)).astype(np.uint8) * 255

    # Only erase paper that is reachable from the image border (connected to
    # the edge of the frame), so internal light patches inside the figure
    # (highlights, jewellery, skin) are never wiped.
    flood = paper_mask.copy()
    flood_padded = cv2.copyMakeBorder(flood, 1, 1, 1, 1, cv2.BORDER_CONSTANT, value=255)
    cv2.floodFill(flood_padded, None, (0, 0), 0)
    border_paper = flood_padded[1:-1, 1:-1]   # connected-to-border paper pixels

    result[border_paper == 255] = 255
    return result


# ---------------------------------------------------------------------------
# CLI smoke test:  python background_removal.py <image_path> [output_path]
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import sys

    src_path = sys.argv[1] if len(sys.argv) > 1 else None
    out_path = sys.argv[2] if len(sys.argv) > 2 else "bg_removed.png"

    if src_path is None:
        # Generate a fake test image: grey background, coloured rectangle subject
        img = np.full((400, 400, 3), (180, 180, 180), dtype=np.uint8)
        cv2.rectangle(img, (80, 80), (320, 320), (40, 80, 160), -1)
        cv2.circle(img, (200, 200), 60, (200, 60, 40), -1)
    else:
        img = cv2.imread(src_path)
        if img is None:
            print(f"Could not read {src_path}")
            sys.exit(1)

    result = remove_background(img)
    cv2.imwrite(out_path, result)
    print(f"Saved to {out_path}")
