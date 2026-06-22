

const formulario = document.querySelector("#formulario-contacto");
const btnFormulario = document.querySelector("#enviar-contacto");

btnFormulario.addEventListener('click', async (e) => {

    e.preventDefault();
    const formData = new FormData(formulario);

    const res = await fetch(`https://formspree.io/f/xojoqalr`, {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
        console.log('Enviado');
        formulario.reset();
    }
})



