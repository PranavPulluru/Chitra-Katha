from __future__ import annotations

import argparse
import base64
import io
import sys
from pathlib import Path

import cv2
import numpy as np
from flask import Flask, jsonify, request, send_from_directory
from PIL import Image

# ── project imports ────────────────────────────────────────────────────────────
_ROOT    = Path(__file__).resolve().parents[1]          # IIT_proj/
_WEB_DIR = _ROOT / "level 1 and level 2"               # static website folder
sys.path.insert(0, str(_ROOT))

from level3.model.inference import infer, load_model
from level3.data.preprocessing import ContourPreprocessor

# ── Flask app — static files served from the website folder ───────────────────
app = Flask(__name__, static_folder=str(_WEB_DIR), static_url_path="")

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

def _decode_image(data: str) -> np.ndarray:
    """
    Accept a data-URL (data:image/...;base64,...) or a plain base64 string.
    Returns a (H, W) uint8 contour image, white-on-black.
    """
    if data.startswith("data:"):
        data = data.split(",", 1)[1]

    raw = base64.b64decode(data)
    pil = Image.open(io.BytesIO(raw)).convert("RGB")
    bgr = cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)

    contour = preprocessor.process(bgr)   # white-bg, black-stroke
    contour = cv2.bitwise_not(contour)    # → white-on-black (model convention)
    return contour


def _encode_image(img: np.ndarray) -> str:
    """Encode a BGR numpy image as a base64 PNG data-URL."""
    ok, buf = cv2.imencode(".png", img)
    if not ok:
        raise RuntimeError("cv2.imencode failed")
    b64 = base64.b64encode(buf.tobytes()).decode("ascii")
    return f"data:image/png;base64,{b64}"


# ── routes ─────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    """Serve the main website."""
    return send_from_directory(str(_WEB_DIR), "index.html")


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


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

    if "reference" not in data or "child" not in data:
        return jsonify({"error": "Both 'reference' and 'child' fields are required"}), 400

    try:
        ref_img   = _decode_image(data["reference"])
        child_img = _decode_image(data["child"])
    except Exception as exc:
        return jsonify({"error": f"Image decode failed: {exc}"}), 400

    try:
        score, heatmap_bgr, zones = infer(
            model,
            ref_img,
            child_img,
            heatmap_size=(224, 224),
            zone_threshold=0.20,
        )
    except Exception as exc:
        return jsonify({"error": f"Inference failed: {exc}"}), 500

    return jsonify({
        "score":   round(float(score), 1),
        "heatmap": _encode_image(heatmap_bgr),
        "zones":   zones,
    })


# ── entry point ────────────────────────────────────────────────────────────────

def main():
    global model

    p = argparse.ArgumentParser(description="Chitra Katha server")
    p.add_argument("--ckpt",   default=None,  help="Checkpoint path (auto-detected if omitted)")
    p.add_argument("--port",   default=5000,  type=int)
    p.add_argument("--device", default="cpu", help="cpu | cuda")
    args = p.parse_args()

    ckpt = args.ckpt
    if ckpt is None:
        auto = Path(__file__).parent / "checkpoints" / "best.pt"
        if auto.exists():
            ckpt = str(auto)
            print(f"Auto-detected checkpoint: {ckpt}")
        else:
            print("No checkpoint found — using untrained projection head")

    print("Loading model…")
    model = load_model(ckpt_path=ckpt, device=args.device)
    print(f"Ready.  Open http://localhost:{args.port} in your browser.")

    app.run(host="0.0.0.0", port=args.port, debug=False)


if __name__ == "__main__":
    main()
