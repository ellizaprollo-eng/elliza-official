/* View-only samples (owner's request, 2026-10-03).
   A browser always receives what it shows, so these are deterrents: they stop right-click saving,
   copying, dragging, printing, the usual save/source/devtools shortcuts and video downloads, and
   they blur the samples while the page is out of focus (screenshot tools) or devtools is open. */
(() => {
  const root = document.documentElement;
  const editable = (el) => el && el.closest && el.closest('input, textarea, select, [contenteditable="true"]');
  const stop = (e) => { if (!editable(e.target)) e.preventDefault(); };

  // Right-click menu, copy, cut and text selection
  ['contextmenu', 'copy', 'cut', 'selectstart'].forEach((t) => document.addEventListener(t, stop, true));
  // Dragging images, videos and links out of the page
  document.addEventListener('dragstart', (e) => {
    if (e.target.closest && e.target.closest('img, video, picture, svg, a, [data-protect]')) e.preventDefault();
  }, true);

  // Keyboard shortcuts: save, print, view source, select all, developer tools
  document.addEventListener('keydown', (e) => {
    const k = (e.key || '').toLowerCase();
    const mod = e.ctrlKey || e.metaKey;
    const devtools = e.key === 'F12' || (mod && (e.shiftKey || e.altKey) && ['i', 'j', 'c', 'k', 'e', 'm', 'u'].includes(k));
    const saveEtc = mod && !e.shiftKey && !e.altKey && ['s', 'u', 'p'].includes(k);
    const selectAll = mod && k === 'a' && !editable(e.target);
    if (devtools || saveEtc || selectAll) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  // Blur the samples while the page is not the active window (screenshot and snipping tools take focus)
  const shield = (on) => root.classList.toggle('wp-shield', on || root.classList.contains('wp-devtools'));
  window.addEventListener('blur', () => {
    // Clicking into an embedded player or booking widget also blurs the window: ignore that case
    setTimeout(() => { const a = document.activeElement; if (!(a && a.tagName === 'IFRAME')) shield(true); }, 0);
  });
  window.addEventListener('focus', () => shield(false));
  document.addEventListener('visibilitychange', () => shield(document.hidden));
  // Print Screen: clear what was just copied and hide the samples for a moment
  document.addEventListener('keyup', (e) => {
    if (e.key !== 'PrintScreen') return;
    shield(true);
    try { navigator.clipboard && navigator.clipboard.writeText(''); } catch (err) { /* not allowed here */ }
    setTimeout(() => shield(false), 2000);
  });

  // Developer tools: the debugger statement only pauses when they are open
  setInterval(() => {
    const t = performance.now();
    // eslint-disable-next-line no-debugger
    debugger;
    if (performance.now() - t > 150) { root.classList.add('wp-devtools'); shield(true); }
  }, 1500);

  // Videos: no download button, picture-in-picture or casting; images not draggable
  const lock = (el) => {
    if (el.tagName === 'VIDEO') {
      el.setAttribute('controlslist', 'nodownload noplaybackrate noremoteplayback');
      el.setAttribute('disablepictureinpicture', '');
      el.disablePictureInPicture = true;
      el.disableRemotePlayback = true;
    } else if (el.tagName === 'IMG') {
      el.setAttribute('draggable', 'false');
    }
  };
  const scan = (n) => {
    if (n.nodeType !== 1) return;
    if (n.tagName === 'VIDEO' || n.tagName === 'IMG') lock(n);
    if (n.querySelectorAll) n.querySelectorAll('video, img').forEach(lock);
  };
  scan(document.body);
  new MutationObserver((list) => list.forEach((m) => m.addedNodes.forEach(scan))).observe(document.body, { childList: true, subtree: true });
})();
