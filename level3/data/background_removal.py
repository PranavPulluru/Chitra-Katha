from __future__ import annotations

import cv2
import numpy as np

_MAX_DIM = 512   # GrabCut resolution cap — quality doesn't improve past this


def remove_background(bgr: np.ndarray, margin_frac: float = 0.05,
                      iterations: int = 5, min_fg_fraction: float = 0.15) -> np.ndarray:
    """
    Strip the background from a student photo using GrabCut + paper detection.

    Assumes the painting is the primary subject and occupies the central region.
    Returns a BGR image with background pixels set to white.
    Falls through unchanged if GrabCut produces an implausible mask.
    """
    h, w = bgr.shape[:2]

    # ── GrabCut on a capped-resolution copy ──────────────────────────────────
    scale = min(1.0, _MAX_DIM / max(h, w))
    small = cv2.resize(bgr, (int(w * scale), int(h * scale))) if scale < 1.0 else bgr
    sh, sw = small.shape[:2]

    mx, my = max(1, int(sw * margin_frac)), max(1, int(sh * margin_frac))
    mask    = np.zeros((sh, sw), np.uint8)
    bgd_mdl = np.zeros((1, 65), np.float64)
    fgd_mdl = np.zeros((1, 65), np.float64)
    cv2.grabCut(small, mask, (mx, my, sw - 2*mx, sh - 2*my),
                bgd_mdl, fgd_mdl, iterations, cv2.GC_INIT_WITH_RECT)

    fg = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    if scale < 1.0:
        fg = cv2.resize(fg, (w, h), interpolation=cv2.INTER_NEAREST)

    if fg.sum() / 255 < min_fg_fraction * h * w:
        return bgr   # GrabCut confused paper with background — pass through

    # Morphological close: fills holes GrabCut punched through uniform light areas.
    r      = max(1, int(min(h, w) * 0.03))
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (r*2+1, r*2+1))
    fg     = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, kernel)

    result = bgr.copy()
    result[fg == 0] = 255

    # ── Second pass: strip connected paper layer (low-sat, high-brightness) ──
    hsv  = cv2.cvtColor(result, cv2.COLOR_BGR2HSV)
    paper = ((hsv[:, :, 1] < 50) & (hsv[:, :, 2] > 130)).astype(np.uint8) * 255

    # Flood-fill from border to identify border-connected paper (the gray blob
    # GrabCut leaves as PR_FGD). After flood-fill, border-connected pixels become
    # 0; enclosed interior paper (jewellery highlights etc.) stay 255. We want
    # to remove the border-connected ones only.
    was_paper = (paper == 255)
    padded = cv2.copyMakeBorder(paper, 1, 1, 1, 1, cv2.BORDER_CONSTANT, value=255)
    cv2.floodFill(padded, None, (0, 0), 0)
    border_connected_paper = was_paper & (padded[1:-1, 1:-1] == 0)
    result[border_connected_paper] = 255

    return result


if __name__ == "__main__":
    import sys
    src  = sys.argv[1] if len(sys.argv) > 1 else None
    dest = sys.argv[2] if len(sys.argv) > 2 else "bg_removed.png"
    img  = cv2.imread(src) if src else (
        lambda i: (cv2.rectangle(i, (80,80),(320,320),(40,80,160),-1), i)[1]
    )(np.full((400,400,3), (180,180,180), dtype=np.uint8))
    cv2.imwrite(dest, remove_background(img))
    print(f"Saved to {dest}")
