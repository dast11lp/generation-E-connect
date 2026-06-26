const historias = [
    {
        nombre: "Juan Rodríguez",
        empresa: "Teleperformance",
        tiempo: "2 meses",
        testimonio:
            "La sección de Networking fue clave. Conecté con un reclutador y a las dos semanas tenía trabajo.",
        rol: "IT Support",
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
        anio: "2024",
        foto: "https://randomuser.me/api/portraits/women/44.jpg"
    }
];

function mostrarHistorias() {
  const contenedor = document.getElementById("tarjetas-historias");

  historias.forEach(historia => {
    contenedor.innerHTML += `
      <div class="card-historia">

        <div class="header-historia">

          <img
            src="${historia.foto}"
            alt="${historia.nombre}"
            class="foto-perfil"
          >

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

mostrarHistorias();