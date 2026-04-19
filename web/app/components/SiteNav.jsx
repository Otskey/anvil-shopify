'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

/**
 * Shared site navigation bar.
 *
 * @param {"home"|"inner"} variant
 *   "inner" (default) — visible immediately with solid background.
 *   "home"  — hidden (display:none) until parent adds `is-visible` via DOM.
 */
export default function SiteNav({ variant = 'inner' }) {
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

  // ─── Home variant: toggle solid background on scroll ─────────────────────────
  useEffect(() => {
    if (variant !== 'home') return;
    const nav = navRef.current;
    if (!nav) return;

    function handleScroll() {
      if (window.scrollY > 20) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant]);

  // Inner pages: visible + scrolled immediately via className (no useEffect delay)
  // Home page: just "site-nav" (display:none) — parent adds is-visible when ready
  const className = variant === 'inner'
    ? 'site-nav is-visible is-scrolled'
    : 'site-nav';

  return (
    <nav className={className} id="site-nav" ref={navRef}>
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
        <li><Link href="/reviews">Reviews</Link></li>
      </ul>
      <Link href="/" className="nav-logo">ANVIL DESIGN & FABRICATION</Link>
      <div className="nav-right">
        {variant !== 'home' && <p className="hero-issue">Issue No. 001 |</p>}
        <span id="date-display"></span>
      </div>
    </nav>
  );
}
