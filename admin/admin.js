// cambios Jaime inicio
// const webinars
const grabaciones = [
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
    },
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
        categoria: "Guest Talk",
        titulo: "Cómo conseguí trabajo en una startup siendo junior",
        autor: "Paula Herrera",
        fecha: "May 2024",
        duracion: "48:22",
        thumbnail: "https://tobacco-img.stanford.edu/wp-content/uploads/antismoking/ad-knockoffs/camel-knockoffs/camel_1-300x211.jpg",
        link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
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

function mostrarGrabaciones(lista = grabaciones) {
    const contenedor = document.getElementById("tarjetas-grabaciones");

    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = `
            <h3>No se encontraron grabaciones.</h3>
        `;
        return;
    }

    lista.forEach(grabacion => {
        contenedor.innerHTML += `
            <a href="${grabacion.link}" class="card" target="_blank">

                <div class="thumbnail">
                    <img
                        src="${grabacion.thumbnail}"
                        alt="${grabacion.titulo}">
                    <span class="duracion">
                        ${grabacion.duracion}
                    </span>
                </div>

                <div class="card-content">
                    <span class="categoria">
                        ${grabacion.categoria}
                    </span>

                    <h3>${grabacion.titulo}</h3>

                    <p class="info">
                        ${grabacion.autor} · ${grabacion.fecha}
                    </p>
                </div>

            </a>
        `;
    });
}

mostrarGrabaciones();


// cambios Jaime final


const listaGrabaciones = grabaciones;

const btnBuscarSesiones = document.querySelector('.btn-buscar-sesiones');
btnBuscarSesiones.addEventListener('click', buscarFiltrarGrabaciones);

function buscarFiltrarGrabaciones() {

    const inputBusqueda = document.getElementById('busqueda-sesiones');
    const textoDigitado = inputBusqueda.value.trim().toLowerCase();

    // Si no escribió nada, mostrar todas
    if (textoDigitado === "") {
        mostrarGrabaciones();
        return;
    }

    const grabacionesEncontradas = listaGrabaciones.filter(grabacion =>
        grabacion.categoria.toLowerCase().includes(textoDigitado) ||
        grabacion.titulo.toLowerCase().includes(textoDigitado) ||
        grabacion.autor.toLowerCase().includes(textoDigitado)
    );
    mostrarGrabaciones(grabacionesEncontradas);
}


// function crearTarjetaGrabacionEncontrada(listraGrabaciones) {
//     const contenedorResultadoGrabaciones = document.querySelector('#tarjetas-grabaciones');
//     for (let grabacion of listaGrabaciones) {
//         let tarjeta = document.createElement('div');
//         tarjeta.innerHTML = `
            
//         `
//     }
// }
