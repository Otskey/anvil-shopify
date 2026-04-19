'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import MobileMenu from './components/MobileMenu';
import SiteNav from './components/SiteNav';

export default function HomePageClient() {
  useEffect(() => {
    // ─── GSAP Animation (from animation.js) ──────────────────────────────────
    const container   = document.querySelector('.container');
    const wakaTop     = document.querySelector('.waka');
    const wakaBottom  = document.querySelector('.waka--bottom');
    const gridWrapper = document.querySelector('.grid__animation-wrapper');


    function getInitialScale() {
      const containerH = container.getBoundingClientRect().height;
      const viewportH  = window.innerHeight;
      return viewportH / containerH;
    }

    let timeline;

    function runAnimation() {
      const initialScale = getInitialScale();

      gsap.set(container, {
        scale: initialScale,
        transformOrigin: 'top center',
      });

      gsap.set(gridWrapper, {
        clipPath: 'inset(0 0 100% 0)',
      });

      gsap.set([wakaTop, wakaBottom], { opacity: 0 });

      timeline = gsap.timeline({
        delay: 0.4,
        onComplete: onAnimationComplete,
      });

      timeline.to([wakaTop, wakaBottom], {
        opacity: 1,
        duration: 0.55,
        ease: 'power2.out',
      });

      timeline.to(gridWrapper, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.3,
        ease: 'power3.out',
      }, '+=0.25');

      timeline.to(container, {
        scale: 1,
        duration: 1.9,
        ease: 'power3.inOut',
      }, '+=0.45');
    }

    function onAnimationComplete() {
      const sw = document.querySelector('.scroll-wrapper');
      sw.style.height   = 'auto';
      sw.style.overflow = 'visible';

      document.getElementById('site-nav').classList.add('is-visible');
      document.getElementById('hero-frame').classList.add('is-revealed');
      document.getElementById('hero-bottom-row').classList.add('is-revealed');
    }


    // Wait for fonts + images so the container has its final rendered height
    if (document.readyState === 'complete') {
      runAnimation();
    } else {
      window.addEventListener('load', runAnimation);
    }

    // ─── Custom cursor ────────────────────────────────────────────────────────
    const cur = document.getElementById('cursor');

    function handleMouseMove(e) {
      cur.style.left = e.clientX + 'px';
      cur.style.top  = e.clientY + 'px';
    }

    function handleMouseEnter() { cur.classList.add('hover'); }
    function handleMouseLeave() { cur.classList.remove('hover'); }

    document.addEventListener('mousemove', handleMouseMove);

    const hoverEls = document.querySelectorAll('a, .product-card, button');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // ─── Hero frame + border lines on scroll ──────────────────────────────────
    const heroFrame     = document.getElementById('hero-frame');
    const heroBottomRow = document.getElementById('hero-bottom-row');
    const heroBorderL   = document.getElementById('hero-border-left');
    const heroBorderR   = document.getElementById('hero-border-right');
    const scrollWrapper = document.querySelector('.scroll-wrapper');

    function handleHeroScroll() {
      const rect  = scrollWrapper.getBoundingClientRect();
      const below = rect.bottom <= 0;
      heroFrame.style.opacity       = below ? '0' : '';
      heroFrame.style.pointerEvents = below ? 'none' : '';
      // Translate the row up by the scroll amount so it scrolls off-screen naturally
      heroBottomRow.style.transform = `translateY(-${window.scrollY}px)`;
      const lineH = Math.max(0, rect.bottom) + 'px';
      heroBorderL.style.height = lineH;
      heroBorderR.style.height = lineH;
    }

    window.addEventListener('scroll', handleHeroScroll, { passive: true });

    // ─── Sidebar text: sits at bottom-left, pushed up by marquee, then fades ──
    const heroSidebar = document.getElementById('hero-sidebar-text');
    const marqueeEl   = document.querySelector('.marquee-strip');
    let sidebarActive = false;

    function updateSidebar() {
      if (!sidebarActive) return;
      const sHeight  = heroSidebar.offsetHeight;
      const mTop     = marqueeEl.getBoundingClientRect().top;
      const baseline = window.innerHeight - sHeight - 48;
      const top      = Math.min(baseline, mTop - sHeight - 8);
      heroSidebar.style.top = top + 'px';
      heroSidebar.style.opacity = mTop <= 0 ? '0' : '';
    }

    window.addEventListener('scroll', updateSidebar, { passive: true });

    const mutationObserver = new MutationObserver((_, obs) => {
      if (heroFrame.classList.contains('is-revealed')) {
        sidebarActive = true;
        updateSidebar();
        heroSidebar.classList.add('is-revealed');
        obs.disconnect();
      }
    });
    mutationObserver.observe(heroFrame, { attributes: true, attributeFilter: ['class'] });


    // ─── Scroll reveal ────────────────────────────────────────────────────────
    const scrollObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          scrollObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => scrollObserver.observe(el));

    // ─── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener('load', runAnimation);
      document.removeEventListener('mousemove', handleMouseMove);
      hoverEls.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      window.removeEventListener('scroll', handleHeroScroll);
      window.removeEventListener('scroll', updateSidebar);
      mutationObserver.disconnect();
      scrollObserver.disconnect();
      if (timeline) timeline.kill();
    };
  }, []);

  return (
    <>
      {/* ─── CUSTOM CURSOR ──────────────────────────────────────────── */}
      <div className="cursor" id="cursor"></div>

      {/* ─── NAV — hidden until GSAP animation completes ─────── */}
      <SiteNav variant="home" />

      {/* ─── HERO BORDER LINES ── */}
      <div className="hero-border-left"  id="hero-border-left"></div>
      <div className="hero-border-right" id="hero-border-right"></div>

      {/* ─── HERO SIDEBAR TEXT ── */}
      <div className="hero-sidebar-text" id="hero-sidebar-text">
        <span className="hero-label">Collection 2026</span>
        <p className="hero-tagline">Homeware and functional objects, wood and steel, designed and handcrafted in the UK.</p>
      </div>

      <div className="hero-frame" id="hero-frame">
        <div className="hero-frame-left"></div>
        <div className="hero-frame-right"></div>
      </div>

      {/* ─── ISSUE + SCROLL — fixed independently, unaffected by hero scroll-out ── */}
      <div className="hero-bottom-row" id="hero-bottom-row">
        <span className="hero-issue">Issue No. 001</span>
        <div
          className="hero-scroll-hint"
          onClick={() => document.getElementById('below-marquee')?.scrollIntoView({ behavior: 'smooth' })}
          style={{ cursor: 'pointer' }}
        >
          <div className="scroll-arrow"></div>
          <span>Scroll</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ANIMATION — DO NOT MODIFY
      ═══════════════════════════════════════════════════════════════ */}
      <div className="scroll-wrapper">
        <div className="container">

          <h2 className="waka">ANVIL</h2>

          <div className="grid__animation-wrapper">
            <div className="grid">

              <a href="#" className="grid__item grid__item--featured" aria-label="Garden Ornament">
                <div className="grid__item-image">
                  <div className="responsive-image" style={{ backgroundColor: '#8c837b' }}>
                    <img
                      src="/images/Homeware/gardenoranment.JPG"
                      alt="Garden Ornament — featured view"
                      loading="eager"
                    />
                  </div>
                </div>
              </a>

              <div className="grid__item grid__item--side">

                <div className="grid__item-panel">
                  <div className="responsive-image" style={{ backgroundColor: '#8c837b' }}>
                    <img
                      src="/images/anvilworkshop.png"
                      alt="Anvil Workshop"
                      loading="eager"
                    />
                  </div>
                  <div className="grid__cta-overlay">
                    <span className="grid__cta-label">Our Collection</span>
                    <h3 className="grid__cta-heading">Visit our shop to see our wares.</h3>
                    <a href="/shop" className="grid__cta-btn">Explore the collection →</a>
                  </div>
                </div>

                <div className="grid__item-panel">
                  <div className="responsive-image" style={{ backgroundColor: '#84745c' }}>
                    <img
                      src="/images/Homeware/gardenornament3.JPG"
                      alt="Garden Ornament — side view"
                      loading="eager"
                    />
                  </div>
                </div>

              </div>

            </div>
          </div>

          <h2 className="waka waka--bottom">ANVIL</h2>

        </div>
      </div>
      {/* ═══════════════════════════════════════════════════════════════ */}


      {/* ─── PAGE CONTENT — scrollable after animation ──────────────── */}
      <div id="page-content">

        {/* Marquee strip */}
        <div className="marquee-strip" aria-hidden="true">
          <div className="marquee-track">
            <span className="marquee-item">Handcrafted Homeware</span>
            <span className="marquee-item">Functional Objects</span>
            <span className="marquee-item">Made by Hand</span>
            <span className="marquee-item">Limited Edition</span>
            <span className="marquee-item">Handcrafted Homeware</span>
            <span className="marquee-item">Functional Objects</span>
            <span className="marquee-item">Made by Hand</span>
            <span className="marquee-item">Limited Edition</span>
            <span className="marquee-item">Functional Objects</span>
            <span className="marquee-item">Made by Hand</span>
            <span className="marquee-item">Limited Edition</span>
          </div>
        </div>

        {/* Section header */}
        <div id="below-marquee" className="section-header reveal">
          <h2 className="section-title">The Collection</h2>
          <span className="section-count">03 Homeware</span>
        </div>

        {/* Product grid */}
        <div className="product-grid reveal-stagger">

          <div className="product-card">
            <Image className="img-primary"
              src="/images/Homeware/gardenoranment.JPG"
              alt="Garden Ornament"
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" />
            <Image className="img-hover"
              src="/images/Homeware/gardenornament3.JPG"
              alt="Garden Ornament detail"
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" />
            <span className="product-num">001</span>
            <div className="product-info">
              <p className="product-category">Homeware</p>
              <h3 className="product-name">Garden Ornament</h3>
            </div>
          </div>

          <div className="product-card">
            <Image className="img-primary"
              src="/images/Homeware/diningtable.JPG"
              alt="Dining Table"
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" />
            <Image className="img-hover"
              src="/images/Homeware/diningtable2.JPG"
              alt="Dining Table detail"
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" />
            <span className="product-num">002</span>
            <div className="product-info">
              <p className="product-category">Homeware</p>
              <h3 className="product-name">Dining Table</h3>
            </div>
          </div>

          <div className="product-card">
            <Image className="img-primary"
              src="/images/Objects/accessgate3.JPG"
              alt="Access Gate"
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" />
            <Image className="img-hover"
              src="/images/Objects/gardengate3.JPG"
              alt="Garden Gate"
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" />
            <span className="product-num">003</span>
            <div className="product-info">
              <p className="product-category">Objects</p>
              <h3 className="product-name">Gates</h3>
            </div>
          </div>

        </div>

        {/* Editorial */}
        <section className="editorial-strip">
          <div className="editorial-text reveal">
            <p className="editorial-kicker">About the Studio</p>
            <blockquote className="editorial-quote">
              &ldquo;Every object begins as a conversation between material, maker, and the quiet demands of daily life.&rdquo;
            </blockquote>
            <p className="editorial-byline">— Studio Statement, 2024</p>
          </div>
          <div className="editorial-image">
            <Image
              src="/images/Homeware/diningtable4.JPG"
              alt="Studio photography"
              width={2418}
              height={3021}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
        </section>

        {/* Kind Words — home teaser */}
        <section className="home-reviews">
          <div className="section-header reveal">
            <h2 className="section-title">Kind Words</h2>
            <span className="section-count">Customer Feedback</span>
          </div>
          <div className="home-reviews__grid reveal-stagger">
            <article className="home-reviews__card">
              <blockquote className="home-reviews__quote">
                Lewis is a bit of an artist when it comes to steel.
              </blockquote>
              <div className="home-reviews__attribution">
                <p className="home-reviews__author">Lottie Judge</p>
                <p className="home-reviews__tag">Pub Bar, North London</p>
              </div>
            </article>
            <article className="home-reviews__card">
              <blockquote className="home-reviews__quote">
                A bulletproof, really pretty desk that will outlive me.
              </blockquote>
              <div className="home-reviews__attribution">
                <p className="home-reviews__author">James Mumby</p>
                <p className="home-reviews__tag">Home-Office Desk</p>
              </div>
            </article>
          </div>
          <div className="home-reviews__cta reveal">
            <Link href="/reviews">Read all reviews →</Link>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <div className="footer-brand reveal">
            <div className="footer-logo">ANVIL DESIGN & FABRICATION</div>
            <p className="footer-desc">A Cambridgeshire operated steel fabrication workshop focusing on handcrafted homeware and functional objects. Designed and built by hand using steel and wood sourced in the UK.</p>
          </div>
          <div className="footer-col reveal">
            <h4>Navigate</h4>
            <ul>
              <li><Link href="/portfolio/homeware">Homeware</Link></li>
              <li><Link href="/portfolio/objects">Objects</Link></li>
              <li><Link href="/reviews">Reviews</Link></li>
              <li><a href="#">Workshop</a></li>
            </ul>
          </div>
          <div className="footer-col reveal">
            <h4>Contact</h4>
            <ul>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col reveal">
            <h4>Follow</h4>
            <ul>
              <li><a href="https://www.instagram.com/anvil_fabrication" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://www.tiktok.com/@anvil_fabrication" target="_blank" rel="noopener noreferrer">TikTok</a></li>
              <li><a href="https://www.facebook.com/anvildesignandfabrication" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            </ul>
          </div>
          <div className="footer-bottom">
            <p>© 2020 ANVIL DESIGN & FABRICATION — All rights reserved</p>
            <p>Cambridgeshire, UK</p>
          </div>
        </footer>

      </div>

      <MobileMenu />
    </>
  );
}
