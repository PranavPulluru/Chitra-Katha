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

  // ── Translation helpers ─────────────────────────────────────────────────
  function _uiStr(key) {
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';
    const s = (typeof UI_STRINGS !== 'undefined')
      ? (UI_STRINGS[lang] || UI_STRINGS['en'])
      : {};
    return s[key] !== undefined ? s[key] : key;
  }
  function _uiFmt(key, vars) {
    let str = _uiStr(key);
    for (const [k, v] of Object.entries(vars)) str = str.replaceAll(`{${k}}`, v);
    return str;
  }

  // ── Internal state ──────────────────────────────────────────────────────
  let _artKey       = null;   // classifier key (e.g. "Kalighat of Bengal")
  let _tutorialId   = null;   // key into TUTORIAL_DATA
  let _tutorial     = null;   // TUTORIAL_DATA[_tutorialId]
  let _currentStep  = 0;      // 0-based step index
  let _refImageSrc  = null;   // data-URL or blob-URL for evaluation reference
  let _fromSelect   = false;  // true if user navigated via art-select screen

  // ── Improvement tips per art form + zone ────────────────────────────────
  const IMPROVEMENT_TIPS = {
    kalighat: {
      "top":          "Try drawing the head outline in one confident sweeping stroke — load your brush fully and don't lift it.",
      "top-left":     "The flowing outer contour of the shoulder and arm should be a single connected curve.",
      "top-right":    "Extend the eyes further horizontally and keep the strokes brisk — they should feel almost fish-like.",
      "center":       "Apply the colour wash in one quick flat pass — avoid going back over wet paint.",
      "center-left":  "The left silhouette edge should flow from shoulder to hip as one sweeping stroke.",
      "center-right": "The thick black outline on garment edges (the 'pad') needs to be bolder — load your brush more.",
      "bottom":       "The lower-body and skirt hem should be outlined with the same bold black line as the rest of the garment.",
      "bottom-left":  "Keep the foot/hem outline continuous — Kalighat feet are simplified into a single confident curve.",
      "bottom-right": "Ensure the garment border lines are clearly separated from the body outline.",
    },
    sohrai: {
      "top":          "Your two red ancestor lines at the top should be thick, parallel, and span the full width.",
      "top-left":     "Ensure the left side has the same density of motifs as the right — Sohrai is symmetrically balanced.",
      "top-right":    "Check the black Shiva line — it should run all the way across just below the red lines.",
      "center":       "The main animal should dominate the centre — make it larger and bolder.",
      "center-left":  "Add X-ray detail inside the animal outline — a spine or rib lines in a contrasting colour.",
      "center-right": "Add the comb sgraffito texture — scored parallel lines give Sohrai its distinctive rhythmic feel.",
      "bottom":       "The lower register needs its own border — a lotus band or simple repeated leaf motif.",
      "bottom-left":  "Add leaf or geometric fill in the lower left to balance the composition.",
      "bottom-right": "Mirror the lower-left motif on the right for compositional balance.",
    },
    warli: {
      "top":          "The top often shows trees — add small triangular tree shapes made of stacked triangles.",
      "top-left":     "Upper-left figures should use the standard two-triangle body — check torso and pelvis proportions.",
      "top-right":    "The Tarpa musician is often placed at the top right — a circle with radiating figures.",
      "center":       "The Chauk (sacred square) should be centred and symmetrical — all four quadrants need equal patterning.",
      "center-left":  "Left figures should be dancing — arms raised and legs bent into the classic triangle shape.",
      "center-right": "Right figures should mirror those on the left in the circular Tarpa dance formation.",
      "bottom":       "The ground register typically shows animals — elongated oval bodies with four stick legs.",
      "bottom-left":  "Add small grouped figure clusters in the lower left for hunting or agricultural scenes.",
      "bottom-right": "Lower right often shows cattle — oval body, four lines for legs, two lines for horns.",
    },
    madhubani: {
      "top":          "The upper border should be densely filled — add a row of lotus flowers or peacocks.",
      "top-left":     "Fill any white space in the upper left with small fish, birds, or diamond patterns.",
      "top-right":    "Upper right: mirror the motif on the left — Madhubani uses symmetrical panel borders.",
      "center":       "The main deity should be in the exact centre — check alignment and make the figure taller.",
      "center-left":  "Left of the deity: add attendant figures or blossoming trees with birds on the branches.",
      "center-right": "Right of the deity: add a mirror-image attendant or a peacock with its tail spread.",
      "bottom":       "The lower border should echo the upper — fish, turtles, or a geometric zigzag is traditional.",
      "bottom-left":  "Bottom left gap: fill with a creeper vine motif or a row of small repeating flower petals.",
      "bottom-right": "Bottom right gap: add a conch shell or ceremonial water pot as a finishing motif.",
    },
    talapatra: {
      "top":          "The top register should have a decorative border — a row of repeated geometric diamonds or dots.",
      "top-left":     "Upper-left outlines should be confident single-line incisions — press the stylus firmly.",
      "top-right":    "Add more cross-hatching inside robes and architectural backgrounds in the upper right.",
      "center":       "The central deity needs a clear aura or mandorla around it — etch concentric oval lines.",
      "center-left":  "Left panel: add a secondary character or devotee kneeling in a smaller scale.",
      "center-right": "Right panel: add a narrative element — a vehicle (vahana) or a symbolic weapon.",
      "bottom":       "The bottom register should show earth or water — horizontal wavy lines represent water.",
      "bottom-left":  "Bottom-left corner: add a row of incised dots or a small lotus rosette as a filler.",
      "bottom-right": "Bottom-right corner: a simple maker's mark — a triangle or a row of dots — is traditional.",
    },
  };

  // Backend is hosted on Hugging Face Spaces. Replace the placeholder below
  // with your actual Space URL (e.g. https://<user>-<space-name>.hf.space).
  // Use a relative path so requests go to whatever server is currently hosting
  // the frontend — local Flask dev server OR the deployed HF Space backend.
  // For Netlify (static-only hosting), swap to the absolute HF Space URL:
  //   const API_COMPARE = 'https://pranavpul-chitra-katha-backend.hf.space/compare';
  const API_COMPARE = '/compare';
  const IMG_BASE    = 'level3v2/step_images/';
  const PLACEHOLDER = 'level3v2/placeholder.svg';

  // Convert any browser-decodable image file (AVIF, WebP, HEIC, BMP, GIF…)
  // to a JPEG data-URL via canvas so the server always receives a known format.
  function _toJpegDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = ev => {
        const img = new Image();
        img.onerror = () => reject(new Error('Browser could not decode image'));
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width  = img.naturalWidth;
          canvas.height = img.naturalHeight;
          canvas.getContext('2d').drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.92));
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Normalize any uploaded file (HEIC, WebP, etc.) to a JPEG data-URL via canvas.
  // This ensures the server always receives a format PIL/OpenCV can decode.
  function _normalizeToJpeg(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = ev => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width  = img.naturalWidth;
          canvas.height = img.naturalHeight;
          canvas.getContext('2d').drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.92));
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

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

    let isFirst = true;
    Object.entries(TUTORIAL_DATA).forEach(([id, data]) => {
      const featured = isFirst;
      isFirst = false;

      const tile = document.createElement('div');
      tile.className = featured ? 'l3s-tile l3s-tile-featured' : 'l3s-tile';
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
          <div class="l3s-tile-chip">${_uiFmt('tileSteps', { n: data.totalSteps })}</div>
          ${featured ? `<div class="l3s-tile-popular">${_uiStr('tileFeatured')}</div>` : ''}
        </div>
        <div class="l3s-tile-info">
          <p class="l3s-tile-name">${data.name}</p>
          <p class="l3s-tile-sub">${data.subtitle}</p>
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

    // Beginner hint card
    const hint = document.createElement('div');
    hint.className = 'l3s-hint-card';
    hint.innerHTML = `
      <div class="l3s-hint-icon">★</div>
      <div>
        <div class="l3s-hint-title">${_uiStr('hintTitle')}</div>
        <div class="l3s-hint-sub">${_uiStr('hintSub')}</div>
      </div>
    `;
    grid.appendChild(hint);

    showScreen('screen-l3-select');
    document.getElementById('screen-l3-select').scrollTop = 0;
  }

  // ── Tutorial screen ─────────────────────────────────────────────────────

  function _startTutorial(id) {
    _tutorialId  = id;
    _tutorial    = TUTORIAL_DATA[id];
    _currentStep = 0;

    // Set tradition kicker (short name for the hero header center)
    const shortName = _tutorial.name.replace(/ Painting$/, '').replace(/ Art$/, '').toUpperCase();
    document.getElementById('l3t-title').textContent = shortName;
    document.getElementById('l3t-hero-subtitle').textContent = '';
    _buildRail();
    _renderStep();
    showScreen('screen-l3-tutorial');
    document.getElementById('screen-l3-tutorial').scrollTop = 0;
  }

  // ── Desktop step rail ────────────────────────────────────────────────────

  function _buildRail() {
    const rail = document.getElementById('l3t-rail');
    if (!rail) return;
    rail.innerHTML = `
      <div class="l3t-rail-count">${_uiFmt('tileSteps', { n: _tutorial.totalSteps })}</div>
      <div class="l3t-rail-title">${_tutorial.name}</div>
      <div class="l3t-rail-prog">
        <div class="l3t-rail-bar" id="l3t-rail-bar"></div>
      </div>
      ${_tutorial.steps.map((s, i) => {
        const lbl = s.instruction.split(/[.!?]/)[0].trim().substring(0, 36);
        return `<div class="l3t-rail-item" data-idx="${i}">
          <span class="l3t-rail-num">${String(i + 1).padStart(2, '0')}</span>
          <span class="l3t-rail-lbl">${lbl}…</span>
          <span class="l3t-rail-chk">✓</span>
        </div>`;
      }).join('')}
    `;

    rail.addEventListener('click', (e) => {
      const item = e.target.closest('.l3t-rail-item');
      if (!item) return;
      const idx = parseInt(item.dataset.idx, 10);
      if (isNaN(idx) || idx === _currentStep) return;
      _currentStep = idx;
      const panel = document.getElementById('l3t-check-panel');
      if (panel) { panel.style.display = 'none'; panel.innerHTML = ''; }
      _renderStep();
    });
  }

  function _renderStep() {
    const step      = _tutorial.steps[_currentStep];
    const total     = _tutorial.steps.length;
    const stepNum   = _currentStep + 1;          // 1-based display

    // Step label + nav counter
    document.getElementById('l3t-step-label').textContent =
      _uiFmt('stepCounter', { n: String(stepNum).padStart(2,'0'), total: String(total).padStart(2,'0') });
    document.getElementById('l3t-counter').textContent    = `${stepNum} / ${total}`;
    document.getElementById('l3t-step-badge').textContent = _uiFmt('stepBadge', { n: stepNum });

    // Progress bar
    const pct = (stepNum / total) * 100;
    document.getElementById('l3t-progress-bar').style.width = pct + '%';

    // "halfway there ✦" — show around 40–65% progress
    const halfwayEl = document.getElementById('l3t-halfway');
    if (halfwayEl) {
      const showHalfway = pct >= 40 && pct <= 65;
      halfwayEl.textContent = showHalfway ? _uiStr('halfwayThere') : '';
    }

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
    const _lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';
    const _t = step.translations && step.translations[_lang];
    document.getElementById('l3t-instruction').textContent = (_t && _t.trim()) ? _t : step.instruction;

    // Desktop rail updates
    document.querySelectorAll('.l3t-rail-item').forEach((el, i) => {
      el.classList.toggle('l3t-rail-item--active', i === _currentStep);
      el.classList.toggle('l3t-rail-item--done', i < _currentStep);
    });
    const railBar = document.getElementById('l3t-rail-bar');
    if (railBar) railBar.style.width = pct + '%';
    const kicker = document.getElementById('l3t-center-kicker');
    if (kicker) kicker.textContent =
      _uiFmt('stepCounter', { n: String(stepNum).padStart(2,'0'), total: String(total).padStart(2,'0') });
    const halfDesk = document.getElementById('l3t-halfway-desk');
    if (halfDesk) halfDesk.textContent = (pct >= 40 && pct <= 65) ? _uiStr('halfwayThere') : '';

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
        showScreen('screen-level1');
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
        <p>${_uiFmt('checkingStep', { n: stepNum })}</p>
      </div>`;

    try {
      let resp;
      try {
        resp = await fetch(API_COMPARE, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ tutorial_id: _tutorialId, step: stepNum, child: childDataURL }),
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
          <button class="l3t-check-dismiss">${_uiStr('btnDismiss')}</button>
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
      zonesHtml = `<p class="zone-all-good">${_uiStr('scoreLookingGreat')}</p>`;
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
          <span class="l3t-check-title">${_uiFmt('stepCheckTitle', { n: stepNum })}</span>
        </div>
        <div class="l3t-check-score-block ${scoreClass}">
          <span class="l3t-check-score-number">${rounded}</span>
          <span class="l3t-check-score-label">${label}</span>
        </div>
        <img class="l3t-check-heatmap" src="${overlayDataURL}" alt="Step heatmap with your drawing" />
        <p class="l3t-check-legend">
          <span class="legend-dot" style="background:#1a7a2e"></span>${_uiStr('legendGood')} &ensp;
          <span class="legend-dot" style="background:#C98A1A"></span>${_uiStr('legendDrift')} &ensp;
          <span class="legend-dot" style="background:#B94012"></span>${_uiStr('legendDeviation')}
          <span class="l3t-check-legend-note">${_uiStr('legendOverlaid')}</span>
        </p>
        <div class="l3t-check-zones">${zonesHtml}</div>
        <button class="l3t-check-dismiss">${_uiStr('btnDismiss')}</button>
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
    document.getElementById('l3e-score-tier').textContent   = '';
    document.getElementById('l3e-score-label').textContent  = '';
    document.getElementById('l3e-heatmap').src              = '';
    document.getElementById('l3e-zone-list').innerHTML      = '';
    document.getElementById('l3e-quiz').style.display       = 'none';
  }

  async function _runComparison(childDataURL) {
    document.getElementById('l3e-results').style.display = 'none';
    document.getElementById('l3e-loading').style.display = 'flex';
    document.getElementById('l3e-btn-upload').disabled   = true;

    try {
      let resp;
      try {
        resp = await fetch(API_COMPARE, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ tutorial_id: _tutorialId, child: childDataURL }),
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
    const rounded = Math.round(score);

    document.getElementById('l3e-score').textContent      = rounded;
    document.getElementById('l3e-score-tier').textContent = _scoreTier(score);
    document.getElementById('l3e-score-label').textContent = _scoreLabel(score);

    // Persist to Art Passport if Apprentice tier or above (score ≥ 40)
    if (score >= 40 && typeof PassportManager !== 'undefined') {
      PassportManager.save(_tutorialId, rounded, _scoreTier(score));
    }
    setTimeout(() => _animateRing(score), 60);
    _updateTierDots(score);

    // Composite child image over heatmap
    const overlayDataURL = await _compositeOverlay(heatmap, childDataURL, 260);
    document.getElementById('l3e-heatmap').src = overlayDataURL;

    const list = document.getElementById('l3e-zone-list');
    list.innerHTML = '';

    if (!zones || zones.length === 0) {
      list.innerHTML = `<p class="zone-all-good">${_uiStr('scoreNoDeviations')}</p>`;
    } else {
      const artTips = (IMPROVEMENT_TIPS[_tutorialId] || {});
      zones.forEach(z => {
        const tip = artTips[z.zone] || null;
        const row = document.createElement('div');
        row.className = 'zone-row';
        row.innerHTML = `
          <span class="zone-badge ${z.severity}">${z.severity}</span>
          <span class="zone-name">${z.zone}</span>
          ${tip ? `<p class="zone-tip">💡 ${tip}</p>` : ''}
        `;
        list.appendChild(row);
      });
    }

    document.getElementById('l3e-results').style.display = 'flex';
    document.getElementById('screen-l3-eval').scrollTop  = 500;

    // Show quiz after a short delay so user can absorb the score first
    setTimeout(() => _renderQuiz(_tutorialId), 800);
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

  function _shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function _scoreLabel(score) {
    if (score >= 90) return _uiStr('scoreLabelNearPerfect');
    if (score >= 75) return _uiStr('scoreLabelGreat');
    if (score >= 55) return _uiStr('scoreLabelWellDone');
    if (score >= 35) return _uiStr('scoreLabelGoodStart');
    return _uiStr('scoreLabelKeepPractising');
  }

  function _scoreTier(score) {
    if (score >= 80) return _uiStr('tierMaster');
    if (score >= 60) return _uiStr('tierJourneyman');
    if (score >= 40) return _uiStr('tierApprentice');
    return _uiStr('tierBeginner');
  }

  function _updateTierDots(score) {
    // tier indices: 0=Beginner 1=Apprentice 2=Journeyman 3=Master
    const tierIndex = score >= 80 ? 3 : score >= 60 ? 2 : score >= 40 ? 1 : 0;
    document.querySelectorAll('.score-tier-step').forEach(el => {
      const t = parseInt(el.dataset.tier, 10);
      el.classList.toggle('active', t === tierIndex);
      el.classList.toggle('reached', t < tierIndex);
    });
  }

  function _renderQuiz(tutorialId) {
    const quizEl = document.getElementById('l3e-quiz');
    const questions = (typeof QUIZ_DATA !== 'undefined' && QUIZ_DATA[tutorialId]) || [];

    if (!questions.length) {
      quizEl.style.display = 'none';
      return;
    }

    const cardsEl = document.getElementById('l3e-quiz-cards');
    const scoreEl = document.getElementById('l3e-quiz-score');
    const finalEl = document.getElementById('l3e-quiz-final-text');

    cardsEl.innerHTML = '';
    scoreEl.style.display = 'none';

    let answered = 0;
    let correct  = 0;

    questions.forEach((q, qi) => {
      const card = document.createElement('div');
      card.className = 'l3e-quiz-card';

      // Shuffle options; track where the correct answer landed
      const correctText    = q.options[q.answer];
      const shuffled       = _shuffle(q.options);
      const shuffledAnswer = shuffled.indexOf(correctText);

      const optionsHtml = shuffled.map((opt, oi) =>
        `<button class="l3e-quiz-option" data-oi="${oi}">${opt}</button>`
      ).join('');

      card.innerHTML = `
        <p class="l3e-quiz-question">
          <span class="l3e-quiz-qnum">Q${qi + 1}</span>${q.q}
        </p>
        <div class="l3e-quiz-options">${optionsHtml}</div>
        <p class="l3e-quiz-explanation" style="display:none">${q.explanation}</p>
      `;

      card.querySelectorAll('.l3e-quiz-option').forEach(btn => {
        btn.addEventListener('click', () => {
          if (btn.disabled) return;

          const oi = parseInt(btn.dataset.oi);
          const isCorrect = oi === shuffledAnswer;

          // Disable all options in this question and reveal correct/wrong
          card.querySelectorAll('.l3e-quiz-option').forEach(b => {
            b.disabled = true;
            const boi = parseInt(b.dataset.oi);
            if (boi === shuffledAnswer) b.classList.add('correct');
            else if (b === btn && !isCorrect) b.classList.add('wrong');
          });

          // Show explanation
          card.querySelector('.l3e-quiz-explanation').style.display = 'block';

          answered++;
          if (isCorrect) correct++;

          // Show final score after all questions answered
          if (answered === questions.length) {
            const pct = Math.round((correct / questions.length) * 100);
            const _qv = { correct, total: questions.length };
            let msg;
            if (pct === 100)    msg = _uiFmt('quizPerfect',       _qv);
            else if (pct >= 75) msg = _uiFmt('quizGreat',         _qv);
            else if (pct >= 50) msg = _uiFmt('quizGood',          _qv);
            else                msg = _uiFmt('quizKeepExploring',  _qv);

            finalEl.textContent = msg;
            scoreEl.style.display = 'block';
            setTimeout(() => scoreEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
          }
        });
      });

      cardsEl.appendChild(card);
    });

    // Retry resets all cards
    document.getElementById('l3e-quiz-retry').onclick = () => {
      answered = 0;
      correct  = 0;
      _renderQuiz(tutorialId);
    };

    document.getElementById('l3e-quiz-home').onclick = () => goScanAgain();

    quizEl.style.display = 'block';
    setTimeout(() => quizEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
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
      showScreen('screen-level1');
    });

    // ── Tutorial screen ────────────────────────────────────────────────────
    document.getElementById('l3t-back').addEventListener('click', () => {
      showScreen(_fromSelect ? 'screen-l3-select' : 'screen-level1');
    });
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

    document.getElementById('l3t-check-input').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      e.target.value = '';
      try {
        const dataURL = await _toJpegDataURL(file);
        _runStepCheck(dataURL);
      } catch { alert('Could not read the selected file.'); }
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
      e.target.value = '';
      try {
        const dataURL = await _toJpegDataURL(file);
        _runComparison(dataURL);
      } catch { alert('Could not read the selected file.'); }
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
