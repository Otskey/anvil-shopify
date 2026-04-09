'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import MobileMenu from '../components/MobileMenu';

export default function ContactPage() {
  useEffect(() => {
    document.title = 'Contact — ANVIL';

    // ─── Custom cursor ────────────────────────────────────────────────────────
    const cursor = document.getElementById('cursor');

    function handleMouseMove(e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    }

    function handleMouseEnter() { cursor.classList.add('hover'); }
    function handleMouseLeave() { cursor.classList.remove('hover'); }

    document.addEventListener('mousemove', handleMouseMove);

    document.querySelectorAll('a, button, input, textarea').forEach(function (el) {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // ─── Clock ───────────────────────────────────────────────────────────────
    const clockEl = document.getElementById('clock');
    let clockId;
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

    // ─── Nav visible immediately ──────────────────────────────────────────────
    const nav = document.getElementById('site-nav');
    if (nav) nav.classList.add('is-visible');

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

    // ─── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      clearInterval(clockId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.querySelectorAll('a, button, input, textarea').forEach(function (el) {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      observer.disconnect();
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

      {/* ─── CONTACT PAGE ── */}
      <main className="contact-page">

        {/* ── Header ── */}
        <header className="contact-header reveal">
          <p className="portfolio-breadcrumb">
            <Link href="/">Home</Link> / Contact
          </p>
          <div className="portfolio-header-inner">
            <h1 className="portfolio-title">Contact</h1>
            <div className="portfolio-meta">
              <span className="portfolio-meta-count">Cambridgeshire, UK</span>
              <p className="portfolio-meta-desc">Workshop enquiries &amp; commissions</p>
            </div>
          </div>
        </header>

        {/* ── Editorial split ── */}
        <section className="contact-editorial reveal">

          <div className="contact-editorial__text">
            <p className="contact-kicker">The Workshop</p>
            <div className="contact-editorial__rule"></div>
            <p className="contact-editorial__body">
              Set within a Cambridgeshire steel fabrication workshop, each ANVIL piece is conceived,
              cut, and finished in the same space. Steel arrives in lengths and leaves as objects —
              formed by hand, without shortcuts.
            </p>
            <p className="contact-editorial__body">
              Every commission begins with a conversation. We work through material, proportion, and
              purpose together — arriving at something made for the exact space it will inhabit.
              There are no standard options, no minimum orders. Bring a sketch, a photograph,
              or just an idea.
            </p>
          </div>

          <div className="contact-editorial__image">
            <img
              src="/images/anvilworkshop.png"
              alt="The ANVIL workshop, Cambridgeshire"
            />
          </div>

        </section>

        {/* ── Contact details + form ── */}
        <section className="contact-body">

          {/* Studio info */}
          <div className="contact-info reveal">

            <div className="contact-info__block">
              <p className="contact-info__label">Studio</p>
              <div className="contact-info__value">
                <p>The Workshop</p>
                <p>[Street Address]</p>
                <p>Cambridgeshire</p>
              </div>
            </div>

            <div className="contact-info__block">
              <p className="contact-info__label">Enquiries</p>
              <div className="contact-info__value">
                <p><a href="mailto:studio@anvil-fabrication.co.uk">studio@anvil-fabrication.co.uk</a></p>
                <p><a href="tel:+44XXXXXXXXXX">+44 (0)XXXX XXXXXX</a></p>
              </div>
            </div>

            <div className="contact-info__block">
              <p className="contact-info__label">Hours</p>
              <div className="contact-info__value">
                <p>Monday – Friday</p>
                <p>9am – 5pm</p>
              </div>
            </div>

          </div>

          {/* Enquiry form — UI only, wire backend separately */}
          <div className="contact-form reveal">
            <p className="contact-kicker">Send an Enquiry</p>
            <div className="contact-editorial__rule"></div>

            <form className="contact-form__fields" onSubmit={function(e){ e.preventDefault(); }}>

              <div className="contact-form__group">
                <label className="contact-form__label" htmlFor="contact-name">Name</label>
                <input
                  className="contact-form__input"
                  type="text"
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                />
              </div>

              <div className="contact-form__group">
                <label className="contact-form__label" htmlFor="contact-email">Email</label>
                <input
                  className="contact-form__input"
                  type="email"
                  id="contact-email"
                  name="email"
                  autoComplete="email"
                />
              </div>

              <div className="contact-form__group">
                <label className="contact-form__label" htmlFor="contact-message">Message</label>
                <textarea
                  className="contact-form__textarea"
                  id="contact-message"
                  name="message"
                  rows="5"
                ></textarea>
              </div>

              <button type="submit" className="contact-form__submit">
                Send message →
              </button>

            </form>
          </div>

        </section>

        {/* ── Footer ── */}
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
