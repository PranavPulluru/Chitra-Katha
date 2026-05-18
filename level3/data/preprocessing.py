from __future__ import annotations

import cv2
import numpy as np
from scipy.ndimage import distance_transform_edt
from data.background_removal import remove_background


PREPROCESS_CFG = dict(
    output_size       = 128,
    blur_kernel       = 5,
    canny_low         = 50,
    canny_high        = 150,
    min_contour_area  = 50,
    edge_mode         = "canny",
    contour_thickness = 1,
    auto_canny        = False,
    direct_edges      = False,
    dilate_px         = 0,
    strip_background  = False,
    center_subject    = False,
)


class ContourPreprocessor:
    def __init__(self, **cfg_overrides):
        cfg = {**PREPROCESS_CFG, **cfg_overrides}
        self.output_size       = cfg["output_size"]
        self.blur_kernel       = cfg["blur_kernel"]
        self.canny_low         = cfg["canny_low"]
        self.canny_high        = cfg["canny_high"]
        self.min_contour_area  = cfg["min_contour_area"]
        self.edge_mode         = cfg["edge_mode"]
        self.contour_thickness = cfg["contour_thickness"]
        self.auto_canny        = cfg["auto_canny"]
        self.direct_edges      = cfg["direct_edges"]
        self.dilate_px         = cfg["dilate_px"]
        self.strip_background  = cfg["strip_background"]
        self.center_subject    = cfg["center_subject"]

    # ── public ────────────────────────────────────────────────────────────────

    def process(self, bgr: np.ndarray, corners: np.ndarray | None = None) -> np.ndarray:
        """Full pipeline → (output_size, output_size) uint8, white-bg black-strokes."""
        img = self._warp(bgr, corners) if corners is not None else bgr
        if self.strip_background:
            img = remove_background(img)
        if self.center_subject:
            img = self._crop_to_subject(img)
        return self._to_edges(img)

    def process_debug(self, bgr: np.ndarray) -> dict[str, np.ndarray]:
        """
        Same as process() but returns every intermediate step as a BGR image.
        Keys: original, after_bg_removal, after_crop, after_resize, contour.
        """
        steps: dict[str, np.ndarray] = {"original": bgr.copy()}

        img = bgr
        if self.strip_background:
            img = remove_background(img)
            steps["after_bg_removal"] = img.copy()

        if self.center_subject:
            img = self._crop_to_subject(img)
            steps["after_crop"] = img.copy()

        resized = cv2.resize(img, (self.output_size, self.output_size))
        steps["after_resize"] = resized.copy()

        result = self._to_edges(img)
        # Convert single-channel result to BGR for uniform encoding
        steps["contour"] = cv2.cvtColor(result, cv2.COLOR_GRAY2BGR)
        return steps

    # ── steps ─────────────────────────────────────────────────────────────────

    def _to_edges(self, img: np.ndarray) -> np.ndarray:
        """Resize → grayscale → blur → edges → (optional dilate)."""
        img     = cv2.resize(img, (self.output_size, self.output_size))
        gray    = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blurred = self._blur(gray)
        edges   = self._edges(blurred)

        if self.direct_edges:
            result = cv2.bitwise_not(edges)
        else:
            result = self._render(self._extract_contours(edges))

        if self.dilate_px > 0:
            k      = cv2.getStructuringElement(
                cv2.MORPH_ELLIPSE,
                (self.dilate_px * 2 + 1, self.dilate_px * 2 + 1),
            )
            result = cv2.bitwise_not(cv2.dilate(cv2.bitwise_not(result), k))

        return result

    def _crop_to_subject(self, bgr: np.ndarray, pad_frac: float = 0.05) -> np.ndarray:
        """
        Crop to the bounding box of actual strokes, ignoring the outermost 3 %
        of pixels.  The border exclusion removes edge text and corner artifacts
        without a density map — sparse limbs at the painting edges are kept.
        """
        gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY) if bgr.ndim == 3 else bgr
        H, W = gray.shape

        # Only pixels darker than 127 count as strokes (avoids photo shadows).
        _, dark = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV)

        # Zero out the outermost 3 % border to ignore edge text / corner noise.
        by, bx = max(1, int(H * 0.03)), max(1, int(W * 0.03))
        dark[:by, :]  = 0;  dark[-by:, :] = 0
        dark[:, :bx]  = 0;  dark[:, -bx:] = 0

        coords = cv2.findNonZero(dark)
        if coords is None:
            return bgr

        x, y, w, h = cv2.boundingRect(coords)
        pad = max(1, int(max(w, h) * pad_frac))
        return bgr[
            max(0, y - pad) : min(H, y + h + pad),
            max(0, x - pad) : min(W, x + w + pad),
        ]

    def _warp(self, bgr: np.ndarray, corners: np.ndarray) -> np.ndarray:
        dst = np.float32([
            [0, 0],
            [self.output_size - 1, 0],
            [self.output_size - 1, self.output_size - 1],
            [0, self.output_size - 1],
        ])
        M = cv2.getPerspectiveTransform(corners.astype(np.float32), dst)
        return cv2.warpPerspective(bgr, M, (self.output_size, self.output_size))

    def _blur(self, gray: np.ndarray) -> np.ndarray:
        k = self.blur_kernel | 1   # ensure odd without a branch
        return cv2.GaussianBlur(gray, (k, k), 0)

    def _edges(self, blurred: np.ndarray) -> np.ndarray:
        if self.edge_mode == "canny":
            if self.auto_canny:
                otsu, _ = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
                high = max(otsu, 1.0)
                return cv2.Canny(blurred, high * 0.4, high)
            return cv2.Canny(blurred, self.canny_low, self.canny_high)

        if self.edge_mode == "adaptive":
            return cv2.adaptiveThreshold(
                blurred, 255,
                cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV,
                blockSize=11, C=2,
            )

        raise ValueError(f"Unknown edge_mode '{self.edge_mode}'")

    def _extract_contours(self, edges: np.ndarray) -> list:
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        return [c for c in contours if cv2.arcLength(c, False) >= self.min_contour_area]

    def _render(self, contours: list) -> np.ndarray:
        canvas = np.full((self.output_size, self.output_size), 255, dtype=np.uint8)
        cv2.drawContours(canvas, contours, -1, 0, self.contour_thickness)
        return canvas


# ── distance transform ────────────────────────────────────────────────────────

def to_distance_transform(stroke_on_black: np.ndarray, sigma: float = 5.0) -> np.ndarray:
    """
    Soft distance-transform: 1.0 at strokes, decaying exponentially with distance.
    Inputs offset by a few pixels produce similar DT images (unlike raw binary).
    """
    mask = (stroke_on_black > 127).astype(np.uint8)
    dt   = distance_transform_edt(1 - mask)
    return np.exp(-dt / sigma).astype(np.float32)
