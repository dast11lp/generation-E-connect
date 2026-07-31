/**
 * PROFILE — Hub Alumni Generation
 * Lógica de la vista de perfil del mentor
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════
     NAVBAR — absorción tipo mercurio
     ══════════════════════════════════════ */
  const navbar     = document.getElementById('header-navbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (navbar) {
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
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) closeMenu();
    }

    if (hamburger) {
      hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
      });
    }

    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
        hamburger.focus();
      }
    });
  }

  /* ══════════════════════════════════════
     MODALES
     ══════════════════════════════════════ */
  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.removeAttribute('hidden');
    /* Fuerza reflow para que la transición dispare */
    modal.offsetHeight;
    modal.style.opacity = '1';
    document.body.style.overflow = 'hidden';

    /* Foco al primer campo */
    const firstFocusable = modal.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) setTimeout(() => firstFocusable.focus(), 50);

    /* Trampa de foco */
    modal.addEventListener('keydown', trapFocus);
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.setAttribute('hidden', '');
      modal.style.opacity = '';
    }, 300);
    document.body.style.overflow = '';
    modal.removeEventListener('keydown', trapFocus);
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const focusable = [...e.currentTarget.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )].filter(el => !el.disabled && el.offsetParent !== null);
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  }

  /* Cierra el modal al hacer clic en el overlay */
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  /* Cierra con Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal-overlay:not([hidden])').forEach(m => closeModal(m.id));
  });

  /* Exponer globalmente para los onclick del HTML */
  window.openModal  = openModal;
  window.closeModal = closeModal;

  /* ══════════════════════════════════════
     ENVÍO DE FORMULARIOS (mocked)
     ══════════════════════════════════════ */
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.profile-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `profile-toast profile-toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <i class="ti ti-${type === 'success' ? 'circle-check' : 'alert-circle'}"></i>
      <span>${message}</span>
    `;

    const style = document.createElement('style');
    style.id = 'toast-style';
    if (!document.getElementById('toast-style')) {
      style.textContent = `
        .profile-toast {
          position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(10px);
          z-index: 3000; display: flex; align-items: center; gap: 8px;
          padding: 12px 20px; border-radius: 100px; font-size: 14px; font-weight: 500;
          box-shadow: 0 8px 28px rgba(0,58,112,.25);
          animation: toastIn .4s cubic-bezier(.34,1.56,.64,1) forwards;
          font-family: Montserrat, sans-serif;
        }
        .profile-toast--success {
          background: #00B87D;
          border: 1px solid #32b34d; color: #FFFFFF;
        }
        .profile-toast--error {
          background: #D64545;
          border: 1px solid #b93838; color: #FFFFFF;
        }
        .profile-toast i { font-size: 18px; }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity .3s ease, transform .3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => toast.remove(), 350);
    }, 3500);
  }

  /* Solicitar sesión */
  const btnSesion = document.querySelector('#modal-sesion .btn-cta-primary');
  if (btnSesion) {
    btnSesion.addEventListener('click', () => {
      const tipo  = document.getElementById('sesion-tipo')?.value;
      const tema  = document.getElementById('sesion-tema')?.value.trim();
      const fecha = document.getElementById('sesion-fecha')?.value;

      if (!tipo || !tema || !fecha) {
        showToast('Por favor completa todos los campos.', 'error');
        return;
      }
      closeModal('modal-sesion');
      showToast('¡Solicitud enviada! Alejandro te responderá en menos de 24 h.');
      /* Resetear */
      document.getElementById('sesion-tipo').value = '';
      document.getElementById('sesion-tema').value = '';
      document.getElementById('sesion-fecha').value = '';
    });
  }

  /* Enviar mensaje */
  const btnMensaje = document.querySelector('#modal-mensaje .btn-cta-primary');
  if (btnMensaje) {
    btnMensaje.addEventListener('click', () => {
      const asunto = document.getElementById('msg-asunto')?.value.trim();
      const texto  = document.getElementById('msg-texto')?.value.trim();

      if (!asunto || !texto) {
        showToast('Por favor completa el asunto y el mensaje.', 'error');
        return;
      }
      closeModal('modal-mensaje');
      showToast('Mensaje enviado. Alejandro te responderá pronto.');
      document.getElementById('msg-asunto').value = '';
      document.getElementById('msg-texto').value  = '';
    });
  }

  /* ══════════════════════════════════════
     VER MÁS RESEÑAS
     ══════════════════════════════════════ */
  const btnLoadMore = document.querySelector('.btn-load-more');
  if (btnLoadMore) {
    const extraReviews = [
      { ava: 'SP', avaCls: 'rev-ava-purple', name: 'Sandra Patiño', meta: 'Unity · 2 meses · Abril 2026',
        text: 'Construí mi portafolio siguiendo sus consejos. A la semana de publicarlo me contactaron tres empresas.' },
      { ava: 'DM', avaCls: 'rev-ava-green',  name: 'Diego Mora',    meta: 'IT Support · 1 mes · Mayo 2026',
        text: 'Muy puntual, muy directo. Valoro especialmente que no te da respuestas genéricas, sino adaptadas a tu caso.' },
    ];

    btnLoadMore.addEventListener('click', () => {
      const list = document.querySelector('.reviews-list');
      extraReviews.forEach(r => {
        const li = document.createElement('li');
        li.className = 'review-item';
        li.innerHTML = `
          <div class="review-top">
            <div class="rev-ava ${r.avaCls}" aria-hidden="true">${r.ava}</div>
            <div class="rev-info">
              <h4>${r.name}</h4>
              <p>${r.meta}</p>
            </div>
            <div class="stars" aria-label="5 estrellas">
              <i class="ti ti-star" aria-hidden="true"></i>
              <i class="ti ti-star" aria-hidden="true"></i>
              <i class="ti ti-star" aria-hidden="true"></i>
              <i class="ti ti-star" aria-hidden="true"></i>
              <i class="ti ti-star" aria-hidden="true"></i>
            </div>
          </div>
          <p class="review-text">"${r.text}"</p>
        `;
        li.style.opacity = '0';
        li.style.transform = 'translateY(10px)';
        li.style.transition = 'opacity .4s ease, transform .4s ease';
        list.appendChild(li);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          li.style.opacity = '1';
          li.style.transform = 'none';
        }));
      });
      btnLoadMore.textContent = 'No hay más reseñas';
      btnLoadMore.disabled = true;
      btnLoadMore.style.opacity = '.5';
      btnLoadMore.style.cursor  = 'default';
    });
  }

  /* ══════════════════════════════════════
     ANIMACIÓN DE ENTRADA — IntersectionObserver
     ══════════════════════════════════════ */
  const animStyle = document.createElement('style');
  animStyle.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(18px);
      transition: opacity .5s ease, transform .5s cubic-bezier(.22,1,.36,1);
    }
    .reveal.visible {
      opacity: 1;
      transform: none;
    }
  `;
  document.head.appendChild(animStyle);

  const cards = document.querySelectorAll('.glass-card, .profile-hero .hero-inner, .profile-hero .hero-tagline, .profile-hero .hero-stats');
  cards.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 60}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* ══════════════════════════════════════
     GUARDAR / COMPARTIR (mocked)
     ══════════════════════════════════════ */
  /* Estos botones están en el navbar del widget anterior;
     si los añades al HTML puedes conectarlos aquí:

  document.getElementById('btn-guardar')?.addEventListener('click', () => {
    showToast('Mentor guardado en tu lista de favoritos.');
  });

  document.getElementById('btn-compartir')?.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({ title: 'Perfil mentor — Hub Alumni', url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Enlace copiado al portapapeles.');
    }
  });
  */

})();
