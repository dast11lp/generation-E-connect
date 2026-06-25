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