'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MobileMenu from '../../components/MobileMenu';

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
          <li className="nav-mobile-trigger">
            <button className="mobile-menu-btn" id="mobile-menu-btn" aria-label="Open menu">
              <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="6" r="6" />
              </svg>
            </button>
          </li>
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
          <Image
            src="/images/Objects/gardengate.jpg"
            alt="Garden Gate"
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 100vw, 100vw"
            priority
          />
          <div className="portfolio-hero__overlay">
            <span className="portfolio-hero__number">001 — Featured</span>
            <h2 className="portfolio-hero__title">Garden Gate</h2>
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

            <div className="portfolio-card portfolio-card--landscape" data-category="functional">
              <Image
                src="/images/Objects/bespokebar.jpg"
                alt="Bespoke Bar"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 66vw"
              />
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">002</span>
                <h3 className="portfolio-card__name">Bespoke Bar</h3>
                <div className="portfolio-card__meta">
                  <span>Steel</span>
                  <span>2024</span>
                </div>
              </div>
            </div>

            <div className="portfolio-card portfolio-card--portrait" data-category="functional">
              <Image
                src="/images/Objects/glassrack.jpg"
                alt="Glass Rack"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">003</span>
                <h3 className="portfolio-card__name">Glass Rack</h3>
                <div className="portfolio-card__meta">
                  <span>Flat Bar</span>
                  <span>2025</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: three equal */}
          <div className="portfolio-grid-row portfolio-grid-row--three">

            <div className="portfolio-card portfolio-card--portrait" data-category="decorative">
              <Image
                src="/images/Objects/lightfixture.jpg"
                alt="Light Fixture"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">004</span>
                <h3 className="portfolio-card__name">Light Fixture</h3>
                <div className="portfolio-card__meta">
                  <span>Blackened Steel</span>
                  <span>2025</span>
                </div>
              </div>
            </div>

            <div className="portfolio-card portfolio-card--portrait" data-category="architectural">
              <Image
                src="/images/Objects/vangate.jpg"
                alt="Van Gate"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">005</span>
                <h3 className="portfolio-card__name">Van Gate</h3>
                <div className="portfolio-card__meta">
                  <span>Solid Bar</span>
                  <span>2024</span>
                </div>
              </div>
            </div>

            <div className="portfolio-card portfolio-card--portrait" data-category="architectural">
              <Image
                src="/images/Objects/stairwell.jpg"
                alt="Stairwell"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">006</span>
                <h3 className="portfolio-card__name">Stairwell</h3>
                <div className="portfolio-card__meta">
                  <span>Welded Steel</span>
                  <span>2024</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 3: narrow left + wide right */}
          <div className="portfolio-grid-row portfolio-grid-row--wide-right">

            <div className="portfolio-card portfolio-card--portrait" data-category="architectural">
              <Image
                src="/images/Objects/securitygate.jpg"
                alt="Security Gate"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">007</span>
                <h3 className="portfolio-card__name">Security Gate</h3>
                <div className="portfolio-card__meta">
                  <span>Round Bar</span>
                  <span>2025</span>
                </div>
              </div>
            </div>

            <div className="portfolio-card portfolio-card--landscape" data-category="architectural">
              <Image
                src="/images/Objects/balcony.jpg"
                alt="Balcony"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 66vw"
              />
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">008</span>
                <h3 className="portfolio-card__name">Balcony</h3>
                <div className="portfolio-card__meta">
                  <span>Welded Steel</span>
                  <span>2025</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 4: two equal */}
          <div className="portfolio-grid-row portfolio-grid-row--two">

            <div className="portfolio-card portfolio-card--landscape" data-category="architectural">
              <Image
                src="/images/Objects/gardengate2.jpg"
                alt="Garden Gate II"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 50vw"
              />
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">009</span>
                <h3 className="portfolio-card__name">Garden Gate II</h3>
                <div className="portfolio-card__meta">
                  <span>Flat Bar</span>
                  <span>2024</span>
                </div>
              </div>
            </div>

            <div className="portfolio-card portfolio-card--landscape" data-category="architectural">
              <Image
                src="/images/Objects/securitygate3.jpg"
                alt="Security Gate III"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 50vw"
              />
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">010</span>
                <h3 className="portfolio-card__name">Security Gate III</h3>
                <div className="portfolio-card__meta">
                  <span>Oxidised Steel</span>
                  <span>2025</span>
                </div>
              </div>
            </div>

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

      <MobileMenu />
    </>
  );
}
