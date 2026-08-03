/**
 * PROFILE — Hub Alumni Generation
 * Lógica de la vista de perfil del mentor
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════
     DATOS DEL PERFIL
     Mismo esquema que mentorData en register.js,
     para que ambos formularios sean compatibles.
     ══════════════════════════════════════ */
  const PROFILE_STORAGE_KEY = 'generationAlumniMentorProfile';

  const AREA_OPTIONS = [
    { value: 'programacion',  label: 'Programación',            icon: 'ti-code' },
    { value: 'empleo',        label: 'Búsqueda de empleo',      icon: 'ti-search' },
    { value: 'networking',    label: 'Networking',              icon: 'ti-users' },
    { value: 'cv',            label: 'CV y LinkedIn',           icon: 'ti-file-text' },
    { value: 'entrevistas',   label: 'Entrevistas',             icon: 'ti-microphone' },
    { value: 'salario',       label: 'Negociación salarial',    icon: 'ti-coin' },
    { value: 'ingles',        label: 'Inglés técnico',          icon: 'ti-language' },
    { value: 'crecimiento',   label: 'Crecimiento profesional', icon: 'ti-rocket' },
  ];

  const MENTOR_TYPE_OPTIONS = [
    { value: 'video', label: 'Videollamada',    desc: 'Google Meet o Zoom',        icon: 'ti-video' },
    { value: 'chat',  label: 'Chat / escrito',  desc: 'Preguntas entre sesiones',  icon: 'ti-message-2' },
    { value: 'cv',    label: 'Revisión de CV',  desc: 'Feedback escrito detallado',icon: 'ti-file-check' },
    { value: 'group', label: 'Grupal',          desc: 'Sesiones para varios Alumni', icon: 'ti-users' },
  ];

  const PROGRAM_LABELS = {
    java: 'FullStack Java',
    unity: 'Desarrollador Unity',
    support: 'IT Support',
    analytics: 'Data Analytics',
  };

  const defaultProfileData = {
    firstName: 'Alejandro',
    lastName: 'Saldaña',
    email: 'alejandro@empresa.com',
    profileImage: '../assets/images/logos/usuario-negra.png',
    linkedin: 'https://linkedin.com/in/alejandro-saldana',
    about: '"Desarrollador backend con más de 7 años en Java y Spring Boot. Fui alumno de bootcamp — entiendo exactamente lo que están viviendo y cómo ayudarlos a dar el siguiente paso con confianza real."',
    generationProgram: 'java',
    skills: ['Java', 'Spring Boot', 'APIs REST', 'Docker', 'AWS', 'Microservicios', 'PostgreSQL', 'Git', 'CI/CD', 'Testing'],
    mentorAreas: ['programacion', 'entrevistas', 'cv', 'salario', 'empleo', 'crecimiento', 'networking', 'ingles'],
    mentorType: ['video', 'cv', 'chat'],
  };

  function loadProfileData() {
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!raw) return { ...defaultProfileData };
      return { ...defaultProfileData, ...JSON.parse(raw) };
    } catch (error) {
      console.error('Error leyendo el perfil desde localStorage:', error);
      return { ...defaultProfileData };
    }
  }

  let profileData = loadProfileData();

  function renderProfile(data) {
    document.getElementById('avatarPhoto').src = data.profileImage;
    document.getElementById('editPhotoPreview').src = data.profileImage;
    document.getElementById('profileFullName').textContent = `${data.firstName} ${data.lastName}`.trim();
    document.getElementById('profileQuote').textContent = data.about || '';

    const programChip = document.getElementById('programChip');
    if (data.generationProgram && PROGRAM_LABELS[data.generationProgram]) {
      programChip.textContent = PROGRAM_LABELS[data.generationProgram];
      programChip.hidden = false;
    } else {
      programChip.hidden = true;
    }

    const linkedinTop = document.getElementById('linkedinBtnTop');
    if (linkedinTop) linkedinTop.href = data.linkedin || '#';

    const contactLinkedin = document.getElementById('contactLinkedinRow');
    const contactLinkedinText = document.getElementById('contactLinkedinText');
    if (contactLinkedin && contactLinkedinText) {
      contactLinkedin.href = data.linkedin || '#';
      contactLinkedinText.textContent = data.linkedin
        ? data.linkedin.replace(/^https?:\/\//, '')
        : 'Sin LinkedIn registrado';
    }

    const contactEmail = document.getElementById('contactEmailRow');
    const contactEmailText = document.getElementById('contactEmailText');
    if (contactEmail && contactEmailText) {
      contactEmail.href = `mailto:${data.email}`;
      contactEmailText.textContent = data.email;
    }

    /* Áreas de expertise */
    const areasGrid = document.getElementById('areasGridDisplay');
    if (areasGrid) {
      areasGrid.innerHTML = AREA_OPTIONS
        .filter(opt => data.mentorAreas.includes(opt.value))
        .map(opt => `<li class="area-pill"><i class="ti ${opt.icon}" aria-hidden="true"></i><span>${opt.label}</span></li>`)
        .join('');
    }

    /* Habilidades */
    const skillsWrap = document.getElementById('skillsWrapDisplay');
    if (skillsWrap) {
      skillsWrap.innerHTML = data.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
    }

    /* Tipo de mentoría */
    const tipoGrid = document.getElementById('tipoGridDisplay');
    if (tipoGrid) {
      tipoGrid.innerHTML = MENTOR_TYPE_OPTIONS.map(opt => {
        const active = data.mentorType.includes(opt.value);
        return `
          <li class="tipo-card ${active ? 'tipo-card-active' : 'tipo-card-off'}">
            <i class="ti ${opt.icon}" aria-hidden="true"></i>
            <div><h4>${opt.label}</h4><p>${active ? opt.desc : 'No disponible ahora'}</p></div>
          </li>`;
      }).join('');
    }
  }

  renderProfile(profileData);

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

  /* ══════════════════════════════════════
     EDITAR PERFIL — modal basado en register
     ══════════════════════════════════════ */
  let editSkillsTemp = [];
  let editPhotoTemp  = null;

  function renderEditSkills() {
    const list = document.getElementById('editSkillsList');
    if (!list) return;
    list.innerHTML = editSkillsTemp.map((skill, i) => `
      <span class="skill-tag-edit">
        <span>${skill}</span>
        <button type="button" data-index="${i}" aria-label="Eliminar ${skill}">&times;</button>
      </span>
    `).join('');

    list.querySelectorAll('button[data-index]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        editSkillsTemp.splice(idx, 1);
        renderEditSkills();
      });
    });
  }

  function addEditSkill() {
    const input = document.getElementById('editSkillInput');
    const value = input.value.trim();
    if (!value) return;

    const exists = editSkillsTemp.some(s => s.toLowerCase() === value.toLowerCase());
    if (exists) {
      showToast('Esa habilidad ya fue agregada.', 'error');
      input.value = '';
      return;
    }
    editSkillsTemp.push(value);
    input.value = '';
    renderEditSkills();
  }

  function renderEditAreasGrid(selected) {
    const grid = document.getElementById('editAreasGrid');
    if (!grid) return;
    grid.innerHTML = AREA_OPTIONS.map(opt => `
      <label class="tag-select">
        <input type="checkbox" name="editMentorAreas" value="${opt.value}" ${selected.includes(opt.value) ? 'checked' : ''}>
        <span>${opt.label}</span>
      </label>
    `).join('');
  }

  function renderEditMentorTypeGrid(selected) {
    const grid = document.getElementById('editMentorTypeGrid');
    if (!grid) return;
    grid.innerHTML = MENTOR_TYPE_OPTIONS.map(opt => `
      <label class="mentor-type-select">
        <input type="checkbox" name="editMentorType" value="${opt.value}" ${selected.includes(opt.value) ? 'checked' : ''}>
        <i class="ti ${opt.icon}" aria-hidden="true"></i>
        <span>${opt.label}</span>
      </label>
    `).join('');
  }

  function openEditProfileModal() {
    document.getElementById('editFirstName').value = profileData.firstName;
    document.getElementById('editLastName').value  = profileData.lastName;
    document.getElementById('editEmail').value     = profileData.email;
    document.getElementById('editLinkedin').value  = profileData.linkedin;
    document.getElementById('editAbout').value     = profileData.about;
    document.getElementById('editProgram').value   = profileData.generationProgram;

    const counter = document.getElementById('editAboutCounter');
    if (counter) counter.textContent = `${profileData.about.length} / 500`;

    document.getElementById('editPhotoPreview').src = profileData.profileImage;
    editPhotoTemp = null;

    editSkillsTemp = [...profileData.skills];
    renderEditSkills();

    renderEditAreasGrid(profileData.mentorAreas);
    renderEditMentorTypeGrid(profileData.mentorType);

    openModal('modal-editar-perfil');
  }
  window.openEditProfileModal = openEditProfileModal;

  const editAboutInput = document.getElementById('editAbout');
  if (editAboutInput) {
    editAboutInput.addEventListener('input', () => {
      const counter = document.getElementById('editAboutCounter');
      if (counter) counter.textContent = `${editAboutInput.value.length} / 500`;
    });
  }

  const editSkillAddBtn = document.getElementById('editSkillAddBtn');
  if (editSkillAddBtn) editSkillAddBtn.addEventListener('click', addEditSkill);

  const editSkillInput = document.getElementById('editSkillInput');
  if (editSkillInput) {
    editSkillInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addEditSkill();
      }
    });
  }

  const editProfileImageInput = document.getElementById('editProfileImage');
  if (editProfileImageInput) {
    editProfileImageInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const maxSizeInBytes = 5 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        showToast('La imagen supera el tamaño máximo de 5 MB.', 'error');
        editProfileImageInput.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById('editPhotoPreview').src = e.target.result;
        editPhotoTemp = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function isValidEmailProfile(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const btnGuardarPerfil = document.getElementById('btnGuardarPerfil');
  if (btnGuardarPerfil) {
    btnGuardarPerfil.addEventListener('click', () => {
      const firstName = document.getElementById('editFirstName').value.trim();
      const lastName  = document.getElementById('editLastName').value.trim();
      const email     = document.getElementById('editEmail').value.trim();

      if (!firstName || !lastName) {
        showToast('Nombres y apellidos son obligatorios.', 'error');
        return;
      }
      if (!email || !isValidEmailProfile(email)) {
        showToast('Ingresa un correo electrónico válido.', 'error');
        return;
      }

      const selectedAreas = Array.from(
        document.querySelectorAll('#editAreasGrid input[name="editMentorAreas"]:checked')
      ).map(el => el.value);

      const selectedTypes = Array.from(
        document.querySelectorAll('#editMentorTypeGrid input[name="editMentorType"]:checked')
      ).map(el => el.value);

      profileData = {
        firstName,
        lastName,
        email,
        profileImage: editPhotoTemp || profileData.profileImage,
        linkedin: document.getElementById('editLinkedin').value.trim(),
        about: document.getElementById('editAbout').value.trim(),
        generationProgram: document.getElementById('editProgram').value,
        skills: [...editSkillsTemp],
        mentorAreas: selectedAreas,
        mentorType: selectedTypes,
      };

      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
      renderProfile(profileData);
      closeModal('modal-editar-perfil');
      showToast('¡Perfil actualizado correctamente!');
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

  const cards = document.querySelectorAll('.glass-card, .description-mentor, .statistics-mentor');
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
