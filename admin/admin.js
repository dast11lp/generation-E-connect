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
        return {
            video: datos.secure_url,
            thumbnail: `https://res.cloudinary.com/dd9iztlrv/video/upload/so_0/${datos.public_id}.jpg`
        };

    } catch (error) {
        console.log(error);
    }
}

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
            { validar: (valor) => valor !== "", mensaje: "Por favor agregar una descripción" },
        ]
    }
]

const mostrarError = (input, mensaje) => {
    input.nextElementSibling.textContent = mensaje;
}

function limpiarError(input) {
    input.nextElementSibling.textContent = "";
}

<<<<<<< HEAD

btnEnviarFormulario.addEventListener('click', async (e) => {
    
    e.preventDefault();

    //let grabacionesLocalStorage = JSON.parse(localStorage.getItem('grabaciones')) || [];
    let grabaciones = JSON.parse(localStorage.getItem('grabaciones')) || [];

    let valido = true;
    
    const tabActiva = document.querySelector(".tabs__list__tab--active").dataset.tab;
    
    let urlFInal = "";
    let thumbnailFinal = "";




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

        if (tabActiva === "1") {
        const archivoVideo = document.querySelector("#videoFile").files[0];

        const resultado = await subirVideoCloudinary(archivoVideo);

        urlFInal = resultado.video;
        thumbnailFinal = resultado.thumbnail;
    } else {
        if (inputURL.value === "") {
            mostrarError(inputURL, "campo vacío")
            valido = false;

        } else if (!regexURL.test(inputURL.value.trim())) {
            mostrarError(inputURL, "ingresa una url válida");
            valido = false;
        } else {
            urlFInal = inputURL.value;
            thumbnailFinal = "";
        }

    }

    const nuevoVideo = {
        //id: grabacionesLocalStorage.length + 1,
        id: grabaciones.length + 1,
        link: urlFInal,
<<<<<<< HEAD
        thumbnail:"img/default-video.png",
=======
        thumbnail: thumbnailFinal,
>>>>>>> 7dc58834c906c12142200283f8586da639dd22d5
        categoria: selectCategoria.value,
        titulo: descriptionArea.value,
        fecha: "Jun 2026",
        autor: "Goku",
        duracion: "59:59"
    }

<<<<<<< HEAD
    // grabacionesLocalStorage.push(nuevoVideo);
    grabaciones.push(nuevoVideo);
    formularioVideo.reset();
    // localStorage.setItem("grabaciones", JSON.stringify(grabacionesLocalStorage));
    localStorage.setItem("grabaciones", JSON.stringify(grabaciones));

    //console.log(grabacionesLocalStorage);
    mostrarGrabaciones();
    alert("Agregado correctamente");
=======
    grabacionesLocalStorage.push(nuevoVideo);
    
    localStorage.setItem("grabaciones", JSON.stringify(grabacionesLocalStorage));
    
    mostrarGrabaciones();
    formularioVideo.reset();
>>>>>>> 7dc58834c906c12142200283f8586da639dd22d5

})

// fin  formulario daniel

// cambios Jaime inicio
// const webinars
=======
>>>>>>> 265f7103f144afa4d6ecbabfd07f3e80b2d83f79
let grabaciones = [
    {
        id: 1,
        categoria: "Guest Talk",
        titulo: "Cómo conseguí trabajo en una startup siendo junior",
        autor: "Paula Herrera",
        fecha: "May 2024",
        duracion: "48:22",
        thumbnail: "https://tobacco-img.stanford.edu/wp-content/uploads/antismoking/ad-knockoffs/camel-knockoffs/camel_1-300x211.jpg",
        link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
        id: 2,
        categoria: "Webinar",
        titulo: "LinkedIn para graduados: perfil, red y búsqueda activa",
        autor: "Equipo Generation",
        fecha: "Abr 2024",
        duracion: "1:12:05",
        thumbnail: "https://i.pinimg.com/736x/4b/f8/aa/4bf8aa9325637fbe1d59085741e102a5.jpg",
        link: "https://www.linkedin.com"
    },
    {
        id: 3,
        categoria: "Taller",
        titulo: "Simula tu entrevista técnica",
        autor: "Equipo Generation",
        fecha: "Mar 2024",
        duracion: "55:41",
        thumbnail: "https://upload.wikimedia.org/wikipedia/en/4/46/JoeCamel.jpg",
        link: "https://www.generation.org"
    },
    {
        id: 4,
        categoria: "Guest Talk",
        titulo: "Cómo conseguí trabajo en una startup siendo junior",
        autor: "Paula Herrera",
        fecha: "May 2024",
        duracion: "48:22",
        thumbnail: "https://tobacco-img.stanford.edu/wp-content/uploads/antismoking/ad-knockoffs/camel-knockoffs/camel_1-300x211.jpg",
        link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
        id: 5,
        categoria: "Guest Talk",
        titulo: "Cómo conseguí trabajo en una startup siendo junior",
        autor: "Paula Herrera",
        fecha: "May 2024",
        duracion: "48:22",
        thumbnail: "https://tobacco-img.stanford.edu/wp-content/uploads/antismoking/ad-knockoffs/camel-knockoffs/camel_1-300x211.jpg",
        link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
];

<<<<<<< HEAD
<<<<<<< HEAD
// function seed () {
//     let grabacionesLocalStorage = JSON.parse(localStorage.getItem('grabaciones')) || []
//     localStorage.setItem("grabaciones", JSON.stringify(grabacionesLocalStorage));
// }
=======
let grabacionesLocalStorage = JSON.parse(localStorage.getItem('grabaciones')) || []  

function seed () {
    
=======
function seed() {
    const grabacionesLocalStorage = JSON.parse(localStorage.getItem('grabaciones')) || []
>>>>>>> 265f7103f144afa4d6ecbabfd07f3e80b2d83f79
    if (grabacionesLocalStorage.length === 0) {
        localStorage.setItem("grabaciones", JSON.stringify(grabaciones));
    }
}
>>>>>>> 7dc58834c906c12142200283f8586da639dd22d5

seed();

function mostrarGrabaciones(lista = []) {
<<<<<<< HEAD
    
<<<<<<< HEAD
    let grabaciones = JSON.parse(localStorage.getItem('grabaciones')) || [];
=======
    seed()
    
=======
>>>>>>> 265f7103f144afa4d6ecbabfd07f3e80b2d83f79
    if (lista.length === 0) {
        lista = JSON.parse(localStorage.getItem('grabaciones')) || []
    }
>>>>>>> 7dc58834c906c12142200283f8586da639dd22d5

    const contenedor = document.getElementById("tarjetas-grabaciones");
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = `<h3>No se encontraron grabaciones.</h3>`;
        return;
    }

    lista.forEach(grabacion => {
        contenedor.innerHTML += `
            <a href="${grabacion.link}" class="card" target="_blank">
                <div class="thumbnail">
                    <img src="${grabacion.thumbnail}" alt="${grabacion.titulo}">
                    <span class="duracion">${grabacion.duracion}</span>
                </div>
                <div class="card-content">
                    <span class="categoria">${grabacion.categoria}</span>
                    <h3>${grabacion.titulo}</h3>
                    <p class="info">${grabacion.autor} · ${grabacion.fecha}</p>
                </div>
            </a>
        `;
    });
}

mostrarGrabaciones();

btnEnviarFormulario.addEventListener('click', async (e) => {
    e.preventDefault();

    seed();
    let grabacionesLocalStorage = JSON.parse(localStorage.getItem('grabaciones')) || []

    let valido = true;
    const tabActiva = document.querySelector(".tabs__list__tab--active").dataset.tab;
    let urlFInal = "";
    let thumbnailFinal = "";

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

    if (tabActiva === "1") {
        const archivoVideo = document.querySelector("#videoFile").files[0];
        const resultado = await subirVideoCloudinary(archivoVideo);
        urlFInal = resultado.video;
        thumbnailFinal = resultado.thumbnail;
    } else {
        if (inputURL.value === "") {
            mostrarError(inputURL, "campo vacío")
            valido = false;
        } else if (!regexURL.test(inputURL.value.trim())) {
            mostrarError(inputURL, "ingresa una url válida");
            valido = false;
        } else {
            urlFInal = inputURL.value;
            thumbnailFinal = "";
        }
    }

    if (!valido) return

    const nuevoVideo = {
        id: grabacionesLocalStorage.length + 1,
        link: urlFInal,
        thumbnail: thumbnailFinal,
        categoria: selectCategoria.value,
        titulo: descriptionArea.value,
        fecha: "Jun 2026",
        autor: "Goku",
        duracion: "59:59"
    }

    grabacionesLocalStorage.push(nuevoVideo);
    localStorage.setItem("grabaciones", JSON.stringify(grabacionesLocalStorage));
    mostrarGrabaciones();
    formularioVideo.reset();
})

const btnBuscarSesiones = document.querySelector('.btn-buscar-sesiones');
btnBuscarSesiones.addEventListener('click', buscarFiltrarGrabaciones);

function buscarFiltrarGrabaciones() {
    const listaGrabaciones = JSON.parse(localStorage.getItem('grabaciones')) || [];
    const inputBusqueda = document.getElementById('busqueda-sesiones');
    const textoDigitado = inputBusqueda.value.trim().toLowerCase();

    if (textoDigitado === "") {
        mostrarGrabaciones();
        return;
    }

    const grabacionesEncontradas = listaGrabaciones.filter(grabacion =>
        grabacion.categoria.toLowerCase().includes(textoDigitado) ||
        grabacion.titulo.toLowerCase().includes(textoDigitado) ||
        grabacion.autor.toLowerCase().includes(textoDigitado)
    );

    if (grabacionesEncontradas.length === 0) {
        const contenedor = document.getElementById("tarjetas-grabaciones");
        contenedor.innerHTML = `<h3>Tu busqueda no dio resultados.</h3>`;
        return;
    }

    mostrarGrabaciones(grabacionesEncontradas);
}