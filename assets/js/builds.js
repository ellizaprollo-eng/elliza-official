/* Live client builds (2026-11-12): the browser frame scrolls the chosen build's full page, then moves to the next one.
   It pauses on hover and when the section is off screen. With reduced motion the frame is scrolled by hand instead.
   Each build's data lives on its button in index.html (data-img, data-url, data-host, data-type, data-desc). */
(() => {
  const stage = document.getElementById('lbStage');
  if (!stage) return;
  const items = [...stage.querySelectorAll('.lb-item')];
  const view = document.getElementById('lbView');
  const img = document.getElementById('lbImage');
  const host = document.getElementById('lbHost');
  const desc = document.getElementById('lbDesc');
  const tags = document.getElementById('lbTags');
  const visit = document.getElementById('lbVisit');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const TAGS = { website: ['Web &amp; UI Design', 'Website Systems'], funnel: ['Funnel Building', 'Landing Pages'] };
  const SPEED = 170; // pixels per second

  let index = 0, anim = null, inView = false, hovering = false, started = false, raf = 0, hold = 0, token = 0;

  const setBar = (p) => items.forEach((it, i) => it.style.setProperty('--p', i === index ? p : 0));
  const tick = () => {
    if (anim) {
      const t = anim.effect.getComputedTiming();
      setBar(anim.playState === 'finished' ? 1 : (t.progress || 0));
    }
    raf = requestAnimationFrame(tick);
  };
  const loop = (on) => { cancelAnimationFrame(raf); if (on) raf = requestAnimationFrame(tick); };

  const scheduleNext = () => {
    clearTimeout(hold);
    const my = token;
    hold = setTimeout(() => { if (my === token && inView && !hovering) show(index + 1); }, 1800);
  };

  function startScroll() {
    if (anim) { anim.cancel(); anim = null; }
    clearTimeout(hold);
    setBar(0);
    if (reduce.matches || !img.complete) return;
    const dist = Math.round(img.getBoundingClientRect().height - view.clientHeight);
    if (dist <= 0) return;
    const duration = Math.min(24000, Math.max(9000, (dist / SPEED) * 1000));
    anim = img.animate(
      [{ transform: 'translateY(0)' }, { transform: `translateY(${-dist}px)` }],
      { duration, delay: 1200, easing: 'cubic-bezier(.45,0,.55,1)', fill: 'both' }
    );
    if (!inView || hovering) anim.pause();
    anim.onfinish = () => { if (inView && !hovering) scheduleNext(); };
  }

  function show(i, byUser) {
    index = (i + items.length) % items.length;
    const my = ++token;
    const it = items[index];
    items.forEach((b, k) => { b.classList.toggle('is-active', k === index); b.setAttribute('aria-selected', String(k === index)); });
    if (anim) { anim.cancel(); anim = null; }
    clearTimeout(hold);
    setBar(0);

    const name = it.querySelector('.lb-name').textContent;
    const isFunnel = it.dataset.type === 'funnel';
    host.textContent = it.dataset.host;
    desc.textContent = it.dataset.desc;
    tags.innerHTML = (TAGS[it.dataset.type] || []).map((t) => `<span class="tag">${t}</span>`).join('');
    visit.href = it.dataset.url;
    visit.textContent = isFunnel ? 'Open the live funnel' : 'Visit the live site';

    view.classList.add('is-swapping');
    const next = new Image();
    next.decoding = 'async';
    next.onload = next.onerror = () => {
      if (my !== token) return;
      setTimeout(() => {
        if (my !== token) return;
        img.src = it.dataset.img;
        if (next.naturalWidth) { img.width = next.naturalWidth; img.height = next.naturalHeight; }
        img.alt = `${name} ${isFunnel ? 'funnel' : 'website'}, full page`;
        view.scrollTop = 0;
        (img.decode ? img.decode() : Promise.resolve()).catch(() => {}).then(() => {
          if (my !== token) return;
          view.classList.remove('is-swapping');
          startScroll();
          new Image().src = items[(index + 1) % items.length].dataset.img; // warm the next one
        });
      }, 260);
    };
    next.src = it.dataset.img;

    if (byUser && window.matchMedia('(max-width: 980px)').matches) {
      const r = view.getBoundingClientRect();
      if (r.top < 60 || r.bottom > window.innerHeight) view.closest('.lb-screen').scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
    }
  }

  items.forEach((b, i) => {
    b.addEventListener('click', () => show(i, true));
    b.addEventListener('keydown', (e) => {
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      const n = (i + step + items.length) % items.length;
      items[n].focus();
      show(n, true);
    });
  });

  if (window.matchMedia('(hover: hover)').matches) {
    view.addEventListener('mouseenter', () => { hovering = true; clearTimeout(hold); if (anim && anim.playState === 'running') anim.pause(); });
    view.addEventListener('mouseleave', () => {
      hovering = false;
      if (!anim || !inView) return;
      if (anim.playState === 'finished') scheduleNext(); else anim.play();
    });
  }

  const begin = () => { if (img.complete && img.naturalWidth) startScroll(); else img.addEventListener('load', startScroll, { once: true }); };
  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    if (inView) {
      loop(true);
      if (!started) { started = true; begin(); new Image().src = items[1].dataset.img; return; }
      if (anim) { if (anim.playState === 'finished') scheduleNext(); else if (!hovering) anim.play(); }
    } else {
      loop(false);
      clearTimeout(hold);
      if (anim && anim.playState === 'running') anim.pause();
    }
  }, { threshold: 0.35 }).observe(view);

  let rt = 0;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (started) startScroll(); }, 250); });
  if (reduce.addEventListener) reduce.addEventListener('change', startScroll);
})();
