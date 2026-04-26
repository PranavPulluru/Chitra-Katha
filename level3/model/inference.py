"""
model/inference.py — infer()
==============================
Single entry-point for scoring a child's contour against a reference.

Returns
-------
  score        : float in [0, 100]
  heatmap_img  : (H, W, 3) uint8 — jet-coloured distance heatmap overlaid on
                 the reference contour
  zone_report  : list of dicts, one per flagged zone, each containing:
                   {
                     "zone":        str   (e.g. "top-left curve"),
                     "mean_dist":   float (average patch distance in zone),
                     "severity":    str   ("low" | "medium" | "high"),
                   }

Usage
-----
    from model.inference import infer, load_model

    model = load_model("level3/checkpoints/best.pt", device="cuda")
    score, heatmap, zones = infer(model, ref_img, child_img)
"""

from __future__ import annotations

import gc
from pathlib import Path

import cv2
import numpy as np
import torch
import torch.nn.functional as F
from .model import ChitraKathaModel, PATCH_GRID

# ── global model cache (loaded once, reused across all requests) ───────────────
_MODEL: ChitraKathaModel | None = None

# ── zone definitions ───────────────────────────────────────────────────────────
# Each entry: (display_name, row_start, row_end, col_start, col_end)
# Indices into the 16×16 patch grid.

_ZONES: list[tuple[str, int, int, int, int]] = [
    ("top-left curve",    0,  5,  0,  5),
    ("top edge",          0,  5,  5, 11),
    ("top-right curve",   0,  5, 11, 16),
    ("left side",         5, 11,  0,  5),
    ("center",            5, 11,  5, 11),
    ("right side",        5, 11, 11, 16),
    ("bottom-left curve", 11, 16,  0,  5),
    ("bottom edge",       11, 16,  5, 11),
    ("bottom-right curve",11, 16, 11, 16),
]

# Thresholds on normalised mean zone distance (0–1 after min-max scaling)
_SEV_MED  = 0.35
_SEV_HIGH = 0.65


# ── helpers ────────────────────────────────────────────────────────────────────

def _to_tensor(img: np.ndarray, device: torch.device) -> torch.Tensor:
    """
    Convert a (H, W) uint8 contour image to a (1, 3, 224, 224) float32 tensor.
    Handles both white-on-black and black-on-white inputs.
    """
    if img.ndim == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Normalise to white-on-black
    if img.mean() > 127:
        img = cv2.bitwise_not(img)

    t = torch.from_numpy(img.astype(np.float32) / 255.0)  # (H, W)
    t = t.unsqueeze(0).unsqueeze(0)                        # (1, 1, H, W)
    t = t.expand(1, 3, -1, -1)                             # (1, 3, H, W)
    return t.to(device)


def _make_heatmap_overlay(
    ref_img:   np.ndarray,
    heatmap:   np.ndarray,   # (16, 16) float32
    alpha:     float = 0.55,
    size:      tuple[int, int] | None = None,
) -> np.ndarray:
    """
    Return a jet-coloured heatmap blended over the reference contour.

    Parameters
    ----------
    ref_img  : (H, W) uint8 or (H, W, 3) uint8
    heatmap  : (16, 16) patch-distance grid
    alpha    : heatmap opacity
    size     : output (width, height); defaults to ref_img spatial size
    """
    h_ref, w_ref = ref_img.shape[:2]
    out_w, out_h = size if size else (w_ref, h_ref)

    # Normalise heatmap to [0, 255]
    hm = heatmap.copy()
    hm_min, hm_max = hm.min(), hm.max()
    if hm_max > hm_min:
        hm = (hm - hm_min) / (hm_max - hm_min)
    hm_uint8 = (hm * 255).astype(np.uint8)

    # Upscale to output size and apply jet colormap
    hm_big   = cv2.resize(hm_uint8, (out_w, out_h), interpolation=cv2.INTER_CUBIC)
    hm_color = cv2.applyColorMap(hm_big, cv2.COLORMAP_JET)  # (H, W, 3) BGR

    # Prepare base image
    if ref_img.ndim == 2:
        base = cv2.cvtColor(ref_img, cv2.COLOR_GRAY2BGR)
    else:
        base = ref_img.copy()
    base = cv2.resize(base, (out_w, out_h), interpolation=cv2.INTER_LINEAR)

    # Blend
    overlay = cv2.addWeighted(base, 1.0 - alpha, hm_color, alpha, 0)
    return overlay


def _zone_report(
    heatmap: np.ndarray,    # (16, 16) float32
    threshold: float = 0.0, # include only zones with normalised score ≥ threshold
) -> list[dict]:
    """
    Compute per-zone mean distance and severity labels.

    Parameters
    ----------
    heatmap   : (16, 16) normalised (or raw) patch distance grid
    threshold : minimum normalised mean distance to include a zone in the report

    Returns
    -------
    list of zone dicts, sorted by mean_dist descending
    """
    hm_min, hm_max = heatmap.min(), heatmap.max()
    span = hm_max - hm_min if hm_max > hm_min else 1.0
    hm_norm = (heatmap - hm_min) / span      # [0, 1]

    report = []
    for name, r0, r1, c0, c1 in _ZONES:
        zone_vals = hm_norm[r0:r1, c0:c1]
        mean_d    = float(zone_vals.mean())
        if mean_d < threshold:
            continue
        if mean_d >= _SEV_HIGH:
            sev = "high"
        elif mean_d >= _SEV_MED:
            sev = "medium"
        else:
            sev = "low"
        report.append(
            {
                "zone":      name,
                "mean_dist": round(mean_d, 4),
                "severity":  sev,
            }
        )

    report.sort(key=lambda x: x["mean_dist"], reverse=True)
    return report


# ── public API ─────────────────────────────────────────────────────────────────

def load_model(
    ckpt_path: str | Path | None = None,
    device:    str | torch.device = "cpu",
) -> ChitraKathaModel:
    """
    Instantiate ChitraKathaModel and load the trained projection head.

    Parameters
    ----------
    ckpt_path : path to a local checkpoint; if None the weights are downloaded
                from the Hugging Face Hub (pranavpul/chitra-katha-weights).
    device    : 'cpu', 'cuda', or a torch.device object.

    The loaded model is cached globally — subsequent calls return the same
    instance without reloading weights.
    """
    global _MODEL
    if _MODEL is not None:
        return _MODEL

    dev = torch.device(device) if isinstance(device, str) else device
    model = ChitraKathaModel(pretrained=True).to(dev)
    model.eval()

    if ckpt_path is not None:
        ckpt = torch.load(ckpt_path, map_location=dev)
        key = "proj_head_state" if "proj_head_state" in ckpt else "state_dict"
        model.proj_head.load_state_dict(ckpt[key])
        print(f"Loaded projection head from {ckpt_path}")
    else:
        print("No checkpoint — using untrained projection head")

    # Quantize the frozen backbone to int8 — cuts its memory ~4x with negligible
    # quality loss for contour comparison on CPU.
    if dev.type == "cpu":
        model.backbone = torch.quantization.quantize_dynamic(
            model.backbone,
            {torch.nn.Linear},
            dtype=torch.qint8,
        )
        print("Backbone quantized to int8")

    gc.collect()
    _MODEL = model
    return _MODEL


@torch.no_grad()
def infer(
    model:       ChitraKathaModel,
    ref_img:     np.ndarray,
    child_img:   np.ndarray,
    heatmap_size: tuple[int, int] | None = None,
    zone_threshold: float = 0.20,
) -> tuple[float, np.ndarray, list[dict]]:
    """
    Score a child's contour against a reference.

    Parameters
    ----------
    model         : loaded ChitraKathaModel (from load_model())
    ref_img       : (H, W) or (H, W, 3) uint8 reference contour
    child_img     : (H, W) or (H, W, 3) uint8 child's tracing
    heatmap_size  : (width, height) of the returned overlay image.
                    Defaults to ref_img's spatial dimensions.
    zone_threshold: normalised distance threshold below which zones are omitted
                    from the report (reduces noise in the feedback).

    Returns
    -------
    score       : float in [0, 100]
    heatmap_img : (H, W, 3) uint8 BGR overlay — jet heatmap on ref contour
    zone_report : list of dicts, sorted by severity (most deviated first)
                  Each dict: {"zone": str, "mean_dist": float, "severity": str}
    """
    device = next(model.parameters()).device
    model.eval()

    ref_t   = _to_tensor(ref_img,   device)
    child_t = _to_tensor(child_img, device)

    out = model(ref_t, child_t)

    score   = float(out["score"].squeeze().cpu())
    heatmap = out["heatmap"].squeeze(0).cpu().numpy()  # (16, 16)

    # Ensure ref_img is grayscale for overlay
    if ref_img.ndim == 3:
        ref_gray = cv2.cvtColor(ref_img, cv2.COLOR_BGR2GRAY)
    else:
        ref_gray = ref_img

    overlay = _make_heatmap_overlay(ref_gray, heatmap, size=heatmap_size)
    zones   = _zone_report(heatmap, threshold=zone_threshold)

    return score, overlay, zones


# ── CLI demo ───────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse
    from pathlib import Path

    p = argparse.ArgumentParser(description="Run Chitra Katha inference")
    p.add_argument("ref",   help="Path to reference contour image")
    p.add_argument("child", help="Path to child's contour image")
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
