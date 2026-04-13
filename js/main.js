// ── Language switcher ──
const btnCz = document.getElementById('lang-cz');
const btnEn = document.getElementById('lang-en');

function setLang(lang) {
  localStorage.setItem('lang', lang);
  btnCz.classList.toggle('active', lang === 'cz');
  btnEn.classList.toggle('active', lang === 'en');
}

// Restore saved preference, default to 'cz'
setLang(localStorage.getItem('lang') || 'cz');

btnCz.addEventListener('click', () => setLang('cz'));
btnEn.addEventListener('click', () => setLang('en'));

// ── Hamburger menu ──
const menuBtn = document.getElementById('menu-btn');
const menuOverlay = document.getElementById('menu-overlay');

menuBtn.addEventListener('click', () => {
  const isOpen = menuOverlay.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', isOpen);
});
