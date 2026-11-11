/* 02 / Sample works (2026-11-12, glaiza.digital flow): main.js still builds every card in the hidden #projectsGrid;
   this moves each card into its channel's row ([data-sw-row]) and wires the arrow buttons.
   Auto-slide: every row (and the ad results row when it overflows) slides by itself in an endless loop. The card
   that leaves on the left is moved to the end, so the loop never runs out. A row stops while the mouse is on it,
   while a keyboard user is inside it, for a few seconds after a swipe or arrow click, and when it is off screen.
   With reduced motion nothing moves by itself. Cards keep main.js's click handlers and popup order. */
(() => {
  const grid = document.getElementById('projectsGrid');
  const rows = [...document.querySelectorAll('[data-sw-row]')];
  if (!grid || !rows.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPEED = 40; // pixels per second
  const HOLD = 2500; // ms of stillness after a swipe or an arrow click

  rows.forEach((row) => {
    const cat = row.dataset.swRow; // one or more categories, e.g. "websites funnels"
    const cards = cat.split(' ').flatMap((c) => [...grid.querySelectorAll(`.project-card[data-category="${c}"]`)]);
    cards.forEach((card) => {
      card.classList.remove('is-hidden', 'is-load-more-hidden');
      card.classList.add('visible');
      card.style.display = '';
      row.append(card);
    });
    const count = document.querySelector(`[data-sw-count="${cat}"]`);
    if (count) count.textContent = cards.length;
  });

  const sliders = new Map();
  function slider(row, prev, next, more) {
    let pos = row.scrollLeft, written = pos, auto = false, inView = false, hover = false, focus = false, touching = false;
    let holdUntil = 0, tween = null, last = 0, raf = 0, expanded = false;
    const block = row.closest('.sw-block');
    [...row.children].forEach((c, i) => { c.dataset.swI = i; }); // original order, restored when "View Sample Works" opens the grid
    const gap = () => parseFloat(getComputedStyle(row).columnGap) || 0;

    // Endless loop needs at least one card's width of spare scroll room.
    const measure = () => {
      const first = row.firstElementChild;
      const room = row.scrollWidth - row.clientWidth;
      auto = !reduce && !expanded && !!first && room >= first.offsetWidth + gap() + 2;
      row.classList.toggle('is-auto', auto);
      if (more) more.parentElement.hidden = !expanded && room <= 2; // nothing hidden off to the side: no button needed
      pos = row.scrollLeft;
      written = pos;
      sync();
    };
    const sync = () => {
      if (!prev || !next) return;
      prev.disabled = !auto && row.scrollLeft < 4;
      next.disabled = !auto && row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
    };
    // Lazy images only load once they are inside the row; fetch the ones about to slide in.
    const warm = () => {
      const g = gap(), until = pos + row.clientWidth * 2;
      let x = 0;
      for (const c of row.children) {
        if (x > until) break;
        c.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
        x += c.offsetWidth + g;
      }
    };
    const recycle = () => {
      const g = gap();
      let shift = 0, first = row.firstElementChild;
      while (first && pos >= first.offsetWidth + g) {
        const w = first.offsetWidth + g;
        row.append(first);
        pos -= w; shift -= w;
        first = row.firstElementChild;
      }
      while (pos < 0) {
        const lastEl = row.lastElementChild;
        row.prepend(lastEl);
        const w = lastEl.offsetWidth + g;
        pos += w; shift += w;
      }
      if (shift && tween) { tween.from += shift; tween.to += shift; }
      if (shift) warm();
    };
    const write = () => { row.scrollLeft = pos; written = row.scrollLeft; };

    const frame = (t) => {
      raf = 0;
      if (expanded) return;
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t;
      if (tween) {
        const k = Math.min(1, (t - tween.t0) / tween.dur);
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        pos = tween.from + (tween.to - tween.from) * e;
        if (k >= 1) { tween = null; holdUntil = t + HOLD; }
        recycle(); write();
      } else if (auto && inView && !hover && !focus && !touching && t >= holdUntil) {
        pos += SPEED * dt;
        recycle(); write();
      }
      if (inView || tween) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } };

    const step = (dir) => {
      const dist = dir * Math.max(240, row.clientWidth * 0.85);
      if (!auto) { row.scrollBy({ left: dist, behavior: reduce ? 'auto' : 'smooth' }); return; }
      tween = { from: pos, to: pos + dist, t0: performance.now(), dur: 650 };
      kick();
    };
    if (prev) prev.addEventListener('click', () => step(-1));
    if (next) next.addEventListener('click', () => step(1));

    // "View Sample Works": the row stops and opens into a grid of every sample in it, first one first.
    // "Show less" closes it back into the sliding row and returns to the top of the block.
    if (more) more.addEventListener('click', () => {
      expanded = !expanded;
      tween = null;
      if (expanded) [...row.children].sort((a, b) => a.dataset.swI - b.dataset.swI).forEach((c) => row.append(c));
      row.classList.toggle('is-all', expanded);
      if (block) block.classList.toggle('is-all', expanded);
      more.setAttribute('aria-expanded', String(expanded));
      more.querySelector('.sw-more-label').textContent = expanded ? 'Show less' : 'View Sample Works';
      more.querySelector('.sw-more-icon').textContent = expanded ? '↑' : '→';
      row.scrollLeft = 0;
      pos = 0;
      written = 0;
      measure();
      if (!expanded) {
        (block || row).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        kick();
      }
      window.dispatchEvent(new Event('resize')); // main.js re-measures the website and funnel previews at their new size
    });

    // A scroll we did not write ourselves is the visitor swiping or using the trackpad: follow it and wait.
    row.addEventListener('scroll', () => {
      if (Math.abs(row.scrollLeft - written) > 1) {
        pos = row.scrollLeft; written = pos; tween = null;
        holdUntil = performance.now() + HOLD;
      }
      sync();
    }, { passive: true });
    row.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hover = true; });
    row.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') hover = false; });
    row.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') touching = true; });
    const release = () => { if (touching) { touching = false; holdUntil = performance.now() + HOLD; } };
    row.addEventListener('pointerup', release);
    row.addEventListener('pointercancel', release);
    row.addEventListener('focusin', (e) => { focus = e.target.matches(':focus-visible'); });
    row.addEventListener('focusout', (e) => { focus = row.contains(e.relatedTarget) && focus; });

    measure();
    warm();
    return {
      measure,
      show(on) { inView = on; if (on) { warm(); kick(); } },
    };
  }

  const targets = [
    ...rows.map((row) => [row, row.closest('.sw-block')]),
    ...[...document.querySelectorAll('.adr-row')].map((row) => [row, null]),
  ];
  targets.forEach(([row, block]) => {
    const pick = (s) => (block ? block.querySelector(s) : null) || (row.closest('.sw-block') ? row.closest('.sw-block').querySelector(s) : null);
    sliders.set(row, slider(row, pick('.sw-prev'), pick('.sw-next'), pick('.sw-more-btn')));
  });

  const io = new IntersectionObserver((entries) => entries.forEach((e) => sliders.get(e.target).show(e.isIntersecting)));
  sliders.forEach((_, row) => io.observe(row));
  let rt = 0;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => sliders.forEach((s) => s.measure()), 200); });

  // Website and funnel previews were measured while hidden; main.js re-measures them on resize.
  window.dispatchEvent(new Event('resize'));
})();
