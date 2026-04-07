'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ObjectsPage() {
  useEffect(() => {
    document.title = 'Objects — ANVIL';

    // ─── Custom cursor ────────────────────────────────────────────────────────
    const cursor = document.getElementById('cursor');

    function handleMouseMove(e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    }

    function handleMouseEnter() { cursor.classList.add('hover'); }
    function handleMouseLeave() { cursor.classList.remove('hover'); }

    document.addEventListener('mousemove', handleMouseMove);

    document.querySelectorAll('a, button, .portfolio-card, .filter-tag').forEach(function (el) {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // ─── Clock ───────────────────────────────────────────────────────────────
    const clockEl = document.getElementById('clock');
    if (clockEl) {
      function updateClock() {
        const now = new Date();
        const h   = String(now.getHours()).padStart(2, '0');
        const m   = String(now.getMinutes()).padStart(2, '0');
        const s   = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = h + ':' + m + ':' + s;
      }
      updateClock();
      var clockId = setInterval(updateClock, 1000);
    }

    // ─── Nav visible immediately (no animation on portfolio pages) ───────────
    const nav = document.getElementById('site-nav');
    if (nav) {
      nav.classList.add('is-visible');
    }

    // ─── Filter system ────────────────────────────────────────────────────────
    const filterTags = document.querySelectorAll('.filter-tag');
    const cards      = document.querySelectorAll('.portfolio-card');

    function handleFilterClick() {
      filterTags.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');

      const selected = this.dataset.filter;

      cards.forEach(function (card) {
        if (selected === 'all' || card.dataset.category === selected) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    }

    filterTags.forEach(function (tag) {
      tag.addEventListener('click', handleFilterClick);
    });

    // ─── Scroll reveal ────────────────────────────────────────────────────────
    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(function (el) { observer.observe(el); });

    // ─── Portfolio grid stagger reveal ───────────────────────────────────────
    const gridRows = document.querySelectorAll('.portfolio-grid-row');

    const rowObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          rowObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    gridRows.forEach(function (row) { rowObserver.observe(row); });

    // ─── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      clearInterval(clockId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.querySelectorAll('a, button, .portfolio-card, .filter-tag').forEach(function (el) {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      filterTags.forEach(function (tag) {
        tag.removeEventListener('click', handleFilterClick);
      });
      observer.disconnect();
      rowObserver.disconnect();
    };
  }, []);

  return (
    <>
      {/* ─── CUSTOM CURSOR ── */}
      <div className="cursor" id="cursor"></div>

      {/* ─── NAV ── */}
      <nav className="site-nav" id="site-nav">
        <ul className="nav-links">
          <li><Link href="/portfolio/homeware">Homeware</Link></li>
          <li><Link href="/portfolio/objects">Objects</Link></li>
        </ul>
        <Link href="/" className="nav-logo">ANVIL</Link>
        <div className="nav-right">
          <p className="hero-issue">Issue No. 001 |</p>
          <span id="clock"></span>
        </div>
      </nav>

      {/* ─── PORTFOLIO PAGE ── */}
      <main className="portfolio-page">

        {/* Header */}
        <header className="portfolio-header reveal">
          <p className="portfolio-breadcrumb">
            <Link href="/">Portfolio</Link> / Objects
          </p>
          <div className="portfolio-header-inner">
            <h1 className="portfolio-title">Objects</h1>
            <div className="portfolio-meta">
              <span className="portfolio-meta-count">10 Works</span>
              <p className="portfolio-meta-desc">Steel objects at the boundary of function and form — sculptures, architectural fittings, and one-off commissions.</p>
            </div>
          </div>
        </header>

        {/* Filter bar */}
        <div className="portfolio-filter">
          <button className="filter-tag active" data-filter="all">All</button>
          <button className="filter-tag" data-filter="sculpture">Sculpture</button>
          <button className="filter-tag" data-filter="architectural">Architectural</button>
          <button className="filter-tag" data-filter="functional">Functional</button>
          <button className="filter-tag" data-filter="decorative">Decorative</button>
        </div>

        {/* Featured hero */}
        <div className="portfolio-hero reveal">
          <div className="img-placeholder" style={{ backgroundColor: '#6e6058' }}></div>
          <div className="portfolio-hero__overlay">
            <span className="portfolio-hero__number">001 — Featured</span>
            <h2 className="portfolio-hero__title">Forged Wall Relief</h2>
            <div className="portfolio-hero__tags">
              <span>Mild Steel</span>
              <span>Hand Forged</span>
              <span>2025</span>
              <span>Commission</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="portfolio-grid">

          {/* Row 1: wide left + narrow right */}
          <div className="portfolio-grid-row portfolio-grid-row--wide-left">

            <div className="portfolio-card portfolio-card--landscape" data-category="sculpture">
              <div className="img-placeholder" style={{ backgroundColor: '#84745c' }}></div>
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">002</span>
                <h3 className="portfolio-card__name">Geometric Mobile</h3>
                <div className="portfolio-card__meta">
                  <span>Sheet Steel</span>
                  <span>2024</span>
                </div>
              </div>
            </div>

            <div className="portfolio-card portfolio-card--portrait" data-category="architectural">
              <div className="img-placeholder" style={{ backgroundColor: '#7a6e64' }}></div>
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">003</span>
                <h3 className="portfolio-card__name">Architectural Door Handle</h3>
                <div className="portfolio-card__meta">
                  <span>Solid Bar</span>
                  <span>2025</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: three equal */}
          <div className="portfolio-grid-row portfolio-grid-row--three">

            <div className="portfolio-card portfolio-card--portrait" data-category="functional">
              <div className="img-placeholder" style={{ backgroundColor: '#9a8e85' }}></div>
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">004</span>
                <h3 className="portfolio-card__name">Bookend Pair</h3>
                <div className="portfolio-card__meta">
                  <span>Flat Bar</span>
                  <span>2024</span>
                </div>
              </div>
            </div>

            <div className="portfolio-card portfolio-card--portrait" data-category="decorative">
              <div className="img-placeholder" style={{ backgroundColor: '#8c837b' }}></div>
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">005</span>
                <h3 className="portfolio-card__name">Forged Door Knocker</h3>
                <div className="portfolio-card__meta">
                  <span>Blackened Steel</span>
                  <span>2025</span>
                </div>
              </div>
            </div>

            <div className="portfolio-card portfolio-card--portrait" data-category="functional">
              <div className="img-placeholder" style={{ backgroundColor: '#6e6058' }}></div>
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">006</span>
                <h3 className="portfolio-card__name">Fireplace Tool Set</h3>
                <div className="portfolio-card__meta">
                  <span>Round Bar</span>
                  <span>2024</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 3: narrow left + wide right */}
          <div className="portfolio-grid-row portfolio-grid-row--wide-right">

            <div className="portfolio-card portfolio-card--portrait" data-category="decorative">
              <div className="img-placeholder" style={{ backgroundColor: '#7a6e64' }}></div>
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">007</span>
                <h3 className="portfolio-card__name">Industrial Clock</h3>
                <div className="portfolio-card__meta">
                  <span>Laser Cut</span>
                  <span>2025</span>
                </div>
              </div>
            </div>

            <div className="portfolio-card portfolio-card--landscape" data-category="architectural">
              <div className="img-placeholder" style={{ backgroundColor: '#84745c' }}></div>
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">008</span>
                <h3 className="portfolio-card__name">Staircase Balustrade Section</h3>
                <div className="portfolio-card__meta">
                  <span>Welded Steel</span>
                  <span>2024</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 4: two equal */}
          <div className="portfolio-grid-row portfolio-grid-row--two">

            <div className="portfolio-card portfolio-card--landscape" data-category="decorative">
              <div className="img-placeholder" style={{ backgroundColor: '#9a8e85' }}></div>
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">009</span>
                <h3 className="portfolio-card__name">Mirror Frame</h3>
                <div className="portfolio-card__meta">
                  <span>Flat Bar</span>
                  <span>2025</span>
                </div>
              </div>
            </div>

            <div className="portfolio-card portfolio-card--landscape" data-category="sculpture">
              <div className="img-placeholder" style={{ backgroundColor: '#6e6058' }}></div>
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">010</span>
                <h3 className="portfolio-card__name">Abstract Wall Sculpture</h3>
                <div className="portfolio-card__meta">
                  <span>Oxidised Steel</span>
                  <span>2025</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Marquee strip */}
        <div className="marquee-strip" aria-hidden="true">
          <div className="marquee-track">
            <span className="marquee-item">Handcrafted in the UK</span>
            <span className="marquee-item">Steel Objects</span>
            <span className="marquee-item">Made to Commission</span>
            <span className="marquee-item">Function & Form</span>
            <span className="marquee-item">Handcrafted in the UK</span>
            <span className="marquee-item">Steel Objects</span>
            <span className="marquee-item">Made to Commission</span>
            <span className="marquee-item">Function & Form</span>
            <span className="marquee-item">Handcrafted in the UK</span>
            <span className="marquee-item">Steel Objects</span>
            <span className="marquee-item">Made to Commission</span>
          </div>
        </div>

        {/* Footer */}
        <footer className="portfolio-footer">
          <Link href="/" className="portfolio-footer-logo">ANVIL</Link>
          <ul className="portfolio-footer-nav">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/portfolio/homeware">Homeware</Link></li>
            <li><Link href="/portfolio/objects">Objects</Link></li>
          </ul>
          <button className="portfolio-back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button>
        </footer>

      </main>
    </>
  );
}
