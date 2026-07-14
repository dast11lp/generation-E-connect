/*****************************************************************
 * register.js
 * Generation Alumni
 * Registro de Mentores
 * Arquitectura Modular
 *****************************************************************/

"use strict";

/*****************************************************************
 * CONFIGURACIÓN GLOBAL
 *****************************************************************/

const CONFIG = {

    totalSteps: 3,
    maxProfileLength: 500,
    maxNoteLength: 300,
    maxSkills: 20,
    allowedImageTypes: [
        "image/jpeg",
        "image/png",
        "image/webp"
    ],

    maxImageSize: 5 * 1024 * 1024,
    storageKey: "generation-mentor-register"
};

/*****************************************************************
 * ESTADO GLOBAL
 *****************************************************************/

const AppState = {

    currentStep: 1,
    totalSteps: CONFIG.totalSteps,
    profileImage: null,
    skills: [],
    areas: [],
    availability: {
        days: [],
        schedule: [],
        duration: ""
    },

    formData: {}

};

/*****************************************************************
 * CACHE DEL DOM
 *****************************************************************/

const DOM = {

    form: null,

    progressFill: null,

    progressSteps: [],

    sections: [],

    nextButtons: [],

    backButtons: [],

    submitButton: null,

    imageInput: null,

    imagePreview: null,

    skillsContainer: null,

    skillsInput: null,

    summaryContainer: null

};

/*****************************************************************
 * CACHE DEL DOM
 *****************************************************************/

function cacheDOM() {

    DOM.form = document.getElementById("mentor-register-form");

    DOM.progressFill = document.getElementById("progress-fill");

    DOM.progressSteps = [

        document.getElementById("step-indicator-1"),

        document.getElementById("step-indicator-2"),

        document.getElementById("step-indicator-3"),

        document.getElementById("step-indicator-4")

    ];

    DOM.sections = [

        document.getElementById("step-register"),

        document.getElementById("step-profile"),

        document.getElementById("step-expertise"),

        document.getElementById("step-availability")

    ];

    DOM.nextButtons = [

        document.getElementById("btn-next-step-1"),

        document.getElementById("btn-next-step-2"),

        document.getElementById("btn-next-step-3")

    ];

    DOM.backButtons = [

        document.getElementById("btn-back-step-2"),

        document.getElementById("btn-back-step-3"),

        document.getElementById("btn-back-step-4")

    ];

    DOM.submitButton = document.getElementById("btn-submit");

    DOM.imageInput = document.getElementById("profile-photo");

    DOM.imagePreview = document.getElementById("profile-preview");

    DOM.skillsContainer = document.getElementById("skills-container");

    DOM.skillsInput = document.getElementById("skills-input");

    DOM.summaryContainer = document.getElementById("summary-container");

}

/*****************************************************************
 * UTILIDADES
 *****************************************************************/

const Utils = {

    show(element) {

        if (!element) return;

        element.classList.remove("hidden");

    },

    hide(element) {

        if (!element) return;

        element.classList.add("hidden");

    },

    toggle(element) {

        if (!element) return;

        element.classList.toggle("hidden");

    },

    isEmpty(value) {

        return value.trim() === "";

    },

    randomId() {

        return Math.random().toString(36).substring(2, 10);

    },

    create(tag, className) {

        const element = document.createElement(tag);

        if (className) {

            element.className = className;

        }

        return element;

    },
    showFlex(element) {

        if (!element) return;

        element.classList.remove("hidden");

        element.classList.add("flex");

    },

    hideFlex(element) {

        if (!element) return;

        element.classList.remove("flex");

        element.classList.add("hidden");

    },

    enable(element) {

        if (!element) return;

        element.disabled = false;

    },

    disable(element) {

        if (!element) return;

        element.disabled = true;

    },
    showFlex(element) {

        if (!element) return;

        element.classList.remove("hidden");

        element.classList.add("flex");

    },

    hideFlex(element) {

        if (!element) return;

        element.classList.remove("flex");

        element.classList.add("hidden");

    },

    enable(element) {

        if (!element) return;

        element.disabled = false;

    },

    disable(element) {

        if (!element) return;

        element.disabled = true;

    }

};

/*****************************************************************
 * BUTTON MANAGER
 *****************************************************************/

const ButtonManager = {

    /*************************************************************
     * Mostrar botón
     *************************************************************/
    show(button){

        if(!button) return;

        button.classList.remove("hidden");

    },

    /*************************************************************
     * Ocultar botón
     *************************************************************/
    hide(button){

        if(!button) return;

        button.classList.add("hidden");

    },

    /*************************************************************
     * Habilitar
     *************************************************************/
    enable(button){

        if(!button) return;

        button.disabled = false;

        button.classList.remove("disabled");

    },

    /*************************************************************
     * Deshabilitar
     *************************************************************/
    disable(button){

        if(!button) return;

        button.disabled = true;

        button.classList.add("disabled");

    },

    /*************************************************************
     * Cambiar texto
     *************************************************************/
    setText(button,text){

        if(!button) return;

        button.textContent = text;

    },

    /*************************************************************
     * Loading
     *************************************************************/
    loading(button,text="Procesando..."){

        if(!button) return;

        this.disable(button);

        button.dataset.originalText = button.textContent;

        button.textContent = text;

        button.classList.add("btn-loading");

    },

    /*************************************************************
     * Restaurar
     *************************************************************/
    restore(button){

        if(!button) return;

        this.enable(button);

        button.classList.remove("btn-loading");

        if(button.dataset.originalText){

            button.textContent = button.dataset.originalText;

        }

    },

    /*************************************************************
     * Mostrar error
     *************************************************************/
    error(button,text="Error"){

        if(!button) return;

        button.classList.remove("btn-loading");

        button.classList.add("btn-error");

        this.setText(button,text);

    },

    /*************************************************************
     * Mostrar éxito
     *************************************************************/
    success(button,text="Completado"){

        if(!button) return;

        button.classList.remove("btn-loading");

        button.classList.add("btn-success");

        this.setText(button,text);

    }

};

/*****************************************************************
 * MESSAGE MANAGER
 *****************************************************************/

const MessageManager = {

    container: null,

    timeoutId: null,

    init() {

        this.container = document.getElementById("global-message");

    },

    show(type, text, duration = 5000) {

        if (!this.container) return;

        clearTimeout(this.timeoutId);

        this.container.className = "message";

        this.container.classList.add(`message-${type}`);

        this.container.textContent = text;

        this.container.classList.remove("hidden");

        if (duration > 0) {

            this.timeoutId = setTimeout(() => {

                this.clear();

            }, duration);

        }

    },

    success(text, duration = 5000) {

        this.show("success", text, duration);

    },

    error(text, duration = 5000) {

        this.show("error", text, duration);

    },

    warning(text, duration = 5000) {

        this.show("warning", text, duration);

    },

    info(text, duration = 5000) {

        this.show("info", text, duration);

    },

    clear() {

        if (!this.container) return;

        this.container.className = "message hidden";

        this.container.textContent = "";

    }

};

/*****************************************************************
 * NAVIGATION MODULE
 *****************************************************************/

const Navigation = {

    /*************************************************************
     * Inicialización
     *************************************************************/
    init() {

        this.bindEvents();

        this.showStep(AppState.currentStep);

        this.updateProgress();

    },

    /*************************************************************
     * Eventos
     *************************************************************/
    bindEvents() {

        DOM.nextButtons.forEach(button => {

            if (!button) return;

            button.addEventListener("click", () => {

                this.next();

            });

        });

        DOM.backButtons.forEach(button => {

            if (!button) return;

            button.addEventListener("click", () => {

                this.previous();

            });

        });

    },

    /*************************************************************
     * Paso siguiente
     *************************************************************/
    next() {

        /* En el Bloque 3 se reemplazará por Validation */

        if (typeof Validation !== "undefined") {

            if (!Validation.validateStep(AppState.currentStep)) {

                return;

            }

        }

        if (AppState.currentStep >= AppState.totalSteps) {

            return;

        }

        AppState.currentStep++;

        this.changeStep();

    },

    /*************************************************************
     * Paso anterior
     *************************************************************/
    previous() {

        if (AppState.currentStep <= 1) {

            return;

        }

        AppState.currentStep--;

        this.changeStep();

    },

    /*************************************************************
     * Cambiar paso
     *************************************************************/
    changeStep() {

        this.showStep(AppState.currentStep);

        this.updateProgress();

        this.updateButtons();

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    },

    /*************************************************************
     * Mostrar paso
     *************************************************************/
    showStep(step) {

        DOM.sections.forEach((section, index) => {

            if (!section) return;

            section.classList.remove("active");

            if ((index + 1) === step) {

                section.classList.add("active");

            }

        });

    },

    /*************************************************************
     * Barra de progreso
     *************************************************************/
    updateProgress() {

        const percentage =
            (AppState.currentStep / AppState.totalSteps) * 100;

        if (DOM.progressFill) {

            DOM.progressFill.style.width = `${percentage}%`;

        }

        DOM.progressSteps.forEach((step, index) => {

            if (!step) return;

            step.classList.remove("active");

            step.classList.remove("completed");

            if (index < AppState.currentStep - 1) {

                step.classList.add("completed");

            }

            if (index === AppState.currentStep - 1) {

                step.classList.add("active");

            }

        });

    },

    /*************************************************************
     * Actualizar botones
     *************************************************************/
    updateButtons() {

        DOM.backButtons.forEach(button => {

            if (!button) return;

            Utils.hide(button);

        });

        DOM.nextButtons.forEach(button => {

            if (!button) return;

            Utils.hide(button);

        });

        if (AppState.currentStep > 1) {

            const backButton =
                DOM.backButtons[AppState.currentStep - 2];

            Utils.show(backButton);

        }

        if (AppState.currentStep < AppState.totalSteps) {

            const nextButton =
                DOM.nextButtons[AppState.currentStep - 1];

            Utils.show(nextButton);

        }

        if (DOM.submitButton) {

            if (AppState.currentStep === AppState.totalSteps) {

                Utils.show(DOM.submitButton);

            } else {

                Utils.hide(DOM.submitButton);

            }

        }

    },

    /*************************************************************
     * Ir directamente a un paso
     *************************************************************/
    goTo(step) {

        if (step < 1 || step > AppState.totalSteps) {

            return;

        }

        AppState.currentStep = step;

        this.changeStep();

    },

    /*************************************************************
     * Reiniciar navegación
     *************************************************************/
    reset() {

        AppState.currentStep = 1;

        this.changeStep();

    }

};

/*****************************************************************
 * CLASE PRINCIPAL
 *****************************************************************/

class RegisterForm {

    constructor() {

        this.init();

    }

    init() {

        cacheDOM();

        MessageManager.init();

        Navigation.init();

        Validation.init();

        ImageManager.init();

        Counter.init();

        Skills.init();

        Storage.init();

        Summary.init();

        Submit.init();

    }

}

/*****************************************************************
 * INICIO DE LA APLICACIÓN
 *****************************************************************/

document.addEventListener("DOMContentLoaded", () => {

    new RegisterForm();

});