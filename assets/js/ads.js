/* Paid ads results (2026-11-12): a card's screenshot button opens that card's proof screenshots in #adrDialog. */
(() => {
  const dlg = document.getElementById('adrDialog');
  if (!dlg || !dlg.showModal) return;
  const title = document.getElementById('adrDialogTitle');
  const body = dlg.querySelector('.adr-dlg-body');
  let opener = null;
  document.querySelectorAll('.adr-shot').forEach((btn) => btn.addEventListener('click', () => {
    dlg.querySelectorAll('.adr-proof').forEach((p) => { p.hidden = p.dataset.card !== btn.dataset.card; });
    title.textContent = btn.dataset.title;
    opener = btn;
    dlg.showModal();
    body.scrollTop = 0;
  }));
  dlg.querySelector('.adr-dlg-x').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { if (opener) opener.focus(); });
})();
