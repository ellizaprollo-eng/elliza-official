/* The homepage top nav on pages that do not load main.js (the booking page, 2026-11-12):
   dark background once the page scrolls, and the phone menu button. */
(() => {
  const wrap = document.getElementById('navWrap');
  if (!wrap) return;
  const links = document.getElementById('navLinks');
  const toggle = document.getElementById('menuToggle');
  const onScroll = () => wrap.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (!links || !toggle) return;
  const setOpen = (open) => {
    links.classList.toggle('open', open);
    toggle.textContent = open ? '✕' : '☰';
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(!links.classList.contains('open')));
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
})();
