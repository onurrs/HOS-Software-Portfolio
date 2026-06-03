/* ============================================================
 *  app.js  –  Main application logic
 *  Depends on: translations.js  (defines currentLang, t())
 * ============================================================ */

'use strict';

let _typedInstance = null;

/* ==================== i18n ==================== */

function applyTranslations() {
  /* Text nodes */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = t(el.dataset.i18n);
    if (val == null) return;
    el.textContent = val;
  });

  /* Placeholder attributes */
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const val = t(el.dataset.i18nPh);
    if (val != null) el.placeholder = val;
  });

  /* html[lang] */
  document.documentElement.lang = currentLang;

  /* Lang toggle label shows the OTHER language */
  const lbl = document.getElementById('lang-label');
  if (lbl) lbl.textContent = currentLang === 'en' ? 'TR' : 'EN';

  /* Re-init Typed with new strings */
  initTyped();
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('portfolio-lang', lang);
  applyTranslations();
}

/* ==================== TYPED.JS ==================== */

function initTyped() {
  if (_typedInstance) {
    _typedInstance.destroy();
    _typedInstance = null;
  }

  const el = document.getElementById('typed-text');
  if (!el) return;

  const strings = t('hero_typed');
  if (!Array.isArray(strings) || strings.length === 0) return;

  _typedInstance = new Typed('#typed-text', {
    strings,
    typeSpeed:   55,
    backSpeed:   35,
    backDelay:   2200,
    startDelay:  600,
    loop:        true,
    smartBackspace: true,
    cursorChar:  '_',
  });
}

/* ==================== NAVBAR ==================== */

function initNavbar() {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ==================== ACTIVE NAV LINKS ==================== */

function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    });
  }, { rootMargin: '-38% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));
}

/* ==================== MOBILE MENU ==================== */

function initMobileMenu() {
  const btn  = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  function closeMenu() {
    menu.classList.add('hidden');
    btn.classList.remove('open');
  }

  btn.addEventListener('click', () => {
    const opening = menu.classList.contains('hidden');
    menu.classList.toggle('hidden', !opening);
    btn.classList.toggle('open', opening);
  });

  menu.querySelectorAll('.mobile-nav-link').forEach(a =>
    a.addEventListener('click', closeMenu)
  );

  /* Close when clicking outside */
  document.addEventListener('click', e => {
    if (!menu.classList.contains('hidden') &&
        !menu.contains(e.target) &&
        !btn.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ==================== LANGUAGE TOGGLE ==================== */

function initLangToggle() {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;

  btn.addEventListener('click', () =>
    setLanguage(currentLang === 'en' ? 'tr' : 'en')
  );
}

/* ==================== BACK TO TOP ==================== */

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () =>
    btn.classList.toggle('visible', window.scrollY > 400)
  , { passive: true });

  btn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
}

/* ==================== CURRENT YEAR ==================== */

function setCurrentYear() {
  const el = document.getElementById('current-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ==================== AOS ==================== */

function initAOS() {
  AOS.init({
    duration: 650,
    easing:   'ease-out-cubic',
    once:     true,
    offset:   70,
  });
}

/* ==================== SMOOTH SCROLL (ANCHORS) ==================== */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ==================== BOOT ==================== */

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();   // apply saved language first
  initTyped();
  initNavbar();
  initActiveNavLinks();
  initMobileMenu();
  initLangToggle();
  initBackToTop();
  setCurrentYear();
  initAOS();
  initSmoothScroll();
});
