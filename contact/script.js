

const formulario = document.querySelector("#formulario-contacto");
const btnFormulario = document.querySelector("#enviar-contacto");

function validar() {
  const reglas = [
    { campo: "#name",    error: "#error-name",    test: v => v.trim().length >= 2,                          msg: "El nombre debe tener al menos 2 caracteres." },
    { campo: "#email",   error: "#error-email",   test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),         msg: "Ingresa un correo válido." },
    { campo: "#number",  error: "#error-number",  test: v => !v.trim() || /^\+?[\d\s\-(). ]{7,20}$/.test(v), msg: "Teléfono inválido." },
    { campo: "#message", error: "#error-message", test: v => v.trim().length >= 10,                         msg: "El mensaje debe tener al menos 10 caracteres." },
  ];

  let valido = true;

  reglas.forEach(({ campo, error, test, msg }) => {
    const input = formulario.querySelector(campo);
    const span  = formulario.querySelector(error);

    if (!test(input.value)) {
      span.textContent = msg;
      valido = false;
    } else {
      span.textContent = "";
    }
  });

  return valido;
}

btnFormulario.addEventListener('click', async (e) => {

    e.preventDefault();
     if (!validar()) return;

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




