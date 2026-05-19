/**
 * app.js — Chitra Katha main application logic
 *
 * Screens:  home → identify → level1 → (level3 | level4)
 * Modes:    camera  |  upload
 */

/* ------------------------------------------------------------------ */
/*  State                                                               */
/* ------------------------------------------------------------------ */

let webcam           = null;   // Classifier webcam controller
let rafId            = null;   // requestAnimationFrame id for camera loop
let mode             = null;   // "camera" | "upload"
let leafletMap       = null;   // Leaflet map instance
let currentArtKey    = null;   // key into ARTFORMS for the identified piece
let currentImageSrc  = null;   // data-URL of the image used for identification
let currentLang      = 'en';   // active language code

const ART_IMAGE_FOLDERS = {
  "Gond Art of Madhya Pradesh": "gond",
  "Kalamkari Of Tamil Nadu":    "kalamkari",
  "Kalighat of Bengal":         "kalighat",
  "Madhubani of Bihar":         "madhubani",
  "Phad of Rajasthan":          "phad",
  "Pichhwai of Rajasthan":      "pitchwai",
  "Soharai of Jharkhand":       "sohrai",
  "Talpatra Chittar of Odisha": "talapatra",
  "Warli oh Maharashtra":       "warli",
};


/* ------------------------------------------------------------------ */
/*  Art Passport                                                        */
/* ------------------------------------------------------------------ */

const PassportManager = {
  STORAGE_KEY:    'chitrakatha_passport',
  TUTORIAL_COUNT: 9,
  _map:           null,
  _toastTimer:    null,

  load() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}'); }
    catch { return {}; }
  },

  // Call after a successful evaluation (score ≥ 40)
  save(tutorialId, score, tier) {
    const data  = this.load();
    const isNew = !data[tutorialId];
    // Only update if this is a new stamp or a better score
    if (isNew || score > (data[tutorialId].score || 0)) {
      data[tutorialId] = { score, tier, earnedAt: new Date().toISOString().slice(0, 10) };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      this._updateCounter();
      if (isNew) this._showToast(tutorialId);
    }
  },

  _updateCounter() {
    const el = document.getElementById('passport-count');
    if (el) el.textContent = `${Object.keys(this.load()).length} / ${this.TUTORIAL_COUNT}`;
  },

  _showToast(tutorialId) {
    const artKey = typeof ARTFORM_TO_TUTORIAL !== 'undefined'
      ? Object.keys(ARTFORM_TO_TUTORIAL).find(k => ARTFORM_TO_TUTORIAL[k] === tutorialId)
      : null;
    const art    = artKey ? ARTFORMS[artKey] : null;
    const name   = art ? art.name   : tutorialId;
    const region = art ? art.region : '';
    const toast  = document.getElementById('passport-toast');
    if (!toast) return;
    toast.textContent = `New stamp! ${name} — ${region} ✦`;
    toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
  },

  initPassportScreen() {
    this._updateCounter();
    this._renderGrid();
    this._initMap();
  },

  _renderGrid() {
    const grid = document.getElementById('passport-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const data = this.load();

    Object.keys(ARTFORMS).forEach(artKey => {
      const art    = ARTFORMS[artKey];
      const tutId  = typeof ARTFORM_TO_TUTORIAL !== 'undefined' ? ARTFORM_TO_TUTORIAL[artKey] : null;
      const stamp  = tutId ? data[tutId] : null;

      const card = document.createElement('div');
      card.className = 'stamp-card' + (stamp ? ' stamp-card--earned' : '') + (!tutId ? ' stamp-card--info' : '');

      if (stamp) {
        card.innerHTML = `
          <span class="stamp-seal">✦</span>
          <div class="stamp-name">${art.name}</div>
          <div class="stamp-region">${art.region}</div>
          <span class="stamp-tier">${stamp.tier}</span>
          <span class="stamp-score">${stamp.score} / 100</span>`;
      } else if (tutId) {
        card.innerHTML = `
          <span class="stamp-lock">○</span>
          <div class="stamp-name">${art.name}</div>
          <div class="stamp-region">${art.region}</div>
          <span class="stamp-hint">Complete tutorial to earn</span>`;
      } else {
        card.innerHTML = `
          <span class="stamp-lock">◎</span>
          <div class="stamp-name">${art.name}</div>
          <div class="stamp-region">${art.region}</div>`;
      }
      grid.appendChild(card);
    });
  },

  _initMap() {
    if (this._map) { this._map.remove(); this._map = null; }
    const mapEl = document.getElementById('passport-map');
    if (!mapEl || typeof L === 'undefined') return;

    const data = this.load();
    this._map  = L.map('passport-map', { zoomControl: true, attributionControl: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 12 }).addTo(this._map);
    this._map.setView([22, 82], 4);

    Object.keys(ARTFORMS).forEach(artKey => {
      const art   = ARTFORMS[artKey];
      if (!art.coords) return;
      const tutId = typeof ARTFORM_TO_TUTORIAL !== 'undefined' ? ARTFORM_TO_TUTORIAL[artKey] : null;
      const stamp = tutId ? data[tutId] : null;

      const icon = L.divIcon({
        className: '',
        html:      `<div class="pp-marker ${stamp ? 'pp-marker--earned' : 'pp-marker--locked'}"></div>`,
        iconSize:  [14, 14],
        iconAnchor:[7, 7],
      });

      const popupHtml = stamp
        ? `<strong>${art.name}</strong><br>${stamp.tier} &middot; ${stamp.score}/100`
        : `<strong>${art.name}</strong><br>${art.region}${tutId ? '<br><em>Try the tutorial to earn a stamp</em>' : ''}`;

      L.marker(art.coords, { icon }).addTo(this._map).bindPopup(popupHtml);
    });
  },
};


/* ------------------------------------------------------------------ */
/*  Screen transitions                                                  */
/* ------------------------------------------------------------------ */

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.wn-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.screen === id)
  );
  applyUITranslations(currentLang);
  if (id === 'screen-passport') PassportManager.initPassportScreen();
}


/* ------------------------------------------------------------------ */
/*  Camera lifecycle                                                    */
/* ------------------------------------------------------------------ */

async function startCamera() {
  const container = document.getElementById('camera-container');
  // Clear any previous video element
  container.innerHTML = '';

  try {
    await Classifier.loadModel();
    webcam = await Classifier.startWebcam(container);
    // Drive the camera frame updates
    function loop() {
      if (webcam) webcam.update();
      rafId = requestAnimationFrame(loop);
    }
    loop();
  } catch (err) {
    console.error('[Camera]', err);
    showErrorState(err.message);
  }
}

function stopCamera() {
  if (rafId)  { cancelAnimationFrame(rafId); rafId = null; }
  if (webcam) { webcam.stop(); webcam = null; }
}


/* ------------------------------------------------------------------ */
/*  Identify flow                                                       */
/* ------------------------------------------------------------------ */

function showLoadingState() {
  setStateOverlay('state-loading');
  document.getElementById('identify-footer').style.display = 'none';
}

function showErrorState(msg) {
  if (msg) document.querySelector('#state-error .state-body').textContent = msg;
  setStateOverlay('state-error');
  document.getElementById('identify-footer').style.display = 'none';
}

function clearStateOverlays() {
  document.querySelectorAll('.state-overlay').forEach(el => {
    el.style.display = 'none';
  });
  document.getElementById('identify-footer').style.display = 'block';
}

function setStateOverlay(id) {
  document.querySelectorAll('.state-overlay').forEach(el => {
    el.style.display = el.id === id ? 'flex' : 'none';
  });
}

async function runIdentify() {
  showLoadingState();

  try {
    await Classifier.loadModel();

    let result;
    if (mode === 'camera') {
      webcam.update();
      // Capture the frame now, before we stop the camera
      currentImageSrc = webcam.canvas.toDataURL('image/jpeg', 0.92);
      result = await Classifier.predictFromCanvas(webcam.canvas);
    } else {
      const img = document.getElementById('preview-img');
      currentImageSrc = img.src;
      result = await Classifier.predictFromImageElement(img);
    }

    // Trim any invisible whitespace the model might return
    const className = result.className.trim();
    console.log('[Identify] class:', className, '| confidence:', (result.probability * 100).toFixed(1) + '%');
    console.log('[Identify] above threshold:', result.aboveThreshold);
    console.log('[Identify] ARTFORMS has key:', !!ARTFORMS[className]);

    // Both non-craft classes the model knows about
    const NON_CRAFT = ['Not a  craft', 'Painting but not crafts'];

    if (NON_CRAFT.includes(className) || !result.aboveThreshold) {
      showErrorState("This doesn't look like one of the folk art forms we know yet. Try a different image.");
      return;
    }

    if (!ARTFORMS[className]) {
      // Log exact character codes to catch invisible character mismatches
      console.error('[Identify] Unknown key:', [...className].map(c => c.charCodeAt(0)));
      showErrorState(`Recognised as "${className}" but we don't have a profile for it yet.`);
      return;
    }

    currentArtKey = className;
    stopCamera();
    populateLevel1(className, result.probability);

    // Clear overlays BEFORE transitioning so they don't flash
    clearStateOverlays();
    showScreen('screen-level1');

    // Init map — wrapped in try/catch so a Leaflet failure doesn't break the page
    setTimeout(() => {
      try {
        initMap(className);
      } catch (mapErr) {
        console.warn('[Map] Leaflet failed to load, skipping map:', mapErr.message);
        document.getElementById('l1-map').textContent = 'Map unavailable offline.';
      }
    }, 150);

  } catch (err) {
    console.error('[Identify] Error:', err);
    showErrorState("Something went wrong. Please try again.");
  }
}


/* ------------------------------------------------------------------ */
/*  Level 1 — populate content                                         */
/* ------------------------------------------------------------------ */

function getLangData(art, lang) {
  if (lang === 'en' || !art.translations || !art.translations[lang]) return art;
  const t = art.translations[lang];
  return {
    ...art,
    tagline:      t.tagline      || art.tagline,
    community:    t.community    || art.community,
    medium:       t.medium       || art.medium,
    significance: t.significance || art.significance,
  };
}

function applyUITranslations(lang) {
  const s = (typeof UI_STRINGS !== 'undefined' && UI_STRINGS[lang]) ? UI_STRINGS[lang] : (UI_STRINGS && UI_STRINGS['en']) || {};
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (s[key] !== undefined) el.textContent = s[key];
  });
}

function populateLevel1(key, probability, lang = 'en') {
  // Reset to the requested language (defaults to English for new identifications)
  currentLang = lang;
  document.querySelectorAll('.lang-btn[data-lang]').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === lang)
  );

  const art  = ARTFORMS[key];
  const data = getLangData(art, currentLang);

  document.getElementById('l1-region').textContent       = '✦ ' + art.region.toUpperCase();
  document.getElementById('l1-name').textContent         = art.name;
  document.getElementById('l1-tagline').textContent      = data.tagline;
  document.getElementById('l1-community').textContent    = data.community;
  document.getElementById('l1-medium').textContent       = data.medium;
  document.getElementById('l1-significance').textContent = data.significance;

  const pct = Math.round(probability * 100);
  document.getElementById('confidence-pill').textContent = `${pct}% match`;

  // Show user's image in the ref card, or reference.png when browsing from atlas
  const refImg = document.getElementById('l1-ref-img');
  if (refImg) {
    if (currentImageSrc) {
      refImg.src = currentImageSrc;
      refImg.style.display = 'block';
    } else {
      const folder = ART_IMAGE_FOLDERS[key];
      if (folder) {
        refImg.src = `level3v2/step_images/${folder}/reference.png`;
        refImg.style.display = 'block';
      } else {
        refImg.src = '';
        refImg.style.display = 'none';
      }
    }
  }

  // Scroll to top of level 1
  document.getElementById('screen-level1').scrollTop = 0;
}

function initMap(key) {
  const art    = ARTFORMS[key];
  const mapEl  = document.getElementById('l1-map');

  // Destroy previous map instance if one exists
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }

  leafletMap = L.map(mapEl, { zoomControl: true, attributionControl: false });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 12
  }).addTo(leafletMap);

  // Custom terracotta marker icon
  const icon = L.divIcon({
    html: `<div style="
      width:14px; height:14px;
      background:#B94012;
      border:3px solid #FDF8EE;
      border-radius:50%;
      box-shadow:0 1px 4px rgba(0,0,0,0.4);
    "></div>`,
    className: '',
    iconSize:   [14, 14],
    iconAnchor: [7, 7],
  });

  L.marker(art.coords, { icon })
    .addTo(leafletMap)
    .bindPopup(`<strong>${art.name}</strong><br>${art.region}`, { closeButton: false })
    .openPopup();

  leafletMap.setView(art.coords, 6);
  leafletMap.invalidateSize();
}


/* ------------------------------------------------------------------ */
/*  Navigation helpers                                                  */
/* ------------------------------------------------------------------ */

function goHome() {
  stopCamera();
  clearStateOverlays();
  // Reset identify screen for next use
  document.getElementById('camera-wrap').style.display       = 'block';
  document.getElementById('upload-preview').style.display    = 'none';
  document.getElementById('identify-footer').style.display   = 'block';
  showScreen('screen-home');
}

async function goScanAgain() {
  mode = 'camera';
  document.getElementById('identify-title').textContent   = (UI_STRINGS[currentLang] || UI_STRINGS['en']).identifyTitle;
  document.getElementById('camera-wrap').style.display    = 'block';
  document.getElementById('upload-preview').style.display = 'none';
  clearStateOverlays();
  showScreen('screen-identify');
  await startCamera();
}


/* ------------------------------------------------------------------ */
/*  Event listeners                                                    */
/* ------------------------------------------------------------------ */

// Home — camera
document.getElementById('btn-camera').addEventListener('click', async () => {
  mode = 'camera';
  document.getElementById('identify-title').textContent   = (UI_STRINGS[currentLang] || UI_STRINGS['en']).identifyTitle;
  document.getElementById('camera-wrap').style.display    = 'block';
  document.getElementById('upload-preview').style.display = 'none';
  clearStateOverlays();
  showScreen('screen-identify');
  await startCamera();
});

// Home — upload (triggers hidden file input)
document.getElementById('btn-upload').addEventListener('click', () => {
  document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  mode = 'upload';
  const url = URL.createObjectURL(file);
  const img  = document.getElementById('preview-img');
  img.src    = url;

  document.getElementById('identify-title').textContent   = (UI_STRINGS[currentLang] || UI_STRINGS['en']).identifyTitleUpload;
  document.getElementById('camera-wrap').style.display    = 'none';
  document.getElementById('upload-preview').style.display = 'flex';
  clearStateOverlays();
  showScreen('screen-identify');

  // Reset file input so the same file can be re-selected
  e.target.value = '';
});

// Identify button
document.getElementById('btn-identify').addEventListener('click', runIdentify);

// Try again button (error state)
document.getElementById('btn-try-again').addEventListener('click', () => {
  clearStateOverlays();
  if (mode === 'camera') startCamera();
});

// Back from identify → home
document.getElementById('identify-back').addEventListener('click', goHome);

// Scan again from result → identify
document.getElementById('btn-scan-again').addEventListener('click', goScanAgain);

// Back from level 1 → home
document.getElementById('l1-back').addEventListener('click', goHome);

// Try Drawing This → Level 3 tutorial
document.getElementById('btn-try-tutorial').addEventListener('click', () => {
  Level3v2.start(currentArtKey, currentImageSrc);
});

// Compare & Contrast — coming soon, no-op
document.getElementById('btn-compare').addEventListener('click', (e) => {
  e.preventDefault();
});

// Level 2 legacy handlers (screen unreachable but keep listeners to avoid errors)
document.getElementById('l2-back').addEventListener('click', () => {
  showScreen('screen-level1');
  setTimeout(() => { if (leafletMap) leafletMap.invalidateSize(); }, 100);
});
document.getElementById('btn-try-painting').addEventListener('click', () => {
  Level3v2.start(currentArtKey, currentImageSrc);
});
document.getElementById('compare-art-btn').addEventListener('click', (e) => {
  e.preventDefault();
});

// Level 4 — Draw for Yourself → Level 3 selection screen
document.getElementById('l4-explore-btn').addEventListener('click', () => {
  Level3v2.start(null, null);
});

// Level 4 back button
document.getElementById('l4-back-btn').addEventListener('click', () => {
  Level4.goBack();
});

// Passport back button
document.getElementById('passport-back').addEventListener('click', () => showScreen('screen-home'));

// Language switcher — handles both mobile (#lang-row) and desktop (#l1-hero-langs)
function _handleLangClick(e) {
  const btn = e.target.closest('.lang-btn');
  if (!btn || !currentArtKey) return;
  const lang = btn.dataset.lang;
  if (lang === currentLang) return;
  const pct = parseInt(document.getElementById('confidence-pill').textContent);
  populateLevel1(currentArtKey, (pct || 0) / 100, lang);
  applyUITranslations(lang);
}
document.getElementById('lang-row').addEventListener('click', _handleLangClick);
document.getElementById('l1-hero-langs').addEventListener('click', _handleLangClick);

// Language pill dropdown (desktop nav)
const langBtn      = document.getElementById('wn-lang-btn');
const langDropdown = document.getElementById('wn-lang-dropdown');
const LANG_LABELS  = { en: 'EN', hi: 'हि', bn: 'বা', ta: 'த', gu: 'ગુ', mr: 'मर', pa: 'ਪੰ' };

langBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  langDropdown.hidden = !langDropdown.hidden;
});

langDropdown.addEventListener('click', (e) => {
  const opt = e.target.closest('.wn-lang-opt');
  if (!opt) return;
  const lang = opt.dataset.lang;
  langDropdown.hidden = true;

  langBtn.textContent = LANG_LABELS[lang] + ' ⌄';

  langDropdown.querySelectorAll('.wn-lang-opt').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === lang)
  );

  if (currentArtKey) {
    const pct = parseInt(document.getElementById('confidence-pill').textContent) || 100;
    populateLevel1(currentArtKey, pct / 100, lang);
  } else {
    currentLang = lang;
  }
  applyUITranslations(lang);
});

document.addEventListener('click', () => { langDropdown.hidden = true; });

// WebNav tab handlers (desktop only — nav is hidden on mobile via CSS)
document.querySelectorAll('.wn-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const screenId = tab.dataset.screen;
    if (screenId === 'screen-l4') return; // coming soon
    stopCamera();
    clearStateOverlays();
    if (screenId === 'screen-atlas') {
      initAtlas();
      showScreen(screenId);
    } else if (screenId === 'screen-l3-select') {
      Level3v2.start(null, null);
    } else {
      showScreen(screenId);
    }
  });
});


/* ------------------------------------------------------------------ */
/*  Art card cycling (home screen)                                      */
/* ------------------------------------------------------------------ */

function initArtCardCycling() {
  const cards = document.querySelectorAll('.home-art-card');
  if (!cards.length) return;

  const cycleNames = [
    ['WARLI', 'SOHRAI', 'PHAD', 'KALAMKARI', 'GOND'],
    ['GOND', 'TALAPATRA', 'WARLI', 'KALIGHAT', 'SOHRAI'],
    ['SOHRAI', 'WARLI', 'GOND', 'TALAPATRA', 'PITCHWAI'],
    ['KALIGHAT', 'TALAPATRA', 'PHAD', 'GOND', 'WARLI'],
  ];
  const intervals = [5000, 5600, 6300, 7100];

  const CYCLE_IMAGES = {
    'WARLI':     'level3v2/step_images/warli/reference.png',
    'SOHRAI':    'level3v2/step_images/sohrai/reference.png',
    'KALAMKARI': 'level3v2/step_images/kalamkari/reference.png',
    'GOND':      'level3v2/step_images/gond/reference.png',
    'KALIGHAT':  'level3v2/step_images/kalighat/reference.png',
    'TALAPATRA': 'level3v2/step_images/talapatra/reference.png',
    'PHAD':      'level3v2/step_images/phad/reference.png',
    'PITCHWAI':  'level3v2/step_images/pitchwai/reference.png',
  };

  cards.forEach((card, i) => {
    const label = card.querySelector('.home-art-label');
    const img   = card.querySelector('.home-art-img');
    if (!label || !cycleNames[i]) return;
    let idx = 0;
    setInterval(() => {
      label.style.opacity = '0';
      if (img) img.style.opacity = '0';
      setTimeout(() => {
        idx = (idx + 1) % cycleNames[i].length;
        const name = cycleNames[i][idx];
        label.textContent = name;
        if (img) {
          const src = CYCLE_IMAGES[name];
          if (src) { img.src = src; img.style.opacity = '1'; }
          else      { img.style.opacity = '0'; }
        }
        label.style.opacity = '1';
      }, 700);
    }, intervals[i]);
  });
}

initArtCardCycling();


/* ------------------------------------------------------------------ */
/*  Atlas screen                                                        */
/* ------------------------------------------------------------------ */

function initAtlas() {
  const grid = document.getElementById('atlas-grid');
  if (!grid || grid.dataset.built) return;
  grid.dataset.built = '1';

  const tones = ['terracotta', 'ochre', 'forest', 'rose', 'indigo', 'parchment'];
  let toneIdx = 0;

  Object.entries(ARTFORMS).forEach(([key, art]) => {
    const tone = tones[toneIdx % tones.length];
    toneIdx++;

    const stepsCount = (() => {
      if (typeof ARTFORM_TO_TUTORIAL === 'undefined') return '–';
      const tutId = ARTFORM_TO_TUTORIAL[key];
      if (tutId && typeof TUTORIAL_DATA !== 'undefined' && TUTORIAL_DATA[tutId]) {
        return TUTORIAL_DATA[tutId].totalSteps;
      }
      return '–';
    })();

    const folder  = ART_IMAGE_FOLDERS[key];
    const imgHtml = folder
      ? `<img class="atlas-card-thumb" src="level3v2/step_images/${folder}/reference.png"
             alt="${art.name}" loading="lazy" onerror="this.style.display='none'" />`
      : '';

    const card = document.createElement('div');
    card.className = 'atlas-card';
    card.innerHTML = `
      <div class="atlas-card-img atlas-tone-${tone}">
        ${imgHtml}
        <span class="atlas-steps-pill">${stepsCount !== '–' ? ((UI_STRINGS[currentLang] || UI_STRINGS['en']).tileSteps || '{n} STEPS').replace('{n}', stepsCount) : stepsCount}</span>
      </div>
      <div class="atlas-card-body">
        <p class="atlas-card-name">${art.name}</p>
        <p class="atlas-card-region">${art.region}</p>
      </div>
    `;
    card.addEventListener('click', () => {
      currentArtKey = key;
      currentImageSrc = null;
      populateLevel1(key, 1.0);
      showScreen('screen-level1');
      setTimeout(() => {
        try { initMap(key); } catch (_) {}
      }, 150);
    });
    grid.appendChild(card);
  });
}
