from __future__ import annotations

import base64
import datetime
import gc
import io
import json
import os
import sys

import cv2
import numpy as np
import torch
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from PIL import Image

try:
    import gspread
    from google.oauth2.service_account import Credentials
    _GOOGLE_LIBS = True
except ImportError:
    _GOOGLE_LIBS = False

_SCOPES = ['https://www.googleapis.com/auth/spreadsheets']


def _gspread_client():
    if not _GOOGLE_LIBS:
        return None
    raw = os.environ.get('GOOGLE_CREDENTIALS_JSON')
    if not raw:
        return None
    creds = Credentials.from_service_account_info(json.loads(raw), scopes=_SCOPES)
    return gspread.Client(auth=creds)


def _upload_image_to_imgbb(b64_data_url: str) -> str:
    api_key = os.environ.get('IMGBB_API_KEY')
    if not api_key or not b64_data_url:
        return ''
    if ',' in b64_data_url:
        b64_data_url = b64_data_url.split(',', 1)[1]
    import urllib.request, urllib.parse
    payload = urllib.parse.urlencode({'key': api_key, 'image': b64_data_url}).encode()
    try:
        with urllib.request.urlopen('https://api.imgbb.com/1/upload', payload, timeout=15) as r:
            return json.loads(r.read())['data']['url']
    except Exception:
        return ''

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
_WEB_DIR = os.path.join(BASE_DIR, '..')
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from model.inference import infer, load_model
from data.preprocessing import ContourPreprocessor

torch.set_num_threads(1)
torch.set_num_interop_threads(1)

app = Flask(__name__, static_folder=_WEB_DIR, static_url_path="")
CORS(app, resources={r"/*": {"origins": "*"}})

# ── startup: model + preprocessors ───────────────────────────────────────────

_ckpt = os.environ.get('CKPT_PATH') or (
    lambda p: p if os.path.exists(p) else None
)(os.path.join(BASE_DIR, 'checkpoints', 'best.pt'))

print("Loading model…")
model = load_model(ckpt_path=_ckpt, device='cpu')
gc.collect()
print("Model ready.")

# Student photos: heavy blur + background strip + subject centering.
# Reference images: light blur only (already clean flat scans).
preprocessor = ContourPreprocessor(
    output_size=224, blur_kernel=3, min_contour_area=2,
    auto_canny=True, direct_edges=True,
    strip_background=True, center_subject=True,
)
ref_preprocessor = ContourPreprocessor(
    output_size=224, blur_kernel=5, min_contour_area=2,
    auto_canny=True, direct_edges=True,
    strip_background=False, center_subject=True,
)

STEP_IMAGES_DIR = os.path.join(BASE_DIR, '..', 'level3v2', 'step_images')
_MAX_DISPLAY    = 600


# ── helpers ───────────────────────────────────────────────────────────────────

def _decode_bgr(data: str) -> np.ndarray:
    """Accept a data-URL or plain base64 string → BGR ndarray."""
    if data.startswith("data:"):
        data = data.split(",", 1)[1]
    data = data.strip()
    if pad := len(data) % 4:
        data += '=' * (4 - pad)
    raw = base64.b64decode(data)
    try:
        pil = Image.open(io.BytesIO(raw)).convert("RGB")
    except Exception as e:
        print(f"[decode] PIL failed ({type(e).__name__}: {e}), trying cv2")
        arr = np.frombuffer(raw, dtype=np.uint8)
        bgr = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if bgr is None:
            raise ValueError("Could not decode image — unsupported format or corrupted data")
        return bgr
    else:
        return cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)


def _load_ref_bgr(tutorial_id: str, step: int | None) -> np.ndarray:
    filename = 'reference.png' if step is None else f'{step}.png'
    path = os.path.join(STEP_IMAGES_DIR, tutorial_id, filename)
    if not os.path.isfile(path):
        raise FileNotFoundError(f"Reference image not found: {tutorial_id}/{filename}")
    return cv2.cvtColor(np.array(Image.open(path).convert("RGB")), cv2.COLOR_RGB2BGR)


def _to_contour(bgr: np.ndarray, is_ref: bool = False) -> np.ndarray:
    """Preprocess → white-on-black contour at output_size × output_size."""
    proc = ref_preprocessor if is_ref else preprocessor
    return cv2.bitwise_not(proc.process(bgr))


def _encode_image(img: np.ndarray) -> str:
    """BGR ndarray → base64 PNG data-URL."""
    ok, buf = cv2.imencode(".png", img)
    if not ok:
        raise RuntimeError("cv2.imencode failed")
    return "data:image/png;base64," + base64.b64encode(buf.tobytes()).decode("ascii")


def _display_size(bgr: np.ndarray) -> tuple[int, int]:
    """(width, height) scaled so longest edge = _MAX_DISPLAY."""
    h, w = bgr.shape[:2]
    s = _MAX_DISPLAY / max(w, h)
    return int(w * s), int(h * s)


def _run_pair(ref_bgr: np.ndarray, child_bgr: np.ndarray, return_raw: bool = False):
    """
    Shared pipeline for /compare and /debug_compare.
    Returns (score, heatmap_bgr, zones, [raw_heatmap], ref_contour, child_contour).
    """
    ref_contour   = _to_contour(ref_bgr,   is_ref=True)
    child_contour = _to_contour(child_bgr, is_ref=False)
    disp_size     = _display_size(ref_bgr)

    result = infer(
        model, ref_contour, child_contour,
        heatmap_size=disp_size,
        zone_threshold=0.20,
        overlay_bgr=ref_bgr,
        return_raw=return_raw,
    )
    # infer returns (score, heatmap, zones) or (score, heatmap, zones, raw)
    return (*result, ref_contour, child_contour)


# ── routes ────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    return send_from_directory(str(_WEB_DIR), "index.html")

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

@app.route("/level3v2/<path:filename>")
def level3v2_static(filename):
    return send_from_directory(os.path.join(BASE_DIR, '..', 'level3v2'), filename)

@app.route("/level4/<path:filename>")
def serve_level4(filename):
    return send_from_directory(os.path.join(BASE_DIR, '..', 'level4'), filename)

@app.route("/debug")
def debug_page():
    return send_from_directory(str(_WEB_DIR), "debug.html")


@app.route("/contour", methods=["POST"])
def contour():
    data = request.get_json(force=True)
    if "image" not in data:
        return jsonify({"error": "'image' field is required"}), 400
    try:
        bgr = _decode_bgr(data["image"])
    except Exception as exc:
        return jsonify({"error": f"Image decode failed: {exc}"}), 400

    result = preprocessor.process(bgr)   # white-bg, black-strokes

    # Colourise: parchment bg (#F7EDD0), deep-brown strokes (#3A1A02)
    out = np.where(
        (result < 128)[..., None],
        np.array([2, 26, 58],  dtype=np.uint8),   # stroke colour (BGR)
        np.array([208, 237, 247], dtype=np.uint8), # bg colour (BGR)
    ).astype(np.uint8)
    return jsonify({"contour": _encode_image(out)})


@app.route("/compare", methods=["POST"])
def compare():
    data = request.get_json(force=True)
    if "tutorial_id" not in data or "child" not in data:
        return jsonify({"error": "Both 'tutorial_id' and 'child' fields are required"}), 400

    try:
        ref_bgr = _load_ref_bgr(data["tutorial_id"], data.get("step"))
    except FileNotFoundError as exc:
        return jsonify({"error": str(exc)}), 404
    except Exception as exc:
        return jsonify({"error": f"Reference load failed: {exc}"}), 400

    try:
        child_bgr = _decode_bgr(data["child"])
    except Exception as exc:
        return jsonify({"error": f"Image decode failed: {exc}"}), 400

    try:
        score, heatmap_bgr, zones, *_ = _run_pair(ref_bgr, child_bgr)
    except Exception as exc:
        return jsonify({"error": f"Inference failed: {exc}"}), 500

    return jsonify({"score": round(float(score), 1), "heatmap": _encode_image(heatmap_bgr), "zones": zones})


@app.route("/debug_preprocess", methods=["POST"])
def debug_preprocess():
    """
    Show every preprocessing step for a student upload.
    POST {"image": "<base64>"} or {"tutorial_id": "...", "child": "<base64>"}

    Returns step images: original, after_bg_removal, after_crop, after_resize, contour.
    Also runs the same image through the reference preprocessor so you can
    compare what the model actually sees for both sides.
    """
    data = request.get_json(force=True)

    # Accept either a standalone image or the full compare payload
    if "image" in data:
        try:
            bgr = _decode_bgr(data["image"])
        except Exception as exc:
            return jsonify({"error": f"Image decode failed: {exc}"}), 400
        child_steps = preprocessor.process_debug(bgr)
        return jsonify({f"child_{k}": _encode_image(v) for k, v in child_steps.items()})

    if "tutorial_id" not in data or "child" not in data:
        return jsonify({"error": "Provide either 'image' or both 'tutorial_id' and 'child'"}), 400

    try:
        ref_bgr = _load_ref_bgr(data["tutorial_id"], data.get("step"))
    except FileNotFoundError as exc:
        return jsonify({"error": str(exc)}), 404

    try:
        child_bgr = _decode_bgr(data["child"])
    except Exception as exc:
        return jsonify({"error": f"Image decode failed: {exc}"}), 400

    ref_steps   = ref_preprocessor.process_debug(ref_bgr)
    child_steps = preprocessor.process_debug(child_bgr)

    return jsonify({
        **{f"ref_{k}":   _encode_image(v) for k, v in ref_steps.items()},
        **{f"child_{k}": _encode_image(v) for k, v in child_steps.items()},
    })


@app.route("/debug_compare", methods=["POST"])
def debug_compare():
    """
    Full debug: preprocessing steps + model internals (raw heatmap, embeddings, theta).
    POST {"tutorial_id": "...", "child": "<base64>", "step": <int|null>}
    """
    data = request.get_json(force=True)
    if "tutorial_id" not in data or "child" not in data:
        return jsonify({"error": "Both 'tutorial_id' and 'child' fields are required"}), 400

    try:
        ref_bgr = _load_ref_bgr(data["tutorial_id"], data.get("step"))
    except FileNotFoundError as exc:
        return jsonify({"error": str(exc)}), 404
    except Exception as exc:
        return jsonify({"error": f"Reference load failed: {exc}"}), 400

    try:
        child_bgr = _decode_bgr(data["child"])
    except Exception as exc:
        return jsonify({"error": f"Image decode failed: {exc}"}), 400

    try:
        score, heatmap_bgr, zones, raw_heatmap, ref_contour, child_contour = _run_pair(
            ref_bgr, child_bgr, return_raw=True
        )
    except Exception as exc:
        return jsonify({"error": f"Inference failed: {exc}"}), 500

    # Normalise raw heatmap for greyscale visualisation
    hm = raw_heatmap.copy()
    if (hi := hm.max()) > (lo := hm.min()):
        hm = (hm - lo) / (hi - lo)
    hm_gray = (hm * 255).astype(np.uint8)

    # Preprocessing steps for both sides
    ref_steps   = ref_preprocessor.process_debug(ref_bgr)
    child_steps = preprocessor.process_debug(child_bgr)

    return jsonify({
        # Scores & model output
        "score":           round(float(score), 1),
        "heatmap_overlay": _encode_image(heatmap_bgr),
        "heatmap_raw":     _encode_image(hm_gray),
        "zones":           zones,
        # What the model actually compared
        "ref_contour":     _encode_image(ref_contour),
        "child_contour":   _encode_image(child_contour),
        # Step-by-step preprocessing
        **{f"ref_{k}":   _encode_image(v) for k, v in ref_steps.items()},
        **{f"child_{k}": _encode_image(v) for k, v in child_steps.items()},
        # Native sizes
        "ref_size":   list(ref_bgr.shape[:2][::-1]),
        "child_size": list(child_bgr.shape[:2][::-1]),
    })


@app.route("/model_sanity/<tutorial_id>")
def model_sanity(tutorial_id):
    """
    Pass the reference image as both ref and stu — score should be ~100.
    GET /model_sanity/<tutorial_id>
    """
    from data.preprocessing import to_distance_transform

    try:
        ref_bgr = _load_ref_bgr(tutorial_id, step=None)
    except FileNotFoundError:
        return jsonify({"error": f"No reference.png for '{tutorial_id}'"}), 404

    ref_contour = _to_contour(ref_bgr, is_ref=True)

    dt  = to_distance_transform(ref_contour, sigma=5.0)
    dev = next(model.parameters()).device
    t   = torch.from_numpy(dt).unsqueeze(0).unsqueeze(0).to(dev)

    with torch.no_grad():
        out = model(t, t)

    score   = float(out["score"].squeeze().cpu())
    heatmap = out["heatmap"].squeeze(0).cpu().numpy()
    theta   = out["theta"].squeeze(0).cpu().numpy()

    emb_cos     = float((out["ref_emb"] * out["stu_emb"]).sum().cpu())
    stn_dev     = float(np.abs(theta - np.array([[1,0,0],[0,1,0]], dtype=np.float32)).max())
    hm_mean     = float(heatmap.mean())
    hm_max      = float(heatmap.max())
    uniform     = abs(hm_max - hm_mean) < 1e-4

    if score >= 85:
        diagnosis = "Model looks healthy."
    elif uniform:
        diagnosis = (f"Score-head convergence bug: score={score:.1f} but fused diff is zero. "
                     "Retrain with fixed curriculum.")
    elif hm_mean > 0.25:
        diagnosis = f"Preprocessing polarity bug: heatmap_mean={hm_mean:.4f} for identical inputs."
    else:
        diagnosis = f"Model undertrained: score={score:.1f}, hm_mean={hm_mean:.4f}."

    hm = heatmap.copy()
    if hm.max() > hm.min():
        hm = (hm - hm.min()) / (hm.max() - hm.min())

    return jsonify({
        "score":         round(score, 1),
        "emb_cosine":    round(emb_cos, 4),
        "stn_deviation": round(stn_dev, 6),
        "heatmap_mean":  round(hm_mean, 6),
        "heatmap_max":   round(hm_max, 6),
        "theta":         theta.tolist(),
        "diagnosis":     diagnosis,
        "ref_contour":   _encode_image(ref_contour),
        "heatmap_raw":   _encode_image((hm * 255).astype(np.uint8)),
    })


# ── data collection endpoints ────────────────────────────────────────────────

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json(force=True)
    required = {'tutorial_id', 'score', 'tier', 'zones', 'image'}
    if not required.issubset(data):
        return jsonify({'error': 'Missing fields'}), 400

    result = _gspread_client()
    if not result:
        print('[submit] GOOGLE_CREDENTIALS_JSON not set — skipping sheet write')
        return jsonify({'ok': True, 'warn': 'credentials not configured'})

    gc_client = result
    sheet_id = os.environ.get('GOOGLE_SHEET_ID')
    ts = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds')

    img_url = _upload_image_to_imgbb(data.get('image', ''))

    sh = gc_client.open_by_key(sheet_id)
    ws = sh.worksheet('Submissions')
    ws.append_row(
        [ts, data['tutorial_id'], data['score'], data['tier'],
         json.dumps(data['zones']), img_url],
        value_input_option='USER_ENTERED')
    return jsonify({'ok': True})


@app.route('/bug', methods=['POST'])
def bug():
    data = request.get_json(force=True)
    if 'description' not in data:
        return jsonify({'error': "'description' required"}), 400

    result = _gspread_client()
    if not result:
        print('[bug] GOOGLE_CREDENTIALS_JSON not set — skipping sheet write')
        return jsonify({'ok': True, 'warn': 'credentials not configured'})

    gc_client = result
    sheet_id = os.environ.get('GOOGLE_SHEET_ID')
    ts = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds')

    img_url = _upload_image_to_imgbb(data.get('screenshot', ''))

    sh = gc_client.open_by_key(sheet_id)
    ws = sh.worksheet('Bug Reports')
    ws.append_row([ts, data['description'], img_url], value_input_option='USER_ENTERED')
    return jsonify({'ok': True})


# ── entry point ───────────────────────────────────────────────────────────────

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 7860))
    print(f"Ready on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port)
