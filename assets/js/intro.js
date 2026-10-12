/* "Start here" intro film (2026-10-13), the same idea as the popup on wovie-certified.
   The film is built in Downloads/elliza-process-video (HyperFrames).

   It opens on every page load, once the loader is done. Browsers do not let a page start sound before
   the visitor's first click, tap or key press, so it first tries to play with sound; when the browser
   says no, it plays muted and the first click, tap or key press inside the popup turns the sound on
   (and starts the film over if it is more than 2 s in). "Watch how I work" ([data-intro]) always plays
   with sound. With reduced motion the popup opens without playing. */
(() => {
  const dlg = document.getElementById('introDialog');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  const vid = dlg.querySelector('video');
  const panel = dlg.querySelector('.intro-in');
  let opener = null;
  let armed = false;

  // showModal() would focus the first button and show its focus ring; the panel takes focus instead.
  function show() {
    if (!dlg.open) dlg.showModal();
    panel.focus({ preventScroll: true });
  }
  function close() {
    vid.pause();
    if (dlg.open) dlg.close();
  }

  // Runs after the browser's own handling of the click, so a click on the video's mute button is not
  // undone, and a click on the picture (which the browser treats as pause) keeps it playing.
  function soundOnFirstTouch(e) {
    if (!dlg.open || !vid.muted) return;
    const t = e.target;
    if (t === dlg || (t.closest && t.closest('.intro-skip, .intro-x'))) return;
    if (e.type === 'keydown' && e.key === 'Escape') return;
    setTimeout(() => {
      if (!dlg.open || !vid.muted) return disarm();
      vid.muted = false;
      if (vid.currentTime > 2) vid.currentTime = 0;
      if (vid.paused && !vid.ended) vid.play().catch(() => {});
      disarm();
    }, 0);
  }
  function arm() {
    if (armed) return;
    armed = true;
    dlg.addEventListener('click', soundOnFirstTouch);
    dlg.addEventListener('keydown', soundOnFirstTouch);
  }
  function disarm() {
    armed = false;
    dlg.removeEventListener('click', soundOnFirstTouch);
    dlg.removeEventListener('keydown', soundOnFirstTouch);
  }

  async function open(restart) {
    show();
    if (restart) vid.currentTime = 0;
    vid.muted = false;
    try {
      await vid.play();
      return;
    } catch (err) {
      // The browser refused sound before any click: play muted for now.
    }
    vid.muted = true;
    arm();
    try {
      await vid.play();
    } catch (err) {
      // Autoplay refused entirely (some phones in low-power mode): the poster and play button stay up.
    }
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-intro]');
    if (!b) return;
    e.preventDefault();
    opener = b;
    open(true);
  });
  dlg.querySelectorAll('.intro-skip, .intro-x').forEach((b) => b.addEventListener('click', close));
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  dlg.addEventListener('close', () => {
    vid.pause();
    disarm();
    if (opener) opener.focus({ preventScroll: true });
    opener = null;
  });
  vid.addEventListener('ended', close);

  // Every load: the film comes first, right after the loader.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  vid.preload = 'auto';
  let started = false;
  function start() {
    if (started) return;
    started = true;
    setTimeout(() => {
      if (reduce) {
        show();
        arm();
      } else open(false);
    }, 400);
  }
  if (document.body.classList.contains('is-ready')) start();
  else {
    const mo = new MutationObserver(() => {
      if (!document.body.classList.contains('is-ready')) return;
      mo.disconnect();
      start();
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    setTimeout(start, 6000); // the loader normally finishes in about 3 s
  }
})();
