'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import MobileMenu from '../components/MobileMenu';
import SiteNav from '../components/SiteNav';
import { reviews } from '../data/reviews';

export default function ReviewsPageClient() {
  useEffect(() => {
    const cursor = document.getElementById('cursor');

    function handleMouseMove(e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    }

    function handleMouseEnter() { cursor.classList.add('hover'); }
    function handleMouseLeave() { cursor.classList.remove('hover'); }

    document.addEventListener('mousemove', handleMouseMove);

    const hoverEls = document.querySelectorAll('a, button, .review-card');
    hoverEls.forEach(function (el) {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
      observer.observe(el);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      hoverEls.forEach(function (el) {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      observer.disconnect();
    };
  }, []);

  const hero = reviews.find((r) => r.hero);
  const bento = reviews.filter((r) => !r.hero);
  return (
    <>
      <div className="cursor" id="cursor"></div>

      <SiteNav />

      <main className="reviews-page">

        <header className="portfolio-header reveal">
          <p className="portfolio-breadcrumb">
            <Link href="/">Home</Link> / Reviews
          </p>
          <div className="portfolio-header-inner">
            <h1 className="portfolio-title">Kind Words</h1>
            <div className="portfolio-meta">
              <span className="portfolio-meta-count">Customer Feedback</span>
              <p className="portfolio-meta-desc">{reviews.length} testimonials from clients of the workshop</p>
            </div>
          </div>
        </header>

        {hero && (
          <section className="reviews-hero reveal">
            <span className="reviews-hero__mark" aria-hidden="true">&ldquo;</span>
            <blockquote className="reviews-hero__quote">{hero.quote}</blockquote>
            <div className="reviews-hero__rule" aria-hidden="true"></div>
            <p className="reviews-hero__attribution">
              <span className="reviews-hero__name">{hero.name}</span>
              {hero.tag && <span className="reviews-hero__tag">{hero.tag}</span>}
            </p>
          </section>
        )}

        <section className="reviews-bento" aria-label="Customer reviews">
          {bento.map((r) => (
            <article
              key={r.id}
              className={`review-card reveal${r.featured ? ' review-card--wide' : ''}`}
            >
              <blockquote className="review-card__quote">{r.quote}</blockquote>
              <footer className="review-card__footer">
                <p className="review-card__author">{r.name}</p>
                {r.tag && <p className="review-card__tag">{r.tag}</p>}
              </footer>
            </article>
          ))}
        </section>

        <section className="reviews-cta reveal">
          <p className="reviews-cta__kicker">Commissions</p>
          <h2 className="reviews-cta__heading">Have your own idea?</h2>
          <p className="reviews-cta__body">
            Every piece begins with a conversation. Bring a sketch, a photograph, or just an idea.
          </p>
          <Link href="/contact" className="reviews-cta__btn">Start a commission →</Link>
        </section>

        <footer className="portfolio-footer">
          <Link href="/" className="portfolio-footer-logo">ANVIL</Link>
          <ul className="portfolio-footer-nav">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/portfolio/homeware">Homeware</Link></li>
            <li><Link href="/portfolio/objects">Objects</Link></li>
            <li><Link href="/reviews">Reviews</Link></li>
          </ul>
          <button className="portfolio-back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button>
        </footer>

      </main>

      <MobileMenu />
    </>
  );
}
