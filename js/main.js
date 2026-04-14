// ── Language switcher ──
const btnCz = document.getElementById('lang-cz');
const btnEn = document.getElementById('lang-en');

function setLang(lang) {
  localStorage.setItem('lang', lang);
  btnCz.classList.toggle('active', lang === 'cz');
  btnEn.classList.toggle('active', lang === 'en');
  document.querySelectorAll('[data-cz]').forEach(el => {
    el.textContent = lang === 'cz' ? el.dataset.cz : el.dataset.en;
  });
}

setLang(localStorage.getItem('lang') || 'cz');

btnCz.addEventListener('click', () => setLang('cz'));
btnEn.addEventListener('click', () => setLang('en'));

// ── Menu overlay ──
const menuBtn     = document.getElementById('menu-btn');
const menuOverlay = document.getElementById('menu-overlay');
const menuClose   = document.getElementById('menu-close');

function openMenu() {
  menuOverlay.classList.add('open');
  menuOverlay.setAttribute('aria-hidden', 'false');
  menuBtn.setAttribute('aria-expanded', 'true');
  menuClose.focus();
  startFocusTrap();
}

function closeMenu() {
  menuOverlay.classList.remove('open');
  menuOverlay.setAttribute('aria-hidden', 'true');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.focus();
  stopFocusTrap();
}

menuBtn.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);

// Zavření přes Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuOverlay.classList.contains('open')) closeMenu();
});

// Zavření kliknutím na pozadí (ne na obsah)
menuOverlay.addEventListener('click', e => {
  if (e.target === menuOverlay) closeMenu();
});

// ── Focus trap ──
function getFocusable() {
  return Array.from(
    menuOverlay.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
  ).filter(el => !el.disabled);
}

function handleTrapKeydown(e) {
  if (e.key !== 'Tab') return;
  const focusable = getFocusable();
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
  } else {
    if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
  }
}

function startFocusTrap() {
  menuOverlay.addEventListener('keydown', handleTrapKeydown);
}

function stopFocusTrap() {
  menuOverlay.removeEventListener('keydown', handleTrapKeydown);
}
