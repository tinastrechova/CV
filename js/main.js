// ── Language switcher ──
const btnToggle = document.getElementById('lang-toggle');

let currentLang  = localStorage.getItem('lang') || 'cz';
let currentIndex = 0;

function setLang(lang) {
  document.documentElement.lang = lang === 'cz' ? 'cs' : 'en';
  currentLang = lang;
  localStorage.setItem('lang', lang);
  btnToggle.textContent = lang === 'cz' ? 'CZ' : 'EN';
  document.querySelectorAll('[data-cz]').forEach(el => {
    el.innerHTML = lang === 'cz' ? el.dataset.cz : el.dataset.en;
  });
  if (typeof milniky !== 'undefined' && document.getElementById('milestone-section')) {
    zobrazMilnik(currentIndex, currentLang);
  }
  if (window.location.pathname.includes('contacts.html')) {
    document.title = lang === 'cz'
      ? 'Kontakty — MarTina Střechová'
      : 'Contacts — MarTina Střechová';
  }
}

setLang(currentLang);

btnToggle.addEventListener('click', () => setLang(currentLang === 'cz' ? 'en' : 'cz'));

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

  const img = document.getElementById('milestone-img');
  const grafika = milnik.grafika.normalize('NFC');
  const dotIdx = grafika.lastIndexOf('.');
  const encodedBase = 'assets/grafiky/' + encodeURIComponent(dotIdx !== -1 ? grafika.slice(0, dotIdx) : grafika);
  const origExt = dotIdx !== -1 ? grafika.slice(dotIdx) : '';
  const tryExts = [origExt, '.png', '.jpg'].filter((v, i, a) => v && a.indexOf(v) === i);
  let extIdx = 0;
  img.onerror = function() {
    extIdx++;
    if (extIdx < tryExts.length) this.src = encodedBase + tryExts[extIdx];
    else this.onerror = null;
  };
  img.src = encodedBase + tryExts[0];
  img.alt = milnik.nadpis;
  document.getElementById('milestone-rok').textContent  = milnik.rok;
  document.getElementById('milestone-nadpis').innerHTML = milnik.nadpis;
  document.getElementById('milestone-text').innerHTML   = milnik.text;
  const head = document.getElementById('timeline-head');
  if (head) head.setAttribute('aria-valuenow', index);

  const player = document.getElementById('audio-player');
  const btn    = document.getElementById('audio-btn');
  player.pause();
  player.src = 'assets/audio/' + audioFolder + '/' + encodeURIComponent(milnik.audio.normalize('NFC'));
  player.currentTime = 0;
  btn.innerHTML = '<img src="assets/Sound.svg" alt="Přehrát audio" style="height: 1.5rem; width: auto;">';
}

// Init na home stránce
if (typeof milniky !== 'undefined' && document.getElementById('milestone-section')) {
  currentIndex = Math.floor(Math.random() * milniky[currentLang].length);
  zobrazMilnik(currentIndex, currentLang);

  const audioPlayer = document.getElementById('audio-player');
  const audioBtn    = document.getElementById('audio-btn');

  audioBtn.setAttribute('aria-label', 'Přehrát audio');

  audioBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
      audioBtn.textContent = '⏸';
      audioBtn.setAttribute('aria-label', 'Pozastavit audio');
    } else {
      audioPlayer.pause();
      audioBtn.innerHTML = '<img src="assets/Sound.svg" alt="Přehrát audio" style="height: 1.5rem; width: auto;">';
      audioBtn.setAttribute('aria-label', 'Přehrát audio');
    }
  });

  audioPlayer.addEventListener('ended', () => {
    audioBtn.innerHTML = '<img src="assets/Sound.svg" alt="Přehrát audio" style="height: 1.5rem; width: auto;">';
    audioBtn.setAttribute('aria-label', 'Přehrát audio');
  });

  // ── Timeline ──
  const timelineTrack = document.getElementById('timeline-track');
  const timelineHead  = document.getElementById('timeline-head');

  function updateHeadPosition(index) {
    timelineHead.style.left = (8 + index / 18 * 76) + '%';
    timelineHead.src = index % 2 !== 0 ? 'assets/hlava_1.png' : 'assets/hlava_2.png';
  }

  function setMilnikDirect(index) {
    index = Math.max(0, Math.min(18, index));
    if (index === currentIndex) return;
    currentIndex = index;
    zobrazMilnik(currentIndex, currentLang);
    updateHeadPosition(currentIndex);
  }

  function setMilnikFade(index) {
    index = Math.max(0, Math.min(18, index));
    if (index === currentIndex) return;
    const milImg     = document.getElementById('milestone-image');
    const milContent = document.getElementById('milestone-content');
    milImg.style.opacity     = '0';
    milContent.style.opacity = '0';
    setTimeout(() => {
      currentIndex = index;
      zobrazMilnik(currentIndex, currentLang);
      updateHeadPosition(currentIndex);
      milImg.style.opacity     = '1';
      milContent.style.opacity = '1';
    }, 300);
  }

  function indexFromX(clientX) {
    const rect = timelineTrack.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return Math.round((x / rect.width - 0.08) / 0.76 * 18);
  }

  timelineTrack.addEventListener('click', e => {
    setMilnikFade(indexFromX(e.clientX));
  });

  timelineHead.addEventListener('mousedown', e => {
    e.preventDefault();
    const onMove = e => setMilnikDirect(indexFromX(e.clientX));
    const onUp   = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  timelineHead.addEventListener('touchstart', e => {
    e.preventDefault();
    const onMove = e => setMilnikDirect(indexFromX(e.touches[0].clientX));
    const onEnd  = () => {
      timelineHead.removeEventListener('touchmove', onMove);
      timelineHead.removeEventListener('touchend', onEnd);
    };
    timelineHead.addEventListener('touchmove', onMove, { passive: false });
    timelineHead.addEventListener('touchend', onEnd);
  }, { passive: false });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') setMilnikFade(currentIndex + 1);
    if (e.key === 'ArrowLeft')  setMilnikFade(currentIndex - 1);
  });

  updateHeadPosition(currentIndex);
}

// ── CV accordion ──
if (typeof cvData !== 'undefined' && document.getElementById('cv')) {
  const cvMain = document.getElementById('cv');

  function renderCV(lang) {
    cvMain.innerHTML = '';
    cvData[lang].kategorie1.forEach((sekce, sIdx) => {
      const section = document.createElement('section');
      section.className = 'cv-sekce';

      const isOpen = sIdx === 0;

      // Section header
      const sectionHeader = document.createElement('div');
      sectionHeader.className = 'cv-section-header' + (isOpen ? ' open' : '');
      sectionHeader.setAttribute('role', 'button');
      sectionHeader.setAttribute('tabindex', '0');
      sectionHeader.setAttribute('aria-expanded', String(isOpen));

      const h2 = document.createElement('h2');
      h2.className = 'cv-sekce-nadpis';
      h2.style.display = 'flex';
      h2.style.justifyContent = 'space-between';
      h2.style.alignItems = 'flex-end';

      const sectionArrow = document.createElement('span');
      sectionArrow.className = 'cv-section-arrow';
      const textSpan = document.createElement('span');
      textSpan.textContent = sekce.sekce;
      const leftPart = document.createElement('span');
      leftPart.style.display = 'flex';
      leftPart.style.alignItems = 'flex-end';
      leftPart.style.gap = '4px';
      leftPart.appendChild(sectionArrow);
      leftPart.appendChild(textSpan);

      const starsImg = document.createElement('img');
      starsImg.src = 'assets/stars.png';
      starsImg.alt = '';
      starsImg.className = 'cv-sekce-hvezda';
      h2.appendChild(leftPart);
      h2.appendChild(starsImg);

      sectionHeader.appendChild(h2);
      section.appendChild(sectionHeader);

      // Section body
      const sectionBody = document.createElement('div');
      sectionBody.className = 'cv-section-body' + (isOpen ? ' open' : '');

      const ul = document.createElement('ul');
      ul.className = 'cv-accordion';

      sekce.polozky.slice().reverse().forEach((polozka, i) => {
        const li = document.createElement('li');
        li.className = 'cv-item';
        const bodyId = 'cv-body-' + i + '-' + sekce.sekce.replace(/\s/g, '-');

        const trigger = document.createElement('div');
        trigger.className = 'cv-item-trigger';
        trigger.setAttribute('role', 'button');
        trigger.setAttribute('tabindex', '0');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-controls', bodyId);

        const rok = document.createElement('span');
        rok.className = 'cv-rok';
        rok.textContent = polozka.rok;

        const nazev = document.createElement('span');
        nazev.className = 'cv-nazev';
        if (polozka.odkaz) {
          const a = document.createElement('a');
          a.href = polozka.odkaz;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.innerHTML = polozka.nazev;
          nazev.appendChild(a);
        } else {
          nazev.innerHTML = polozka.nazev;
        }

        const spec = document.createElement('span');
        spec.className = 'cv-spec';
        spec.textContent = polozka.specifikace;

        const arrow = document.createElement('span');
        arrow.className = 'cv-arrow';

        const arrowNazev = document.createElement('div');
        arrowNazev.className = 'cv-arrow-nazev';
        arrowNazev.appendChild(arrow);
        arrowNazev.appendChild(nazev);

        trigger.appendChild(rok);
        trigger.appendChild(arrowNazev);
        trigger.appendChild(spec);

        const body = document.createElement('div');
        body.className = 'cv-item-body';
        body.id = bodyId;
        const p = document.createElement('p');
        p.textContent = polozka.text;
        body.appendChild(p);

        function toggleItem(e) {
          if (e.target.tagName === 'A') return;
          const isOpen = li.classList.contains('open');
          li.classList.toggle('open', !isOpen);
          trigger.setAttribute('aria-expanded', String(!isOpen));
        }

        trigger.addEventListener('click', toggleItem);
        trigger.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleItem(e);
          }
        });

        li.appendChild(trigger);
        li.appendChild(body);
        ul.appendChild(li);
      });

      sectionBody.appendChild(ul);
      section.appendChild(sectionBody);
      cvMain.appendChild(section);

      function toggleSection() {
        const open = sectionBody.classList.contains('open');
        sectionBody.classList.toggle('open', !open);
        sectionHeader.classList.toggle('open', !open);
        sectionHeader.setAttribute('aria-expanded', String(!open));
      }

      sectionHeader.addEventListener('click', toggleSection);
      sectionHeader.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleSection();
        }
      });
    });
  }

  function cv2Section(title) {
    const sec = document.createElement('section');
    sec.className = 'cv2-section';
    const h2 = document.createElement('h2');
    h2.className = 'cv-sekce-nadpis';
    h2.style.display = 'flex';
    h2.style.justifyContent = 'space-between';
    h2.style.alignItems = 'flex-end';
    const titleSpan = document.createElement('span');
    titleSpan.textContent = title;
    const img = document.createElement('img');
    img.src = 'assets/stars.png';
    img.alt = '';
    img.className = 'cv-sekce-hvezda';
    h2.appendChild(titleSpan);
    h2.appendChild(img);
    sec.appendChild(h2);
    return sec;
  }

  function cv2CollapsibleSection(title) {
    const sec = document.createElement('section');
    sec.className = 'cv2-section';

    const header = document.createElement('div');
    header.className = 'cv-section-header';
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.setAttribute('aria-expanded', 'false');

    const h2 = document.createElement('h2');
    h2.className = 'cv-sekce-nadpis';
    h2.style.display = 'flex';
    h2.style.justifyContent = 'space-between';
    h2.style.alignItems = 'flex-end';

    const arrow = document.createElement('span');
    arrow.className = 'cv-section-arrow';
    const titleSpan2 = document.createElement('span');
    titleSpan2.textContent = title;
    const leftPart2 = document.createElement('span');
    leftPart2.style.display = 'flex';
    leftPart2.style.alignItems = 'flex-end';
    leftPart2.style.gap = '4px';
    leftPart2.appendChild(arrow);
    leftPart2.appendChild(titleSpan2);

    const img = document.createElement('img');
    img.src = 'assets/stars.png';
    img.alt = '';
    img.className = 'cv-sekce-hvezda';
    h2.appendChild(leftPart2);
    h2.appendChild(img);

    header.appendChild(h2);
    sec.appendChild(header);

    const body = document.createElement('div');
    body.className = 'cv-section-body';
    sec.appendChild(body);

    function toggle() {
      const open = body.classList.contains('open');
      body.classList.toggle('open', !open);
      header.classList.toggle('open', !open);
      header.setAttribute('aria-expanded', String(!open));
    }
    header.addEventListener('click', toggle);
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });

    return { sec, body };
  }

  function renderCV2(lang) {
    const existing = cvMain.querySelector('.cv2-wrapper');
    if (existing) existing.remove();

    const k2 = cvData[lang].kategorie2;
    const wrapper = document.createElement('div');
    wrapper.className = 'cv2-wrapper';

    // Jazyky + Nástroje side by side
    const rowTop = document.createElement('div');
    rowTop.className = 'cv2-row';

    const secJazyky = cv2Section(k2.nadpisy.jazyky);
    const ulJazyky = document.createElement('ul');
    ulJazyky.className = 'cv2-list cv2-list--two-col';
    k2.jazyky.forEach(j => {
      const li = document.createElement('li');
      li.className = 'cv2-item';
      li.innerHTML = '<span class="cv2-label">' + j.jazyk + '</span><span class="cv2-level">' + j.uroven + '</span>';
      ulJazyky.appendChild(li);
    });
    secJazyky.appendChild(ulJazyky);

    const secNastroje = cv2Section(k2.nadpisy.nastroje);
    const ulNastroje = document.createElement('ul');
    ulNastroje.className = 'cv2-list cv2-list--two-col';
    k2.nastroje.forEach(n => {
      const li = document.createElement('li');
      li.className = 'cv2-item';
      li.innerHTML = '<span class="cv2-label">' + n.nazev + '</span><span class="cv2-level">' + n.uroven + '</span>';
      ulNastroje.appendChild(li);
    });
    secNastroje.appendChild(ulNastroje);

    rowTop.appendChild(secJazyky);
    rowTop.appendChild(secNastroje);
    wrapper.appendChild(rowTop);

    // Kompetence
    const secKomp = cv2Section(k2.nadpisy.kompetence);
    const tagsWrap = document.createElement('div');
    tagsWrap.className = 'cv2-tags';
    k2.kompetence.forEach(k => {
      const tag = document.createElement('span');
      tag.className = 'cv2-tag';
      tag.textContent = k;
      tagsWrap.appendChild(tag);
    });
    secKomp.appendChild(tagsWrap);
    wrapper.appendChild(secKomp);

    // Reference (collapsible)
    const { sec: secRef, body: bodyRef } = cv2CollapsibleSection(k2.nadpisy.reference);
    const ulRef = document.createElement('ul');
    ulRef.className = 'cv2-list';
    k2.reference.forEach(r => {
      const li = document.createElement('li');
      li.className = 'cv2-item cv2-item--ref';
      const nameSpan = document.createElement('span');
      nameSpan.className = 'cv2-label';
      nameSpan.textContent = r.jmeno;
      const desc = document.createElement('span');
      desc.className = 'cv2-ref-popis';
      desc.textContent = r.popis;
      const a = document.createElement('a');
      a.href = 'mailto:' + r.email;
      a.className = 'cv2-email';
      a.textContent = r.email;
      li.appendChild(nameSpan);
      li.appendChild(desc);
      li.appendChild(a);
      ulRef.appendChild(li);
    });
    bodyRef.appendChild(ulRef);
    wrapper.appendChild(secRef);

    // Publikace (collapsible)
    const { sec: secPub, body: bodyPub } = cv2CollapsibleSection(k2.nadpisy.publikace);
    const ulPub = document.createElement('ul');
    ulPub.className = 'cv2-list';
    k2.publikace.forEach(p => {
      const li = document.createElement('li');
      li.className = 'cv2-item cv2-item--pub';
      const a = document.createElement('a');
      a.href = p.odkaz;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'cv2-pub-title';
      a.textContent = p.nazev;
      const source = document.createElement('span');
      source.className = 'cv2-pub-source';
      source.textContent = p.zdroj;
      li.appendChild(a);
      li.appendChild(source);
      ulPub.appendChild(li);
    });
    bodyPub.appendChild(ulPub);
    wrapper.appendChild(secPub);

    cvMain.appendChild(wrapper);
  }

  renderCV(currentLang);
  renderCV2(currentLang);

  const origSetLang = setLang;
  setLang = function(lang) {
    origSetLang(lang);
    renderCV(lang);
    renderCV2(lang);
  };
}
