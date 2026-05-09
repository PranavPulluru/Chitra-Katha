from __future__ import annotations

import argparse
import base64
import gc
import io
import os
import sys

import cv2
import numpy as np
import torch
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from PIL import Image

# ── project imports ────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))   # level3/
_WEB_DIR = os.path.join(BASE_DIR, '..')                 # project root (index.html lives here)
# Ensure level3/ is on sys.path so `data` and `model` packages are importable
# regardless of where the process is launched from (e.g. Render's working dir).
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from model.inference import infer, load_model
from data.preprocessing import ContourPreprocessor

# Limit PyTorch to a single CPU thread — reduces per-thread memory overhead
# significantly on memory-constrained hosts like Render's free tier.
torch.set_num_threads(1)
torch.set_num_interop_threads(1)

# ── Flask app — static files served from the website folder ───────────────────
app = Flask(__name__, static_folder=_WEB_DIR, static_url_path="")

# Allow cross-origin calls from the frontend (hosted on a different origin,
# e.g. GitHub Pages) to the backend endpoints on this HF Space.
# For a locked-down version, replace `"*"` with your frontend's origin, e.g.
#   CORS(app, resources={r"/*": {"origins": "https://<you>.github.io"}})
CORS(app, resources={r"/*": {"origins": "*"}})

# ── globals loaded once at startup ────────────────────────────────────────────
model        = None
preprocessor = ContourPreprocessor(
    output_size       = 224,
    blur_kernel       = 3,
    min_contour_area  = 2,
    contour_thickness = 1,
    auto_canny        = True, # Otsu-derived thresholds adapt to variable lighting
    direct_edges      = True, # return 1-px Canny edges; avoids thick-contour artefact
    #dilate_px         = 1,    # thicken edges by 1 px (increase to 2 if still too thin)
)


# ── helpers ────────────────────────────────────────────────────────────────────

STEP_IMAGES_DIR = os.path.join(BASE_DIR, '..', 'level3v2', 'step_images')


def _decode_bgr(data: str) -> np.ndarray:
    """
    Accept a data-URL (data:image/...;base64,...) or a plain base64 string.
    Returns the raw BGR image at its native upload resolution.
    """
    if data.startswith("data:"):
        data = data.split(",", 1)[1]

    # Strip whitespace and fix padding (some browsers omit trailing '=')
    data = data.strip()
    pad = len(data) % 4
    if pad:
        data += '=' * (4 - pad)

    raw = base64.b64decode(data)

    # Try PIL first; if PIL can't identify the format, fall back to OpenCV.
    # Keep cv2.cvtColor outside the except so its errors surface naturally.
    try:
        pil = Image.open(io.BytesIO(raw)).convert("RGB")
    except Exception as pil_err:
        print(f"[decode] PIL failed ({type(pil_err).__name__}: {pil_err}), trying cv2")
        arr = np.frombuffer(raw, dtype=np.uint8)
        bgr = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if bgr is None:
            raise ValueError("Could not decode image — unsupported format or corrupted data")
        return bgr
    else:
        return cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)


def _load_ref_bgr(tutorial_id: str, step: int | None) -> np.ndarray:
    """
    Load a reference image from disk at its native resolution.
    step=None  → reference.png (final evaluation)
    step=N     → N.png (per-step check)
    """
    filename = 'reference.png' if step is None else f'{step}.png'
    path = os.path.join(STEP_IMAGES_DIR, tutorial_id, filename)

    if not os.path.isfile(path):
        raise FileNotFoundError(f"Reference image not found: {tutorial_id}/{filename}")

    pil = Image.open(path).convert("RGB")
    return cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)


def _to_contour(bgr: np.ndarray) -> np.ndarray:
    """Run the contour preprocessor → (output_size, output_size) white-on-black."""
    contour = preprocessor.process(bgr)   # white-bg, black-stroke
    return cv2.bitwise_not(contour)        # → white-on-black (model convention)


def _encode_image(img: np.ndarray) -> str:
    """Encode a BGR numpy image as a base64 PNG data-URL."""
    ok, buf = cv2.imencode(".png", img)
    if not ok:
        raise RuntimeError("cv2.imencode failed")
    b64 = base64.b64encode(buf.tobytes()).decode("ascii")
    return f"data:image/png;base64,{b64}"


_MAX_DISPLAY = 600   # max pixel dimension for heatmap overlay output


def _letterbox_square(bgr: np.ndarray) -> np.ndarray:
    """
    Pad bgr with white to make it square, preserving aspect ratio.
    side = max(H, W) — content is never scaled, only symmetric white padding added.
    """
    h, w = bgr.shape[:2]
    side = max(h, w)
    if h == w:
        return bgr
    pad_top   = (side - h) // 2
    pad_bot   = side - h - pad_top
    pad_left  = (side - w) // 2
    pad_right = side - w - pad_left
    return cv2.copyMakeBorder(
        bgr, pad_top, pad_bot, pad_left, pad_right,
        cv2.BORDER_CONSTANT, value=(255, 255, 255),
    )


# ── routes ─────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    """Serve the main website."""
    return send_from_directory(str(_WEB_DIR), "index.html")


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/level3v2/<path:filename>")
def level3v2_static(filename):
    """Serve level3v2 assets — JS, CSS, step images, placeholder SVG."""
    return send_from_directory(os.path.join(BASE_DIR, '..', 'level3v2'), filename)


@app.route("/level4/<path:filename>")
def serve_level4(filename):
    """Serve level4 assets — JS, CSS."""
    return send_from_directory(os.path.join(BASE_DIR, '..', 'level4'), filename)


@app.route("/contour", methods=["POST"])
def contour():
    data = request.get_json(force=True)
    if "image" not in data:
        return jsonify({"error": "'image' field is required"}), 400

    try:
        if data["image"].startswith("data:"):
            b64 = data["image"].split(",", 1)[1]
        else:
            b64 = data["image"]
        raw = base64.b64decode(b64)
        pil = Image.open(io.BytesIO(raw)).convert("RGB")
        bgr = cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)
    except Exception as exc:
        return jsonify({"error": f"Image decode failed: {exc}"}), 400

    # Extract contour with the tuned OpenCV pipeline
    contour_img = preprocessor.process(bgr)   # (224,224) uint8, white-bg black-stroke

    # Colourise to match the UI: parchment bg (#F7EDD0), deep-brown strokes (#3A1A02)
    out = np.empty((contour_img.shape[0], contour_img.shape[1], 3), dtype=np.uint8)
    is_stroke = contour_img < 128            # True where OpenCV drew lines
    out[~is_stroke] = [208, 237, 247]        # BGR for #F7EDD0 (parchment)
    out[ is_stroke] = [2,   26,  58 ]        # BGR for #3A1A02 (deep brown)

    return jsonify({"contour": _encode_image(out)})


@app.route("/compare", methods=["POST"])
def compare():
    data = request.get_json(force=True)

    if "tutorial_id" not in data or "child" not in data:
        return jsonify({"error": "Both 'tutorial_id' and 'child' fields are required"}), 400

    step = data.get("step")  # int for per-step check, None for final evaluation

    try:
        ref_bgr = _load_ref_bgr(data["tutorial_id"], step)
    except FileNotFoundError as exc:
        return jsonify({"error": str(exc)}), 404
    except Exception as exc:
        return jsonify({"error": f"Reference image load failed: {exc}"}), 400

    try:
        child_bgr = _decode_bgr(data["child"])
    except Exception as exc:
        return jsonify({"error": f"Child image decode failed: {exc}"}), 400

    # Letterbox both images to square before edge detection so content
    # proportions are preserved regardless of input resolution or orientation.
    ref_lb    = _letterbox_square(ref_bgr)
    child_lb  = _letterbox_square(child_bgr)
    ref_img   = _to_contour(ref_lb)
    child_img = _to_contour(child_lb)

    # Compute display size that preserves the reference's native aspect ratio.
    ref_h, ref_w = ref_bgr.shape[:2]
    _scale = _MAX_DISPLAY / max(ref_w, ref_h)
    disp_w = int(ref_w * _scale)
    disp_h = int(ref_h * _scale)

    try:
        score, heatmap_bgr, zones = infer(
            model,
            ref_img,
            child_img,
            heatmap_size=(disp_w, disp_h),
            zone_threshold=0.20,
            overlay_bgr=ref_bgr,
        )
    except Exception as exc:
        return jsonify({"error": f"Inference failed: {exc}"}), 500

    return jsonify({
        "score":   round(float(score), 1),
        "heatmap": _encode_image(heatmap_bgr),
        "zones":   zones,
    })


@app.route("/debug_compare", methods=["POST"])
def debug_compare():
    data = request.get_json(force=True)
    if "tutorial_id" not in data or "child" not in data:
        return jsonify({"error": "Both 'tutorial_id' and 'child' fields are required"}), 400

    step = data.get("step")

    try:
        ref_bgr = _load_ref_bgr(data["tutorial_id"], step)
    except FileNotFoundError as exc:
        return jsonify({"error": str(exc)}), 404
    except Exception as exc:
        return jsonify({"error": f"Reference image load failed: {exc}"}), 400

    try:
        child_bgr = _decode_bgr(data["child"])
    except Exception as exc:
        return jsonify({"error": f"Child image decode failed: {exc}"}), 400

    ref_h,   ref_w   = ref_bgr.shape[:2]
    child_h, child_w = child_bgr.shape[:2]

    ref_lb        = _letterbox_square(ref_bgr)
    child_lb      = _letterbox_square(child_bgr)
    ref_contour   = _to_contour(ref_lb)
    child_contour = _to_contour(child_lb)

    _scale = _MAX_DISPLAY / max(ref_w, ref_h)
    disp_w = int(ref_w * _scale)
    disp_h = int(ref_h * _scale)

    try:
        score, heatmap_bgr, _, raw_heatmap = infer(
            model,
            ref_contour,
            child_contour,
            heatmap_size=(disp_w, disp_h),
            zone_threshold=0.20,
            overlay_bgr=ref_bgr,
            return_raw=True,
        )
    except Exception as exc:
        return jsonify({"error": f"Inference failed: {exc}"}), 500

    hm = raw_heatmap.copy()
    lo, hi = hm.min(), hm.max()
    if hi > lo:
        hm = (hm - lo) / (hi - lo)
    hm_gray = (hm * 255).astype(np.uint8)

    return jsonify({
        "ref_native_size":   [ref_w,   ref_h],
        "child_native_size": [child_w, child_h],
        "ref_letterboxed":   _encode_image(ref_lb),
        "ref_contour":       _encode_image(ref_contour),
        "child_letterboxed": _encode_image(child_lb),
        "child_contour":     _encode_image(child_contour),
        "score":             round(float(score), 1),
        "heatmap_raw":       _encode_image(hm_gray),
        "heatmap_overlay":   _encode_image(heatmap_bgr),
    })


@app.route("/model_sanity/<tutorial_id>")
def model_sanity(tutorial_id):
    """
    Pass the reference image as BOTH ref and stu — score should be ~100.
    Returns numeric internals so we can pinpoint exactly where the model fails.

    Hit: GET /model_sanity/kalighat
    """
    from data.preprocessing import to_distance_transform

    try:
        ref_bgr = _load_ref_bgr(tutorial_id, step=None)
    except FileNotFoundError:
        return jsonify({"error": f"No reference.png found for tutorial '{tutorial_id}'"}), 404
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400

    ref_lb      = _letterbox_square(ref_bgr)
    ref_contour = _to_contour(ref_lb)   # (224, 224) uint8 white-on-black

    # Build DT tensor the same way inference._to_tensor does.
    # ref_contour is already white-on-black (255 = stroke).
    gray = ref_contour   # already 2-D
    dt   = to_distance_transform(gray, sigma=5.0)
    dev  = next(model.parameters()).device
    t    = torch.from_numpy(dt).unsqueeze(0).unsqueeze(0).to(dev)   # (1,1,H,W)

    with torch.no_grad():
        out = model(t, t)   # identical ref and stu

    score   = float(out["score"].squeeze().cpu())
    heatmap = out["heatmap"].squeeze(0).cpu().numpy()      # (H, W)
    ref_emb = out["ref_emb"]                               # (1, 256) L2-normed
    stu_emb = out["stu_emb"]
    theta   = out["theta"].squeeze(0).cpu().numpy()        # (2, 3)

    emb_cosine    = float((ref_emb * stu_emb).sum().cpu())
    identity      = np.array([[1., 0., 0.], [0., 1., 0.]])
    stn_deviation = float(np.abs(theta - identity).max())
    hm_mean       = float(heatmap.mean())
    hm_max        = float(heatmap.max())

    # Contour pixel-match (identical inputs should be 100 %)
    # ref_contour used as both, so this is always 100 % — useful as sanity baseline
    contour_match_pct = 100.0

    # Normalise heatmap for visualization
    hm = heatmap.copy()
    lo, hi = hm.min(), hm.max()
    if hi > lo:
        hm = (hm - lo) / (hi - lo)
    hm_gray = (hm * 255).astype(np.uint8)

    # ── Diagnosis ─────────────────────────────────────────────────────────────
    # A uniform heatmap (mean == max) means all pixels have the same activation
    # value → the fused difference fed into the head is spatially zero (correct
    # for identical inputs). The head is just outputting its bias term.
    uniform_heatmap = abs(hm_max - hm_mean) < 1e-4

    if score >= 85:
        diagnosis = "Model looks healthy for identical inputs."
    elif uniform_heatmap:
        diagnosis = (
            f"SCORE HEAD CONVERGENCE BUG: fused difference is zero for identical inputs "
            f"(heatmap is uniform at {hm_mean:.4f} — preprocessing is CORRECT). "
            f"But score={score:.1f} instead of ~100 because the score head MLP outputs "
            f"sigmoid(bias) ~ 0.5 for a zero-tensor input. "
            "emb_cosine=1.0 and theta=identity confirm the architecture is working; "
            "the bias terms simply did not converge during training. "
            "FIX: retrain the model with the fixed curriculum."
        )
    elif hm_mean > 0.25 and not uniform_heatmap:
        diagnosis = (
            f"PREPROCESSING BUG: model sees non-uniform high difference "
            f"(heatmap_mean={hm_mean:.4f}) even for identical inputs. "
            "Check _to_tensor polarity vs _to_contour output."
        )
    else:
        diagnosis = (
            f"MODEL UNDERTRAINED: score={score:.1f}, heatmap_mean={hm_mean:.4f}. "
            "Fused difference is non-trivial even for identical inputs — the STN "
            f"warp (max deviation from identity = {stn_deviation:.4f}) or backbone "
            "features may not have converged. Retrain with the fixed curriculum."
        )

    return jsonify({
        "score":              round(score, 1),
        "expected_score":     100,
        "emb_cosine":         round(emb_cosine, 4),
        "stn_deviation":      round(stn_deviation, 6),
        "heatmap_mean":       round(hm_mean, 6),
        "heatmap_max":        round(hm_max, 6),
        "contour_match_pct":  contour_match_pct,
        "theta":              theta.tolist(),
        "diagnosis":          diagnosis,
        "ref_contour":        _encode_image(ref_contour),
        "heatmap_raw":        _encode_image(hm_gray),
    })


# ── entry point ────────────────────────────── ──────────────────────────────────

def main():
    torch.set_num_threads(1)
    global model

    p = argparse.ArgumentParser(description="Chitra Katha server")
    p.add_argument("--ckpt",   default=None,  help="Checkpoint path (auto-detected if omitted)")
    p.add_argument("--port",   default=5000,  type=int)
    p.add_argument("--device", default="cpu", help="cpu | cuda")
    args = p.parse_args()

    ckpt = args.ckpt
    if ckpt is None:
        auto = os.path.join(BASE_DIR, 'checkpoints', 'best.pt')
        if os.path.exists(auto):
            ckpt = auto
            print(f"Auto-detected checkpoint: {ckpt}")
        else:
            print("No checkpoint found — using untrained model weights")

    print("Loading model…")
    model = load_model(ckpt_path=ckpt, device=args.device)
    gc.collect()
    print(f"Ready.  Open http://localhost:{args.port} in your browser.")

    app.run(host="0.0.0.0", port=args.port, debug=False)


if __name__ == '__main__':
    # Hugging Face Spaces Docker runtime exposes port 7860.
    port = int(os.environ.get('PORT', 7860))

    ckpt = os.environ.get('CKPT_PATH')
    if ckpt is None:
        auto = os.path.join(BASE_DIR, 'checkpoints', 'best.pt')
        if os.path.exists(auto):
            ckpt = auto
            print(f"Auto-detected checkpoint: {ckpt}")
        else:
            print("No checkpoint found — using untrained model weights")

    print("Loading model…")
    model = load_model(ckpt_path=ckpt, device='cpu')
    gc.collect()  # Free any loader temporaries after model is fully resident
    print(f"Ready.  Open http://localhost:{port} in your browser.")

    app.run(host='0.0.0.0', port=port)
