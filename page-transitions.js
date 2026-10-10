/* =========================================================================
   BachilleratoFacilito · Transiciones de página
   - Salida: el overlay se expande en círculo desde el punto del clic y
     barre la pantalla con un escáner antes de cargar la siguiente página.
   - Entrada: si la navegación viene de una transición interna (flag en
     sessionStorage) o la página es una asignatura, el círculo se contrae
     revelando el contenido.
   - Cada asignatura tiene su propia escena animada (SVG + CSS en futuro.css)
     relacionada con su contenido. Lengua mantiene el libro en CSS.
   ========================================================================= */

(() => {
  const subjectMap = {
    matematicas: ['Matemáticas II', '∑', '#2ef2c8'],
    fisica: ['Física', '↗', '#38bdf8'],
    filosofia: ['Filosofía', '✦', '#c084fc'],
    lengua: ['Lengua y Literatura', '📖', '#fb923c'],
    dibujo: ['Dibujo Técnico II', '△', '#a3e635'],
    historia: ['Historia de España', '◷', '#facc15'],
    ingles: ['Inglés', 'A', '#818cf8'],
    biologia: ['Biología', '🧬', '#34d399'],
    quimica: ['Química', '⚗', '#f472b6']
  };

  /* Escenas SVG por asignatura (viewBox 230 x 150) */
  const scenes = {
    matematicas: `
      <svg class="bf-scene" viewBox="0 0 230 150" aria-hidden="true">
        <path class="sc-grid" d="M0 37.5H230M0 75H230M0 112.5H230M57.5 0V150M115 0V150M172.5 0V150"/>
        <path class="sc-axis" pathLength="1" d="M20 75H210M115 14V136"/>
        <path class="sc-curve" pathLength="1" d="M22 118 C 70 22, 120 128, 208 34"/>
        <text class="sc-tok t1" x="26" y="42">∫</text>
        <text class="sc-tok t2" x="184" y="132">π</text>
        <text class="sc-tok t3" x="150" y="30">Σ</text>
      </svg>`,
    fisica: `
      <svg class="bf-scene" viewBox="0 0 230 150" aria-hidden="true">
        <circle class="sc-nucleus" cx="115" cy="75" r="8"/>
        <g class="sc-orbit" style="--r:0deg"><ellipse cx="115" cy="75" rx="88" ry="30"/><circle class="sc-electron" cx="203" cy="75" r="4"/></g>
        <g class="sc-orbit o2" style="--r:60deg"><ellipse cx="115" cy="75" rx="88" ry="30"/><circle class="sc-electron" cx="203" cy="75" r="4"/></g>
        <g class="sc-orbit o3" style="--r:-60deg"><ellipse cx="115" cy="75" rx="88" ry="30"/><circle class="sc-electron" cx="203" cy="75" r="4"/></g>
      </svg>`,
    filosofia: `
      <svg class="bf-scene" viewBox="0 0 230 150" aria-hidden="true">
        <path class="sc-pediment" d="M40 50 L115 20 L190 50 Z"/>
        <rect class="sc-column" style="--i:0" x="52" y="50" width="14" height="72" rx="2"/>
        <rect class="sc-column" style="--i:1" x="84" y="50" width="14" height="72" rx="2"/>
        <rect class="sc-column" style="--i:2" x="116" y="50" width="14" height="72" rx="2"/>
        <rect class="sc-column" style="--i:3" x="148" y="50" width="14" height="72" rx="2"/>
        <rect class="sc-column" style="--i:4" x="180" y="50" width="14" height="72" rx="2"/>
        <path class="sc-base" d="M30 128H200"/>
      </svg>`,
    dibujo: `
      <svg class="bf-scene" viewBox="0 0 230 150" aria-hidden="true">
        <path class="sc-draw" pathLength="1" d="M115 28 L82 126"/>
        <path class="sc-draw d2" pathLength="1" d="M115 28 L148 126"/>
        <path class="sc-draw d3" pathLength="1" d="M84 112 A 46 46 0 0 1 146 112"/>
        <path class="sc-draw d4" pathLength="1" d="M26 138 L26 88 L76 138 Z"/>
        <path class="sc-draw d5" pathLength="1" d="M170 40 L210 40 M190 26 L190 54"/>
      </svg>`,
    historia: `
      <svg class="bf-scene" viewBox="0 0 230 150" aria-hidden="true">
        <path class="sc-timeline" pathLength="1" d="M18 80H212"/>
        <circle class="sc-dot" style="--i:0" cx="40" cy="80" r="5"/>
        <circle class="sc-dot" style="--i:1" cx="92" cy="80" r="5"/>
        <circle class="sc-dot" style="--i:2" cx="144" cy="80" r="5"/>
        <circle class="sc-dot" style="--i:3" cx="194" cy="80" r="5"/>
        <text class="sc-year" style="--i:0" x="40" y="66">1808</text>
        <text class="sc-year" style="--i:1" x="92" y="104">1931</text>
        <text class="sc-year" style="--i:2" x="144" y="66">1936</text>
        <text class="sc-year" style="--i:3" x="194" y="104">1975</text>
      </svg>`,
    ingles: `
      <svg class="bf-scene" viewBox="0 0 230 150" aria-hidden="true">
        <g class="sc-bubble" style="--i:0"><rect x="22" y="34" width="96" height="38" rx="14"/><text x="70" y="59">Hello!</text></g>
        <g class="sc-bubble" style="--i:1"><rect x="112" y="84" width="96" height="38" rx="14"/><text x="160" y="109">¡Hola!</text></g>
      </svg>`,
    biologia: `
      <svg class="bf-scene" viewBox="0 0 230 150" aria-hidden="true">
        <ellipse class="sc-membrane" cx="115" cy="75" rx="84" ry="54"/>
        <circle class="sc-nucleolus" cx="112" cy="72" r="22"/>
        <g class="sc-spin"><circle class="sc-organelle" cx="60" cy="75" r="5"/><circle class="sc-organelle" cx="172" cy="75" r="5"/><circle class="sc-organelle" cx="115" cy="32" r="4"/><circle class="sc-organelle" cx="115" cy="118" r="4"/></g>
      </svg>`,
    quimica: `
      <svg class="bf-scene" viewBox="0 0 230 150" aria-hidden="true">
        <polygon class="sc-ring" pathLength="1" points="115,33 151,54 151,96 115,117 79,96 79,54"/>
        <circle class="sc-atom" style="--i:0" cx="115" cy="33" r="6"/>
        <circle class="sc-atom" style="--i:1" cx="151" cy="54" r="6"/>
        <circle class="sc-atom" style="--i:2" cx="151" cy="96" r="6"/>
        <circle class="sc-atom" style="--i:3" cx="115" cy="117" r="6"/>
        <circle class="sc-atom" style="--i:4" cx="79" cy="96" r="6"/>
        <circle class="sc-atom" style="--i:5" cx="79" cy="54" r="6"/>
        <circle class="sc-bubble-rise b1" cx="60" cy="134" r="3"/>
        <circle class="sc-bubble-rise b2" cx="174" cy="132" r="4"/>
      </svg>`
  };

  const FLAG_KEY = 'bf-transition-pending';
  const EXIT_MS = 450;
  const ENTER_MS = 600;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Archivos de asignatura cuyo nombre no coincide con la clave de subjectMap
  const fileAliases = {
    'dibujo-tecnico.html': 'dibujo',
    'historia-de-espana.html': 'historia'
  };

  const fileToSubject = (href = '') => {
    const file = href.split('/').pop().split('?')[0].toLowerCase();
    if (fileAliases[file]) return fileAliases[file];
    for (const key of Object.keys(subjectMap)) {
      if (file === `${key}.html`) return key;
    }
    if (file === 'filosofia-apuntes.html' || file === 'filosofia-autores.html' || file === 'filosofia-comparaciones.html') return 'filosofia';
    return null;
  };

  const currentSubject = fileToSubject(location.pathname) || document.body.dataset.subject || null;
  let isExiting = false;
  let exitTimer = 0;
  let pendingHref = '';

  /* ---------- Overlay --------------------------------------------------- */

  const overlay = document.createElement('div');
  overlay.className = 'bf-transition';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="bf-transition__inner">
      <div class="bf-transition__art"><div class="bf-transition__scene"></div><span class="bf-transition__symbol" aria-hidden="true"></span></div>
      <div class="bf-transition__label">Preparando contenido</div>
      <h2 class="bf-transition__title"></h2>
    </div>`;
  document.body.appendChild(overlay);

  const titleEl = overlay.querySelector('.bf-transition__title');
  const symbolEl = overlay.querySelector('.bf-transition__symbol');
  const sceneEl = overlay.querySelector('.bf-transition__scene');

  const setOverlayContent = (subject) => {
    const [name, symbol, color] = subject && subjectMap[subject]
      ? subjectMap[subject]
      : ['BachilleratoFacilito', 'BF', '#5ef2e0'];
    overlay.dataset.subject = subject || 'generic';
    overlay.style.setProperty('--sc', color);
    titleEl.textContent = name;
    symbolEl.textContent = symbol;
    // Reinicia la escena para que sus animaciones arranquen desde cero
    sceneEl.innerHTML = subject && scenes[subject] ? scenes[subject] : '';
  };

  const root = document.documentElement;
  const resetOverlay = () => {
    overlay.classList.remove('is-active', 'is-enter', 'is-exit');
    root.classList.remove('bf-pre-enter');
  };

  /* ---------- Entrada ---------------------------------------------------- */

  let pendingFlag = false;
  try {
    pendingFlag = sessionStorage.getItem(FLAG_KEY) === '1';
    sessionStorage.removeItem(FLAG_KEY);
  } catch (_) { /* almacenamiento no disponible */ }

  if (!reduceMotion.matches && (currentSubject || pendingFlag)) {
    setOverlayContent(currentSubject);
    overlay.classList.add('is-active', 'is-enter');
    // Cuando la capa ya está pintada, se retira la cubierta previa del <head>
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('bf-pre-enter')));
    window.setTimeout(resetOverlay, ENTER_MS + 120);
  } else {
    root.classList.remove('bf-pre-enter');
  }

  /* ---------- Salida ----------------------------------------------------- */

  const finishExit = () => {
    if (!isExiting) return;
    isExiting = false;
    window.clearTimeout(exitTimer);
    location.href = pendingHref;
  };

  overlay.addEventListener('animationend', (event) => {
    if (event.target !== overlay) return;
    if (event.animationName === 'bf-circle-open') finishExit();
    // Entrada terminada: ocultar ya, sin esperar al temporizador
    if (event.animationName === 'bf-circle-close') resetOverlay();
  });

  const startExit = (event, targetSubject, href) => {
    if (reduceMotion.matches) {
      location.href = href;
      return;
    }

    isExiting = true;
    pendingHref = href;
    setOverlayContent(targetSubject);
    const x = event && event.clientX ? event.clientX : window.innerWidth / 2;
    const y = event && event.clientY ? event.clientY : window.innerHeight / 2;
    overlay.style.setProperty('--bf-tx', `${x}px`);
    overlay.style.setProperty('--bf-ty', `${y}px`);

    overlay.classList.remove('is-enter');
    void overlay.offsetWidth;
    overlay.classList.add('is-active', 'is-exit');

    try {
      sessionStorage.setItem(FLAG_KEY, '1');
    } catch (_) { /* sin almacenamiento, la entrada no se animará */ }

    exitTimer = window.setTimeout(finishExit, EXIT_MS);
  };

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (isExiting) {
      event.preventDefault();
      return;
    }

    const link = event.target.closest('a[href]');
    if (!link) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;

    const raw = link.getAttribute('href');
    if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) return;

    let url;
    try { url = new URL(raw, location.href); } catch { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return;

    event.preventDefault();
    startExit(event, fileToSubject(url.pathname), url.href);
  });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      resetOverlay();
      isExiting = false;
      window.clearTimeout(exitTimer);
    }
  });
})();
