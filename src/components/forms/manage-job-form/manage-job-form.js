import { uploadImage } from "../../../services/cloudinary.service.js";
import { jobPortals as staticJobs } from "../../../data/jobs.data.js";
import { readUserJobs, updateUserJob, deleteUserJob } from "../../../services/job-storage.service.js";

const COMPONENT_URL = import.meta.url;
const HTML_URL = new URL("./manage-job-form-content.html", COMPONENT_URL);
const CSS_URL = new URL("./manage-job-form-content.css", COMPONENT_URL);
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

const urlPattern = /^(https?:\/\/)([\w-]+\.)+[\w]{2,}(\/[\w-._~:/?#[\]@!$&'()*+,;=%]*)?$/;

export async function createManageJobForm() {
  const [html, css, sharedCss] = await loadTemplates();

  const root = document.createElement("div");
  root.innerHTML = html;

  const sharedStyle = document.createElement("style");
  sharedStyle.textContent = sharedCss;
  const style = document.createElement("style");
  style.textContent = css;
  root.prepend(style);
  root.prepend(sharedStyle);

  const form = root.querySelector("#mjf-form");
  const select = root.querySelector("#mjf-select");
  const details = root.querySelector("#mjf-details");
  const staticNote = root.querySelector("[data-static-note]");
  const nameInput = root.querySelector("#mjf-name");
  const descriptionInput = root.querySelector("#mjf-description");
  const urlInput = root.querySelector("#mjf-url");
  const categoryInput = root.querySelector("#mjf-category");
  const imageInput = root.querySelector("#mjf-image");
  const imagePreview = root.querySelector("[data-current-image-preview]");
  const footer = root.querySelector("#mjf-footer");
  const saveBtn = root.querySelector("#mjf-save");
  const deleteBtn = root.querySelector("#mjf-delete");
  const errors = {
    name: root.querySelector('[data-error="name"]'),
    description: root.querySelector('[data-error="description"]'),
    url: root.querySelector('[data-error="url"]'),
    category: root.querySelector('[data-error="category"]'),
    image: root.querySelector('[data-error="image"]'),
  };

  footer.remove();

  let currentJob = null;

  function getAllJobsWithMeta() {
    const staticWithMeta = staticJobs.map((j) => ({ ...j, isStatic: true }));
    const userJobs = readUserJobs().map((j) => ({ ...j, isStatic: false }));
    return [...staticWithMeta, ...userJobs];
  }

  function populateSelect() {
    const all = getAllJobsWithMeta();
    select.innerHTML =
      '<option value="">Seleccionar portal de empleo...</option>' +
      all
        .map((j) => `<option value="${String(j.id)}">${j.name}${j.isStatic ? " (predeterminado)" : ""}</option>`)
        .join("");
  }

  function clearErrors() {
    Object.values(errors).forEach((el) => (el.textContent = ""));
  }

  function fillForm(job) {
    currentJob = job;
    details.hidden = false;
    staticNote.hidden = !job.isStatic;
    clearErrors();

    nameInput.value = job.name;
    descriptionInput.value = job.description;
    urlInput.value = job.url;
    categoryInput.value = job.category;
    imageInput.value = "";
    imagePreview.src = job.image;

    const readOnly = job.isStatic;
    [nameInput, descriptionInput, urlInput, categoryInput, imageInput].forEach((el) => (el.disabled = readOnly));
    saveBtn.disabled = readOnly;
    deleteBtn.disabled = readOnly;
  }

  select.addEventListener("change", () => {
    const id = select.value;
    if (!id) {
      details.hidden = true;
      currentJob = null;
      return;
    }
    const job = getAllJobsWithMeta().find((j) => String(j.id) === id);
    if (job) fillForm(job);
  });

  async function collectAndValidate() {
    clearErrors();
    if (!currentJob || currentJob.isStatic) return { errors: true };

    let hasError = false;
    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();
    const url = urlInput.value.trim();
    const category = categoryInput.value;

    if (!name) { errors.name.textContent = "El nombre es obligatorio."; hasError = true; }
    if (!description) { errors.description.textContent = "Agrega una descripción."; hasError = true; }
    if (!url) {
      errors.url.textContent = "Este campo es obligatorio.";
      hasError = true;
    } else if (!urlPattern.test(url)) {
      errors.url.textContent = "Ingresa una URL válida.";
      hasError = true;
    }
    if (!category) { errors.category.textContent = "Selecciona una categoría."; hasError = true; }

    if (hasError) return { errors: true };

    const updates = { name, description, url, category };
    const newFile = imageInput.files[0];

    if (newFile) {
      try {
        const uploaded = await uploadImage(newFile);
        if (!uploaded) {
          errors.image.textContent = "Selecciona una imagen válida.";
          return { errors: true };
        }
        updates.image = uploaded.url;
      } catch (error) {
        errors.image.textContent = error.message ?? "No se pudo subir la imagen.";
        return { errors: true };
      }
    }

    return { updates };
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const result = await collectAndValidate();
    if (result.errors) return;

    const updated = updateUserJob(currentJob.id, result.updates);
    root.dispatchEvent(new CustomEvent("job-updated", { detail: updated, bubbles: true, composed: true }));
  });

  deleteBtn.addEventListener("click", () => {
    if (!currentJob || currentJob.isStatic) return;

    const confirmed = window.confirm("¿Estás seguro de eliminar este empleo? Esta acción no se puede deshacer.");
    if (!confirmed) return;

    deleteUserJob(currentJob.id);
    root.dispatchEvent(new CustomEvent("job-deleted", { detail: { id: currentJob.id }, bubbles: true, composed: true }));
  });

  root.querySelector('[data-action="close"]')?.addEventListener("click", () => {
    root.dispatchEvent(new CustomEvent("manage-job-cancel", { bubbles: true, composed: true }));
  });

  populateSelect();

  return { element: root, footerElement: footer };
}