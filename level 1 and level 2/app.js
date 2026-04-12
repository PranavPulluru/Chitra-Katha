/**
 * app.js — Chitra Katha main application logic
 *
 * Screens:  home → identify → level1 → level2
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


/* ------------------------------------------------------------------ */
/*  Screen transitions                                                  */
/* ------------------------------------------------------------------ */

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
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

function populateLevel1(key, probability) {
  const art = ARTFORMS[key];

  document.getElementById('l1-region').textContent  = art.region.toUpperCase();
  document.getElementById('l1-name').textContent    = art.name;
  document.getElementById('l1-tagline').textContent = art.tagline;
  document.getElementById('l1-history').textContent = art.history;
  document.getElementById('l1-community').textContent = art.community;

  const pct = Math.round(probability * 100);
  document.getElementById('confidence-pill').textContent = `${pct}% match`;

  // Materials list
  const matList = document.getElementById('l1-materials');
  matList.innerHTML = art.materials.map(m => `<li>${m}</li>`).join('');

  // Tools list
  const toolList = document.getElementById('l1-tools');
  toolList.innerHTML = art.tools.map(t => `<li>${t}</li>`).join('');

  // Level 2 art name
  document.getElementById('l2-artname').textContent = art.name;

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
/*  Level 3 v2 — delegates to Level3v2 module (level3v2/level3v2.js)  */
/* ------------------------------------------------------------------ */

function showLevel3() {
  // Level3v2 module handles all three sub-screens:
  //   screen-l3-select, screen-l3-tutorial, screen-l3-eval
  Level3v2.start(currentArtKey, currentImageSrc);
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


/* ------------------------------------------------------------------ */
/*  Event listeners                                                    */
/* ------------------------------------------------------------------ */

// Home — camera
document.getElementById('btn-camera').addEventListener('click', async () => {
  mode = 'camera';
  document.getElementById('identify-title').textContent   = 'Point at the artwork';
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

  document.getElementById('identify-title').textContent   = 'Review your image';
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

// Back from level 1 → home
document.getElementById('l1-back').addEventListener('click', goHome);

// Go Deeper → level 2
document.getElementById('btn-go-deeper').addEventListener('click', () => {
  showScreen('screen-level2');
  document.getElementById('screen-level2').scrollTop = 0;
});

// Back from level 2 → level 1
document.getElementById('l2-back').addEventListener('click', () => {
  showScreen('screen-level1');
  // Re-invalidate map in case it lost size during transition
  setTimeout(() => { if (leafletMap) leafletMap.invalidateSize(); }, 100);
});

// Try Painting → level 3
document.getElementById('btn-try-painting').addEventListener('click', showLevel3);

// Compare Art Forms → level 4
document.getElementById('compare-art-btn').addEventListener('click', () => {
  Level4.start(currentArtKey);
});

// Level 4 — Draw for Yourself → Level 3 selection screen
document.getElementById('l4-explore-btn').addEventListener('click', () => {
  Level3v2.start(null, null);
});

// Level 4 back button
document.getElementById('l4-back-btn').addEventListener('click', () => {
  Level4.goBack();
});

// Level 3 navigation is handled entirely within level3v2/level3v2.js.
// The btn-try-painting listener above is the only hook needed here.