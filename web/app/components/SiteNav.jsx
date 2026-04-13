'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

/**
 * Shared site navigation bar.
 *
 * @param {"home"|"inner"} variant
 *   "inner" (default) — visible immediately with solid background.
 *   "home"  — hidden until `visible` prop becomes true; background toggles on scroll.
 * @param {boolean} visible  — controls fade-in for the "home" variant.
 */
export default function SiteNav({ variant = 'inner', visible = true }) {
  const navRef = useRef(null);

  // ─── Date display (DD Mon YYYY) ──────────────────────────────────────────────
  useEffect(() => {
    const dateEl = document.getElementById('date-display');
    if (!dateEl) return;

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    function updateDate() {
      const d = new Date();
      dateEl.textContent =
        String(d.getDate()).padStart(2, '0') + ' ' +
        months[d.getMonth()] + ' ' +
        d.getFullYear();
    }

    updateDate();
    const id = setInterval(updateDate, 60000);
    return () => clearInterval(id);
  }, []);

  // ─── Visibility & scroll behaviour ───────────────────────────────────────────
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    if (variant === 'inner') {
      // Inner pages: solid background, visible immediately
      nav.classList.add('is-visible', 'is-scrolled');
      return;
    }

    // Home variant: visibility controlled by `visible` prop
    if (visible) {
      nav.classList.add('is-visible');
    } else {
      nav.classList.remove('is-visible');
    }

    // Toggle solid background on scroll
    function handleScroll() {
      if (window.scrollY > 20) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // set initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant, visible]);

  return (
    <nav className="site-nav" id="site-nav" ref={navRef}>
      <ul className="nav-links">
        <li className="nav-mobile-trigger">
          <button className="mobile-menu-btn" id="mobile-menu-btn" aria-label="Open menu">
            <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="6" r="6" />
            </svg>
          </button>
        </li>
        <li><a href="#">Store</a></li>
        <li><Link href="/portfolio/homeware">Homeware</Link></li>
        <li><Link href="/portfolio/objects">Objects</Link></li>
      </ul>
      <Link href="/" className="nav-logo">ANVIL</Link>
      <div className="nav-right">
        {variant !== 'home' && <p className="hero-issue">Issue No. 001 |</p>}
        <span id="date-display"></span>
      </div>
    </nav>
  );
}
