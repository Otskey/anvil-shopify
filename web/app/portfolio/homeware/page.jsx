'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomewarePage() {
  useEffect(() => {
    document.title = 'Homeware — ANVIL';

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
            <Link href="/">Portfolio</Link> / Homeware
          </p>
          <div className="portfolio-header-inner">
            <h1 className="portfolio-title">Homeware</h1>
            <div className="portfolio-meta">
              <span className="portfolio-meta-count">12 Works</span>
              <p className="portfolio-meta-desc">Steel homeware designed for everyday life — shelving, tables, storage and light, all made by hand in the UK.</p>
            </div>
          </div>
        </header>

        {/* Filter bar */}
        <div className="portfolio-filter">
          <button className="filter-tag active" data-filter="all">All</button>
          <button className="filter-tag" data-filter="shelving">Shelving</button>
          <button className="filter-tag" data-filter="tables">Tables</button>
          <button className="filter-tag" data-filter="lighting">Lighting</button>
          <button className="filter-tag" data-filter="storage">Storage</button>
          <button className="filter-tag" data-filter="hooks">Hooks & Rails</button>
        </div>

        {/* Featured hero */}
        <div className="portfolio-hero reveal">
          <Image
            src="/images/Homeware/houseoffice.jpg"
            alt="House Office"
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 100vw, 100vw"
            priority
          />
          <div className="portfolio-hero__overlay">
            <span className="portfolio-hero__number">001 — Featured</span>
            <h2 className="portfolio-hero__title">House Office</h2>
            <div className="portfolio-hero__tags">
              <span>Steel</span>
              <span>Powder Coat</span>
              <span>2025</span>
              <span>Bespoke</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="portfolio-grid">

          {/* Row 1: wide left + narrow right */}
          <div className="portfolio-grid-row portfolio-grid-row--wide-left">

            <div className="portfolio-card portfolio-card--landscape" data-category="tables">
              <Image
                src="/images/Homeware/xtable.jpg"
                alt="X Table"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 66vw"
              />
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">002</span>
                <h3 className="portfolio-card__name">X Table</h3>
                <div className="portfolio-card__meta">
                  <span>Steel & Oak</span>
                  <span>2025</span>
                </div>
              </div>
            </div>

            <div className="portfolio-card portfolio-card--portrait" data-category="tables">
              <Image
                src="/images/Homeware/chair.jpg"
                alt="Steel Chair"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">003</span>
                <h3 className="portfolio-card__name">Steel Chair</h3>
                <div className="portfolio-card__meta">
                  <span>Mild Steel</span>
                  <span>2024</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: three equal */}
          <div className="portfolio-grid-row portfolio-grid-row--three">

            <div className="portfolio-card portfolio-card--portrait" data-category="hooks">
              <Image
                src="/images/Homeware/kitchenaid.jpg"
                alt="Kitchen Aid Stand"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">004</span>
                <h3 className="portfolio-card__name">Kitchen Aid Stand</h3>
                <div className="portfolio-card__meta">
                  <span>Flat Bar Steel</span>
                  <span>2024</span>
                </div>
              </div>
            </div>

            <div className="portfolio-card portfolio-card--portrait" data-category="storage">
              <Image
                src="/images/Homeware/fireplace.jpg"
                alt="Fireplace Surround"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">005</span>
                <h3 className="portfolio-card__name">Fireplace Surround</h3>
                <div className="portfolio-card__meta">
                  <span>Blackened Steel</span>
                  <span>2025</span>
                </div>
              </div>
            </div>

            <div className="portfolio-card portfolio-card--portrait" data-category="storage">
              <Image
                src="/images/Homeware/logstorage.jpg"
                alt="Log Storage"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">006</span>
                <h3 className="portfolio-card__name">Log Storage</h3>
                <div className="portfolio-card__meta">
                  <span>Round Bar</span>
                  <span>2024</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 3: narrow left + wide right */}
          <div className="portfolio-grid-row portfolio-grid-row--wide-right">

            <div className="portfolio-card portfolio-card--portrait" data-category="storage">
              <Image
                src="/images/Homeware/homebar.jpg"
                alt="Home Bar"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">007</span>
                <h3 className="portfolio-card__name">Home Bar</h3>
                <div className="portfolio-card__meta">
                  <span>Steel & Weld</span>
                  <span>2025</span>
                </div>
              </div>
            </div>

            <div className="portfolio-card portfolio-card--landscape" data-category="tables">
              <Image
                src="/images/Homeware/officedesk.jpg"
                alt="Office Desk"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 66vw"
              />
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">008</span>
                <h3 className="portfolio-card__name">Office Desk</h3>
                <div className="portfolio-card__meta">
                  <span>Steel & Oak</span>
                  <span>2024</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 4: two equal */}
          <div className="portfolio-grid-row portfolio-grid-row--two">

            <div className="portfolio-card portfolio-card--landscape" data-category="lighting">
              <div className="img-placeholder" style={{ backgroundColor: '#9a8e85' }}></div>
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">009</span>
                <h3 className="portfolio-card__name">Pendant Ceiling Light</h3>
                <div className="portfolio-card__meta">
                  <span>Spun Steel</span>
                  <span>2025</span>
                </div>
              </div>
            </div>

            <div className="portfolio-card portfolio-card--landscape" data-category="hooks">
              <Image
                src="/images/Homeware/drain.jpg"
                alt="Utility Drain"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 50vw"
              />
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">010</span>
                <h3 className="portfolio-card__name">Utility Drain</h3>
                <div className="portfolio-card__meta">
                  <span>Mild Steel</span>
                  <span>2024</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 5: three equal */}
          <div className="portfolio-grid-row portfolio-grid-row--three">

            <div className="portfolio-card portfolio-card--portrait" data-category="storage">
              <Image
                src="/images/Homeware/choppingboard.jpg"
                alt="Chopping Board"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">011</span>
                <h3 className="portfolio-card__name">Chopping Board</h3>
                <div className="portfolio-card__meta">
                  <span>Steel & Wood</span>
                  <span>2025</span>
                </div>
              </div>
            </div>

            <div className="portfolio-card portfolio-card--portrait" data-category="storage">
              <Image
                src="/images/Homeware/choppingboard2.jpg"
                alt="Chopping Board II"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">012</span>
                <h3 className="portfolio-card__name">Chopping Board II</h3>
                <div className="portfolio-card__meta">
                  <span>Steel & Wood</span>
                  <span>2024</span>
                </div>
              </div>
            </div>

            <div className="portfolio-card portfolio-card--portrait" data-category="tables">
              <Image
                src="/images/Homeware/xtable2.jpg"
                alt="X Table II"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
              <div className="portfolio-card__overlay">
                <span className="portfolio-card__number">013</span>
                <h3 className="portfolio-card__name">X Table II</h3>
                <div className="portfolio-card__meta">
                  <span>Steel & Oak</span>
                  <span>2024</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Marquee strip */}
        <div className="marquee-strip" aria-hidden="true">
          <div className="marquee-track">
            <span className="marquee-item">Handcrafted in the UK</span>
            <span className="marquee-item">Steel Homeware</span>
            <span className="marquee-item">Made to Order</span>
            <span className="marquee-item">Designed for Life</span>
            <span className="marquee-item">Handcrafted in the UK</span>
            <span className="marquee-item">Steel Homeware</span>
            <span className="marquee-item">Made to Order</span>
            <span className="marquee-item">Designed for Life</span>
            <span className="marquee-item">Handcrafted in the UK</span>
            <span className="marquee-item">Steel Homeware</span>
            <span className="marquee-item">Made to Order</span>
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
