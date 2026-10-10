
(() => {
  const progress = document.createElement('div');
  progress.className = 'bf-scroll-progress';
  progress.setAttribute('aria-hidden','true');
  progress.innerHTML = '<span></span>';
  document.body.appendChild(progress);
  const bar = progress.firstElementChild;

  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.setProperty('--scroll-progress', `${Math.min(100, Math.max(0, value)) / 100}`);
    ticking = false;
  };
  const scheduleUpdate = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', scheduleUpdate, {passive:true});
  window.addEventListener('resize', scheduleUpdate, {passive:true});
  update();
})();
