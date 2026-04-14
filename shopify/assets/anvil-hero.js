/**
 * ANVIL — Shopify Hero Animation
 * File: assets/anvil-hero.js
 *
 * Called as anvilHeroInit() once GSAP is confirmed loaded.
 * GSAP is loaded at end of <body> in theme.liquid.
 */

function anvilHeroInit() {
  'use strict';

  /* ─── GSAP guard ──────────────────────────────────────── */
  if (typeof gsap === 'undefined') {
    console.warn('[ANVIL] GSAP not loaded — animation skipped. Upload gsap.min.js to Shopify assets.');
    return;
  }

  /* ─── DOM refs ────────────────────────────────────────── */
  var container     = document.getElementById('anvil-container');
  var wakaEls       = document.querySelectorAll('.anvil-waka');
  var gridWrapper   = document.querySelector('.anvil-grid__animation-wrapper');
  var stripeBg      = document.getElementById('anvil-stripe-bg');
  var scrollWrapper = document.getElementById('anvil-scroll-wrapper');
  var nav           = document.getElementById('anvil-nav');
  var heroFrame     = document.getElementById('anvil-hero-frame');
  var borderL       = document.getElementById('anvil-border-left');
  var borderR       = document.getElementById('anvil-border-right');
  var sidebar       = document.getElementById('anvil-sidebar-text');
  var marquee       = document.getElementById('anvil-marquee');
  var replayBtn     = document.getElementById('anvil-replay-btn');
  var cursor        = document.getElementById('anvil-cursor');

  if (!container || !gridWrapper) {
    console.warn('[ANVIL] Hero elements not found — skipping.');
    return;
  }

  /* ─── Scale calculation ───────────────────────────────── */
  function getInitialScale() {
    return window.innerHeight / container.getBoundingClientRect().height;
  }

  /* ─── Animation ───────────────────────────────────────── */
  function runAnimation() {
    var scale = getInitialScale();

    gsap.set(container, { scale: scale, transformOrigin: 'top center' });
    gsap.set(gridWrapper, { clipPath: 'inset(0 0 100% 0)' });
    if (stripeBg) gsap.set(stripeBg, { clipPath: 'inset(0 0 100% 0)' });
    gsap.set(wakaEls, { opacity: 0 });

    var tl = gsap.timeline({ delay: 0.4, onComplete: onComplete });

    /* Phase 1 — headings fade in */
    tl.to(wakaEls, { opacity: 1, duration: 0.55, ease: 'power2.out' });

    /* Phase 2 — grid unfurls; stripe background paints in simultaneously */
    tl.to(gridWrapper, { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power3.out' }, '+=0.25');
    if (stripeBg) tl.to(stripeBg, { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power3.out' }, '<');

    /* Phase 3 — zoom in */
    tl.to(container, { scale: 1, duration: 1.9, ease: 'power3.inOut' }, '+=0.45');
  }

  /* ─── Post-animation ──────────────────────────────────── */
  function onComplete() {
    scrollWrapper.style.height   = 'auto';
    scrollWrapper.style.overflow = 'visible';
    nav.classList.add('is-visible');
    heroFrame.classList.add('is-revealed');
    replayBtn.classList.add('is-visible');
    sidebarActive = true;
    updateSidebar();
    sidebar.classList.add('is-revealed');
  }

  /* ─── Replay ──────────────────────────────────────────── */
  function replay() {
    scrollWrapper.style.height   = '100vh';
    scrollWrapper.style.overflow = 'hidden';
    nav.classList.remove('is-visible');
    nav.classList.remove('is-scrolled');
    heroFrame.classList.remove('is-revealed');
    replayBtn.classList.remove('is-visible');
    sidebarActive = false;
    sidebar.classList.remove('is-revealed');
    sidebar.style.top     = '';
    sidebar.style.opacity = '';
    runAnimation();
  }

  if (replayBtn) replayBtn.addEventListener('click', replay);

  /* ─── Scroll ──────────────────────────────────────────── */
  window.addEventListener('scroll', function () {
    if (!scrollWrapper) return;
    var rect  = scrollWrapper.getBoundingClientRect();
    var below = rect.bottom <= 0;

    heroFrame.style.opacity       = below ? '0' : '';
    heroFrame.style.pointerEvents = below ? 'none' : '';

    if (borderL && borderR) {
      var lineH = Math.max(0, rect.bottom) + 'px';
      borderL.style.height = lineH;
      borderR.style.height = lineH;
    }

    /* Toggle solid background on scroll — matches marketing site SiteNav */
    if (nav) {
      if (window.scrollY > 20) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    }

    updateSidebar();
  }, { passive: true });

  /* ─── Sidebar ─────────────────────────────────────────── */
  var sidebarActive = false;

  function updateSidebar() {
    if (!sidebarActive || !sidebar || !marquee) return;
    var sHeight  = sidebar.offsetHeight;
    var mTop     = marquee.getBoundingClientRect().top;
    var baseline = window.innerHeight - sHeight - 48;
    var top      = Math.min(baseline, mTop - sHeight - 8);
    sidebar.style.top     = top + 'px';
    sidebar.style.opacity = mTop <= 0 ? '0' : '';
  }

  /* ─── Custom cursor ───────────────────────────────────── */
  if (cursor) {
    document.addEventListener('mousemove', function (e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, .anvil-grid__item').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('hover'); });
    });
  }

  /* ─── Kick off ────────────────────────────────────────── */
  if (document.readyState === 'complete') {
    runAnimation();
  } else {
    window.addEventListener('load', runAnimation);
  }
}
