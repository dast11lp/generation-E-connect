const historias = [
    {
        nombre: "Juan Rodríguez",
        empresa: "Teleperformance",
        tiempo: "2 meses",
        testimonio:
            "La sección de Networking fue clave. Conecté con un reclutador y a las dos semanas tenía trabajo.",
        rol: "IT Support",
        categoria: "IT",
        anio: "2023",
        foto: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        nombre: "María López",
        empresa: "Mercado Libre",
        tiempo: "4 meses",
        testimonio:
            "Gracias a las simulaciones de entrevista conseguí mi primer empleo.",
        rol: "Frontend Developer",
        categoria: "Java",
        anio: "2024",
        foto: "https://randomuser.me/api/portraits/women/44.jpg"
    }
];

let filtroActual = "todas";

function mostrarHistorias() {
  const contenedor = document.getElementById("tarjetas-historias");
  contenedor.innerHTML = "";

  const historiasFiltradas = filtroActual === "todas"
    ? historias
    : historias.filter(h => h.categoria === filtroActual);

  historiasFiltradas.forEach(historia => {
    contenedor.innerHTML += `
      <div class="card-historia">

        <div class="header-historia">

          <img
            src="${historia.foto}"
            alt="${historia.nombre}"
            class="foto-perfil">

          <div>
            <h3 class="nombre">${historia.nombre}</h3>

            <p class="empresa">
              ${historia.empresa} · ${historia.tiempo}
            </p>
          </div>

        </div>

        <p class="testimonio">
          "${historia.testimonio}"
        </p>

        <span class="badge-rol">
          ${historia.rol} · ${historia.anio}
        </span>

        <a href="#" class="btn-ver-mas">
          Ver más
        </a>

      </div>
    `;
  });
}

function inicializarFiltros() {
  const botones = document.querySelectorAll(".botones button");

  botones.forEach(boton => {
    boton.addEventListener("click", () => {
      
      botones.forEach(b => b.classList.remove("activo"));
      boton.classList.add("activo");

      filtroActual = boton.dataset.filtro;
      mostrarHistorias();
    });
  });
}

let indiceActual = 0;
let intervaloCarrusel = null;

function construirCarrusel() {
  const carrusel = document.getElementById("carrusel");

  const slides = historias.map(h => `
    <div class="carrusel-slide">
      <img src="${h.foto}" alt="${h.nombre}">
      <div>
        <p class="testimonio">"${h.testimonio}"</p>
        <p class="nombre">${h.nombre}</p>
        <p class="empresa">${h.empresa} · ${h.rol}</p>
      </div>
    </div>
  `).join("");

  const puntos = historias.map((_, i) => `
    <button class="carrusel-punto ${i === 0 ? "activo" : ""}" data-indice="${i}"></button>
  `).join("");

  carrusel.innerHTML = `
    <button class="carrusel-flecha anterior">&#10094;</button>
    <div class="carrusel-track">${slides}</div>
    <button class="carrusel-flecha siguiente">&#10095;</button>
    <div class="carrusel-puntos">${puntos}</div>
  `;

  const track = carrusel.querySelector(".carrusel-track");
  const puntosEls = carrusel.querySelectorAll(".carrusel-punto");
  const flechaAnterior = carrusel.querySelector(".anterior");
  const flechaSiguiente = carrusel.querySelector(".siguiente");

  function irASlide(indice) {
    indiceActual = (indice + historias.length) % historias.length;
    track.style.transform = `translateX(-${indiceActual * 100}%)`;

    puntosEls.forEach(p => p.classList.remove("activo"));
    puntosEls[indiceActual].classList.add("activo");
  }

  function reiniciarAutoplay() {
    clearInterval(intervaloCarrusel);
    intervaloCarrusel = setInterval(() => irASlide(indiceActual + 1), 4000);
  }

  flechaSiguiente.addEventListener("click", () => {
    irASlide(indiceActual + 1);
    reiniciarAutoplay();
  });

  flechaAnterior.addEventListener("click", () => {
    irASlide(indiceActual - 1);
    reiniciarAutoplay();
  });

  puntosEls.forEach(punto => {
    punto.addEventListener("click", () => {
      irASlide(Number(punto.dataset.indice));
      reiniciarAutoplay();
    });
  });

  reiniciarAutoplay();
}

function inicializarModal() {
  const modal = document.getElementById("modal-historia");
  const btnAbrir = document.getElementById("btn-agregar-historia");
  const btnCerrar = document.getElementById("btn-cerrar-modal");
  const form = document.getElementById("form-historia");

  btnAbrir.addEventListener("click", () => {
    modal.classList.remove("oculto");
  });

  btnCerrar.addEventListener("click", () => {
    modal.classList.add("oculto");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("oculto");
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fotoIngresada = document.getElementById("input-foto").value.trim();
    const fotoPorDefecto = "https://randomuser.me/api/portraits/lego/1.jpg";

    const nuevaHistoria = {
      nombre: document.getElementById("input-nombre").value.trim(),
      empresa: document.getElementById("input-empresa").value.trim(),
      tiempo: document.getElementById("input-tiempo").value.trim(),
      testimonio: document.getElementById("input-testimonio").value.trim(),
      rol: document.getElementById("input-rol").value.trim(),
      anio: document.getElementById("input-anio").value.trim(),
      categoria: document.getElementById("input-categoria").value,
      foto: fotoIngresada || fotoPorDefecto
    };

    historias.push(nuevaHistoria);

    form.reset();
    modal.classList.add("oculto");

    mostrarHistorias();
    construirCarrusel();
  });
}

mostrarHistorias();
inicializarFiltros();
construirCarrusel();
inicializarModal();
