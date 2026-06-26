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