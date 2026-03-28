/**
 * Waka Waka — Homepage intro animation
 *
 * Sequence:
 *  1. Measure the container's natural height and calculate the scale that
 *     makes it fit exactly inside the viewport (= "magazine cover" view).
 *  2. Set initial states: container scaled down, images clipped, headings invisible.
 *  3. GSAP timeline:
 *       a. Top "Waka" fades in
 *       b. Bottom "Waka" fades in
 *       c. Image grid "unfurls" via clip-path (top → bottom reveal)
 *       d. Container scales up to 1× — the top "Waka" expands to fill viewport width
 *
 * Shopify / Liquid translation notes
 * ------------------------------------
 * - Load GSAP via: {{ 'gsap.min.js' | asset_url | script_tag }}
 * - Wrap in a DOMContentLoaded listener (or move <script> to end of <body>).
 * - Replace image src values with {{ image | img_url: '1200x' }} etc.
 * - The animation logic itself is framework-agnostic and needs no changes.
 */

(function () {
  'use strict';

  // ─── DOM references ───────────────────────────────────────────────────────
  const container   = document.querySelector('.container');
  const wakaTop     = document.querySelector('.waka');
  const wakaBottom  = document.querySelector('.waka--bottom');
  const gridWrapper = document.querySelector('.grid__animation-wrapper');
  const replayBtn   = document.querySelector('.replay-btn');

  // ─── Scale calculation ────────────────────────────────────────────────────
  /**
   * The container has a large natural height (145vw) that is taller than the
   * viewport. We calculate the scale factor that compresses it to exactly
   * 100vh so the full "magazine cover" — both WAKA headings and the images
   * between them — is visible at once when the animation starts.
   *
   * Using transform-origin: top center means the top edge stays pinned to the
   * top of the viewport as the scale changes. During the zoom-in phase, the
   * bottom WAKA and images scroll off-screen downward, leaving only the top
   * WAKA filling the viewport.
   */
  function getInitialScale() {
    const containerH = container.getBoundingClientRect().height; // natural height in px
    const viewportH  = window.innerHeight;
    return viewportH / containerH;
  }

  // ─── Animation ────────────────────────────────────────────────────────────
  function runAnimation() {
    const initialScale = getInitialScale();

    // ── Set initial states (invisible / clipped) ──
    gsap.set(container, {
      scale: initialScale,
      transformOrigin: 'top center',
    });

    // clip-path: inset(top right bottom left)
    // inset(0 0 100% 0) hides everything (bottom edge clipped 100% = nothing visible).
    // animating to inset(0 0 0% 0) reveals the content from top to bottom.
    gsap.set(gridWrapper, {
      clipPath: 'inset(0 0 100% 0)',
    });

    gsap.set([wakaTop, wakaBottom], { opacity: 0 });

    // ── Build the timeline ──
    const tl = gsap.timeline({
      delay: 0.4,
      onComplete: onAnimationComplete,
    });

    // Phase 1 — top heading fades in
    tl.to(wakaTop, {
      opacity: 1,
      duration: 0.55,
      ease: 'power2.out',
    });

    // Phase 2 — bottom heading fades in (overlaps slightly with phase 1)
    tl.to(wakaBottom, {
      opacity: 1,
      duration: 0.55,
      ease: 'power2.out',
    }, '-=0.25');

    // Phase 3 — magazine cover unfurls between the headings
    tl.to(gridWrapper, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1.3,
      ease: 'power3.out',
    }, '+=0.25');

    // Phase 4 — zoom in: the container scales from the initial compressed
    // state up to its natural 1× size.  Because transform-origin is "top
    // center", the top WAKA text stays at the top of the viewport and grows
    // until it fills the full viewport width.
    tl.to(container, {
      scale: 1,
      duration: 1.9,
      ease: 'power3.inOut',
    }, '+=0.45');
  }

  // ─── Post-animation unlock ────────────────────────────────────────────────
  function onAnimationComplete() {
    // The only thing that was ever locked was the scroll-wrapper height/overflow
    // (to prevent the oversized container from creating a scrollbar during the
    // animation). Release it so the full page can scroll normally.
    const sw = document.querySelector('.scroll-wrapper');
    sw.style.height   = 'auto';
    sw.style.overflow = 'visible';

    replayBtn.classList.add('is-visible');
  }

  // ─── Replay ───────────────────────────────────────────────────────────────
  function replay() {
    const sw = document.querySelector('.scroll-wrapper');
    sw.style.height   = '100vh';
    sw.style.overflow = 'hidden';

    replayBtn.classList.remove('is-visible');
    runAnimation();
  }

  replayBtn.addEventListener('click', replay);

  // ─── Kick off ────────────────────────────────────────────────────────────
  if (typeof gsap === 'undefined') {
    console.error('[waka] GSAP failed to load — check your internet connection or CDN URL.');
    return;
  }

  // Wait for fonts + images so the container has its final rendered height
  // before we calculate the initial scale.
  window.addEventListener('load', runAnimation);

}());
