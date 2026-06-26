// inicio formulario daniel
const formularioVideo = document.querySelector("#formulario_video");

const selectCategoria = document.querySelector("#category")
const inputURL = document.querySelector("#videoUrl");
const descriptionArea = document.querySelector("#description");


const btnEnviarFormulario = document.querySelector("#send");

const spanError = document.querySelectorAll('.error')


const tabSeccion = document.querySelector('.tabs')
const tabList = document.querySelectorAll('.tabs__list__tab')
const tabContent = document.querySelectorAll('.tabs__content')

const regexURL = /^(https?:\/\/)([\w\-]+\.)+[\w]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?$/



tabSeccion.addEventListener('click', ({ target }) => {
    const tab = target.closest('.tabs__list__tab');
    if (!tab) return;

    tabList.forEach((el) => {
        el.classList.remove("tabs__list__tab--active")
    });
    target.classList.add("tabs__list__tab--active");

    tabContent.forEach((el) => {
        el.classList.remove("tabs__content--active")
    })
    document.querySelector(`.tabs__content--${tab.dataset.tab}`).classList.add("tabs__content--active");
})

// capturar video 

const subirVideoCloudinary = async (archivo) => {
    try {
        if (!archivo) {
            console.log("inserta un archivo de video");
            return
        }

        const tipoArchivo = archivo.type.split("/")[0]

        if (tipoArchivo !== 'video') {
            console.log("por favor ingresar un archivo de video");
            return
        }

        const formData = new FormData();
        formData.append("file", archivo);
        formData.append("upload_preset", "ml_default");
        formData.append("folder", "alumni/cursos/")

        const respuesta = await fetch("https://api.cloudinary.com/v1_1/dd9iztlrv/video/upload", {
            method: "POST",
            body: formData
        })


        if (!respuesta.ok) {
            console.log("Error al subir el video, intenta de nuevo");
            return
        }

        const datos = await respuesta.json();
        return datos.secure_url;


    } catch (error) {
        console.log(error);
    }
}

// validar formulario

const camposFormulario = [
    {
        input: selectCategoria,
        validaciones: [
            { validar: (valor) => valor !== "", mensaje: "selecciona una categoría" },
        ],

    },
    {
        input: descriptionArea,
        validaciones: [
            { validar: (valor) => valor !== "", mensaje: "Por favor agregar una descripción", },
        ]
    }
]

const mostrarError = (input, mensaje) => {
    input.nextElementSibling.textContent = mensaje;
}

function limpiarError(input) {
    input.nextElementSibling.textContent = "";
}


btnEnviarFormulario.addEventListener('click', async (e) => {

    e.preventDefault();
    let valido = true;

    const tabActiva = document.querySelector(".tabs__list__tab--active").dataset.tab;

    let urlFInal = "";

    if (tabActiva === "1") {
        const archivoVideo = document.querySelector("#videoFile").files[0];
        urlFInal = await subirVideoCloudinary(archivoVideo)
    } else {
        if (inputURL.value === "") {
            mostrarError(inputURL, "campo vacío")
            valido = false;

        } else if (!regexURL.test(inputURL.value.trim())) {
            mostrarError(inputURL, "ingresa una url válida");
            valido = false;
        } else {
            urlFInal = inputURL.value;
        }

    }


    camposFormulario.forEach(campo => {
        limpiarError(campo.input);
        for (const validacion of campo.validaciones) {
            if (!validacion.validar(campo.input.value)) {
                mostrarError(campo.input, validacion.mensaje);
                valido = false;
                break;
            }
        }
    });

    if (!valido) return

    const nuevoVideo = {
        url: urlFInal,
        categoria: selectCategoria.value,
        descripcion: descriptionArea.value
    }

    console.log(nuevoVideo);
    grabaciones.push(nuevoVideo);
    
    localStorage.setItem("videos", JSON.stringify(grabaciones));


})

// fin  formulario daniel

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
