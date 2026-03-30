(function () {
  'use strict';

  // ─── Custom cursor ────────────────────────────────────────────────────────
  const cursor = document.getElementById('cursor');

  document.addEventListener('mousemove', function (e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .portfolio-card, .filter-tag').forEach(function (el) {
    el.addEventListener('mouseenter', function () { cursor.classList.add('hover'); });
    el.addEventListener('mouseleave', function () { cursor.classList.remove('hover'); });
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
    setInterval(updateClock, 1000);
  }

  // ─── Nav visible immediately (no animation on portfolio pages) ───────────
  const nav = document.getElementById('site-nav');
  if (nav) {
    nav.classList.add('is-visible');
  }

  // ─── Filter system ────────────────────────────────────────────────────────
  const filterTags = document.querySelectorAll('.filter-tag');
  const cards      = document.querySelectorAll('.portfolio-card');

  filterTags.forEach(function (tag) {
    tag.addEventListener('click', function () {
      // Update active tag
      filterTags.forEach(function (t) { t.classList.remove('active'); });
      tag.classList.add('active');

      const selected = tag.dataset.filter;

      cards.forEach(function (card) {
        if (selected === 'all' || card.dataset.category === selected) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
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
  // Each .portfolio-grid-row gets staggered children when it enters view
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

}());
