'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function MobileMenu() {
  useEffect(() => {
    const menuBtn    = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!menuBtn || !mobileMenu) return;

    const circle   = mobileMenu.querySelector('.mobile-menu__circle');
    const closeBtn = mobileMenu.querySelector('.mobile-menu__close');

    function openMenu() {
      const r = menuBtn.getBoundingClientRect();
      circle.style.left = (r.left + r.width  / 2 - 6) + 'px';
      circle.style.top  = (r.top  + r.height / 2 - 6) + 'px';
      mobileMenu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', openMenu);
    closeBtn?.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', closeMenu);
    });

    return function() {
      menuBtn.removeEventListener('click', openMenu);
    };
  }, []);

  return (
    <div className="mobile-menu" id="mobile-menu">
      <div className="mobile-menu__circle" />
      <div className="mobile-menu__content">
        <nav className="mobile-menu__nav">
          <a href="#">Store</a>
          <Link href="/portfolio/homeware">Homeware</Link>
          <Link href="/portfolio/objects">Objects</Link>
          <Link href="/reviews">Reviews</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
      <button className="mobile-menu__close" aria-label="Close menu">
        <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6" cy="6" r="6" />
        </svg>
      </button>
    </div>
  );
}
