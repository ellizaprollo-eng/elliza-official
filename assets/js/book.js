/* Booking page (2026-11-12, owner: the calendar must fit its box): Calendly reports its content height with
   "calendly.page_height" messages; the box follows it, so the calendar never needs its own scrollbar on any step. */
(() => {
  const box = document.querySelector('.calendly-inline-widget');
  if (!box) return;
  window.addEventListener('message', (e) => {
    if (!(e.origin === 'https://calendly.com' || /\.calendly\.com$/.test(e.origin))) return;
    const d = e.data;
    if (!d || d.event !== 'calendly.page_height' || !d.payload) return;
    const h = parseInt(d.payload.height, 10);
    if (!(h >= 400)) return; // while loading Calendly reports 2-26 px; ignore those so the box never collapses
    box.style.height = `${h}px`;
  });
})();
