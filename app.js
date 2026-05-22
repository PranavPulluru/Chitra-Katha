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

// Extended art form data for the passport screen
// (includes info-only forms not in the classifier training set)
const PASSPORT_ART_FORMS = [
  { tutId:'warli',     name:'Warli Painting',    region:'Maharashtra',    state:'maharashtra',    type:'tutorial', seal:'✦', blurb:'Tribal geometry from the Sahyadri foothills — circles, triangles and stick figures dancing on mud-walls.' },
  { tutId:'gond',      name:'Gond Art',          region:'Madhya Pradesh', state:'madhya-pradesh', type:'tutorial', seal:'✿', blurb:'Dotted, line-filled forest creatures from the Gondi people of central India.' },
  { tutId:'madhubani', name:'Madhubani',         region:'Bihar',          state:'bihar',          type:'tutorial', seal:'❋', blurb:'Mithila wedding paintings — bright fields, fish, and the goddess in every panel.' },
  { tutId:'sohrai',    name:'Sohrai Painting',   region:'Jharkhand',      state:'jharkhand',      type:'tutorial', seal:'✺', blurb:'Harvest-festival murals on village walls, painted with twig brushes and earth.' },
  { tutId:'kalighat',  name:'Kalighat Painting', region:'West Bengal',    state:'west-bengal',    type:'tutorial', seal:'❂', blurb:'Bazaar pat paintings sold at Kalighat temple — bold, satirical, modern.' },
  { tutId:'talapatra', name:'Talapatra Chitra',  region:'Odisha',         state:'odisha',         type:'tutorial', seal:'✤', blurb:'Etchings on palm leaf inked with lamp-soot. Tiny, intricate epics.' },
  { tutId:'kalamkari', name:'Kalamkari',         region:'Andhra Pradesh', state:'andhra-pradesh', type:'tutorial', seal:'✥', blurb:'Pen-drawn cotton textiles dyed with tamarind, iron and indigo.' },
  { tutId:'phad',      name:'Phad Painting',     region:'Rajasthan',      state:'rajasthan',      type:'tutorial', seal:'❈', blurb:'Scroll paintings of folk heroes, performed and unfurled by Bhopa priests.' },
  { tutId:'pitchwai',  name:'Pichhwai',          region:'Rajasthan',      state:'rajasthan',      type:'tutorial', seal:'✦', blurb:'Devotional Krishna textiles hung behind temple idols at Nathdwara.' },
  { tutId:'sanji',     name:'Sanji Art',         region:'Uttar Pradesh',  state:'uttar-pradesh',  type:'tutorial', seal:'❉', blurb:'Paper stencils for Vrindavan rangolis — devotion through paper-cut.' },
  { tutId:null,        name:'Aipan Art',         region:'Uttarakhand',    state:'uttarakhand',    type:'info',     seal:'◎', blurb:'Ritual floor patterns in red ochre and rice paste, drawn at thresholds.' },
  { tutId:null,        name:'Tanjore Painting',  region:'Tamil Nadu',     state:'tamil-nadu',     type:'info',     seal:'◎', blurb:'Gold-foiled, gem-encrusted Chola devotional panels from Thanjavur.' },
  { tutId:null,        name:'Kolam Art',         region:'Tamil Nadu',     state:'tamil-nadu',     type:'info',     seal:'◎', blurb:'Sunrise floor drawings in rice flour — a daily geometry meditation.' },
  { tutId:null,        name:'Thangka Painting',  region:'Sikkim',         state:'sikkim',         type:'info',     seal:'◎', blurb:'Buddhist scroll icons painted on cotton, rolled and carried by monks.' },
];

// % positions of state label callouts within the SVG viewBox (520×590)
const PASSPORT_LABEL_POS = {
  'rajasthan':      { x:19, y:49 },
  'madhya-pradesh': { x:48, y:62 },
  'maharashtra':    { x:24, y:70 },
  'uttar-pradesh':  { x:55, y:38 },
  'bihar':          { x:82, y:38 },
  'jharkhand':      { x:80, y:55 },
  'west-bengal':    { x:92, y:50 },
  'odisha':         { x:78, y:70 },
  'andhra-pradesh': { x:55, y:86 },
  'uttarakhand':    { x:64, y:19 },
  'tamil-nadu':     { x:38, y:92 },
  'sikkim':         { x:90, y:32 },
};

// Inline SVG India map (converted from india-map.jsx)
const INDIA_SVG_MARKUP = `<svg viewBox="0 0 520 590" class="india-map" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="hatch-warm" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <line x1="0" y1="0" x2="0" y2="6" stroke="#7A4422" stroke-width="0.5" opacity="0.18"/>
    </pattern>
    <pattern id="hatch-terra" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <line x1="0" y1="0" x2="0" y2="5" stroke="#5A1A04" stroke-width="0.6" opacity="0.45"/>
    </pattern>
  </defs>
  <g transform="translate(58 60)">
    <circle r="14" fill="none" stroke="#7A4422" stroke-width="1" opacity="0.55"/>
    <path d="M0 -14 L3 0 L0 14 L-3 0 Z" fill="#B94012" opacity="0.85"/>
    <path d="M-14 0 L0 -3 L14 0 L0 3 Z" fill="#3A1A02" opacity="0.7"/>
    <text x="0" y="-19" text-anchor="middle" font-size="8" fill="#3A1A02" font-family="Fraunces,serif" font-style="italic">N</text>
  </g>
  <g>
    <text x="30" y="420" font-size="9" fill="#3B6741" font-family="Fraunces,serif" font-style="italic" opacity="0.55">Arabian Sea</text>
    <text x="375" y="460" font-size="9" fill="#3B6741" font-family="Fraunces,serif" font-style="italic" opacity="0.55">Bay of Bengal</text>
    <text x="195" y="585" font-size="8" fill="#3B6741" font-family="Fraunces,serif" font-style="italic" opacity="0.55">Indian Ocean</text>
  </g>
  <g stroke="#3B6741" stroke-width="0.7" fill="none" opacity="0.3">
    <path d="M30 380 q5 -3 10 0 t10 0 t10 0"/>
    <path d="M30 400 q5 -3 10 0 t10 0 t10 0"/>
    <path d="M375 490 q5 -3 10 0 t10 0 t10 0"/>
    <path d="M375 510 q5 -3 10 0 t10 0 t10 0"/>
    <path d="M210 560 q5 -3 10 0 t10 0 t10 0"/>
  </g>
  <ellipse class="state-filler" cx="282" cy="572" rx="20" ry="14"/>
  <g class="india-states">
    <path class="state-filler" d="M165 35 L230 30 L248 75 L215 100 L165 95 L135 75 L145 50 Z"/>
    <path class="state-filler" d="M215 100 L250 100 L258 130 L230 142 L215 130 Z"/>
    <path class="state-filler" d="M155 115 L200 115 L215 140 L195 165 L160 158 L145 138 Z"/>
    <path class="state-filler" d="M200 165 L248 152 L260 180 L245 200 L215 198 L200 182 Z"/>
    <path class="state-filler" d="M40 235 L95 230 L130 258 L158 278 L158 312 L132 348 L95 365 L60 358 L32 322 L22 285 L28 252 Z"/>
    <path class="state-filler" d="M205 348 L268 348 L298 365 L305 395 L285 420 L240 422 L210 405 L202 378 Z"/>
    <path class="state-filler" d="M285 295 L340 298 L355 330 L340 370 L318 372 L290 355 L282 325 Z"/>
    <path class="state-filler" d="M130 388 L198 388 L222 408 L232 442 L222 478 L208 502 L182 508 L158 495 L138 462 L122 425 Z"/>
    <path class="state-filler" d="M110 422 L132 422 L138 442 L122 450 L110 442 Z"/>
    <path class="state-filler" d="M140 478 L195 478 L215 510 L200 555 L178 578 L158 568 L138 540 L132 510 Z"/>
    <path class="state-filler" d="M450 200 L502 198 L515 220 L510 248 L478 252 L458 240 L450 220 Z"/>
    <path class="state-filler" d="M478 255 L515 255 L515 295 L495 305 L478 290 Z"/>
    <path class="state-filler" d="M450 170 L500 168 L508 188 L478 195 L455 190 Z"/>
    <circle class="state-filler" cx="468" cy="430" r="3"/>
    <circle class="state-filler" cx="468" cy="442" r="2"/>
    <path id="uttarakhand"    class="state state--info" d="M255 100 L305 100 L318 135 L290 155 L258 142 Z"/>
    <path id="rajasthan"      class="state" d="M65 165 L145 158 L200 178 L215 210 L215 245 L195 275 L145 285 L95 280 L60 250 L50 210 Z"/>
    <path id="uttar-pradesh"  class="state" d="M220 205 L295 200 L345 215 L380 235 L372 265 L320 270 L270 268 L230 250 L218 225 Z"/>
    <path id="bihar"          class="state" d="M340 218 L405 218 L425 245 L415 268 L378 272 L348 262 Z"/>
    <path id="jharkhand"      class="state" d="M340 275 L405 275 L420 305 L395 330 L360 335 L335 320 Z"/>
    <path id="sikkim"         class="state state--info" d="M415 200 L442 198 L450 220 L432 230 L418 220 Z"/>
    <path id="west-bengal"    class="state" d="M408 235 L442 240 L458 268 L458 305 L442 335 L422 350 L408 335 L402 305 L405 270 Z"/>
    <path id="madhya-pradesh" class="state" d="M165 270 L220 268 L268 275 L312 278 L332 305 L322 335 L285 348 L232 348 L188 335 L162 305 Z"/>
    <path id="maharashtra"    class="state" d="M95 320 L158 320 L200 328 L245 335 L285 348 L285 388 L258 418 L208 432 L162 432 L118 415 L88 380 L82 348 Z"/>
    <path id="odisha"         class="state" d="M305 335 L355 335 L390 358 L408 388 L388 418 L350 425 L320 412 L302 388 L298 358 Z"/>
    <path id="andhra-pradesh" class="state" d="M215 422 L275 425 L310 432 L345 452 L350 482 L332 510 L292 518 L252 510 L222 488 L210 458 Z"/>
    <path id="tamil-nadu"     class="state state--info" d="M218 462 L262 472 L300 482 L310 515 L295 550 L270 575 L240 575 L222 552 L212 520 L215 488 Z"/>
  </g>
</svg>`;

const PassportManager = {
  STORAGE_KEY:    'chitrakatha_passport',
  TUTORIAL_COUNT: 9,
  _toastTimer:    null,
  _selectedState: null,

  load() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}'); }
    catch { return {}; }
  },

  // Call after a successful evaluation (score ≥ 40)
  save(tutorialId, score, tier) {
    const data  = this.load();
    const isNew = !data[tutorialId];
    if (isNew || score > (data[tutorialId].score || 0)) {
      data[tutorialId] = { score, tier, earnedAt: new Date().toISOString().slice(0, 10) };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      this._updateCounter();
      if (isNew) this._showToast(tutorialId);
    }
  },

  _updateCounter() {
    const data = this.load();
    const count = Object.keys(data).length;
    const el = document.getElementById('passport-count');
    if (el) el.textContent = `${count} / ${this.TUTORIAL_COUNT}`;
  },

  _showToast(tutorialId) {
    const af    = PASSPORT_ART_FORMS.find(a => a.tutId === tutorialId);
    const name   = af ? af.name   : tutorialId;
    const region = af ? af.region : '';
    const seal   = af ? af.seal   : '✦';
    const toast  = document.getElementById('passport-toast');
    if (!toast) return;
    toast.innerHTML = `<span class="passport-toast-icon">${seal}</span><span>New stamp! ${name} — ${region}</span>`;
    toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
  },

  initPassportScreen() {
    this._updateCounter();
    this._initMap();
    this._renderHero();
    this._renderGrid();
  },

  // ── Hero: progress bar, stats, recent stamp card ──────────────────
  _renderHero() {
    const data = this.load();
    const tutorialStates = [...new Set(PASSPORT_ART_FORMS.filter(a => a.type === 'tutorial').map(a => a.state))];
    const earnedStates   = [...new Set(PASSPORT_ART_FORMS.filter(a => a.type === 'tutorial' && data[a.tutId]).map(a => a.state))];
    const total  = tutorialStates.length;
    const earned = earnedStates.length;
    const pct    = total ? (earned / total) * 100 : 0;

    const _set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

    _set('pp-earned-count', earned);
    _set('pp-total-count', total);

    const fill = document.getElementById('pp-progress-fill');
    if (fill) fill.style.width = pct + '%';

    // Tier counts
    const tiers = { Master:0, Journeyman:0, Apprentice:0 };
    PASSPORT_ART_FORMS.forEach(af => {
      if (!data[af.tutId]) return;
      const t = this._tier(data[af.tutId].score);
      if (t && tiers[t] !== undefined) tiers[t]++;
    });
    _set('pp-master',      tiers.Master);
    _set('pp-journeyman',  tiers.Journeyman);
    _set('pp-apprentice',  tiers.Apprentice);
    _set('pp-todo',        PASSPORT_ART_FORMS.length - PASSPORT_ART_FORMS.filter(a => data[a.tutId]).length);

    // Wall meta
    const earnedForms = PASSPORT_ART_FORMS.filter(a => data[a.tutId]);
    _set('pp-earned-count-wall', earnedForms.length);
    _set('pp-todo-count-wall',   PASSPORT_ART_FORMS.length - earnedForms.length);

    // Recent stamp card
    const card = document.getElementById('pp-recent-card');
    if (!card) return;
    const recent = earnedForms[earnedForms.length - 1];
    if (recent) {
      const tier = this._tier(data[recent.tutId].score);
      card.className = 'pp-recent-card';
      card.innerHTML = `
        <div class="pp-recent-eyebrow">Latest stamp</div>
        <div class="pp-recent-seal">${recent.seal}</div>
        <div class="pp-recent-name">${recent.name}</div>
        <div class="pp-recent-region">${recent.region}</div>
        <div class="pp-recent-tier">${tier} · ${data[recent.tutId].score}/100</div>
        <div class="pp-recent-line"></div>
        <span class="pp-recent-handwritten">"each tradition, a new way of seeing"</span>`;
    } else {
      card.className = 'pp-recent-card pp-recent-empty';
      card.innerHTML = `
        <div class="pp-recent-eyebrow">No stamps yet</div>
        <div class="pp-recent-seal pp-recent-seal--empty">○</div>
        <div class="pp-recent-name">Begin your journey</div>
        <div class="pp-recent-region">Complete a tutorial in the Studio</div>`;
    }
  },

  // ── SVG India map ─────────────────────────────────────────────────
  _initMap() {
    const svgWrap = document.getElementById('pp-india-svg-wrap');
    if (!svgWrap) return;

    svgWrap.innerHTML = INDIA_SVG_MARKUP;

    const data = this.load();

    // Build a map of stateId → earned/locked status
    const stateInfo = {};
    PASSPORT_ART_FORMS.forEach(af => {
      if (af.type === 'tutorial') {
        if (!stateInfo[af.state]) stateInfo[af.state] = false;
        if (data[af.tutId]) stateInfo[af.state] = true;
      }
    });

    // Apply CSS classes to SVG paths
    Object.entries(stateInfo).forEach(([sid, earned]) => {
      const path = document.getElementById(sid);
      if (!path) return;
      path.classList.remove('state--earned', 'state--locked');
      path.classList.add(earned ? 'state--earned' : 'state--locked');
    });

    // Render labels for earned states
    this._renderMapLabels(data);

    // State click handler — use onclick to avoid duplicate listeners on re-open
    const mapEl = document.getElementById('passport-map');
    if (mapEl) {
      mapEl.onclick = (e) => {
        const path = e.target.closest('path.state');
        if (!path || !path.id) return;
        this._selectedState = path.id;
        this._renderAtlasSide(path.id, this.load());
      };
    }
  },

  _renderMapLabels(data) {
    const labelsEl = document.getElementById('pp-map-labels');
    if (!labelsEl) return;
    labelsEl.innerHTML = '';

    const seenStates = new Set();
    PASSPORT_ART_FORMS.forEach(af => {
      if (af.type !== 'tutorial' || !data[af.tutId]) return;
      if (seenStates.has(af.state)) return;
      seenStates.add(af.state);

      const pos = PASSPORT_LABEL_POS[af.state];
      if (!pos) return;

      const label = document.createElement('div');
      label.className = 'pp-map-label';
      label.style.left = pos.x + '%';
      label.style.top  = pos.y + '%';
      label.innerHTML = `<span class="pp-map-label-dot"></span><span class="pp-map-label-text">${af.region}</span>`;
      labelsEl.appendChild(label);
    });
  },

  // ── Atlas side panel ──────────────────────────────────────────────
  _renderAtlasSide(stateId, data) {
    const regionEl = document.getElementById('pp-side-region');
    const artsEl   = document.getElementById('pp-side-arts');
    if (!regionEl || !artsEl) return;

    const arts = PASSPORT_ART_FORMS.filter(a => a.state === stateId);
    const regionName = arts[0]?.region || stateId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    regionEl.textContent = regionName;

    if (arts.length === 0) {
      artsEl.innerHTML = '<p class="pp-side-empty">This region isn\'t part of the atlas yet.</p>';
      return;
    }

    artsEl.innerHTML = arts.map(af => {
      const earned = data[af.tutId];
      const tier   = earned ? this._tier(earned.score) : null;
      const isEarned = !!earned;
      return `
        <div class="pp-side-art${isEarned ? ' pp-side-art--earned' : ''}">
          <div class="pp-side-art-seal">${isEarned ? af.seal : (af.type === 'info' ? '◎' : '○')}</div>
          <div class="pp-side-art-body">
            <div class="pp-side-art-name">${af.name}</div>
            <div class="pp-side-art-blurb">${af.blurb}</div>
            ${isEarned
              ? `<div class="pp-side-art-meta"><span class="pp-side-art-tier">${tier}</span><span class="pp-side-art-score">${earned.score}/100</span></div>`
              : af.type === 'info'
                ? '<div class="pp-side-art-cta">Explore only</div>'
                : '<button class="pp-side-art-cta-btn" onclick="showScreen(\'screen-l3-select\')">Start tutorial →</button>'
            }
          </div>
        </div>`;
    }).join('');
  },

  // ── Stamp grid ────────────────────────────────────────────────────
  _renderGrid() {
    const grid = document.getElementById('passport-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const data = this.load();

    PASSPORT_ART_FORMS.forEach(af => {
      const earned = af.tutId ? data[af.tutId] : null;
      const tier   = earned ? this._tier(earned.score) : null;
      const card   = document.createElement('div');

      if (earned) {
        card.className = 'stamp-card stamp-card--earned';
        card.dataset.tier = tier;
        card.innerHTML = `
          <span class="stamp-seal">${af.seal}</span>
          <div class="stamp-name">${af.name}</div>
          <div class="stamp-region">${af.region}</div>
          <span class="stamp-tier">${tier}</span>
          <span class="stamp-score">${earned.score} <em style="font-weight:400;color:var(--muted)">/ 100</em></span>
          <div class="stamp-cancel" aria-hidden="true">VISITED</div>`;
      } else if (af.type === 'info') {
        card.className = 'stamp-card stamp-card--info';
        card.innerHTML = `
          <span class="stamp-lock">◎</span>
          <div class="stamp-name">${af.name}</div>
          <div class="stamp-region">${af.region}</div>
          <span class="stamp-hint">Explore only</span>`;
      } else {
        card.className = 'stamp-card';
        card.innerHTML = `
          <span class="stamp-lock">○</span>
          <div class="stamp-name">${af.name}</div>
          <div class="stamp-region">${af.region}</div>
          <span class="stamp-hint">Complete tutorial to earn</span>`;
      }

      // Click → select state on map
      card.addEventListener('click', () => {
        if (af.state) {
          this._selectedState = af.state;
          this._renderAtlasSide(af.state, this.load());
        }
      });

      grid.appendChild(card);
    });
  },

  _tier(score) {
    if (score >= 80) return 'Master';
    if (score >= 60) return 'Journeyman';
    if (score >= 40) return 'Apprentice';
    return null;
  },

  // Re-render everything after a new stamp is saved (called from level3v2)
  refresh() {
    const data = this.load();
    this._updateCounter();
    this._renderHero();
    this._renderGrid();

    // Re-apply map state classes
    const stateInfo = {};
    PASSPORT_ART_FORMS.forEach(af => {
      if (af.type === 'tutorial') {
        if (!stateInfo[af.state]) stateInfo[af.state] = false;
        if (data[af.tutId]) stateInfo[af.state] = true;
      }
    });
    Object.entries(stateInfo).forEach(([sid, earned]) => {
      const path = document.getElementById(sid);
      if (!path) return;
      path.classList.remove('state--earned', 'state--locked');
      path.classList.add(earned ? 'state--earned' : 'state--locked');
    });
    this._renderMapLabels(data);

    if (this._selectedState) {
      this._renderAtlasSide(this._selectedState, data);
    }
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
  document.getElementById('l1-about').textContent        = data.tagline;
  document.getElementById('l1-community').textContent    = data.community;
  document.getElementById('l1-region-body').textContent  = art.region;
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
document.getElementById('lang-row')?.addEventListener('click', _handleLangClick);
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
    } else if (screenId === 'screen-identify') {
      goScanAgain();
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
