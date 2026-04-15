// ── Language switcher ──
const btnCz = document.getElementById('lang-cz');
const btnEn = document.getElementById('lang-en');

let currentLang  = localStorage.getItem('lang') || 'cz';
let currentIndex = 0;

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  btnCz.classList.toggle('active', lang === 'cz');
  btnEn.classList.toggle('active', lang === 'en');
  document.querySelectorAll('[data-cz]').forEach(el => {
    el.textContent = lang === 'cz' ? el.dataset.cz : el.dataset.en;
  });
  if (typeof milniky !== 'undefined' && document.getElementById('milestone-section')) {
    zobrazMilnik(currentIndex, currentLang);
  }
}

setLang(currentLang);

btnCz.addEventListener('click', () => setLang('cz'));
btnEn.addEventListener('click', () => setLang('en'));

// ── Menu overlay ──
const menuBtn     = document.getElementById('menu-btn');
const menuOverlay = document.getElementById('menu-overlay');

function openMenu() {
  menuOverlay.classList.add('open');
  menuOverlay.setAttribute('aria-hidden', 'false');
  menuBtn.classList.add('open');
  menuBtn.setAttribute('aria-expanded', 'true');
  startFocusTrap();
}

function closeMenu() {
  menuOverlay.classList.remove('open');
  menuOverlay.setAttribute('aria-hidden', 'true');
  menuBtn.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.focus();
  stopFocusTrap();
}

menuBtn.addEventListener('click', () => {
  menuOverlay.classList.contains('open') ? closeMenu() : openMenu();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuOverlay.classList.contains('open')) closeMenu();
});

document.addEventListener('click', e => {
  if (
    menuOverlay.classList.contains('open') &&
    !menuOverlay.contains(e.target) &&
    !menuBtn.contains(e.target) &&
    !btnCz.contains(e.target) &&
    !btnEn.contains(e.target)
  ) closeMenu();
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
  const focusable = getFocusable();
  if (focusable[0]) focusable[0].focus();
}

function stopFocusTrap() {
  menuOverlay.removeEventListener('keydown', handleTrapKeydown);
}

// ── Milestone ──
function zobrazMilnik(index, jazyk) {
  const milnik = milniky[jazyk][index];
  const audioFolder = jazyk === 'cz' ? 'cz' : 'aj';

  document.getElementById('milestone-img').src = 'assets/grafiky/' + encodeURIComponent(milnik.grafika);
  document.getElementById('milestone-img').alt  = milnik.nadpis;
  document.getElementById('milestone-rok').textContent  = milnik.rok;
  document.getElementById('milestone-nadpis').innerHTML = milnik.nadpis;
  document.getElementById('milestone-text').innerHTML   = milnik.text;

  const player = document.getElementById('audio-player');
  const btn    = document.getElementById('audio-btn');
  player.pause();
  player.src = 'assets/audio/' + audioFolder + '/' + encodeURIComponent(milnik.audio);
  player.currentTime = 0;
  btn.innerHTML = '<img src="assets/Sound.svg" alt="Přehrát audio" style="height: 1.5rem; width: auto;">';
}

// Init na home stránce
if (typeof milniky !== 'undefined' && document.getElementById('milestone-section')) {
  currentIndex = Math.floor(Math.random() * milniky[currentLang].length);
  zobrazMilnik(currentIndex, currentLang);

  const audioPlayer = document.getElementById('audio-player');
  const audioBtn    = document.getElementById('audio-btn');

  audioBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
      audioBtn.textContent = '⏸';
    } else {
      audioPlayer.pause();
      audioBtn.innerHTML = '<img src="assets/Sound.svg" alt="Přehrát audio" style="height: 1.5rem; width: auto;">';
    }
  });

  audioPlayer.addEventListener('ended', () => {
    audioBtn.innerHTML = '<img src="assets/Sound.svg" alt="Přehrát audio" style="height: 1.5rem; width: auto;">';
  });
}
