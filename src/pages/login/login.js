import { login } from "../../services/auth.service.js";
import { ApiError } from "../../services/api-client.js";

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
let submitButton = form.querySelector(".btn-submit")

form.addEventListener("submit", async function(e) {
    e.preventDefault()  // evita que el form recargue la página

    let emailIngresado = document.getElementById("email").value.trim()
    let passwordIngresada = document.getElementById("password").value.trim()

    submitButton.disabled = true
    submitButton.textContent = "Ingresando..."

    try {
        await login(emailIngresado, passwordIngresada)
        window.location.href = "../home/home.html"
    } catch (error) {
        const mensaje = error instanceof ApiError
            ? error.message
            : "No fue posible conectar con el servidor. Intenta de nuevo."
        mostrarError(mensaje)
    } finally {
        submitButton.disabled = false
        submitButton.textContent = "Ingresar al Portal"
    }
})

function mostrarError(mensaje) {
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