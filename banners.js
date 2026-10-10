/* =========================================================================
   BachilleratoFacilito · Banners animados de asignatura
   Detecta el banner de la página (hero de la asignatura), le añade una escena
   SVG animada propia de la materia y oculta la ilustración estática antigua.
   Los estilos y animaciones están en banners.css.
   ========================================================================= */

(() => {
  /* Página -> escena */
  const pageToScene = {
    'matematicas': 'mates',
    'fisica': 'fisica',
    'filosofia': 'filosofia',
    'filosofia-apuntes': 'filosofia',
    'filosofia-autores': 'filosofia',
    'filosofia-comparaciones': 'filosofia',
    'lengua': 'lengua',
    'bloquelengua': 'lengua',
    'bloquelite': 'lengua',
    'bloquetextos': 'lengua',
    'adec-coher-cohes': 'lengua',
    'dibujo-tecnico': 'dibujo',
    'historia-de-espana': 'historia',
    'ingles': 'ingles',
    'biologia': 'biologia',
    'quimica': 'quimica'
  };

  const file = location.pathname.split('/').pop().replace(/\.html$/i, '').toLowerCase();
  const scene = pageToScene[file] || document.body.dataset.bannerScene;
  if (!scene) return;

  const hero = document.querySelector('.subject-hero, .history-hero, .chemistry-hero, .subject-page-heading');
  if (!hero) return;

  /* Ilustraciones estáticas que se sustituyen por la escena animada */
  const oldArt = [
    '.subject-math-visual', '.subject-literature-visual', '.physics-hero__composition',
    '.history-hero__composition', '.chemistry-hero__composition', '.subject-drawing-visual',
    '.subject-english-visual', '.subject-biology-visual', '.subject-philosophy-portrait'
  ];

  /* ---------- Utilidades para generar SVG ----------------------------- */

  const range = (n) => Array.from({ length: n }, (_, i) => i);
  const svg = (inner) => `<svg viewBox="0 0 400 240" role="presentation" focusable="false">${inner}</svg>`;

  /* ---------- Escenas -------------------------------------------------- */

  const scenes = {
    /* Matemáticas: ejes, curva que se dibuja y un punto que la recorre */
    mates: () => {
      const curve = 'M26 196 C 88 196, 112 36, 200 120 S 312 206, 376 48';
      return svg(`
        <g class="bfb-grid"><path d="M0 40H400M0 80H400M0 120H400M0 160H400M0 200H400M80 0V240M160 0V240M240 0V240M320 0V240"/></g>
        <path class="bfb-l bfb-soft" d="M20 120H386M200 12V228"/>
        <path class="bfb-l bfb-soft" d="M380 115l8 5-8 5M195 18l5-8 5 8"/>
        <path class="bfb-l2 bfb-soft bfb-dash" d="M26 150 C 80 60, 140 60, 200 150 S 320 240, 376 150"/>
        <path class="bfb-l bfb-draw bfb-math-curve" pathLength="1" d="${curve}"/>
        <path class="bfb-l2 bfb-math-tan" d="M150 160L250 80"/>
        <circle class="bfb-f bfb-math-dot" r="7" style="offset-path:path('${curve}')"/>
        <g class="bfb-sym">
          <text class="bfb-t bfb-float" x="44" y="62" style="--d:0s">∫</text>
          <text class="bfb-t bfb-float" x="318" y="226" style="--d:-1.4s">π</text>
          <text class="bfb-t bfb-float" x="300" y="44" style="--d:-2.6s">Σ</text>
          <text class="bfb-t bfb-float bfb-sm" x="84" y="214" style="--d:-3.4s">√x</text>
          <text class="bfb-t bfb-float bfb-sm" x="228" y="58" style="--d:-0.8s">f(x)</text>
          <text class="bfb-t bfb-float bfb-sm" x="30" y="132" style="--d:-2s">lim</text>
        </g>`);
    },

    /* Física: átomo con electrones en órbita y una onda en movimiento */
    fisica: () => {
      const orbit = 'M82 120a118 40 0 1 0 236 0a118 40 0 1 0 -236 0';
      const orbits = [0, 60, 120].map((deg, i) => `
        <g transform="rotate(${deg} 200 120)">
          <path class="bfb-l bfb-soft" d="${orbit}"/>
          <circle class="bfb-f${i === 1 ? '2' : ''} bfb-electron" r="6" style="offset-path:path('${orbit}');--d:${-i * 1.7}s"/>
        </g>`).join('');
      return svg(`
        <defs><clipPath id="bfb-phy-clip"><rect x="0" y="196" width="400" height="44"/></clipPath>
          <radialGradient id="bfb-nuc"><stop offset="0" stop-color="var(--ba2)"/><stop offset="1" stop-color="var(--ba)" stop-opacity=".2"/></radialGradient></defs>
        ${orbits}
        <circle class="bfb-nucleus-halo" cx="200" cy="120" r="26" fill="url(#bfb-nuc)"/>
        <circle class="bfb-f2" cx="193" cy="115" r="7"/><circle class="bfb-f" cx="207" cy="123" r="7"/><circle class="bfb-f" cx="199" cy="130" r="6"/>
        <g clip-path="url(#bfb-phy-clip)"><path class="bfb-l2 bfb-wave" d="M-80 218${' q20 -20 40 0 t40 0'.repeat(10)}"/></g>
        <text class="bfb-t bfb-float bfb-sm" x="296" y="46" style="--d:-1s">E = mc²</text>
        <text class="bfb-t bfb-float bfb-sm" x="30" y="52" style="--d:-2.4s">F = ma</text>
        <text class="bfb-t bfb-float bfb-sm" x="40" y="186" style="--d:-3.2s">λ = h/p</text>`);
    },

    /* Filosofía: templo griego que se levanta, sol que late y preguntas flotando */
    filosofia: () => svg(`
      <circle class="bfb-sun" cx="200" cy="112" r="86" fill="var(--ba)"/>
      <circle class="bfb-l bfb-soft bfb-spin" cx="200" cy="112" r="104" stroke-dasharray="3 9" style="transform-origin:200px 112px"/>
      <g class="bfb-temple">
        <path class="bfb-pediment" d="M82 82L200 30L318 82Z"/>
        <rect class="bfb-slab" x="90" y="86" width="220" height="9" rx="2"/>
        ${range(6).map((i) => `<rect class="bfb-column" style="--i:${i}" x="${100 + i * 38}" y="98" width="16" height="84" rx="3"/>`).join('')}
        <rect class="bfb-slab" x="86" y="182" width="228" height="8" rx="2"/>
        <rect class="bfb-slab" x="78" y="190" width="244" height="9" rx="2"/>
        <rect class="bfb-slab" x="70" y="199" width="260" height="10" rx="2"/>
      </g>
      <g class="bfb-q">
        <text class="bfb-t bfb-rise" x="46" y="190" style="--d:0s">?</text>
        <text class="bfb-t bfb-rise" x="344" y="200" style="--d:-1.8s">?</text>
        <text class="bfb-t bfb-rise bfb-sm" x="24" y="120" style="--d:-3.2s">λόγος</text>
        <text class="bfb-t bfb-rise bfb-sm" x="322" y="130" style="--d:-4.4s">cogito</text>
        <text class="bfb-t bfb-rise" x="372" y="150" style="--d:-0.9s">¿</text>
      </g>`),

    /* Lengua: libro abierto con una página que pasa y letras que vuelan */
    lengua: () => {
      const letters = ['A', 'ñ', '¿?', '«»', 'ç', 'Z', ';', 'b'];
      return svg(`
        <g class="bfb-book">
          <path class="bfb-page" d="M200 196C158 174 112 170 62 182V70C112 58 158 64 200 88Z"/>
          <path class="bfb-page" d="M200 196C242 174 288 170 338 182V70C288 58 242 64 200 88Z"/>
          <path class="bfb-l" d="M200 88V196"/>
          <path class="bfb-l bfb-soft" d="M74 172C112 164 156 168 192 186M326 172C288 164 244 168 208 186"/>
          <path class="bfb-l2 bfb-writing" pathLength="1" d="M82 96H176" style="--i:0"/>
          <path class="bfb-l2 bfb-writing" pathLength="1" d="M82 114H166" style="--i:1"/>
          <path class="bfb-l2 bfb-writing" pathLength="1" d="M82 132H172" style="--i:2"/>
          <path class="bfb-l2 bfb-writing" pathLength="1" d="M82 150H150" style="--i:3"/>
          <path class="bfb-l bfb-soft" d="M224 100H318M224 118H312M224 136H318M224 154H298"/>
          <path class="bfb-flip" d="M200 196C242 174 288 170 338 182V70C288 58 242 64 200 88Z"/>
        </g>
        ${letters.map((c, i) => `<text class="bfb-t bfb-rise bfb-lt" x="${96 + i * 30}" y="70" style="--d:${-i * 0.9}s">${c}</text>`).join('')}`);
    },

    /* Dibujo técnico: compás trazando una circunferencia, triángulo y cota */
    dibujo: () => {
      const circle = 'M310 118A70 70 0 1 1 170 118A70 70 0 1 1 310 118';
      return svg(`
        <g class="bfb-grid"><path d="M0 40H400M0 80H400M0 120H400M0 160H400M0 200H400M80 0V240M160 0V240M240 0V240M320 0V240"/></g>
        <path class="bfb-l bfb-soft bfb-dash" d="M120 118H360M240 30V206"/>
        <path class="bfb-l bfb-draw bfb-cd-circle" pathLength="1" d="${circle}"/>
        <path class="bfb-l2 bfb-draw bfb-cd-tri" pathLength="1" d="M240 48L300 152H180Z"/>
        <g class="bfb-compass" style="transform-origin:240px 118px">
          <path class="bfb-l" d="M240 118H306"/>
          <path class="bfb-l" d="M306 118l8 -3l-2 6z" fill="var(--ba2)"/>
          <circle class="bfb-f" cx="240" cy="118" r="4"/>
        </g>
        <g class="bfb-cota">
          <path class="bfb-l2" d="M170 214H310M170 208V220M310 208V220"/>
          <text class="bfb-t bfb-sm" x="214" y="206">Ø 140</text>
        </g>
        <g class="bfb-cube">
          <path class="bfb-l bfb-draw bfb-cb1" pathLength="1" d="M42 78L72 62L102 78L72 94Z"/>
          <path class="bfb-l bfb-draw bfb-cb2" pathLength="1" d="M42 78V112L72 128V94M72 128L102 112V78"/>
        </g>
        <path class="bfb-l bfb-soft" d="M40 188H128M40 196H128" stroke-dasharray="2 6"/>`);
    },

    /* Historia: mapa de la península, línea del tiempo con hitos y reloj */
    historia: () => {
      const dates = [['1492', 44], ['1812', 126], ['1898', 208], ['1936', 290], ['1978', 372]];
      return svg(`
        <g transform="translate(14 -6) scale(1.02)">
          <path class="bfb-l bfb-draw bfb-hmap" pathLength="1" d="M74 43L112 31L143 45L174 40L195 62L181 84L194 105L169 121L137 115L117 132L86 119L78 96L54 82L64 62Z" transform="translate(40 0) scale(.88)"/>
          <circle class="bfb-f bfb-ping" cx="146" cy="92" r="4" style="--d:0s"/>
          <circle class="bfb-f2 bfb-ping" cx="190" cy="68" r="4" style="--d:-1.4s"/>
          <circle class="bfb-f bfb-ping" cx="118" cy="52" r="4" style="--d:-2.6s"/>
        </g>
        <g class="bfb-clock" transform="translate(318 66)">
          <circle class="bfb-l" r="38"/><circle class="bfb-l bfb-soft" r="31" stroke-dasharray="1 7"/>
          <path class="bfb-l2 bfb-hand-min" d="M0 0V-28" style="transform-origin:0 0"/>
          <path class="bfb-l bfb-hand-hr" d="M0 0V-18" style="transform-origin:0 0"/>
          <circle class="bfb-f" r="3"/>
        </g>
        <path class="bfb-l bfb-soft" d="M30 178H380"/>
        <path class="bfb-l2 bfb-draw bfb-hline" pathLength="1" d="M30 178H380"/>
        ${dates.map(([y, x], i) => `
          <g class="bfb-node" style="--i:${i}">
            <circle class="bfb-f${i % 2 ? '2' : ''}" cx="${x}" cy="178" r="7"/>
            <circle class="bfb-l bfb-ring" cx="${x}" cy="178" r="7"/>
            <text class="bfb-t bfb-yr" x="${x}" y="${i % 2 ? 210 : 154}" text-anchor="middle">${y}</text>
          </g>`).join('')}`);
    },

    /* Inglés: conversación con globos que aparecen y puntos de escritura */
    ingles: () => svg(`
      <g class="bfb-bubble" style="--i:0">
        <path class="bfb-bub" d="M40 38h128a14 14 0 0 1 14 14v22a14 14 0 0 1-14 14H80l-22 16v-16h-18a14 14 0 0 1-14-14V52a14 14 0 0 1 14-14z"/>
        <text class="bfb-bt" x="111" y="72" text-anchor="middle">Hello!</text>
      </g>
      <g class="bfb-bubble bfb-right" style="--i:1">
        <path class="bfb-bub bfb-bub2" d="M236 98h128a14 14 0 0 1 14 14v22a14 14 0 0 1-14 14h-18v16l-22-16h-88a14 14 0 0 1-14-14v-22a14 14 0 0 1 14-14z"/>
        <text class="bfb-bt" x="300" y="132" text-anchor="middle">How are you?</text>
      </g>
      <g class="bfb-bubble" style="--i:2">
        <path class="bfb-bub" d="M40 162h108a14 14 0 0 1 14 14v10a14 14 0 0 1-14 14H80l-22 14v-14h-18a14 14 0 0 1-14-14v-10a14 14 0 0 1 14-14z"/>
        <circle class="bfb-typing" cx="74" cy="181" r="4" style="--k:0"/><circle class="bfb-typing" cx="92" cy="181" r="4" style="--k:1"/><circle class="bfb-typing" cx="110" cy="181" r="4" style="--k:2"/>
      </g>
      <text class="bfb-t bfb-float" x="288" y="44" style="--d:0s">Aa</text>
      <text class="bfb-t bfb-float bfb-sm" x="212" y="214" style="--d:-1.5s">verb</text>
      <text class="bfb-t bfb-float bfb-sm" x="330" y="206" style="--d:-2.7s">tense</text>
      <text class="bfb-t bfb-float bfb-sm" x="236" y="60" style="--d:-3.6s">the</text>`),

    /* Biología: doble hélice de ADN que gira y una célula que late */
    biologia: () => {
      const n = 14, top = 22, gap = 15.5, cx = 108, amp = 44, period = 3.6;
      const rungs = range(n).map((i) => {
        const y = top + i * gap, d = `${-(i * period / 9.5).toFixed(2)}s`;
        return `
          <g style="--d:${d}">
            <line class="bfb-l bfb-rung" x1="${cx - amp}" x2="${cx + amp}" y1="${y}" y2="${y}"/>
            <circle class="bfb-f bfb-nodeA" cx="${cx}" cy="${y}" r="5.5"/>
            <circle class="bfb-f2 bfb-nodeB" cx="${cx}" cy="${y}" r="5.5"/>
          </g>`;
      }).join('');
      return svg(`
        <g class="bfb-helix" style="--p:${period}s">${rungs}</g>
        <g class="bfb-cell" transform="translate(296 118)">
          <circle class="bfb-membrane" r="64"/>
          <circle class="bfb-l bfb-soft" r="52" stroke-dasharray="2 7"/>
          <circle class="bfb-nucleus" r="22"/>
          <circle class="bfb-f2" cx="-5" cy="-5" r="6"/>
          <g class="bfb-orgs">
            <ellipse class="bfb-f" cx="-40" cy="14" rx="9" ry="5"/>
            <ellipse class="bfb-f2" cx="36" cy="-26" rx="8" ry="4.5"/>
            <circle class="bfb-f" cx="30" cy="34" r="5"/>
            <circle class="bfb-f2" cx="-26" cy="-38" r="4"/>
          </g>
        </g>
        <circle class="bfb-f bfb-bubl" cx="214" cy="196" r="4" style="--d:0s"/>
        <circle class="bfb-f2 bfb-bubl" cx="226" cy="206" r="3" style="--d:-1.6s"/>
        <text class="bfb-t bfb-float bfb-sm" x="226" y="42" style="--d:-1s">ADN</text>
        <text class="bfb-t bfb-float bfb-sm" x="330" y="222" style="--d:-2.2s">ATP</text>`);
    },

    /* Química: matraz con líquido y burbujas, anillo de benceno y moléculas */
    quimica: () => {
      const flask = 'M262 34H298V92L348 192Q356 210 338 210H222Q204 210 212 192L262 92Z';
      const hex = [[0, -34], [29.4, -17], [29.4, 17], [0, 34], [-29.4, 17], [-29.4, -17]];
      return svg(`
        <defs><clipPath id="bfb-flask"><path d="${flask}"/></clipPath></defs>
        <g class="bfb-benzene" transform="translate(88 118)">
          <g class="bfb-spin-slow">
            <polygon class="bfb-l" points="${hex.map((p) => p.join(',')).join(' ')}"/>
            <circle class="bfb-l2" r="18"/>
            ${hex.map((p, i) => `<circle class="bfb-f${i % 2 ? '2' : ''} bfb-atom" cx="${p[0]}" cy="${p[1]}" r="7" style="--i:${i}"/>`).join('')}
          </g>
        </g>
        <g clip-path="url(#bfb-flask)">
          <rect class="bfb-liquid" x="190" y="150" width="190" height="80"/>
          <path class="bfb-liquid bfb-lwave" d="M170 150${' q15 -9 30 0 t30 0'.repeat(9)}V240H170Z"/>
          ${range(6).map((i) => `<circle class="bfb-bubl bfb-fill" cx="${250 + i * 15}" cy="196" r="${3 + (i % 3)}" style="--d:${-i * 0.7}s"/>`).join('')}
        </g>
        <path class="bfb-l bfb-flask-o" d="${flask}"/>
        <path class="bfb-l" d="M254 34H306"/>
        <text class="bfb-t bfb-float bfb-sm" x="170" y="40" style="--d:-0.6s">H₂O</text>
        <text class="bfb-t bfb-float bfb-sm" x="350" y="70" style="--d:-1.9s">CO₂</text>
        <text class="bfb-t bfb-float bfb-sm" x="28" y="44" style="--d:-3s">pH</text>
        <text class="bfb-t bfb-float bfb-sm" x="52" y="214" style="--d:-2.4s">NaCl</text>`);
    }
  };

  /* ---------- Montaje -------------------------------------------------- */

  const build = scenes[scene];
  if (!build || hero.querySelector('.bfb')) return;

  hero.classList.add('bf-banner');
  hero.dataset.bfScene = scene;

  oldArt.forEach((selector) => {
    hero.querySelectorAll(selector).forEach((node) => node.classList.add('bf-banner__old'));
  });
  // La tarjeta lateral de Filosofía solo contenía la ilustración antigua
  hero.querySelectorAll('.subject-summary-card').forEach((card) => {
    if (!card.querySelector(':scope > :not(.bf-banner__old)')) card.classList.add('bf-banner__old');
  });

  // Si queda una tarjeta de datos a la derecha, la escena se coloca a su izquierda
  if (hero.querySelector('.subject-summary-card:not(.bf-banner__old), .history-hero__stats')) {
    hero.classList.add('bf-banner--card');
  }

  const glow = document.createElement('div');
  glow.className = 'bfb-glow';
  glow.setAttribute('aria-hidden', 'true');

  const art = document.createElement('div');
  art.className = 'bfb';
  art.setAttribute('aria-hidden', 'true');
  art.innerHTML = build();

  hero.append(glow, art);
})();
