import { fetchStories, updateStory, deactivateStory } from "../../../services/story-storage.service.js";

const COMPONENT_URL = import.meta.url;
const HTML_URL = new URL("./manage-story-form-content.html", COMPONENT_URL);
const CSS_URL = new URL("./manage-story-form-content.css", COMPONENT_URL);
const SHARED_CSS_URL = new URL("../job-form/job-form-content.css", COMPONENT_URL);

let templatesPromise = null;
function loadTemplates() {
  if (!templatesPromise) {
    templatesPromise = Promise.all([
      fetch(HTML_URL).then((r) => r.text()),
      fetch(CSS_URL).then((r) => r.text()),
      fetch(SHARED_CSS_URL).then((r) => r.text()),
    ]);
  }
  return templatesPromise;
}

export async function createManageStoryForm() {
  const [html, css, sharedCss] = await loadTemplates();

  const root = document.createElement("div");
  root.innerHTML = html;

  const sharedStyle = document.createElement("style");
  sharedStyle.textContent = sharedCss;
  const style = document.createElement("style");
  style.textContent = css;
  root.prepend(style);
  root.prepend(sharedStyle);

  const form = root.querySelector("#msf-form");
  const select = root.querySelector("#msf-select");
  const details = root.querySelector("#msf-details");
  const nameInput = root.querySelector("#msf-name");
  const companyInput = root.querySelector("#msf-company");
  const timeToHireInput = root.querySelector("#msf-timeToHire");
  const roleInput = root.querySelector("#msf-role");
  const yearInput = root.querySelector("#msf-year");
  const categoryInput = root.querySelector("#msf-category");
  const photoInput = root.querySelector("#msf-photo");
  const photoPreview = root.querySelector("[data-current-photo-preview]");
  const testimonyInput = root.querySelector("#msf-testimony");
  const footer = root.querySelector("#msf-footer");
  const saveBtn = root.querySelector("#msf-save");
  const deleteBtn = root.querySelector("#msf-delete");
  const errors = {
    name: root.querySelector('[data-error="name"]'),
    company: root.querySelector('[data-error="company"]'),
    timeToHire: root.querySelector('[data-error="timeToHire"]'),
    role: root.querySelector('[data-error="role"]'),
    year: root.querySelector('[data-error="year"]'),
    category: root.querySelector('[data-error="category"]'),
    photo: root.querySelector('[data-error="photo"]'),
    testimony: root.querySelector('[data-error="testimony"]'),
  };

  footer.remove();

  let currentStory = null;
  let allStories = [];

  function populateSelect() {
    select.innerHTML =
      '<option value="">Seleccionar historia...</option>' +
      allStories.map((s) => `<option value="${String(s.id)}">${s.name}</option>`).join("");
  }

  function clearErrors() {
    Object.values(errors).forEach((el) => (el.textContent = ""));
  }

  function fillForm(story) {
    currentStory = story;
    details.hidden = false;
    clearErrors();

    nameInput.value = story.name;
    companyInput.value = story.company;
    timeToHireInput.value = story.timeToHire;
    roleInput.value = story.role;
    yearInput.value = story.year;
    categoryInput.value = story.category;
    photoInput.value = "";
    photoPreview.src = story.photo;
    testimonyInput.value = story.testimony;

    saveBtn.disabled = false;
    deleteBtn.disabled = false;
  }

  select.addEventListener("change", () => {
    const id = select.value;
    if (!id) {
      details.hidden = true;
      currentStory = null;
      return;
    }
    const story = allStories.find((s) => String(s.id) === id);
    if (story) fillForm(story);
  });

  function collectAndValidate() {
    clearErrors();
    if (!currentStory) return { errors: true };

    let hasError = false;
    const name = nameInput.value.trim();
    const company = companyInput.value.trim();
    const timeToHire = timeToHireInput.value.trim();
    const role = roleInput.value.trim();
    const year = yearInput.value.trim();
    const category = categoryInput.value;
    const photo = photoInput.value.trim();
    const testimony = testimonyInput.value.trim();

    if (!name) { errors.name.textContent = "El nombre es obligatorio."; hasError = true; }
    if (!company) { errors.company.textContent = "La empresa es obligatoria."; hasError = true; }
    if (!timeToHire) { errors.timeToHire.textContent = "Este campo es obligatorio."; hasError = true; }
    if (!role) { errors.role.textContent = "El rol es obligatorio."; hasError = true; }
    if (!year) { errors.year.textContent = "El año es obligatorio."; hasError = true; }
    if (!category) { errors.category.textContent = "Selecciona una categoría."; hasError = true; }
    if (!testimony) { errors.testimony.textContent = "El testimonio es obligatorio."; hasError = true; }

    if (hasError) return { errors: true };

    return {
      updates: {
        name,
        company,
        timeToHire,
        role,
        year,
        category,
        photo: photo || currentStory.photo,
        testimony,
        featured: currentStory.featured,
        active: currentStory.active,
      },
    };
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const result = collectAndValidate();
    if (result.errors) return;

    try {
      const updated = await updateStory(currentStory.id, result.updates);
      root.dispatchEvent(new CustomEvent("story-updated", { detail: updated, bubbles: true, composed: true }));
    } catch (error) {
      errors.name.textContent = error.message ?? "No se pudo guardar la historia.";
    }
  });

  deleteBtn.addEventListener("click", async () => {
    if (!currentStory) return;

    const confirmed = window.confirm(
      "¿Estás seguro de eliminar esta historia?\nSeguirá existiendo en el sistema pero dejará de mostrarse públicamente.\nEsta acción no se puede deshacer desde aquí."
    );
    if (!confirmed) return;

    try {
      await deactivateStory(currentStory.id);
      root.dispatchEvent(new CustomEvent("story-deleted", { detail: { id: currentStory.id }, bubbles: true, composed: true }));
    } catch (error) {
      window.alert(error.message ?? "No se pudo desactivar la historia.");
    }
  });

  root.querySelector('[data-action="close"]')?.addEventListener("click", () => {
    root.dispatchEvent(new CustomEvent("manage-story-cancel", { bubbles: true, composed: true }));
  });

  allStories = await fetchStories();
  populateSelect();

  return { element: root, footerElement: footer };
}