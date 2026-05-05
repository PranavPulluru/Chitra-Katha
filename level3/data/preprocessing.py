"""
data/preprocessing.py — ContourPreprocessor
=============================================
Shared OpenCV pipeline used by:
    - prepare_dataset.py  (batch: folk art images → training contours)
    - main.py             (runtime: live camera frames → CNN input)

The goal is to strip everything except stroke geometry — lighting, paper
texture, pencil grain — so the CNN only ever sees clean line information.
"""

import cv2
import numpy as np
from scipy.ndimage import distance_transform_edt


# ---------------------------------------------------------------------------
# Config  ← edit defaults here; both dataset prep and runtime inherit them
# ---------------------------------------------------------------------------

PREPROCESS_CFG = dict(
    output_size      = 128,    # square output in pixels (must match MODEL_CFG)
    blur_kernel      = 5,      # Gaussian kernel size; increase for noisier paper
    canny_low        = 50,     # Canny lower threshold (ignored when auto_canny=True)
    canny_high       = 150,    # Canny upper threshold (ignored when auto_canny=True)

    # Sohrai uses bold, thick strokes — genuine marks are long contours.
    # 50 px arc-length filters out single-pixel paper grain without
    # clipping real Sohrai lines.  (contourArea is ~0 for thin Canny
    # edges, so we filter by arc length instead.)
    min_contour_area = 50,

    # "canny" works well for both:
    #   - user drawings on paper (high-contrast pencil/ink)
    #   - reference images (digital line art or clean scans)
    # Switch to "adaptive" only if your reference images are photos of actual
    # mud walls — wall texture confuses Canny.
    edge_mode        = "canny",

    contour_thickness = 1,     # px thickness when re-drawing clean contours

    # auto_canny: derive Canny thresholds from the image's Otsu value so the
    # detector adapts to variable lighting / contrast in user-uploaded photos.
    auto_canny   = False,

    # direct_edges: skip findContours + drawContours entirely and return the
    # raw Canny edge map.  Edges are always 1-px thin, which eliminates the
    # "thick contour" artefact that occurs when findContours traces the outer
    # boundary of wide Sohrai strokes.
    direct_edges = False,

    # dilate_px: dilation radius applied after edge detection (direct_edges path)
    # or after re-rendering contours (findContours path).  Set to 0 to disable.
    # A value of 1-2 thickens lines for visibility without over-fattening.
    dilate_px = 0,
)


# ---------------------------------------------------------------------------
# ContourPreprocessor
# ---------------------------------------------------------------------------

class ContourPreprocessor:
    """
    Converts an image (BGR numpy array) into a clean binary contour image
    ready for the CNN.

    Pipeline
    --------
    [optional] 1. Perspective-warp to AR canvas bounds (runtime only)
               2. Resize to output_size × output_size
               3. Grayscale
               4. Gaussian blur          – kills pencil texture / paper grain
               5. Edge detection         – Canny or adaptive threshold
               6. Contour extraction     – cv2.findContours
               7. Small-contour removal  – drops noise below min_contour_area
               8. Re-render contours     – clean white-bg / black-stroke image

    Output
    ------
    uint8 numpy array, shape (output_size, output_size), white bg, black strokes.
    Pass through torchvision.transforms.ToTensor() to get a (1, H, W) float32
    tensor in [0, 1] suitable for the model.
    """

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

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def process(
        self,
        bgr: np.ndarray,
        corners: np.ndarray | None = None,
    ) -> np.ndarray:
        """
        Full pipeline on a single BGR image or camera frame.

        Parameters
        ----------
        bgr     : (H, W, 3) uint8 BGR image (standard OpenCV format)
        corners : (4, 2) float32 array of AR marker pixel coords,
                  ordered [top-left, top-right, bottom-right, bottom-left].
                  Pass None to skip perspective warp (dataset prep mode).

        Returns
        -------
        (output_size, output_size) uint8 — white background, black strokes.
        """
        img = self._warp(bgr, corners) if corners is not None else bgr
        img = cv2.resize(img, (self.output_size, self.output_size))
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blurred = self._blur(gray)
        edges = self._edges(blurred)

        if self.direct_edges:
            # Canny: white=edge, black=background → invert to white-bg black-stroke.
            result = cv2.bitwise_not(edges)
        else:
            contours = self._extract_contours(edges)
            result = self._render(contours)

        if self.dilate_px > 0:
            kernel = cv2.getStructuringElement(
                cv2.MORPH_ELLIPSE,
                (self.dilate_px * 2 + 1, self.dilate_px * 2 + 1),
            )
            # Dilate the strokes: invert so strokes are white, dilate, invert back.
            strokes = cv2.bitwise_not(result)
            strokes = cv2.dilate(strokes, kernel, iterations=1)
            result  = cv2.bitwise_not(strokes)

        return result

    # ------------------------------------------------------------------
    # Steps (each overridable independently in a subclass)
    # ------------------------------------------------------------------

    def _warp(self, bgr: np.ndarray, corners: np.ndarray) -> np.ndarray:
        """Perspective-warp the AR canvas region to a square crop."""
        dst = np.float32([
            [0,                    0],
            [self.output_size - 1, 0],
            [self.output_size - 1, self.output_size - 1],
            [0,                    self.output_size - 1],
        ])
        M = cv2.getPerspectiveTransform(corners.astype(np.float32), dst)
        return cv2.warpPerspective(bgr, M, (self.output_size, self.output_size))

    def _blur(self, gray: np.ndarray) -> np.ndarray:
        """Gaussian blur — removes pencil texture and high-frequency noise."""
        k = self.blur_kernel
        # kernel must be odd
        if k % 2 == 0:
            k += 1
        return cv2.GaussianBlur(gray, (k, k), 0)

    def _edges(self, blurred: np.ndarray) -> np.ndarray:
        """Edge / threshold step — output is a binary uint8 image."""
        if self.edge_mode == "canny":
            if self.auto_canny:
                # Derive thresholds from Otsu so the detector adapts to
                # whatever contrast the user's photo happens to have.
                otsu_val, _ = cv2.threshold(
                    blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
                )
                high = max(otsu_val, 1.0)
                low  = high * 0.4
                return cv2.Canny(blurred, low, high)
            return cv2.Canny(blurred, self.canny_low, self.canny_high)

        if self.edge_mode == "adaptive":
            return cv2.adaptiveThreshold(
                blurred, 255,
                cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                cv2.THRESH_BINARY_INV,
                blockSize=11,
                C=2,
            )

        raise ValueError(
            f"Unknown edge_mode '{self.edge_mode}'. Choose 'canny' or 'adaptive'."
        )

    def _extract_contours(self, edges: np.ndarray) -> list:
        """Extract contours, dropping anything shorter than min_contour_area pixels.

        Canny edges are 1-pixel-wide lines whose enclosed area is ~0, so
        cv2.contourArea() always returns ~0 and would filter everything out.
        We use cv2.arcLength() (perimeter / line length) instead.
        """
        contours, _ = cv2.findContours(
            edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )
        return [c for c in contours if cv2.arcLength(c, False) >= self.min_contour_area]

    def _render(self, contours: list) -> np.ndarray:
        """Draw clean contours onto a white canvas."""
        canvas = np.full(
            (self.output_size, self.output_size), 255, dtype=np.uint8
        )
        cv2.drawContours(canvas, contours, -1, 0, self.contour_thickness)
        return canvas


# ---------------------------------------------------------------------------
# Distance-transform conversion
# ---------------------------------------------------------------------------

def to_distance_transform(stroke_on_black: np.ndarray, sigma: float = 5.0) -> np.ndarray:
    """
    Convert a binary contour image to a soft distance-transform representation.

    Parameters
    ----------
    stroke_on_black : (H, W) uint8 — 255 at strokes, 0 at background
    sigma           : Gaussian falloff in pixels; controls how far the signal
                      extends from each stroke (larger = softer gradients)

    Returns
    -------
    (H, W) float32 in [0, 1] — 1.0 at stroke pixels, decaying smoothly to 0
    with distance.  Two structurally similar drawings that are offset by a few
    pixels will have similar DT images; raw binary images would not.

    Why this representation
    -----------------------
    Raw binary contours are 1-pixel-thin lines. Any global shift of even 2 px
    makes the pixel-wise MSE enormous even when the structure is nearly correct.
    The DT encodes spatial proximity continuously, making small displacements
    produce small distances — which is exactly what a structural loss needs.
    """
    stroke_mask = (stroke_on_black > 127).astype(np.uint8)
    # distance_transform_edt returns the Euclidean distance from each 0-pixel
    # to the nearest 1-pixel; we pass (1 - mask) so distance is measured FROM
    # background pixels TO the nearest stroke pixel.
    dt = distance_transform_edt(1 - stroke_mask)
    return np.exp(-dt / sigma).astype(np.float32)


# ---------------------------------------------------------------------------
# Smoke test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    preprocessor = ContourPreprocessor()

    # Fake a camera frame: light grey background with a drawn circle
    fake = np.ones((480, 640, 3), dtype=np.uint8) * 230
    cv2.circle(fake, (320, 240), 80, (30, 30, 30), 3)

    result = preprocessor.process(fake)
    print(f"Output shape : {result.shape}")
    print(f"Unique values: {sorted(set(result.flatten()))[:5]} ...")

    # Confirm it can also run in adaptive mode
    soft = ContourPreprocessor(edge_mode="adaptive")
    result2 = soft.process(fake)
    print(f"Adaptive output shape: {result2.shape}")
    print("Smoke test passed.")
