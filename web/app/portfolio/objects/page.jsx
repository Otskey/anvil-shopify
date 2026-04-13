'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MobileMenu from '../../components/MobileMenu';
import SiteNav from '../../components/SiteNav';
import { meta, filters, items } from '../../data/objects';
import dimensions from '../../data/image-dimensions.json';

export default function ObjectsPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredItems = activeFilter === 'all'
    ? items
    : items.filter(item => item.category === activeFilter);

  const totalCount = items.length;

  // ─── Cursor, clock, nav — run once on mount ─────────────────────────────────
  useEffect(() => {
    document.title = 'Objects — ANVIL';

    const cursor = document.getElementById('cursor');

    function handleMouseMove(e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    }

    function handleMouseEnter() { cursor.classList.add('hover'); }
    function handleMouseLeave() { cursor.classList.remove('hover'); }

    document.addEventListener('mousemove', handleMouseMove);

    document.querySelectorAll('a, button, .masonry-item, .filter-tag').forEach(function (el) {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.querySelectorAll('a, button, .masonry-item, .filter-tag').forEach(function (el) {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // ─── Scroll reveal for header — run once on mount ───────────────────────────
  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal');

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

  // ─── Masonry item stagger — re-run after filter changes ─────────────────────
  useEffect(() => {
    const masonryItems = document.querySelectorAll('.masonry-item');

    const itemObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          itemObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    masonryItems.forEach(function (el) { itemObserver.observe(el); });

    return () => { itemObserver.disconnect(); };
  }, [activeFilter]);

  return (
    <>
      {/* ─── CUSTOM CURSOR ── */}
      <div className="cursor" id="cursor"></div>

      {/* ─── NAV ── */}
      <SiteNav />

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

        {/* Filter bar */}
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

        {/* Masonry gallery — images display at their natural proportions */}
        <div className="portfolio-masonry">
          {filteredItems.map((item, index) => {
            const dim = dimensions[item.src] || { width: 800, height: 600 };
            return (
              <div
                key={item.src}
                className="masonry-item"
                data-category={item.category}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={dim.width}
                  height={dim.height}
                  style={{ width: '100%', height: 'auto' }}
                  sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                  priority={index < 4}
                />
                <div className="portfolio-card__overlay">
                  <span className="portfolio-card__number">
                    {String(index + 1).padStart(3, '0')}
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
