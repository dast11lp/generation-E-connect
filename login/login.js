// mostrar/ocultar contraseña
let togglePassword = document.getElementById("toggle-password")
let inputPassword = document.getElementById("password")

togglePassword.addEventListener("click", function() {
    if (inputPassword.type === "password") {
        inputPassword.type = "text"
    } else {
        inputPassword.type = "password"
    }
})

// login
let form = document.getElementById("login-form")

form.addEventListener("submit", function(e) {
    e.preventDefault()  // evita que el form recargue la página

    let emailIngresado = document.getElementById("email").value.trim()
    let passwordIngresada = document.getElementById("password").value.trim()

    // traer usuarios guardados en sessionStorage
    let usuarios = JSON.parse(localStorage.getItem("generationAlumniMentors")) || []

    // buscar si existe un usuario con ese correo y contraseña
    let usuarioEncontrado = usuarios.find(function(usuario) {
        return usuario.email === emailIngresado && usuario.password === passwordIngresada
    })

    if (usuarioEncontrado) {
        // guardar sesión activa
        localStorage.setItem("sesionActiva", JSON.stringify(usuarioEncontrado))
        // redirigir a about
        window.location.href = "../home/home.html"
    } else {
        mostrarError("Correo o contraseña incorrectos. Verifica tus datos.")
    }
})

function mostrarError(mensaje) {
    // verificar si ya existe un mensaje de error
    let errorExistente = document.getElementById("login-error")
    if (errorExistente) {
        errorExistente.remove()
    }

    let error = document.createElement("p")
    error.id = "login-error"
    error.textContent = mensaje
    error.style.color = "#dc2626"
    error.style.fontSize = "13px"
    error.style.textAlign = "center"
    error.style.marginTop = "8px"

    // lo inserta después del botón de submit
    let boton = document.querySelector(".btn-submit")
    boton.insertAdjacentElement("afterend", error)
}