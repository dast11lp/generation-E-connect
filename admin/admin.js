const formularioVideo = document.querySelector("#formulario_video");
const selectCategoria = document.querySelector("#category")
const btnEnviarFormulario = document.querySelector("#send");
const videoURL = document.querySelector("#videoUrl");

const tabSeccion = document.querySelector('.tabs')
const tabList = document.querySelectorAll('.tabs__list__tab')
const tabContent = document.querySelectorAll('.tabs__content')

const regexURL = /^(https?:\/\/)([\w\-]+\.)+[\w]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?$/



tabSeccion.addEventListener('click', ({ target }) => {
    const tab = target.closest('.tabs__list__tab');
    if (!tab) return;

    console.log(tabList);

    tabList.forEach((el)=> {
        el.classList.remove("tabs__list__tab--active")
    });

    target.classList.add("tabs__list__tab--active");

    tabContent.forEach((el)=> {

    })
    
 
})



btnEnviarFormulario.addEventListener('click', (e) => {

    e.preventDefault();

    const urlTest = regexURL.test(videoURL.value);


    if (selectCategoria.value === "") {
        console.log("debes seleccionar una categoría");
        return
    }

    if (!urlTest) {
        console.log("la url no es válida");

    }



    const datosFormulario = new FormData(formularioVideo);

    console.log(datosFormulario);


})
