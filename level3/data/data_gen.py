"""
data/data_gen.py — SyntheticPairGenerator & SyntheticPairDataset
=================================================================
Creates (reference, distorted_child, similarity_label) triplets for training.

Each distorted image is produced by applying one or more parameterised
perturbations to a clean reference contour.  The distortion severity (0=none,
1=maximum) is converted to a similarity label via:

    similarity = 1 - severity

Distortion catalogue
--------------------
  gaussian_jitter   — random pixel displacement of white contour pixels
  random_gaps       — erase random arc-length segments from contours
  line_oscillation  — sinusoidal displacement perpendicular to stroke
  endpoint_error    — over/undershoot at detected curve endpoints
  affine_perturb    — small rotation + scale + translate
"""

from __future__ import annotations

import random
from pathlib import Path
from typing import Sequence

import cv2
import numpy as np
import torch
from torch.utils.data import Dataset
from torchvision import transforms


# ── low-level distortions ──────────────────────────────────────────────────────

def gaussian_jitter(img: np.ndarray, sigma: float) -> np.ndarray:
    """
    Shift every white contour pixel by a random (dx, dy) drawn from N(0, sigma).

    Parameters
    ----------
    img   : (H, W) uint8, white contour on black background
    sigma : standard deviation in pixels (0 = no effect, ~3–8 for strong jitter)
    """
    if sigma < 1e-3:
        return img.copy()
    ys, xs = np.where(img > 127)
    if len(xs) == 0:
        return img.copy()
    dx = np.round(np.random.normal(0, sigma, len(xs))).astype(int)
    dy = np.round(np.random.normal(0, sigma, len(ys))).astype(int)
    nx = np.clip(xs + dx, 0, img.shape[1] - 1)
    ny = np.clip(ys + dy, 0, img.shape[0] - 1)
    out = np.zeros_like(img)
    out[ny, nx] = 255
    return out


def random_gaps(img: np.ndarray, gap_fraction: float) -> np.ndarray:
    """
    Randomly erase contiguous segments of the contour.

    Parameters
    ----------
    gap_fraction : fraction of contour pixels to erase (0=none, 1=all)
    """
    if gap_fraction < 1e-3:
        return img.copy()
    out = img.copy()
    ys, xs = np.where(img > 127)
    if len(xs) == 0:
        return out
    n_erase = int(len(xs) * gap_fraction)
    # erase in random contiguous blocks (more realistic than random scatter)
    start = random.randint(0, max(0, len(xs) - n_erase))
    out[ys[start:start + n_erase], xs[start:start + n_erase]] = 0
    return out


def line_oscillation(img: np.ndarray, amplitude: float, frequency: float = 0.05) -> np.ndarray:
    """
    Displace each contour pixel along the local normal direction with a
    sinusoidal wave, simulating a shaky hand.

    Parameters
    ----------
    amplitude  : max displacement in pixels
    frequency  : spatial frequency of the wave (cycles per pixel)
    """
    if amplitude < 1e-3:
        return img.copy()
    ys, xs = np.where(img > 127)
    if len(xs) == 0:
        return img.copy()

    # Approximate normals via finite differences along contour ordering.
    # Use arc-length parameter for the sinusoid phase.
    arc = np.arange(len(xs), dtype=float)
    phase = 2 * np.pi * frequency * arc

    # Estimate local tangent from sorted contour (approximate with x-gradient)
    dx_tan = np.gradient(xs.astype(float))
    dy_tan = np.gradient(ys.astype(float))
    norm_len = np.hypot(dx_tan, dy_tan) + 1e-6
    # Normal = perpendicular to tangent
    nx_n = -dy_tan / norm_len
    ny_n =  dx_tan / norm_len

    displacement = amplitude * np.sin(phase)
    nx = np.clip(np.round(xs + displacement * nx_n).astype(int), 0, img.shape[1] - 1)
    ny = np.clip(np.round(ys + displacement * ny_n).astype(int), 0, img.shape[0] - 1)

    out = np.zeros_like(img)
    out[ny, nx] = 255
    return out


def endpoint_error(img: np.ndarray, overshoot_fraction: float) -> np.ndarray:
    """
    Extend or truncate curve segments at their endpoints.

    A positive overshoot_fraction extends contours (overshoot);
    a negative value truncates them (undershoot).

    Parameters
    ----------
    overshoot_fraction : signed fraction of each curve's length to add/remove
    """
    if abs(overshoot_fraction) < 1e-3:
        return img.copy()
    contours, _ = cv2.findContours(img, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
    out = np.zeros_like(img)
    for cnt in contours:
        pts = cnt[:, 0, :]          # (N, 2)
        n = len(pts)
        delta = int(abs(overshoot_fraction) * n)
        if overshoot_fraction > 0:
            # Extend: extrapolate from endpoints along tangent direction
            if n >= 2 and delta > 0:
                tail_dir = pts[-1] - pts[-2]
                extension = np.stack([
                    pts[-1] + tail_dir * (i + 1) / delta
                    for i in range(delta)
                ]).astype(int)
                extension[:, 0] = np.clip(extension[:, 0], 0, img.shape[1] - 1)
                extension[:, 1] = np.clip(extension[:, 1], 0, img.shape[0] - 1)
                pts = np.vstack([pts, extension])
        else:
            # Truncate: drop end pixels
            pts = pts[:max(1, n - delta)]
        out[pts[:, 1], pts[:, 0]] = 255
    return out


def affine_perturb(
    img: np.ndarray,
    angle_deg: float,
    scale: float,
    translate_frac: float,
) -> np.ndarray:
    """
    Apply a small affine transform (rotate + scale + translate) to the contour.

    Parameters
    ----------
    angle_deg      : rotation in degrees
    scale          : scale factor (1.0 = identity)
    translate_frac : translation as fraction of image size
    """
    h, w = img.shape
    cx, cy = w / 2.0, h / 2.0
    tx = translate_frac * w
    ty = translate_frac * h
    M = cv2.getRotationMatrix2D((cx, cy), angle_deg, scale)
    M[0, 2] += tx
    M[1, 2] += ty
    return cv2.warpAffine(img, M, (w, h), flags=cv2.INTER_NEAREST)


# ── severity → parameter mapping ──────────────────────────────────────────────

def _severity_params(severity: float) -> dict:
    """
    Map a normalised severity ∈ [0, 1] to concrete distortion parameters.

    Each distortion scales linearly or slightly super-linearly with severity
    to produce a natural range of errors.
    """
    s = float(np.clip(severity, 0.0, 1.0))
    return dict(
        jitter_sigma       = s * 6.0,          # 0 – 6 px
        gap_fraction       = s * 0.35,          # 0 – 35 % of contour erased
        oscillation_amp    = s * 5.0,           # 0 – 5 px
        oscillation_freq   = 0.04 + s * 0.06,  # 0.04 – 0.10 cycles/px
        overshoot_fraction = (s - 0.5) * 0.2,  # –0.10 – +0.10  (negative = undershoot)
        angle_deg          = s * 12.0,          # 0 – 12°
        scale              = 1.0 + (random.random() - 0.5) * s * 0.15,  # 0.925 – 1.075
        translate_frac     = (random.random() - 0.5) * s * 0.10,        # ±5 %
    )


# ── high-level generator ───────────────────────────────────────────────────────

class SyntheticPairGenerator:
    """
    Generates a distorted version of a reference contour image.

    Usage
    -----
    gen = SyntheticPairGenerator()
    child_img, similarity = gen(ref_img, severity=0.4)
    """

    def __call__(
        self,
        ref: np.ndarray,
        severity: float | None = None,
    ) -> tuple[np.ndarray, float]:
        """
        Parameters
        ----------
        ref      : (H, W) uint8, white contour on black background
        severity : distortion level in [0, 1]; sampled uniformly if None

        Returns
        -------
        (distorted_image, similarity_label)
            distorted_image  : (H, W) uint8, same layout as ref
            similarity_label : float in [0, 1]  (= 1 - severity)
        """
        if severity is None:
            severity = float(np.random.beta(2, 2))   # biased toward mid-range

        p = _severity_params(severity)
        out = ref.copy()

        # Apply distortions probabilistically so not all appear every time.
        if random.random() < 0.8:
            out = gaussian_jitter(out, p["jitter_sigma"])
        if random.random() < 0.5:
            out = random_gaps(out, p["gap_fraction"])
        if random.random() < 0.6:
            out = line_oscillation(out, p["oscillation_amp"], p["oscillation_freq"])
        if random.random() < 0.4:
            out = endpoint_error(out, p["overshoot_fraction"])
        if random.random() < 0.7:
            out = affine_perturb(out, p["angle_deg"], p["scale"], p["translate_frac"])

        similarity = 1.0 - severity
        return out, similarity


# ── PyTorch Dataset ────────────────────────────────────────────────────────────

class SyntheticPairDataset(Dataset):
    """
    PyTorch Dataset that wraps a directory of reference contour PNGs and
    yields synthetic (ref, child, similarity) triplets on the fly.

    Parameters
    ----------
    ref_dir          : directory containing reference contour PNGs
    pairs_per_image  : how many distorted variants to generate per reference
    image_size       : spatial size for output tensors (both H and W)
    augment_ref      : apply mild horizontal flip / small rotation to the ref
                       itself (increases variety)
    """

    def __init__(
        self,
        ref_dir:         str | Path,
        pairs_per_image: int  = 20,
        image_size:      int  = 224,
        augment_ref:     bool = True,
    ) -> None:
        self.ref_paths      = sorted(Path(ref_dir).glob("*.png"))
        if not self.ref_paths:
            raise FileNotFoundError(f"No PNG files found in {ref_dir}")

        self.pairs_per_image = pairs_per_image
        self.image_size      = image_size
        self.generator       = SyntheticPairGenerator()

        base_tf = [
            transforms.Resize((image_size, image_size)),
            transforms.ToTensor(),            # → (1, H, W) float32 in [0, 1]
        ]
        aug_tf = [
            transforms.RandomHorizontalFlip(p=0.5),
            transforms.RandomRotation(10),
        ] + base_tf if augment_ref else base_tf

        self.ref_transform   = transforms.Compose(aug_tf)
        self.child_transform = transforms.Compose(base_tf)

    def __len__(self) -> int:
        return len(self.ref_paths) * self.pairs_per_image

    def __getitem__(self, idx: int):
        ref_path = self.ref_paths[idx % len(self.ref_paths)]

        ref_img = cv2.imread(str(ref_path), cv2.IMREAD_GRAYSCALE)
        if ref_img is None:
            raise FileNotFoundError(ref_path)

        # Ensure white-on-black convention (invert if majority is white)
        if ref_img.mean() > 127:
            ref_img = cv2.bitwise_not(ref_img)

        child_img, similarity = self.generator(ref_img)

        from PIL import Image
        ref_tensor   = self.ref_transform(Image.fromarray(ref_img))
        child_tensor = self.child_transform(Image.fromarray(child_img))

        # Expand to 3 channels to match DINOv2 expectations
        ref_tensor   = ref_tensor.expand(3, -1, -1)
        child_tensor = child_tensor.expand(3, -1, -1)

        return (
            ref_tensor,                                       # (3, H, W) float32
            child_tensor,                                     # (3, H, W) float32
            torch.tensor(similarity, dtype=torch.float32),   # scalar
        )


# ── smoke test ─────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    gen = SyntheticPairGenerator()

    # Fake reference: circle on black background
    ref = np.zeros((224, 224), dtype=np.uint8)
    cv2.circle(ref, (112, 112), 60, 255, 2)

    for severity in [0.0, 0.3, 0.6, 1.0]:
        out, sim = gen(ref, severity=severity)
        n_white = int((out > 127).sum())
        print(f"severity={severity:.1f}  similarity={sim:.2f}  white_px={n_white}")

    print("data_gen smoke test passed.")
