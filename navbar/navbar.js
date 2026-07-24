/**
 * NAVBAR — Hub Alumni Generation
 * Absorción tipo mercurio · Accesibilidad completa
 */
(function () {
  'use strict';

  const navbar     = document.getElementById('header-navbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!navbar) return;

  /* ── Scroll con requestAnimationFrame (60 fps garantizados) ── */
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY > 80;
        navbar.classList.toggle('scrolled', scrolled);
        if (!scrolled && mobileMenu.classList.contains('open')) closeMenu();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ── Menú móvil ── */
  function openMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', onClickOutside);
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', onClickOutside);
  }

  function onClickOutside(e) {
    if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  }

  hamburger?.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  /* Cierra el menú al elegir un enlace en móvil */
  mobileMenu.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', closeMenu)
  );

  /* Escape cierra el menú y devuelve el foco */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
      hamburger?.focus();
    }
  });

  /* ── Link activo según página actual ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navbar.querySelectorAll('.navegacion-principal a').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop();
    if (href === currentPage) link.classList.add('active');

    link.addEventListener('click', () => {
      navbar.querySelectorAll('.navegacion-principal a')
            .forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

})();


fetch("/navbar/navbar.html").then((resp) => resp.text()).then((html) => document.getElementById('navbar-container').innerHTML = html);
