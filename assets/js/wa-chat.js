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
  // Owner: no new tab. Phones open the WhatsApp app itself (falling back to the WhatsApp page in this tab when the
  // app is not installed); computers go straight into WhatsApp Web in this tab. WhatsApp never lets a website press
  // send for the visitor, so the chat opens with the message already typed. Not wa.me: some PH networks block it.
  const isPhone = window.matchMedia('(pointer: coarse)').matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const openChat = (msg) => {
    const q = `phone=${PHONE}` + (msg ? `&text=${encodeURIComponent(msg)}` : '');
    if (!isPhone) { window.location.href = `https://web.whatsapp.com/send?${q}`; return; }
    let left = false;
    const away = () => { left = true; };
    window.addEventListener('pagehide', away, { once: true });
    window.addEventListener('blur', away, { once: true });
    document.addEventListener('visibilitychange', away, { once: true });
    window.location.href = `whatsapp://send?${q}`;
    setTimeout(() => { if (!left) window.location.href = `https://api.whatsapp.com/send?${q}`; }, 1500);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    openChat(text.value.trim() || text.defaultValue);
  });
  // Every other "Chat on WhatsApp" link on the page opens the same way.
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href*="api.whatsapp.com/send"]');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    openChat(new URL(a.href).searchParams.get('text') || '');
  });
})();
