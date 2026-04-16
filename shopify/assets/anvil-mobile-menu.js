/**
 * ANVIL — Mobile menu toggle (shared between hero + global nav)
 * Self-contained; runs on DOMContentLoaded.
 */
(function () {
  function wireUp() {
    var btn   = document.getElementById('anvil-mobile-menu-btn');
    var menu  = document.getElementById('anvil-mobile-menu');
    var close = document.getElementById('anvil-mobile-menu-close');
    if (!btn || !menu) return;

    var circle = menu.querySelector('.anvil-mobile-menu__circle');

    function openMenu() {
      var r = btn.getBoundingClientRect();
      if (circle) {
        circle.style.left = (r.left + r.width / 2 - 6) + 'px';
        circle.style.top  = (r.top  + r.height / 2 - 6) + 'px';
      }
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', openMenu);
    if (close) close.addEventListener('click', closeMenu);
    menu.querySelectorAll('.anvil-mobile-menu__nav a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireUp);
  } else {
    wireUp();
  }
})();
