/**
 * classifier.js — Chitra-Katha Teachable Machine Module
 *
 * Dependencies (loaded via CDN in index.html):
 *   - @tensorflow/tfjs
 *   - @teachablemachine/image
 */

const Classifier = (() => {

  /* —— Config ———————————————————————————————————————————————————— */
  const MODEL_URL = "https://teachablemachine.withgoogle.com/models/CefyWcpll/";
  const THRESHOLD = 0.85;

  /* —— State ————————————————————————————————————————————————————— */
  let model = null;

  /* —— Load Model —————————————————————————————————————————————— */
  async function loadModel() {
    if (model) return;
    model = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
    console.log("[Classifier] Model loaded. Classes:", model.getClassLabels());
  }

  /* —— Predict from Canvas ————————————————————————————————————— */
  async function predictFromCanvas(canvas) {
    if (!model) throw new Error("Model not loaded. Call Classifier.loadModel() first.");
    const preds = await model.predict(canvas);
    const best = preds.reduce((a, b) => a.probability > b.probability ? a : b);
    return {
      className:      best.className,
      probability:    best.probability,
      allPredictions: preds,
      aboveThreshold: best.probability >= THRESHOLD
    };
  }

  /* —— Predict from Image Element ————————————————————————————— */
  async function predictFromImageElement(imgEl) {
    const canvas = document.createElement("canvas");
    canvas.width  = 224;
    canvas.height = 224;
    canvas.getContext("2d").drawImage(imgEl, 0, 0, 224, 224);
    return await predictFromCanvas(canvas);
  }

  /* —— Start Webcam ——————————————————————————————————————————— */
  async function startWebcam(containerEl) {
    const attempts = [
      { label: "rear (exact)", constraints: { video: { facingMode: { exact: "environment" }, width: { ideal: 640 }, height: { ideal: 480 } } } },
      { label: "rear (ideal)", constraints: { video: { facingMode: { ideal: "environment" }, width: { ideal: 640 }, height: { ideal: 480 } } } },
      { label: "front",        constraints: { video: { facingMode: { ideal: "user" },        width: { ideal: 640 }, height: { ideal: 480 } } } },
      { label: "any camera",   constraints: { video: true } },
    ];

    let stream = null;
    let lastErr = null;

    for (const attempt of attempts) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ ...attempt.constraints, audio: false });
        console.log("[Classifier] Camera opened:", attempt.label);
        break;
      } catch (e) {
        console.warn(`[Classifier] Camera attempt failed (${attempt.label}):`, e.name, e.message);
        lastErr = e;
        stream = null;
      }
    }

    if (!stream) {
      const n = lastErr ? lastErr.name : "UnknownError";
      let msg = `Could not open camera (${n}).`;
      if (n === "NotAllowedError"  || n === "PermissionDeniedError") msg = "Camera permission denied. Allow camera access in your browser settings and reload.";
      else if (n === "NotFoundError")    msg = "No camera found. Make sure no other app is using it.";
      else if (n === "NotReadableError") msg = "Camera is in use by another application. Close it and try again.";
      else if (n === "SecurityError")    msg = "Camera blocked. The page must be served over HTTPS (not file://).";
      throw new Error(msg);
    }

    const videoEl = document.createElement("video");
    videoEl.setAttribute("playsinline", "");
    videoEl.setAttribute("muted", "");
    videoEl.autoplay   = true;
    videoEl.srcObject  = stream;
    videoEl.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";

    await new Promise((res, rej) => {
      videoEl.onloadedmetadata = res;
      setTimeout(() => rej(new Error("Camera metadata timeout.")), 8000);
    });
    await videoEl.play();

    if (containerEl) containerEl.appendChild(videoEl);

    const size      = 480;
    const offCanvas = document.createElement("canvas");
    offCanvas.width  = size;
    offCanvas.height = Math.round(size * 0.75);
    const ctx = offCanvas.getContext("2d");

    return {
      canvas: offCanvas,
      update() { ctx.drawImage(videoEl, 0, 0, offCanvas.width, offCanvas.height); },
      pause() { videoEl.pause(); },
      stop() {
        videoEl.pause();
        stream.getTracks().forEach(t => t.stop());
        if (videoEl.parentNode) videoEl.parentNode.removeChild(videoEl);
      }
    };
  }

  /* —— Utility ————————————————————————————————————————————————— */
  function getClassLabels() {
    if (!model) throw new Error("Model not loaded.");
    return model.getClassLabels();
  }

  /* —— Public API —————————————————————————————————————————————— */
  return { MODEL_URL, THRESHOLD, loadModel, predictFromCanvas, predictFromImageElement, startWebcam, getClassLabels };

})();

if (typeof module !== "undefined" && module.exports) module.exports = Classifier;
