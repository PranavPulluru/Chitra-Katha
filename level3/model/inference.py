"""
model/inference.py — infer()
==============================
Single entry-point for scoring a student's contour against a reference.

Returns
-------
  score        : float in [0, 100]
  heatmap_img  : (H, W, 3) uint8 — jet-coloured error heatmap overlaid on
                 the reference contour
  zone_report  : list of dicts, one per flagged zone:
                   {
                     "zone":      str   (e.g. "top-left"),
                     "mean_dist": float (mean error in zone, 0–1),
                     "severity":  str   ("low" | "medium" | "high"),
                   }

Usage
-----
    from model.inference import infer, load_model

    model = load_model("level3/checkpoints/best.pt", device="cpu")
    score, heatmap, zones = infer(model, ref_img, child_img)
"""

from __future__ import annotations

import gc
from pathlib import Path

import cv2
import numpy as np
import torch
from .model import DTSiameseNet
from data.preprocessing import to_distance_transform

# ── global model cache ─────────────────────────────────────────────────────────
_MODEL: DTSiameseNet | None = None

# ── zone definitions (fractional: rows/cols as fraction of heatmap H/W) ───────
# Each entry: (display_name, r0, r1, c0, c1) all in [0, 1]
_ZONES_FRAC: list[tuple[str, float, float, float, float]] = [
    ("top-left",      0.00, 0.33, 0.00, 0.33),
    ("top-center",    0.00, 0.33, 0.33, 0.67),
    ("top-right",     0.00, 0.33, 0.67, 1.00),
    ("mid-left",      0.33, 0.67, 0.00, 0.33),
    ("center",        0.33, 0.67, 0.33, 0.67),
    ("mid-right",     0.33, 0.67, 0.67, 1.00),
    ("bottom-left",   0.67, 1.00, 0.00, 0.33),
    ("bottom-center", 0.67, 1.00, 0.33, 0.67),
    ("bottom-right",  0.67, 1.00, 0.67, 1.00),
]

_SEV_MED  = 0.35
_SEV_HIGH = 0.65


# ── helpers ────────────────────────────────────────────────────────────────────

def _to_tensor(img: np.ndarray, device: torch.device) -> torch.Tensor:
    """
    Convert a binary contour image to a (1, 1, H, W) distance-transform tensor.

    Accepts either polarity (white-bg/black-stroke or white-stroke/black-bg).
    Always normalises to white-stroke/black-bg before computing the DT.
    """
    if img.ndim == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Ensure white-on-black (255 = stroke)
    if img.mean() < 127:
        pass   # already white-on-black
    else:
        img = cv2.bitwise_not(img)

    dt = to_distance_transform(img, sigma=5.0)               # (H, W) float32 [0, 1]
    t  = torch.from_numpy(dt).unsqueeze(0).unsqueeze(0)      # (1, 1, H, W)
    return t.to(device)


def _make_heatmap_overlay(
    ref_img: np.ndarray,
    heatmap: np.ndarray,          # (H, W) float32
    alpha:   float = 0.55,
    size:    tuple[int, int] | None = None,
) -> np.ndarray:
    """
    Blend a jet-coloured error heatmap over the reference contour.

    Parameters
    ----------
    ref_img : (H, W) or (H, W, 3) uint8
    heatmap : (H, W) float32 error map from the model
    alpha   : heatmap opacity in the blend
    size    : output (width, height); defaults to ref_img dimensions
    """
    h_ref, w_ref = ref_img.shape[:2]
    out_w, out_h = size if size else (w_ref, h_ref)

    hm = heatmap.copy()
    lo, hi = hm.min(), hm.max()
    if hi > lo:
        hm = (hm - lo) / (hi - lo)
    hm_uint8 = (hm * 255).astype(np.uint8)

    hm_big   = cv2.resize(hm_uint8, (out_w, out_h), interpolation=cv2.INTER_CUBIC)
    hm_color = cv2.applyColorMap(hm_big, cv2.COLORMAP_JET)

    if ref_img.ndim == 2:
        base = cv2.cvtColor(ref_img, cv2.COLOR_GRAY2BGR)
    else:
        base = ref_img.copy()
    base = cv2.resize(base, (out_w, out_h), interpolation=cv2.INTER_LINEAR)

    return cv2.addWeighted(base, 1.0 - alpha, hm_color, alpha, 0)


def _zone_report(
    heatmap:   np.ndarray,   # (H, W) float32
    threshold: float = 0.0,
) -> list[dict]:
    """
    Compute per-zone mean error and severity labels.

    Zone boundaries are defined as fractions of the heatmap's spatial
    dimensions, so this works correctly regardless of the heatmap resolution
    output by the model.
    """
    H, W = heatmap.shape
    lo, hi = heatmap.min(), heatmap.max()
    span = hi - lo if hi > lo else 1.0
    hm_norm = (heatmap - lo) / span

    report = []
    for name, r0f, r1f, c0f, c1f in _ZONES_FRAC:
        r0, r1 = int(r0f * H), int(r1f * H)
        c0, c1 = int(c0f * W), int(c1f * W)
        zone_vals = hm_norm[r0:r1, c0:c1]
        mean_d    = float(zone_vals.mean())
        if mean_d < threshold:
            continue
        sev = "high" if mean_d >= _SEV_HIGH else ("medium" if mean_d >= _SEV_MED else "low")
        report.append({"zone": name, "mean_dist": round(mean_d, 4), "severity": sev})

    report.sort(key=lambda x: x["mean_dist"], reverse=True)
    return report


# ── public API ─────────────────────────────────────────────────────────────────

def load_model(
    ckpt_path: str | Path | None = None,
    device:    str | torch.device = "cpu",
) -> DTSiameseNet:
    """
    Instantiate DTSiameseNet and optionally load trained weights.

    The loaded model is cached globally; subsequent calls return the same
    instance without reloading weights.

    Parameters
    ----------
    ckpt_path : path to a checkpoint saved by train.py (full state_dict).
                Pass None to use an untrained model (for testing only).
    device    : 'cpu', 'cuda', or a torch.device object.
    """
    global _MODEL
    if _MODEL is not None:
        return _MODEL

    dev = torch.device(device) if isinstance(device, str) else device
    model = DTSiameseNet(pretrained=False).to(dev)
    model.eval()

    if ckpt_path is not None:
        ckpt = torch.load(ckpt_path, map_location=dev, weights_only=True)
        # Support both bare state_dict and wrapped {"state_dict": ...} saves
        state = ckpt.get("state_dict", ckpt)
        model.load_state_dict(state)
        print(f"Loaded checkpoint from {ckpt_path}")
    else:
        print("No checkpoint — using untrained model weights")

    gc.collect()
    _MODEL = model
    return _MODEL


@torch.no_grad()
def infer(
    model:          DTSiameseNet,
    ref_img:        np.ndarray,
    child_img:      np.ndarray,
    heatmap_size:   tuple[int, int] | None = None,
    zone_threshold: float = 0.20,
    overlay_bgr:    np.ndarray | None = None,
    return_raw:     bool = False,
) -> tuple[float, np.ndarray, list[dict]]:
    """
    Score a student's contour against a reference.

    Parameters
    ----------
    model         : loaded DTSiameseNet (from load_model())
    ref_img       : (H, W) or (H, W, 3) uint8 reference contour
    child_img     : (H, W) or (H, W, 3) uint8 student's drawing
    heatmap_size  : (width, height) of the returned overlay image.
                    Defaults to ref_img's spatial dimensions.
    zone_threshold: minimum normalised error to include a zone in the report
    overlay_bgr   : optional original colour reference image to use as overlay
                    background instead of the preprocessed contour
    return_raw    : if True, also return the raw float32 heatmap array

    Returns
    -------
    score       : float in [0, 100]
    heatmap_img : (H, W, 3) uint8 BGR overlay — jet heatmap on ref contour
    zone_report : list of dicts sorted by severity (most deviated first)
    heatmap_raw : (H, W) float32 — only included when return_raw=True
    """
    device = next(model.parameters()).device
    model.eval()

    ref_t   = _to_tensor(ref_img,   device)
    child_t = _to_tensor(child_img, device)

    out = model(ref_t, child_t)

    score   = float(out["score"].squeeze().cpu())
    heatmap = out["heatmap"].squeeze(0).cpu().numpy()   # (H, W)

    # Use the original colour reference as overlay background when provided;
    # otherwise fall back to the preprocessed contour (grayscale).
    overlay_base = overlay_bgr if overlay_bgr is not None else (
        cv2.cvtColor(ref_img, cv2.COLOR_BGR2GRAY) if ref_img.ndim == 3 else ref_img
    )

    overlay = _make_heatmap_overlay(overlay_base, heatmap, size=heatmap_size)
    zones   = _zone_report(heatmap, threshold=zone_threshold)

    if return_raw:
        return score, overlay, zones, heatmap
    return score, overlay, zones


# ── CLI demo ───────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse

    p = argparse.ArgumentParser(description="Run DTSiameseNet inference")
    p.add_argument("ref",   help="Path to reference contour image")
    p.add_argument("child", help="Path to student's contour image")
    p.add_argument("--ckpt",   default=None,              help="Checkpoint path")
    p.add_argument("--device", default="cpu",             help="cpu or cuda")
    p.add_argument("--out",    default="heatmap_out.png", help="Output overlay path")
    args = p.parse_args()

    model = load_model(args.ckpt, device=args.device)

    ref_img   = cv2.imread(args.ref,   cv2.IMREAD_GRAYSCALE)
    child_img = cv2.imread(args.child, cv2.IMREAD_GRAYSCALE)

    score, heatmap_img, zones = infer(model, ref_img, child_img)
    cv2.imwrite(args.out, heatmap_img)

    print(f"\nSimilarity score : {score:.1f} / 100")
    print(f"Heatmap saved    : {args.out}")
    print("\nRegion feedback:")
    for z in zones:
        print(f"  [{z['severity'].upper():6s}]  {z['zone']}  (dist={z['mean_dist']:.3f})")
    if not zones:
        print("  No significant deviations detected.")
