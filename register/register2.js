const STORAGE_KEY = 'generationAlumniMentors';

let currentStep = 1;
const totalSteps = 3;

let mentorData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    profileImage: '',
    mentorAreas: [],
    linkedin: '',
    about: '',
    generationProgram: '',
    skills: [],
    mentorType: []
};

let skillsList = [];

const form = document.getElementById('mentor-register-form');

// Pasos
const steps = document.querySelectorAll('.form-step');
const stepIndicators = {
    1: document.getElementById('step-indicator-1'),
    2: document.getElementById('step-indicator-2'),
    3: document.getElementById('step-indicator-3')
};
const progressFill = document.getElementById('progress-fill');

// Botones de navegación
const btnNextStep1 = document.getElementById('btn-next-step-1');
const btnNextStep2 = document.getElementById('btn-next-step-2');
const btnBackStep2 = document.getElementById('btn-back-step-2');
const btnBackStep3 = document.getElementById('btn-back-step-3');
const btnGoogle = document.getElementById('btn-google');

// Mensaje global
const globalMessage = document.getElementById('global-message');

// Paso 1 - inputs
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const acceptTermsInput = document.getElementById('accept-terms');

// Paso 2 - inputs
const profileImageInput = document.getElementById('profile-image');
const profilePreview = document.getElementById('profile-preview');
const linkedinInput = document.getElementById('linkedin-profile');
const aboutInput = document.getElementById('about-me');
const aboutCounter = document.getElementById('about-counter');

// Paso 3 - inputs
const skillSearchInput = document.getElementById('skill-search');
const btnAddSkill = document.getElementById('btn-add-skill');
const skillsContainer = document.getElementById('skills-container');

function showStep(stepNumber) {
    steps.forEach((section) => section.classList.remove('active'));

    const stepIds = {
        1: 'step-register',
        2: 'step-profile',
        3: 'step-expertise'
    };

    document.getElementById(stepIds[stepNumber]).classList.add('active');
    currentStep = stepNumber;

    updateProgressBar();

    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateProgressBar() {
    const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressFill.style.width = `${percentage}%`;

    Object.keys(stepIndicators).forEach((key) => {
        const stepNum = parseInt(key);
        const indicator = stepIndicators[key];

        indicator.classList.remove('active', 'completed');

        if (stepNum < currentStep) {
            indicator.classList.add('completed');
        } else if (stepNum === currentStep) {
            indicator.classList.add('active');
        }
    });
}

function showGlobalMessage(text, type = 'success') {
    globalMessage.textContent = text;
    globalMessage.className = `message ${type}`;
    globalMessage.classList.remove('hidden');

    globalMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
        globalMessage.classList.add('hidden');
    }, 4000);
}

function showFieldError(inputElement, errorElementId, message) {
    const errorElement = document.getElementById(errorElementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
    inputElement.classList.add('input-error');
}

function clearFieldError(inputElement, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    if (errorElement) {
        errorElement.textContent = '';
    }
    inputElement.classList.remove('input-error');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    // Mínimo 8 caracteres, una mayúscula, un número y un símbolo
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?~`])[A-Za-z\d\S]{8,}$/;
    return passwordRegex.test(password);
}

function validateStep1() {
    let isValid = true;
    const missingFields = [];

    // ---- Nombres ----
    if (firstNameInput.value.trim() === '') {
        showFieldError(firstNameInput, 'error-first-name', 'Este campo es obligatorio.');
        missingFields.push('Nombres');
        isValid = false;
    } else {
        clearFieldError(firstNameInput, 'error-first-name');
    }

    // ---- Apellidos ----
    if (lastNameInput.value.trim() === '') {
        showFieldError(lastNameInput, 'error-last-name', 'Este campo es obligatorio.');
        missingFields.push('Apellidos');
        isValid = false;
    } else {
        clearFieldError(lastNameInput, 'error-last-name');
    }

    // ---- Correo ----
    if (emailInput.value.trim() === '') {
        showFieldError(emailInput, 'error-email', 'Este campo es obligatorio.');
        missingFields.push('Correo electrónico');
        isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
        showFieldError(emailInput, 'error-email', 'Ingresa un correo electrónico válido.');
        isValid = false;
    } else {
        clearFieldError(emailInput, 'error-email');
    }

    // ---- Contraseña ----
    let passwordFormatError = false;

    if (passwordInput.value === '') {
        passwordInput.classList.add('input-error');
        missingFields.push('Contraseña');
        isValid = false;
    } else if (!isValidPassword(passwordInput.value)) {
        passwordInput.classList.add('input-error');
        passwordFormatError = true;
        isValid = false;
    } else {
        passwordInput.classList.remove('input-error');
    }

    // ---- Confirmar contraseña ----
    let passwordMismatch = false;

    if (confirmPasswordInput.value === '') {
        confirmPasswordInput.classList.add('input-error');
        missingFields.push('Confirmar contraseña');
        isValid = false;
    } else if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.classList.add('input-error');
        passwordMismatch = true;
        isValid = false;
    } else {
        confirmPasswordInput.classList.remove('input-error');
    }

    // ---- Términos ----
    let termsMissing = false;
    if (!acceptTermsInput.checked) {
        termsMissing = true;
        isValid = false;
    }

    if (!isValid) {
        const messageParts = [];

        if (missingFields.length > 0) {
            messageParts.push(`Faltan campos por llenar: ${missingFields.join(', ')}.`);
        }

        if (passwordFormatError) {
            messageParts.push('La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo.');
        }

        if (passwordMismatch) {
            messageParts.push('Las contraseñas no coinciden.');
        }

        if (termsMissing) {
            messageParts.push('Debes aceptar los Términos de uso y la Política de privacidad.');
        }

        showGlobalMessage(messageParts.join(' '), 'error');
    }

    return isValid;
}

function saveStep1Data() {
    mentorData.firstName = firstNameInput.value.trim();
    mentorData.lastName = lastNameInput.value.trim();
    mentorData.email = emailInput.value.trim();
    mentorData.password = passwordInput.value;
}

// Vista previa de la foto de perfil
profileImageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // Validar tamaño máximo (5 MB)
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
        showGlobalMessage('La imagen supera el tamaño máximo de 5 MB.', 'error');
        profileImageInput.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        profilePreview.src = e.target.result;
        mentorData.profileImage = e.target.result;
    };
    reader.readAsDataURL(file);
});

// Contador de caracteres
aboutInput.addEventListener('input', () => {
    const length = aboutInput.value.length;
    aboutCounter.textContent = `${length} / 500`;
});

function saveStep2Data() {
    // Áreas de mentoría seleccionadas
    const areaCheckboxes = document.querySelectorAll('input[name="mentorAreas"]:checked');
    mentorData.mentorAreas = Array.from(areaCheckboxes).map((checkbox) => checkbox.value);

    mentorData.linkedin = linkedinInput.value.trim();
    mentorData.about = aboutInput.value.trim();
}

function renderSkills() {
    skillsContainer.innerHTML = '';

    skillsList.forEach((skill, index) => {
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            <span>${skill}</span>
            <button type="button" class="skill-remove" data-index="${index}" aria-label="Eliminar ${skill}">
                &times;
            </button>
        `;
        skillsContainer.appendChild(skillTag);
    });

    // Listeners para eliminar cada habilidad
    document.querySelectorAll('.skill-remove').forEach((button) => {
        button.addEventListener('click', (event) => {
            const index = parseInt(event.currentTarget.dataset.index);
            skillsList.splice(index, 1);
            renderSkills();
        });
    });
}

function addSkill() {
    const value = skillSearchInput.value.trim();

    if (value === '') return;

    // Evitar duplicados
    const alreadyExists = skillsList.some(
        (skill) => skill.toLowerCase() === value.toLowerCase()
    );

    if (alreadyExists) {
        showGlobalMessage('Esa habilidad ya fue agregada.', 'error');
        skillSearchInput.value = '';
        return;
    }

    skillsList.push(value);
    skillSearchInput.value = '';
    renderSkills();
}

btnAddSkill.addEventListener('click', addSkill);

skillSearchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        addSkill();
    }
});

function saveStep3Data() {
    mentorData.generationProgram = document.getElementById('generation-program').value;
    mentorData.skills = skillsList;

    const mentorTypeCheckboxes = document.querySelectorAll('input[name="mentorType"]:checked');
    mentorData.mentorType = Array.from(mentorTypeCheckboxes).map((checkbox) => checkbox.value);
}

function validateStep3() {
    if (mentorData.mentorType && document.querySelectorAll('input[name="mentorType"]:checked').length === 0) {
        showGlobalMessage('Selecciona al menos un tipo de mentoría que puedas ofrecer.', 'error');
        return false;
    }
    return true;
}

// ------------------------------------------------------------
// BOTONES DE NAVEGACIÓN
// ------------------------------------------------------------

btnNextStep1.addEventListener('click', () => {
    if (validateStep1()) {
        saveStep1Data();
        showStep(2);
    }
});

btnNextStep2.addEventListener('click', () => {
    saveStep2Data();
    showStep(3);
});

btnBackStep2.addEventListener('click', () => {
    showStep(1);
});

btnBackStep3.addEventListener('click', () => {
    showStep(2);
});

// ------------------------------------------------------------
// GUARDADO EN LOCALSTORAGE
// ------------------------------------------------------------

function getMentorsFromStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error leyendo mentores desde localStorage:', error);
        return [];
    }
}

function saveMentorToStorage(mentor) {
    const mentors = getMentorsFromStorage();

    mentor.id = Date.now();
    mentor.createdAt = new Date().toISOString();

    mentors.push(mentor);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(mentors));
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateStep3()) return;

    saveStep3Data();

    // Guardamos el registro completo en localStorage
    saveMentorToStorage(mentorData);

    showGlobalMessage('¡Solicitud enviada con éxito! Bienvenido/a como mentor de Generation Alumni.', 'success');

    // Reiniciamos el formulario y el estado después de un momento
    setTimeout(() => {
        form.reset();
        skillsList = [];
        renderSkills();
        aboutCounter.textContent = '0 / 500';
        profilePreview.src = '../assets/images/logos/usuario.png';

        mentorData = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            profileImage: '',
            mentorAreas: [],
            linkedin: '',
            about: '',
            generationProgram: '',
            skills: [],
            mentorType: []
        };

        showStep(1);
    }, 2000);
});

document.addEventListener('DOMContentLoaded', () => {
    showStep(1);
});