let boton = document.getElementById("btn-next-step-1");

boton.addEventListener("click", function leerDatos(){
    let nombre = document.getElementById("first-name").value;
    let apellido = document.getElementById("last-name").value;
    let correo = document.getElementById("email").value;
    let contrasenia = document.getElementById("password").value;
    let confirmarContrasenia = document.getElementById("confirm-password").value;

    if (!nombre || !apellido || !correo || !contrasenia || !confirmarContrasenia) {
        error.textContent = "Complete todos los campos, para continuar."
        return
    }

    let conteo = contrasenia.length
    let tieneMayusculas = false
    let tieneNumero = false
    const comprobacion = contrasenia.split("");

    if (conteo >= 8) {
        for (let letra of comprobacion) {
            if (letra === letra.toUpperCase() && letra !== letra.toLowerCase()) {
                tieneMayusculas = true                
            }
            if (letra >= 0 && letra <= 9) {
                tieneNumero = true
            }
        }
        
        if (tieneMayusculas === true && tieneNumero === true) {
            correcto.textContent = "Su contraseña es valida"
        }else{
            contraseña.textContent = "Su contraseña no cumple con los requisitos."
            return
        }
    }else{
        contraseña.textContent = "Su contraseña no cumple con los requisitos."
        return
    }
});