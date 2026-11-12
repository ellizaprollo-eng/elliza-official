/* WhatsApp chat (2026-11-12): the green button opens a small chat card; "Send a message" delivers the visitor's
   name, number and message to Elliza's WhatsApp (+63 930 661 4307) without leaving the page. */
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
    if (window.matchMedia('(hover: hover)').matches) (document.getElementById('waVisitorName') || text).focus({ preventScroll: true }); // no keyboard pop-up on phones
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

  // Owner: "Send a message" sends right away. The site posts it to /api/wa-message, which forwards it to Elliza's
  // WhatsApp (CallMeBot). If that is not set up yet or fails, WhatsApp opens with the message typed, so nothing is lost.
  const nameIn = document.getElementById('waVisitorName');
  const phoneIn = document.getElementById('waVisitorPhone');
  const note = document.getElementById('waNote');
  const done = document.getElementById('waDone');
  const sendBtn = form.querySelector('.wa-send');
  const sendLabel = form.querySelector('.wa-send-label');
  const honey = form.querySelector('.wa-hp');
  const NOTE = note ? note.textContent : '';
  let openedAt = 0;
  fab.addEventListener('click', () => { if (!panel.hidden && !openedAt) openedAt = Date.now(); });
  const say = (msg, bad) => { if (!note) return; note.textContent = msg; note.classList.toggle('is-error', !!bad); };
  [nameIn, phoneIn].forEach((el) => el && el.addEventListener('input', () => { if (note && note.classList.contains('is-error')) say(NOTE, false); }));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = text.value.trim() || text.defaultValue;
    const name = nameIn ? nameIn.value.trim() : '';
    const phone = phoneIn ? phoneIn.value.trim() : '';
    if (!nameIn || !phoneIn) { openChat(message); return; } // older page without the fields
    if (name.length < 2) { say('Please add your name.', true); nameIn.focus(); return; }
    if (!/^\+?[0-9 ()-]{7,20}$/.test(phone)) { say('Please add your WhatsApp number with the country code.', true); phoneIn.focus(); return; }

    sendBtn.disabled = true;
    sendLabel.textContent = 'Sending…';
    say(NOTE, false);
    try {
      const r = await fetch('/api/wa-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, message, website: honey ? honey.value : '', elapsed: Date.now() - (openedAt || Date.now()), page: location.pathname }),
      });
      if (r.ok) { form.hidden = true; done.hidden = false; return; }
      if (r.status === 400 || r.status === 429) {
        sendBtn.disabled = false;
        sendLabel.textContent = 'Send a message';
        say(r.status === 429 ? 'Too many messages. Please try again in a few minutes.' : 'Please check your name, number and message.', true);
        return;
      }
    } catch (err) { /* offline or blocked: use WhatsApp below */ }
    sendBtn.disabled = false;
    sendLabel.textContent = 'Send a message';
    openChat(`${message}\n\n${name} · ${phone}`);
  });
  // Every other "Chat on WhatsApp" link on the page opens the same way.
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href*="api.whatsapp.com/send"]');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    openChat(new URL(a.href).searchParams.get('text') || '');
  });
})();
