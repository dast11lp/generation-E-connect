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
            document.getElementById("step-expertise")
        ];

        /******************************
         * BARRA DE PROGRESO
         ******************************/

        this.progressFill = document.getElementById("progress-fill");

        this.progressIndicators = [
            document.getElementById("step-indicator-1"),
            document.getElementById("step-indicator-2"),
            document.getElementById("step-indicator-3")
        ];

        /******************************
         * BOTONES
         ******************************/

        this.nextButtons = [
            document.getElementById("btn-next-step-1"),
            document.getElementById("btn-next-step-2")
        ];

        this.backButtons = [
            document.getElementById("btn-back-step-2"),
            document.getElementById("btn-back-step-3")
        ];

        this.submitButton = document.getElementById("btn-submit");

        /******************************
         * PASO 2 - PERFIL
         ******************************/

        this.profileImageInput = document.getElementById("profile-image");
        this.profilePreview = document.getElementById("profile-preview");
        this.defaultProfilePreview = this.profilePreview
            ? this.profilePreview.getAttribute("src")
            : "";

        this.aboutMeInput = document.getElementById("about-me");
        this.aboutCounter = document.getElementById("about-counter");
        this.aboutMaxLength = this.aboutMeInput
            ? parseInt(this.aboutMeInput.getAttribute("maxlength"), 10) || 500
            : 500;

        this.linkedinInput = document.getElementById("linkedin-profile");

        /******************************
         * PASO 3 - EXPERIENCIA
         ******************************/

        this.generationProgramSelect = document.getElementById("generation-program");
        this.skillSearchInput = document.getElementById("skill-search");
        this.addSkillButton = document.getElementById("btn-add-skill");
        this.skillsContainer = document.getElementById("skills-container");
        this.skills = [];

        /******************************
         * MENSAJES GLOBALES
         ******************************/

        this.globalMessage = document.getElementById("global-message");

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
        this.updateAboutCounter();
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
         * FOTO DE PERFIL
         ******************************/

        if (this.profileImageInput) {
            this.profileImageInput.addEventListener("change", (event) => {
                this.handleProfileImageChange(event);
            });
        }

        /******************************
         * CONTADOR "SOBRE TI"
         ******************************/

        if (this.aboutMeInput) {
            this.aboutMeInput.addEventListener("input", () => {
                this.updateAboutCounter();
            });
        }

        /******************************
         * HABILIDADES
         ******************************/

        if (this.addSkillButton) {
            this.addSkillButton.addEventListener("click", () => {
                this.addSkill();
            });
        }

        if (this.skillSearchInput) {
            this.skillSearchInput.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    this.addSkill();
                }
            });
        }

        /******************************
         * ENVÍO
         ******************************/

        if (this.form) {
            this.form.addEventListener("submit", (event) => {
                event.preventDefault();
                this.handleSubmit();
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

        const percentage = (this.currentStep / this.totalSteps) * 100;

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

            default:
                return true;
        }
    }

    /****************************************************************
     * PASO 1 - CREAR CUENTA
     ****************************************************************/

    validateRegister() {

        const results = [
            this.validateRequired("first-name"),
            this.validateRequired("last-name"),
            this.validateEmail(),
            this.validatePassword(),
            this.validateConfirmPassword(),
            this.validateTerms()
        ];

        return results.every(Boolean);
    }

    /****************************************************************
     * PASO 2 - PERFIL PROFESIONAL
     ****************************************************************/

    validateProfile() {

        const areasValid = this.validateMentorAreas();
        const linkedinValid = this.validateLinkedin();

        return areasValid && linkedinValid;
    }

    /****************************************************************
     * PASO 3 - EXPERIENCIA Y MENTORÍAS
     ****************************************************************/

    validateExpertise() {

        const mentorTypes = document.querySelectorAll(
            'input[name="mentorType"]:checked'
        );

        if (mentorTypes.length === 0) {
            alert("Selecciona al menos un tipo de mentoría.");
            return false;
        }

        return true;
    }

    /****************************************************************
     * ÁREAS DE MENTORÍA
     ****************************************************************/

    validateMentorAreas() {

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
     * LINKEDIN (OPCIONAL)
     ****************************************************************/

    validateLinkedin() {

        if (!this.linkedinInput) return true;

        const value = this.linkedinInput.value.trim();

        if (value === "") {
            this.showSuccess(this.linkedinInput);
            return true;
        }

        const regex = /^https?:\/\/(www\.)?linkedin\.com\/.+$/i;

        if (!regex.test(value)) {
            this.showError(
                this.linkedinInput,
                "Ingresa una URL válida de LinkedIn."
            );
            return false;
        }

        this.showSuccess(this.linkedinInput);
        return true;
    }

    /****************************************************************
     * CAMPO OBLIGATORIO
     ****************************************************************/

    validateRequired(id) {

        const input = document.getElementById(id);

        if (!input) return true;

        if (input.value.trim() === "") {
            this.showError(input, "Este campo es obligatorio.");
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

        if (!select) return true;

        if (select.value === "") {
            this.showError(select, "Selecciona una opción.");
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
        if (!email) return true;

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
        if (!password) return true;

        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

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
        if (!password || !confirm) return true;

        if (password.value !== confirm.value) {
            this.showError(confirm, "Las contraseñas no coinciden.");
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
        if (!terms) return true;

        if (!terms.checked) {
            alert("Debes aceptar los términos.");
            return false;
        }

        return true;
    }

    /****************************************************************
     * FOTO DE PERFIL
     ****************************************************************/

    handleProfileImageChange(event) {

        const file = event.target.files && event.target.files[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

        if (!allowedTypes.includes(file.type)) {
            alert("Formato no válido. Usa JPG, PNG o WEBP.");
            event.target.value = "";
            return;
        }

        if (file.size > maxSizeBytes) {
            alert("La imagen supera el tamaño máximo de 5 MB.");
            event.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if (this.profilePreview) {
                this.profilePreview.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    }

    /****************************************************************
     * CONTADOR "SOBRE TI"
     ****************************************************************/

    updateAboutCounter() {

        if (!this.aboutMeInput || !this.aboutCounter) return;

        const length = this.aboutMeInput.value.length;
        this.aboutCounter.textContent = `${length} / ${this.aboutMaxLength}`;
    }

    /****************************************************************
     * HABILIDADES
     ****************************************************************/

    addSkill() {

        if (!this.skillSearchInput || !this.skillsContainer) return;

        const value = this.skillSearchInput.value.trim();

        if (value === "") return;

        const normalized = value.toLowerCase();
        const alreadyAdded = this.skills.some(
            skill => skill.toLowerCase() === normalized
        );

        if (alreadyAdded) {
            this.skillSearchInput.value = "";
            return;
        }

        this.skills.push(value);
        this.renderSkill(value);
        this.skillSearchInput.value = "";
        this.skillSearchInput.focus();
    }

    renderSkill(skill) {

        const tag = document.createElement("span");
        tag.className = "skill-tag";
        tag.textContent = skill;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "skill-remove";
        removeButton.setAttribute("aria-label", `Eliminar ${skill}`);
        removeButton.textContent = "×";

        removeButton.addEventListener("click", () => {
            this.skills = this.skills.filter(item => item !== skill);
            tag.remove();
        });

        tag.appendChild(removeButton);
        this.skillsContainer.appendChild(tag);
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

    /****************************************************************
     * MENSAJE GLOBAL
     ****************************************************************/

    showGlobalMessage(message, type = "success") {

        if (!this.globalMessage) return;

        this.globalMessage.textContent = message;
        this.globalMessage.classList.remove("hidden", "success", "error");
        this.globalMessage.classList.add(type);
    }

    /****************************************************************
     * ENVÍO DEL FORMULARIO
     ****************************************************************/

    handleSubmit() {

        if (!this.validateStep(3)) {
            return;
        }

        const formData = {
            firstName: document.getElementById("first-name")?.value.trim(),
            lastName: document.getElementById("last-name")?.value.trim(),
            email: document.getElementById("email")?.value.trim(),
            mentorAreas: Array.from(
                document.querySelectorAll('input[name="mentorAreas"]:checked')
            ).map(input => input.value),
            linkedin: this.linkedinInput ? this.linkedinInput.value.trim() : "",
            about: this.aboutMeInput ? this.aboutMeInput.value.trim() : "",
            generationProgram: this.generationProgramSelect
                ? this.generationProgramSelect.value
                : "",
            skills: this.skills,
            mentorType: Array.from(
                document.querySelectorAll('input[name="mentorType"]:checked')
            ).map(input => input.value)
        };

        console.log("Formulario enviado:", formData);

        this.showGlobalMessage(
            "¡Tu solicitud para ser mentor fue enviada correctamente!",
            "success"
        );

        if (this.submitButton) {
            this.submitButton.disabled = true;
        }
    }
}

/********************************************************************
 * INICIAR CUANDO CARGUE EL DOM
 ********************************************************************/

document.addEventListener("DOMContentLoaded", () => {
    new RegisterForm();
});