/* 02 / Sample works (2026-11-12, glaiza.digital flow): main.js still builds every card in the hidden #projectsGrid;
   this moves each card into its channel's row ([data-sw-row]) and wires the row's arrow buttons. The cards keep
   main.js's click handlers, so the popup, live links and previews work as before. */
(() => {
  const grid = document.getElementById('projectsGrid');
  const rows = [...document.querySelectorAll('[data-sw-row]')];
  if (!grid || !rows.length) return;
  const smooth = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

  rows.forEach((row) => {
    const cat = row.dataset.swRow;
    const cards = [...grid.querySelectorAll(`.project-card[data-category="${cat}"]`)];
    cards.forEach((card) => {
      card.classList.remove('is-hidden', 'is-load-more-hidden');
      card.classList.add('visible');
      card.style.display = '';
      row.append(card);
    });
    const count = document.querySelector(`[data-sw-count="${cat}"]`);
    if (count) count.textContent = cards.length;

    const block = row.closest('.sw-block');
    const prev = block.querySelector('.sw-prev');
    const next = block.querySelector('.sw-next');
    const sync = () => {
      prev.disabled = row.scrollLeft < 4;
      next.disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
    };
    const step = (dir) => row.scrollBy({ left: dir * Math.max(240, row.clientWidth * 0.85), behavior: smooth });
    prev.addEventListener('click', () => step(-1));
    next.addEventListener('click', () => step(1));
    row.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });

  // Website and funnel previews were measured while hidden; main.js re-measures them on resize.
  window.dispatchEvent(new Event('resize'));
})();
