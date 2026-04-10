'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MobileMenu from '../../components/MobileMenu';
import { meta, filters, featured, items } from '../../data/homeware';

// ─── Layout helpers ───────────────────────────────────────────────────────────
// Row patterns cycle: wide-left (2 items), three-col (3 items),
// wide-right (2 items), two-col (2 items), then repeat.
const ROW_PATTERNS   = ['wide-left', 'three', 'wide-right', 'two'];
const ROW_ITEM_COUNT = { 'wide-left': 2, 'three': 3, 'wide-right': 2, 'two': 2 };

function groupIntoRows(portfolioItems) {
  const rows = [];
  let itemIndex    = 0;
  let patternIndex = 0;
  while (itemIndex < portfolioItems.length) {
    const rowType    = ROW_PATTERNS[patternIndex % ROW_PATTERNS.length];
    const itemsInRow = portfolioItems.slice(itemIndex, itemIndex + ROW_ITEM_COUNT[rowType]);
    rows.push({ rowType, itemsInRow });
    itemIndex    += ROW_ITEM_COUNT[rowType];
    patternIndex += 1;
  }
  return rows;
}

export default function HomewarePage() {
  const [activeFilter, setActiveFilter] = useState('all');

  // Derive the visible items and grid layout from the active filter.
  // The count in the header always reflects the full catalogue total.
  const filteredItems = activeFilter === 'all'
    ? items
    : items.filter(item => item.category === activeFilter);

  // When a subcategory is active, the first matching item becomes the hero;
  // the remaining items fill the grid. For 'all', use the dedicated featured object.
  const heroItem  = activeFilter === 'all' ? featured : filteredItems[0];
  const heroTags  = activeFilter === 'all' ? featured.tags : [heroItem?.material, heroItem?.year].filter(Boolean);
  const gridItems = activeFilter === 'all' ? items : filteredItems.slice(1);

  const totalCount = items.length + 1; // +1 for the featured hero
  const gridRows   = groupIntoRows(gridItems);

  // ─── Cursor, clock, nav — run once on mount ─────────────────────────────────
  useEffect(() => {
    document.title = 'Homeware — ANVIL';

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

    const clockEl = document.getElementById('clock');
    var clockId;
    if (clockEl) {
      function updateClock() {
        const now = new Date();
        const h   = String(now.getHours()).padStart(2, '0');
        const m   = String(now.getMinutes()).padStart(2, '0');
        const s   = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = h + ':' + m + ':' + s;
      }
      updateClock();
      clockId = setInterval(updateClock, 1000);
    }

    const nav = document.getElementById('site-nav');
    if (nav) {
      nav.classList.add('is-visible');
    }

    return () => {
      clearInterval(clockId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.querySelectorAll('a, button, .portfolio-card, .filter-tag').forEach(function (el) {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // ─── Scroll reveal for header/hero — run once on mount ──────────────────────
  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });

    return () => { revealObserver.disconnect(); };
  }, []);

  // ─── Grid stagger — re-run after filter changes so new rows animate in ───────
  // On initial load the observer triggers as the user scrolls.
  // After a filter change we add in-view immediately so there is no flash.
  useEffect(() => {
    const gridRowEls = document.querySelectorAll('.portfolio-grid-row');

    if (activeFilter === 'all') {
      // Initial / reset: use IntersectionObserver for scroll-triggered stagger
      const rowObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            rowObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });

      gridRowEls.forEach(function (row) { rowObserver.observe(row); });

      return () => { rowObserver.disconnect(); };
    } else {
      // Filtered view: show all rows immediately, no stagger delay
      gridRowEls.forEach(function (row) { row.classList.add('in-view'); });
    }
  }, [activeFilter]);

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
            <Link href="/">Portfolio</Link> / {meta.title}
          </p>
          <div className="portfolio-header-inner">
            <h1 className="portfolio-title">{meta.title}</h1>
            <div className="portfolio-meta">
              <span className="portfolio-meta-count">{totalCount} Works</span>
              <p className="portfolio-meta-desc">{meta.description}</p>
            </div>
          </div>
        </header>

        {/* Filter bar — category values here must match item.category in data/homeware.js */}
        <div className="portfolio-filter">
          {filters.map((filter) => (
            <button
              key={filter.value}
              className={`filter-tag${activeFilter === filter.value ? ' active' : ''}`}
              data-filter={filter.value}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Featured hero — item 001, updates when a subcategory filter is active */}
        {heroItem && (
          <div className="portfolio-hero reveal">
            <Image
              src={heroItem.src}
              alt={heroItem.alt}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 100vw, 100vw"
              priority
            />
            <div className="portfolio-hero__overlay">
              <span className="portfolio-hero__number">001 — Featured</span>
              <h2 className="portfolio-hero__title">{heroItem.title}</h2>
              <div className="portfolio-hero__tags">
                {heroTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grid — re-renders automatically when activeFilter changes */}
        <div className="portfolio-grid">
          {gridRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`portfolio-grid-row portfolio-grid-row--${row.rowType}`}
            >
              {row.itemsInRow.map((item, positionInRow) => {
                // Calculate the global item number across all rows
                const globalItemNumber = gridRows
                  .slice(0, rowIndex)
                  .reduce((count, previousRow) => count + previousRow.itemsInRow.length, 0)
                  + positionInRow + 2; // +2 because featured hero is 001

                return (
                  <div
                    key={item.src}
                    className={`portfolio-card portfolio-card--${item.aspect}`}
                    data-category={item.category}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 50vw"
                    />
                    <div className="portfolio-card__overlay">
                      <span className="portfolio-card__number">
                        {String(globalItemNumber).padStart(3, '0')}
                      </span>
                      <h3 className="portfolio-card__name">{item.title}</h3>
                      <div className="portfolio-card__meta">
                        <span>{item.material}</span>
                        <span>{item.year}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
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
