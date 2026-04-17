/**
 * level3v2/level3v2.js — Chitra Katha Level 3 v2
 * ================================================
 * Guided step-by-step drawing tutorial with AI evaluation.
 *
 * Screens managed (ids must match index.html):
 *   screen-l3-select   — Art form selection grid (shown when identified art
 *                         has no tutorial, or user wants to choose)
 *   screen-l3-tutorial — Step-by-step tutorial viewer
 *   screen-l3-eval     — Upload artwork & see AI score/heatmap/zones
 *
 * Depends on (same page scope):
 *   TUTORIAL_DATA, ARTFORM_TO_TUTORIAL  (data.js)
 *   showScreen()                        (app.js)
 *
 * Android note:
 *   All image paths are relative URLs so they resolve correctly whether
 *   served by Flask or from file:// in an Android WebView.
 *   The /compare endpoint must be reachable; on Android, point API_COMPARE
 *   to the device's local server IP.
 */

const Level3v2 = (() => {
  'use strict';

  // ── Internal state ──────────────────────────────────────────────────────
  let _artKey       = null;   // classifier key (e.g. "Kalighat of Bengal")
  let _tutorialId   = null;   // key into TUTORIAL_DATA
  let _tutorial     = null;   // TUTORIAL_DATA[_tutorialId]
  let _currentStep  = 0;      // 0-based step index
  let _refImageSrc  = null;   // data-URL or blob-URL for evaluation reference
  let _fromSelect   = false;  // true if user navigated via art-select screen

  // Backend is hosted on Hugging Face Spaces. Replace the placeholder below
  // with your actual Space URL (e.g. https://<user>-<space-name>.hf.space).
  const BACKEND_URL = 'https://pranavpul-chitra-katha-backend.hf.space'; // TODO: fill in
  const API_COMPARE = `${BACKEND_URL}/compare`;
  const IMG_BASE    = 'level3v2/step_images/';
  const PLACEHOLDER = 'level3v2/placeholder.svg';

  // ── Public entry point ──────────────────────────────────────────────────

  /**
   * Called from app.js when the user taps "Try Painting This" on level 2.
   * @param {string} artKey   — ARTFORMS key (classifier output)
   * @param {string} imageSrc — data-URL or blob-URL of the identified artwork
   */
  function start(artKey, imageSrc) {
    _artKey      = artKey;
    _refImageSrc = imageSrc || null;

    const tutId = ARTFORM_TO_TUTORIAL[artKey];
    if (tutId && TUTORIAL_DATA[tutId]) {
      _fromSelect = false;
      _startTutorial(tutId);
    } else {
      // Art form not supported — let user pick from the 5 available
      _showArtSelect();
    }
  }

  // ── Art-select screen ───────────────────────────────────────────────────

  function _showArtSelect() {
    const grid = document.getElementById('l3s-grid');
    grid.innerHTML = '';

    Object.entries(TUTORIAL_DATA).forEach(([id, data]) => {
      const tile = document.createElement('div');
      tile.className = 'l3s-tile';
      tile.setAttribute('role', 'button');
      tile.setAttribute('tabindex', '0');

      tile.innerHTML = `
        <div class="l3s-tile-img-wrap">
          <img
            class="l3s-tile-img"
            src="${IMG_BASE}${id}/reference.png"
            alt="${data.name}"
            loading="lazy"
            onerror="this.closest('.l3s-tile-img-wrap').classList.add('l3s-no-img');this.remove()"
          />
          <div class="l3s-tile-fallback">✦</div>
        </div>
        <div class="l3s-tile-info">
          <p class="l3s-tile-name">${data.name}</p>
          <p class="l3s-tile-sub">${data.subtitle}</p>
          <span class="l3s-tile-steps">${data.totalSteps} steps</span>
        </div>
      `;

      const pick = () => {
        _fromSelect   = true;
        _refImageSrc  = null;   // no user scan → evaluation uses reference.jpg
        _startTutorial(id);
      };
      tile.addEventListener('click', pick);
      tile.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') pick(); });
      grid.appendChild(tile);
    });

    showScreen('screen-l3-select');
    document.getElementById('screen-l3-select').scrollTop = 0;
  }

  // ── Tutorial screen ─────────────────────────────────────────────────────

  function _startTutorial(id) {
    _tutorialId  = id;
    _tutorial    = TUTORIAL_DATA[id];
    _currentStep = 0;

    document.getElementById('l3t-title').textContent = _tutorial.name;
    _renderStep();
    showScreen('screen-l3-tutorial');
    document.getElementById('screen-l3-tutorial').scrollTop = 0;
  }

  function _renderStep() {
    const step      = _tutorial.steps[_currentStep];
    const total     = _tutorial.steps.length;
    const stepNum   = _currentStep + 1;          // 1-based display

    // Header counter
    document.getElementById('l3t-counter').textContent = `${stepNum} / ${total}`;
    document.getElementById('l3t-step-badge').textContent = `Step ${stepNum}`;

    // Progress bar
    const pct = (stepNum / total) * 100;
    document.getElementById('l3t-progress-bar').style.width = pct + '%';

    // Step reference image
    const imgEl  = document.getElementById('l3t-image');
    const imgSrc = `${IMG_BASE}${_tutorialId}/${stepNum}.png`;
    imgEl.src    = imgSrc;
    imgEl.alt    = `Step ${stepNum} reference`;
    imgEl.classList.remove('l3t-image-error');
    imgEl.onerror = () => {
      imgEl.src = PLACEHOLDER;
      imgEl.classList.add('l3t-image-error');
    };

    // Instruction text
    document.getElementById('l3t-instruction').textContent = step.instruction;

    // Clear any step-check result from the previous step
    _clearStepCheck();

    // Navigation visibility
    const prevBtn   = document.getElementById('l3t-prev');
    const nextBtn   = document.getElementById('l3t-next');
    const finishBtn = document.getElementById('l3t-finish');

    prevBtn.disabled = (_currentStep === 0);

    const isLast = (_currentStep === total - 1);
    nextBtn.style.display   = isLast ? 'none' : 'block';
    finishBtn.style.display = isLast ? 'block' : 'none';

    document.getElementById('screen-l3-tutorial').scrollTop = 0;
  }

  function _nextStep() {
    if (_currentStep < _tutorial.steps.length - 1) {
      _currentStep++;
      _renderStep();
    }
  }

  function _prevStep() {
    if (_currentStep > 0) {
      _currentStep--;
      _renderStep();
    }
  }

  function _tutorialBack() {
    // On the first step, back goes to the previous screen
    if (_currentStep === 0) {
      if (_fromSelect) {
        showScreen('screen-l3-select');
      } else {
        showScreen('screen-level2');
      }
    } else {
      _prevStep();
    }
  }

  // ── Camera modal (per-step check) ───────────────────────────────────────

  let _camStream = null;
  let _camVideo  = null;
  let _camRaf    = null;

  function _openCamera() {
    const modal = document.getElementById('l3t-cam-modal');
    const video = document.getElementById('l3t-cam-video');
    _camVideo = video;

    modal.style.display = 'flex';

    const attempts = [
      { video: { facingMode: { exact: 'environment' } } },
      { video: { facingMode: { ideal: 'environment' } } },
      { video: true },
    ];

    (async () => {
      let stream = null;
      for (const constraints of attempts) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ ...constraints, audio: false });
          break;
        } catch (_) { /* try next */ }
      }

      if (!stream) {
        _closeCamera();
        alert('Could not access camera. Check browser permissions.');
        return;
      }

      _camStream      = stream;
      video.srcObject = stream;
      video.setAttribute('playsinline', '');
      video.muted = true;
      await video.play();
    })();
  }

  function _closeCamera() {
    const modal = document.getElementById('l3t-cam-modal');
    modal.style.display = 'none';
    if (_camStream) {
      _camStream.getTracks().forEach(t => t.stop());
      _camStream = null;
    }
    if (_camVideo) {
      _camVideo.srcObject = null;
      _camVideo = null;
    }
    if (_camRaf) {
      cancelAnimationFrame(_camRaf);
      _camRaf = null;
    }
  }

  function _captureFrame() {
    const video = document.getElementById('l3t-cam-video');
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement('canvas');
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataURL = canvas.toDataURL('image/jpeg', 0.92);

    _closeCamera();
    _clearStepCheck();
    _runStepCheck(dataURL);
  }

  // ── Per-step check ──────────────────────────────────────────────────────

  function _clearStepCheck() {
    const panel = document.getElementById('l3t-check-panel');
    panel.style.display = 'none';
    panel.innerHTML     = '';
  }

  async function _runStepCheck(childDataURL) {
    const panel   = document.getElementById('l3t-check-panel');
    const stepNum = _currentStep + 1;

    // Show spinner
    panel.style.display = 'block';
    panel.innerHTML = `
      <div class="l3t-check-loading">
        <div class="spinner"></div>
        <p>Checking step ${stepNum}…</p>
      </div>`;

    try {
      const refDataURL = await _pathToDataURL(`${IMG_BASE}${_tutorialId}/${stepNum}.png`);

      let resp;
      try {
        resp = await fetch(API_COMPARE, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ reference: refDataURL, child: childDataURL }),
        });
      } catch (_) {
        throw { isNetwork: true };
      }

      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body.error || `Server error ${resp.status}`);
      }

      const data = await resp.json();
      _showStepCheckResult(panel, data, stepNum, childDataURL);

    } catch (err) {
      console.error('[StepCheck]', err);
      const msg = (err && err.isNetwork)
        ? 'Could not reach the server. Is <code>python level3/server.py</code> running?'
        : (err && err.message) || 'Something went wrong.';
      panel.innerHTML = `
        <div class="l3t-check-result l3t-check-error">
          <p>${msg}</p>
          <button class="l3t-check-dismiss">Dismiss</button>
        </div>`;
      panel.querySelector('.l3t-check-dismiss').addEventListener('click', _clearStepCheck);
    }
  }

  async function _showStepCheckResult(panel, data, stepNum, childDataURL) {
    const { score, heatmap, zones } = data;
    const label   = _scoreLabel(score);
    const rounded = Math.round(score);

    let scoreClass = 'check-score-low';
    if      (rounded >= 75) scoreClass = 'check-score-high';
    else if (rounded >= 50) scoreClass = 'check-score-mid';

    let zonesHtml = '';
    if (!zones || zones.length === 0) {
      zonesHtml = '<p class="zone-all-good">✦ Looking great!</p>';
    } else {
      zonesHtml = zones.slice(0, 4).map(z => `
        <div class="zone-row">
          <span class="zone-badge ${z.severity}">${z.severity}</span>
          <span class="zone-name">${z.zone}</span>
        </div>`).join('');
    }

    // Composite child image over heatmap so user sees deviations on their own drawing
    const overlayDataURL = await _compositeOverlay(heatmap, childDataURL, 260);

    panel.innerHTML = `
      <div class="l3t-check-result">
        <div class="l3t-check-header">
          <span class="l3t-check-title">Step ${stepNum} Check</span>
        </div>
        <div class="l3t-check-score-block ${scoreClass}">
          <span class="l3t-check-score-number">${rounded}</span>
          <span class="l3t-check-score-label">${label}</span>
        </div>
        <img class="l3t-check-heatmap" src="${overlayDataURL}" alt="Step heatmap with your drawing" />
        <p class="l3t-check-legend">
          <span class="legend-dot" style="background:#1a7a2e"></span>Good &ensp;
          <span class="legend-dot" style="background:#C98A1A"></span>Drift &ensp;
          <span class="legend-dot" style="background:#B94012"></span>Deviation
          <span class="l3t-check-legend-note">(your drawing overlaid)</span>
        </p>
        <div class="l3t-check-zones">${zonesHtml}</div>
        <button class="l3t-check-dismiss">Dismiss</button>
      </div>`;

    panel.querySelector('.l3t-check-dismiss').addEventListener('click', _clearStepCheck);
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ── Evaluation screen ───────────────────────────────────────────────────

  function _showEvaluation() {
    document.getElementById('l3e-artname').textContent = _tutorial.name;
    _resetEvalUI();
    showScreen('screen-l3-eval');
    document.getElementById('screen-l3-eval').scrollTop = 0;
  }

  function _resetEvalUI() {
    document.getElementById('l3e-results').style.display   = 'none';
    document.getElementById('l3e-loading').style.display   = 'none';
    document.getElementById('l3e-ring-circle').style.strokeDashoffset = '314';
    document.getElementById('l3e-ring-circle').style.stroke = 'var(--terracotta)';
    document.getElementById('l3e-score').textContent        = '–';
    document.getElementById('l3e-score-label').textContent  = '';
    document.getElementById('l3e-heatmap').src              = '';
    document.getElementById('l3e-zone-list').innerHTML      = '';
  }

  async function _runComparison(childDataURL) {
    document.getElementById('l3e-results').style.display = 'none';
    document.getElementById('l3e-loading').style.display = 'flex';
    document.getElementById('l3e-btn-upload').disabled   = true;

    try {
      // Always compare against the canonical master reference for this art form,
      // NOT the user's Level-1 identification image.
      const refDataURL = await _pathToDataURL(`${IMG_BASE}${_tutorialId}/reference.png`);

      let resp;
      try {
        resp = await fetch(API_COMPARE, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ reference: refDataURL, child: childDataURL }),
        });
      } catch (_networkErr) {
        throw { isNetwork: true };
      }

      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body.error || `Server error ${resp.status}`);
      }

      const data = await resp.json();
      _showResults(data, childDataURL);

    } catch (err) {
      console.error('[Level3v2]', err);
      _showErrorResults(err);

    } finally {
      document.getElementById('l3e-loading').style.display   = 'none';
      document.getElementById('l3e-btn-upload').disabled     = false;
    }
  }

  async function _showResults(data, childDataURL) {
    const { score, heatmap, zones } = data;

    document.getElementById('l3e-score').textContent       = Math.round(score);
    document.getElementById('l3e-score-label').textContent = _scoreLabel(score);
    setTimeout(() => _animateRing(score), 60);

    // Composite child image over heatmap
    const overlayDataURL = await _compositeOverlay(heatmap, childDataURL, 260);
    document.getElementById('l3e-heatmap').src = overlayDataURL;

    const list = document.getElementById('l3e-zone-list');
    list.innerHTML = '';

    if (!zones || zones.length === 0) {
      list.innerHTML = '<p class="zone-all-good">✦ No significant deviations — great work!</p>';
    } else {
      zones.forEach(z => {
        const row = document.createElement('div');
        row.className = 'zone-row';
        row.innerHTML = `
          <span class="zone-badge ${z.severity}">${z.severity}</span>
          <span class="zone-name">${z.zone}</span>
        `;
        list.appendChild(row);
      });
    }

    document.getElementById('l3e-results').style.display = 'flex';
    document.getElementById('screen-l3-eval').scrollTop  = 500; // scroll down to results
  }

  function _showErrorResults(err) {
    document.getElementById('l3e-score').textContent = '–';

    let msg;
    if (err && err.isNetwork) {
      msg = `Could not reach the comparison server.<br>
             Make sure <code>python level3/server.py</code> is running.`;
    } else {
      msg = err && err.message ? err.message : 'Something went wrong. Please try again.';
    }

    document.getElementById('l3e-score-label').textContent = '';
    document.getElementById('l3e-zone-list').innerHTML =
      `<p class="zone-all-good" style="color:var(--terracotta)">${msg}</p>`;
    document.getElementById('l3e-results').style.display = 'flex';
  }

  // ── Heatmap + child overlay ─────────────────────────────────────────────

  /**
   * Composite the user's drawing (semi-transparent) on top of the heatmap
   * so the user can see exactly where on *their own artwork* the deviations fall.
   *
   * Layout:
   *   1. Heatmap (jet-coloured, full opacity)      — feedback layer
   *   2. Child image (object-fit:cover, 38% opacity) — "here is your drawing"
   *
   * Returns a new data-URL (PNG). Falls back to the plain heatmap on any error.
   */
  function _compositeOverlay(heatmapDataURL, childDataURL, size) {
    size = size || 260;
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      canvas.width  = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      const heatmapImg = new Image();
      heatmapImg.onload = () => {
        // Draw heatmap first
        ctx.drawImage(heatmapImg, 0, 0, size, size);

        const childImg = new Image();
        childImg.onload = () => {
          // Draw child image centred + cover-cropped at 38% opacity
          ctx.globalAlpha = 0.38;
          const iw = childImg.naturalWidth;
          const ih = childImg.naturalHeight;
          const scale = Math.max(size / iw, size / ih);
          const sw = iw * scale;
          const sh = ih * scale;
          ctx.drawImage(childImg, (size - sw) / 2, (size - sh) / 2, sw, sh);
          ctx.globalAlpha = 1.0;
          resolve(canvas.toDataURL('image/png'));
        };
        childImg.onerror = () => resolve(heatmapDataURL);
        childImg.src = childDataURL;
      };
      heatmapImg.onerror = () => resolve(heatmapDataURL);
      heatmapImg.src = heatmapDataURL;
    });
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  function _scoreLabel(score) {
    if (score >= 90) return 'Near perfect!';
    if (score >= 75) return 'Great work!';
    if (score >= 55) return 'Well done!';
    if (score >= 35) return 'Good start!';
    return 'Keep practising!';
  }

  function _animateRing(score) {
    const circle = document.getElementById('l3e-ring-circle');
    circle.style.strokeDashoffset = String(314 * (1 - score / 100));
    if      (score >= 75) circle.style.stroke = 'var(--forest)';
    else if (score >= 50) circle.style.stroke = 'var(--ochre)';
    else                  circle.style.stroke = 'var(--terracotta)';
  }

  /**
   * Load a local image path and return it as a base64 data-URL.
   * Used when we want to send the canonical reference.jpg to the server.
   */
  function _pathToDataURL(path) {
    return new Promise((resolve, reject) => {
      const img    = new Image();
      img.crossOrigin = 'anonymous';
      img.onload  = () => {
        const c = document.createElement('canvas');
        c.width  = img.naturalWidth;
        c.height = img.naturalHeight;
        c.getContext('2d').drawImage(img, 0, 0);
        resolve(c.toDataURL('image/jpeg', 0.92));
      };
      img.onerror = () => reject(new Error(`Could not load reference image: ${path}`));
      img.src = path;
    });
  }

  /**
   * Convert a blob: URL to a base64 data-URL.
   */
  function _blobURLToDataURL(blobURL) {
    return new Promise((resolve, reject) => {
      const img    = new Image();
      img.onload  = () => {
        const c = document.createElement('canvas');
        c.width  = img.naturalWidth;
        c.height = img.naturalHeight;
        c.getContext('2d').drawImage(img, 0, 0);
        resolve(c.toDataURL('image/jpeg', 0.92));
      };
      img.onerror = () => reject(new Error('Could not load reference image'));
      img.src = blobURL;
    });
  }

  // ── Event wiring ─────────────────────────────────────────────────────────

  function _init() {
    // ── Art-select screen ──────────────────────────────────────────────────
    document.getElementById('l3s-back').addEventListener('click', () => {
      showScreen('screen-level2');
    });

    // ── Tutorial screen ────────────────────────────────────────────────────
    document.getElementById('l3t-back').addEventListener('click', _tutorialBack);
    document.getElementById('l3t-prev').addEventListener('click', _prevStep);
    document.getElementById('l3t-next').addEventListener('click', _nextStep);
    document.getElementById('l3t-finish').addEventListener('click', _showEvaluation);

    document.getElementById('l3t-check-btn-upload').addEventListener('click', () => {
      _clearStepCheck();
      document.getElementById('l3t-check-input').click();
    });

    document.getElementById('l3t-check-btn-camera').addEventListener('click', () => {
      _clearStepCheck();
      _openCamera();
    });

    document.getElementById('l3t-cam-capture').addEventListener('click', _captureFrame);
    document.getElementById('l3t-cam-cancel').addEventListener('click',  _closeCamera);

    document.getElementById('l3t-check-input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      e.target.value = '';
      const reader = new FileReader();
      reader.onload  = ev => _runStepCheck(ev.target.result);
      reader.onerror = ()  => alert('Could not read the selected file.');
      reader.readAsDataURL(file);
    });

    // Touch/swipe support for step navigation
    let _touchStartX = 0;
    const tutScreen = document.getElementById('screen-l3-tutorial');
    tutScreen.addEventListener('touchstart', e => {
      _touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    tutScreen.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].screenX - _touchStartX;
      if (Math.abs(dx) < 50) return;   // too small — ignore
      if (dx < 0) _nextStep();          // swipe left  → next
      else        _prevStep();          // swipe right → prev
    }, { passive: true });

    // ── Evaluation screen ──────────────────────────────────────────────────
    document.getElementById('l3e-back').addEventListener('click', () => {
      showScreen('screen-l3-tutorial');
      document.getElementById('screen-l3-tutorial').scrollTop = 0;
    });

    document.getElementById('l3e-btn-upload').addEventListener('click', () => {
      document.getElementById('l3e-file-input').click();
    });

    document.getElementById('l3e-file-input').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      e.target.value = '';   // allow re-selecting the same file

      const reader = new FileReader();
      reader.onload  = ev => _runComparison(ev.target.result);
      reader.onerror = ()  => alert('Could not read the selected file.');
      reader.readAsDataURL(file);
    });

    document.getElementById('l3e-retry').addEventListener('click', _resetEvalUI);
  }

  // ── Initialise on DOM ready ──────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

  // Public API
  return { start };

})();
