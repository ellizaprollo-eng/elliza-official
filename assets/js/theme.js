/* Theme switch (2026-11-12). Light is the default (owner: show light first, dark is the option); a dark choice is remembered
   in localStorage ("elliza-mode"). A tiny script in each page's <head> applies it before the page paints, so there is no flash. */
(() => {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const sync = () => {
    const light = root.getAttribute('data-theme') === 'light';
    btn.setAttribute('aria-pressed', String(light));
    btn.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
    btn.title = light ? 'Dark mode' : 'Light mode';
    if (meta) meta.setAttribute('content', light ? '#f6efe7' : '#0b0908');
  };
  btn.addEventListener('click', () => {
    const light = root.getAttribute('data-theme') !== 'light';
    if (light) root.setAttribute('data-theme', 'light'); else root.removeAttribute('data-theme');
    try { localStorage.setItem('elliza-mode', light ? 'light' : 'dark'); } catch (e) { /* private mode: still switches */ }
    sync();
  });
  sync();
})();
