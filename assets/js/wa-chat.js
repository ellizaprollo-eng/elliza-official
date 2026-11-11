/* WhatsApp chat (2026-11-12): the green button opens a small chat card; "Send a message" opens WhatsApp
   with the visitor's text, addressed to Elliza's phone (+63 930 661 4307). */
(() => {
  const fab = document.getElementById('waFab');
  const panel = document.getElementById('waPanel');
  if (!fab || !panel) return;
  const PHONE = '639306614307';
  const form = document.getElementById('waForm');
  const text = document.getElementById('waText');
  const time = document.getElementById('waTime');

  const setOpen = (open) => {
    panel.hidden = !open;
    fab.classList.toggle('is-open', open);
    fab.setAttribute('aria-expanded', String(open));
    fab.setAttribute('aria-label', open ? 'Close the WhatsApp chat' : 'Chat with Elliza on WhatsApp');
    if (!open) return;
    time.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const dot = fab.querySelector('.wa-dot');
    if (dot) dot.remove();
    if (window.matchMedia('(hover: hover)').matches) text.focus({ preventScroll: true }); // no keyboard pop-up on phones
  };

  fab.addEventListener('click', () => setOpen(panel.hidden));
  panel.querySelector('.wa-close').addEventListener('click', () => { setOpen(false); fab.focus(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) { setOpen(false); fab.focus(); }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = text.value.trim() || text.defaultValue;
    // api.whatsapp.com rather than wa.me: some networks in the Philippines block wa.me
    window.open(`https://api.whatsapp.com/send?phone=${PHONE}&text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });
})();
