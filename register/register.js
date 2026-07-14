/********************************************************************
 * register.js
 * Generation Alumni
 * Registro de Mentores
 ********************************************************************/

"use strict";

/********************************************************************
 * CLASE PRINCIPAL
 ********************************************************************/

class RegisterForm {
    constructor() {
        /******************************
         * PASOS
         ******************************/
        this.currentStep = 1;
        this.totalSteps = 3;
        /******************************
         * FORMULARIO
         ******************************/
        this.form = document.getElementById("mentor-register-form");
        /******************************
         * SECCIONES
         ******************************/

        this.steps = [
            document.getElementById("step-register"),
            document.getElementById("step-profile"),
            document.getElementById("step-expertise"),
            document.getElementById("step-availability")
        ];

        /******************************
         * BARRA DE PROGRESO
         ******************************/

        this.progressFill = document.getElementById("progress-fill");

        this.progressIndicators = [
            document.getElementById("step-indicator-1"),
            document.getElementById("step-indicator-2"),
            document.getElementById("step-indicator-3"),
            document.getElementById("step-indicator-4")
        ];

        /******************************
         * BOTONES
         ******************************/

        this.nextButtons = [
            document.getElementById("btn-next-step-1"),
            document.getElementById("btn-next-step-2"),
            document.getElementById("btn-next-step-3")
        ];

        this.backButtons = [
            document.getElementById("btn-back-step-2"),
            document.getElementById("btn-back-step-3"),
            document.getElementById("btn-back-step-4")
        ];

        this.submitButton = document.getElementById("btn-submit");

        /******************************
         * INICIALIZAR
         ******************************/

        this.init();
    }

    /****************************************************************
     * INICIALIZACIÓN
     ****************************************************************/

    init() {
        this.bindEvents();
        this.showStep(this.currentStep);
        this.updateProgress();
    }

    /****************************************************************
     * EVENTOS
     ****************************************************************/

    bindEvents() {

        /******************************
         * SIGUIENTE
         ******************************/

        this.nextButtons.forEach(button => {
            
            if (!button) return;
            button.addEventListener("click", () => {
                this.nextStep();
            });

        });

        /******************************
         * ATRÁS
         ******************************/

        this.backButtons.forEach(button => {

            if (!button) return;
            button.addEventListener("click", () => {
                this.previousStep();
            });
        });

        /******************************
         * ENVÍO
         ******************************/

        if (this.form) {
            this.form.addEventListener("submit", (event) => {
                event.preventDefault();
                console.log("Formulario enviado.");
            });

        }

    }

    /****************************************************************
     * SIGUIENTE PASO
     ****************************************************************/

    nextStep() {

        if (!this.validateStep(this.currentStep)) {
            return;
        }

        if (this.currentStep >= this.totalSteps) {
            return;
        }

        this.currentStep++;
        this.showStep(this.currentStep);
        this.updateProgress();

    }

    /****************************************************************
     * PASO ANTERIOR
     ****************************************************************/

    previousStep() {

        if (this.currentStep <= 1) {
            return;
        }

        this.currentStep--;
        this.showStep(this.currentStep);
        this.updateProgress();
    }

    /****************************************************************
     * MOSTRAR PASO
     ****************************************************************/

    showStep(step) {

        this.steps.forEach((section, index) => {
            
            if (!section) return;
            section.classList.remove("active");
            if (index + 1 === step) {
                section.classList.add("active");
            }
        });
    }

    /****************************************************************
     * ACTUALIZAR BARRA
     ****************************************************************/

    updateProgress() {

        const percentage =
            (this.currentStep / this.totalSteps) * 100;
        if (this.progressFill) {
            this.progressFill.style.width = percentage + "%";
        }

        this.progressIndicators.forEach((indicator, index) => {
            if (!indicator) return;
            indicator.classList.remove("active");
            if (index < this.currentStep) {
                indicator.classList.add("active");
            }
        });
    }

    /****************************************************************
 * VALIDAR PASO
 ****************************************************************/

    validateStep(step) {

        switch (step) {
            case 1:
                return this.validateRegister();

            case 2:
                return this.validateProfile();

            case 3:
                return this.validateExpertise();

            case 4:
                return this.validateAvailability();

            default:
                return true;
        }
    }
    /****************************************************************
     * PASO 1
     ****************************************************************/

    validateRegister() {

        let valid = true;

        valid &= this.validateRequired("first-name");
        valid &= this.validateRequired("last-name");

        valid &= this.validateEmail();
        valid &= this.validatePassword();
        valid &= this.validateConfirmPassword();
        valid &= this.validateTerms();

        return Boolean(valid);

    }
    /****************************************************************
     * PASO 2
     ****************************************************************/

    validateProfile() {

        let valid = true;

        valid &= this.validateRequired("current-position");
        valid &= this.validateRequired("current-company");
        valid &= this.validateSelect("experience-years");
        valid &= this.validateSelect("country");

        return Boolean(valid);

    }
    /****************************************************************
     * PASO 3
     ****************************************************************/

    validateExpertise() {

        const checked = document.querySelectorAll(
            'input[name="mentorAreas"]:checked'
        );

        if (checked.length === 0) {
            alert("Selecciona al menos un área de mentoría.");
            return false;
        }

        return true;
    }
    /****************************************************************
     * PASO 4
     ****************************************************************/

    validateAvailability() {

        const days = document.querySelectorAll(
            'input[name="availableDays"]:checked'
        );

        if (days.length === 0) {
            alert("Selecciona al menos un día.");
            return false;
        }
        return true;
    }
    /****************************************************************
     * CAMPO OBLIGATORIO
     ****************************************************************/

    validateRequired(id) {

        const input = document.getElementById(id);

        if (!input) return true;

        if (input.value.trim() === "") {
            this.showError(
                input,
                "Este campo es obligatorio."
            );
            return false;
        }

        this.showSuccess(input);
        return true;
    }

    /****************************************************************
     * SELECT
     ****************************************************************/

    validateSelect(id) {

        const select = document.getElementById(id);

        if (select.value === "") {
            this.showError(
                select,
                "Selecciona una opción."
            );
            return false;
        }

        this.showSuccess(select);
        return true;
    }

    /****************************************************************
     * EMAIL
     ****************************************************************/

    validateEmail() {

        const email = document.getElementById("email");
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.value.trim() === "") {
            this.showError(email, "Ingresa tu correo.");
            return false;
        }

        if (!regex.test(email.value)) {
            this.showError(email, "Correo inválido.");
            return false;
        }

        this.showSuccess(email);
        return true;
    }

    /****************************************************************
     * PASSWORD
     ****************************************************************/

    validatePassword() {

        const password = document.getElementById("password");

        const regex =

            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!regex.test(password.value)) {
            this.showError(
                password,
                "Debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo."
            );

            return false;
        }

        this.showSuccess(password);
        return true;
    }
    /****************************************************************
     * CONFIRMAR PASSWORD
     ****************************************************************/

    validateConfirmPassword() {

        const password = document.getElementById("password");

        const confirm = document.getElementById("confirm-password");

        if (password.value !== confirm.value) {
            this.showError(
                confirm,
                "Las contraseñas no coinciden."
            );

            return false;
        }

        this.showSuccess(confirm);

        return true;
    }

    /****************************************************************
     * TÉRMINOS
     ****************************************************************/

    validateTerms() {

        const terms = document.getElementById("accept-terms");

        if (!terms.checked) {
            alert("Debes aceptar los términos.");
            return false;
        }
        return true;
    }

    /****************************************************************
     * ERROR
     ****************************************************************/

    showError(input, message) {

        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        
        const error = input.parentElement.querySelector(".error-message");
        if (error) {
            error.textContent = message;
        }
    }

    /****************************************************************
     * SUCCESS
     ****************************************************************/

    showSuccess(input) {

        input.classList.remove("is-invalid");
        input.classList.add("is-valid");

        const error = input.parentElement.querySelector(".error-message");
        if (error) {
            error.textContent = "";
        }
    }
}



/********************************************************************
 * INICIAR CUANDO CARGUE EL DOM
 ********************************************************************/

document.addEventListener("DOMContentLoaded", () => {

    new RegisterForm();
});