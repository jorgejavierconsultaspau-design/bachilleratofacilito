/* =========================================================================
   BachilleratoFacilito · Motion futurista
   - Cascada de entrada (asigna --bf-i a los hijos de cada rejilla/lista).
   - Tarjetas con inclinación 3D y foco de luz que sigue al puntero.
   - Botones magnéticos que se desplazan hacia el cursor.
   - Halo de cursor (solo puntero fino y sin movimiento reducido).
   No modifica la estructura del DOM: solo establece propiedades CSS
   personalizadas en línea sobre los elementos existentes.
   ========================================================================= */

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* ---------- 1. Cascada de entrada ----------------------------------- */

  const staggerSelectors = [
    '[class*="grid"] > *',
    '.bf-resource-list > *',
    '.recursos-links > *',
    '.bf-progress__badges > *',
    '.bf-timeline__items > *',
    '.bf-pau__index > *',
    '.bf-pau__years > *',
    '.bf-popular-search > *',
    '.subject-summary-card > *',
    '.bf-quick-search > *',
    '.bf-footer__main > *'
  ];

  const setupStagger = () => {
    const seen = new Set();
    document.querySelectorAll(staggerSelectors.join(',')).forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);
      // Índice dentro de su contenedor, con tope para que la cascada no se alargue.
      const siblings = Array.from(el.parentElement.children);
      const index = Math.min(siblings.indexOf(el), 12);
      el.style.setProperty('--bf-i', index);
    });
  };

  /* ---------- 2. Tarjetas: inclinación 3D y foco de luz --------------- */

  const tiltSelector = [
    '.bf-subject',
    '.subject-block-card',
    '.card',
    '.glass-panel',
    '.library-card',
    '.comparison-card',
    '.history-card',
    '.template-block',
    '.physics-directory-card',
    '.subject-summary-card',
    '.bf-resource-list__item'
  ].join(',');

  const MAX_TILT = 7; // grados

  const setupPointerEffects = () => {
    if (!finePointer.matches || reduceMotion.matches) return;

    const magneticSelector = [
      '.btn-neon',
      '.bf-button',
      '.btn-library',
      '.btn-history',
      '.btn-outline',
      '.btn-ghost',
      '.btn-back',
      '.bf-hero__cta',
      '.back-to-top',
      '.bf-theme-toggle'
    ].join(',');

    let pointerFrame = 0;
    let latestEvent = null;
    document.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      latestEvent = event;
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        const pointer = latestEvent;
        latestEvent = null;
        const target = pointer.target;
        if (!target.closest) return;

        const card = target.closest(tiltSelector);
        if (card) {
          const rect = card.getBoundingClientRect();
          if (rect.width && rect.height) {
            const px = Math.max(0, Math.min(1, (pointer.clientX - rect.left) / rect.width));
            const py = Math.max(0, Math.min(1, (pointer.clientY - rect.top) / rect.height));
            card.classList.add('bf-tilt-active');
            card.style.setProperty('--bf-rx', `${((0.5 - py) * MAX_TILT * 2).toFixed(2)}deg`);
            card.style.setProperty('--bf-ry', `${((px - 0.5) * MAX_TILT * 2).toFixed(2)}deg`);
            card.style.setProperty('--bf-gx', `${(px * 100).toFixed(1)}%`);
            card.style.setProperty('--bf-gy', `${(py * 100).toFixed(1)}%`);
          }
        }

        const btn = target.closest(magneticSelector);
        if (btn) {
          const rect = btn.getBoundingClientRect();
          const dx = pointer.clientX - (rect.left + rect.width / 2);
          const dy = pointer.clientY - (rect.top + rect.height / 2);
          const clamp = (value, max) => Math.max(-max, Math.min(max, value));
          btn.classList.add('bf-magnetic-active');
          btn.style.setProperty('--bf-btn-x', `${clamp(dx * 0.22, 9).toFixed(1)}px`);
          btn.style.setProperty('--bf-btn-y', `${clamp(dy * 0.28, 7).toFixed(1)}px`);
        }
      });
    }, { passive: true });

    document.addEventListener('pointerout', (event) => {
      if (pointerFrame) {
        cancelAnimationFrame(pointerFrame);
        pointerFrame = 0;
        latestEvent = null;
      }

      const target = event.target;
      if (!target.closest) return;

      const card = target.closest(tiltSelector);
      if (card && !card.contains(event.relatedTarget)) {
        card.style.setProperty('--bf-rx', '0deg');
        card.style.setProperty('--bf-ry', '0deg');
        card.classList.remove('bf-tilt-active');
      }

      const btn = target.closest(magneticSelector);
      if (btn && !btn.contains(event.relatedTarget)) {
        btn.style.setProperty('--bf-btn-x', '0px');
        btn.style.setProperty('--bf-btn-y', '0px');
        btn.classList.remove('bf-magnetic-active');
      }
    }, { passive: true });
  };

  /* ---------- 4. Halo de cursor -------------------------------------- */

  const setupCursorGlow = () => {
    if (!finePointer.matches || reduceMotion.matches) return;

    const glow = document.createElement('div');
    glow.className = 'bf-cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let running = false;

    const frame = () => {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        requestAnimationFrame(frame);
      } else {
        running = false;
      }
    };

    window.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      targetX = event.clientX;
      targetY = event.clientY;
      glow.classList.add('is-on');
      if (!running) {
        running = true;
        requestAnimationFrame(frame);
      }
    }, { passive: true });

    document.addEventListener('pointerleave', () => glow.classList.remove('is-on'));
  };

  const setupHeroParallax = () => {
    if (!finePointer.matches || reduceMotion.matches) return;
    const hero = document.querySelector('.bf-hero');
    if (!hero) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const animate = () => {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      hero.style.setProperty('--bf-mx', `${currentX}px`);
      hero.style.setProperty('--bf-my', `${currentY}px`);
      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        frame = requestAnimationFrame(animate);
      } else {
        frame = 0;
      }
    };

    const scheduleFrame = () => {
      if (!frame) frame = requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      targetX = (event.clientX / window.innerWidth - 0.5) * 10;
      targetY = (event.clientY / window.innerHeight - 0.5) * 8;
      scheduleFrame();
    }, { passive: true });

    window.addEventListener('pointerleave', () => {
      targetX = 0;
      targetY = 0;
      scheduleFrame();
    });
  };

  /* ---------- 5. Inicio ----------------------------------------------- */

  const init = () => {
    setupStagger();
    setupPointerEffects();
    setupCursorGlow();
    setupHeroParallax();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
