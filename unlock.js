(() => {
  const q = new URLSearchParams(location.search);
  const next = q.get('next') || '';
  const safe = /^\/(assets|projects|case-study|certifications|testimonials)\/[A-Za-z0-9/_.-]+$/.test(next) && next.indexOf('..') < 0;
  const field = document.querySelector('[data-next]');
  if (field) field.value = safe ? next : '/';
  if (q.get('wrong')) { const e = document.querySelector('[data-error]'); if (e) e.hidden = false; }
})();
