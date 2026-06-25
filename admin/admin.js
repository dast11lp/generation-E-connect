// cambios Jaime inicio

const webinars = [
    {
        categoria: "Guest Talk",
        titulo: "Cómo conseguí trabajo en una startup siendo junior",
        autor: "Paula Herrera",
        fecha: "May 2024",
        duracion: "48:22",
        thumbnail: "https://tobacco-img.stanford.edu/wp-content/uploads/antismoking/ad-knockoffs/camel-knockoffs/camel_1-300x211.jpg",
        link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
        categoria: "Webinar",
        titulo: "LinkedIn para graduados: perfil, red y búsqueda activa",
        autor: "Equipo Generation",
        fecha: "Abr 2024",
        duracion: "1:12:05",
        thumbnail: "https://i.pinimg.com/736x/4b/f8/aa/4bf8aa9325637fbe1d59085741e102a5.jpg",
        link: "https://www.linkedin.com"
    },
    {
        categoria: "Taller",
        titulo: "Simula tu entrevista técnica",
        autor: "Equipo Generation",
        fecha: "Mar 2024",
        duracion: "55:41",
        thumbnail: "https://upload.wikimedia.org/wikipedia/en/4/46/JoeCamel.jpg",
        link: "https://www.generation.org"
    }
];

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

function mostrarWebinars() {
    const contenedor = document.getElementById("tarjetas-grabaciones");

    webinars.forEach(webinar => {
        contenedor.innerHTML += `
      <a href="${webinar.link}" class="card" target="_blank">

        <div class="thumbnail">
          <img
            src="${webinar.thumbnail}"
            alt="${webinar.titulo}"
          >

          <span class="duracion">
            ${webinar.duracion}
          </span>
        </div>

        <div class="card-content">

          <span class="categoria">
            ${webinar.categoria}
          </span>

          <h3>
            ${webinar.titulo}
          </h3>

          <p class="info">
            ${webinar.autor} · ${webinar.fecha}
          </p>

        </div>

      </a>
    `;
    });
}

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

mostrarWebinars();

mostrarHistorias();


// cambios Jaime final
const btnBuscarSesiones = document.querySelector('.btn-buscar-sesiones');
btnBuscarSesiones.addEventListener('click', buscarFiltrarGrabaciones);

function buscarFiltrarGrabaciones() {
    const inputBusqueda = document.getElementById('busqueda-sesiones');
    console.log("El botón funciona");
    console.log(inputBusqueda.value);
    
    const textoDigitado = inputBusqueda.value.trim().toLowerCase();

    if (textoDigitado != "") {
        const grabacionesEncontradas = listraGrabaciones.filter(grabacion => 
            grabacion.nombre?.toLowerCase().includes(textoDigitado));
        crearTarjetaGrabacionEncontrada(grabacionesEncontradas);
    } else {
        console.log("No se ha ingresado ninguna búsqueda");
    }
}

function crearTarjetaGrabacionEncontrada(listraGrabaciones) {
    const contenedorResultadoGrabaciones = document.querySelector('.grabaciones');
    for (let grabacion of listaGrabaciones) {
        let tarjeta = document.createElement('div');
        tarjeta.innerHTML = `
            
        `
    }
}
