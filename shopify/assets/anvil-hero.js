/**
 * ANVIL — Shopify Hero Animation
 * File: assets/anvil-hero.js
 *
 * Direct port of animation.js scoped to .anvil- elements.
 * Called as anvilHeroInit() once GSAP is confirmed loaded.
 * GSAP is loaded inline in the section liquid; this file handles
 * the animation logic, cursor, clock, scroll behaviour, and replay.
 */

function anvilHeroInit() {
  'use strict';

  if (typeof gsap === 'undefined') {
    console.error('[ANVIL] GSAP not loaded.');
    return;
  }

  /* ─── DOM refs ────────────────────────────────────────── */
  var container    = document.getElementById('anvil-container');
  var wakaEls      = document.querySelectorAll('.anvil-waka');
  var gridWrapper  = document.querySelector('.anvil-grid__animation-wrapper');
  var scrollWrapper = document.getElementById('anvil-scroll-wrapper');
  var nav          = document.getElementById('anvil-nav');
  var heroFrame    = document.getElementById('anvil-hero-frame');
  var borderL      = document.getElementById('anvil-border-left');
  var borderR      = document.getElementById('anvil-border-right');
  var sidebar      = document.getElementById('anvil-sidebar-text');
  var marquee      = document.getElementById('anvil-marquee');
  var replayBtn    = document.getElementById('anvil-replay-btn');
  var cursor       = document.getElementById('anvil-cursor');

  if (!container || !gridWrapper) {
    console.warn('[ANVIL] Hero elements not found — skipping animation.');
    return;
  }

  /* ─── Hide Fluid theme's own nav during the hero ─────── */
  /*
    Fluid renders its nav in .shopify-section-header.
    We hide it while the hero is active, then restore it on scroll-away.
    If your theme uses a different selector update it here.
  */
  var themeHeader =
    document.querySelector('.shopify-section-header') ||
    document.querySelector('[id="shopify-section-header"]') ||
    document.querySelector('header.site-header');

  if (themeHeader) {
    themeHeader.style.display = 'none';
    themeHeader.dataset.anvilHidden = 'true';
  }

  document.body.classList.add('anvil-hero-active');

  /* ─── Scale calculation ───────────────────────────────── */
  function getInitialScale() {
    var h = container.getBoundingClientRect().height;
    return window.innerHeight / h;
  }

  /* ─── Animation ───────────────────────────────────────── */
  function runAnimation() {
    var scale = getInitialScale();

    gsap.set(container, {
      scale: scale,
      transformOrigin: 'top center',
    });

    gsap.set(gridWrapper, {
      clipPath: 'inset(0 0 100% 0)',
    });

    gsap.set(wakaEls, { opacity: 0 });

    var tl = gsap.timeline({
      delay: 0.4,
      onComplete: onComplete,
    });

    /* Phase 1 — both ANVIL headings fade in */
    tl.to(wakaEls, {
      opacity: 1,
      duration: 0.55,
      ease: 'power2.out',
    });

    /* Phase 2 — image grid unfurls */
    tl.to(gridWrapper, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1.3,
      ease: 'power3.out',
    }, '+=0.25');

    /* Phase 3 — zoom in */
    tl.to(container, {
      scale: 1,
      duration: 1.9,
      ease: 'power3.inOut',
    }, '+=0.45');
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
    heroFrame.classList.remove('is-revealed');
    replayBtn.classList.remove('is-visible');

    sidebarActive = false;
    sidebar.classList.remove('is-revealed');
    sidebar.style.top     = '';
    sidebar.style.opacity = '';

    runAnimation();
  }

  if (replayBtn) replayBtn.addEventListener('click', replay);

  /* ─── Scroll: hero frame + border lines ───────────────── */
  window.addEventListener('scroll', function () {
    if (!scrollWrapper) return;
    var rect  = scrollWrapper.getBoundingClientRect();
    var below = rect.bottom <= 0;

    /* Hide our ANVIL nav and restore Fluid's nav when scrolled past hero */
    if (below) {
      nav.style.opacity       = '0';
      nav.style.pointerEvents = 'none';
      if (themeHeader && themeHeader.dataset.anvilHidden) {
        themeHeader.style.display = '';
        delete themeHeader.dataset.anvilHidden;
      }
    } else {
      if (nav.classList.contains('is-visible')) {
        nav.style.opacity       = '';
        nav.style.pointerEvents = '';
      }
    }

    heroFrame.style.opacity       = below ? '0' : '';
    heroFrame.style.pointerEvents = below ? 'none' : '';

    if (borderL && borderR) {
      var lineH = Math.max(0, rect.bottom) + 'px';
      borderL.style.height = lineH;
      borderR.style.height = lineH;
    }

    updateSidebar();
  }, { passive: true });

  /* ─── Sidebar: push up by marquee ────────────────────── */
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

    var hoverTargets = 'a, button, .anvil-grid__item, .card-wrapper, .product-card-wrapper, [type="submit"], select';
    document.querySelectorAll(hoverTargets).forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('hover'); });
    });
  }

  /* ─── Live clock ──────────────────────────────────────── */
  var clockEl = document.getElementById('anvil-clock');
  if (clockEl) {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    function tick() {
      var d = new Date();
      clockEl.textContent =
        String(d.getDate()).padStart(2, '0') + ' ' +
        months[d.getMonth()] + ' ' +
        d.getFullYear();
    }
    tick();
    setInterval(tick, 60000);
  }

  /* ─── Kick off ────────────────────────────────────────── */
  /*
    We wait for window load so images have dimensions and
    the container has its final rendered height before
    calculating the initial scale — identical to the main site.
  */
  if (document.readyState === 'complete') {
    runAnimation();
  } else {
    window.addEventListener('load', runAnimation);
  }
}
