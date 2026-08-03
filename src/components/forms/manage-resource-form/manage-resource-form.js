import { escapeHtml } from "../../utils/html.js";
import { uploadVideo } from "../../../services/cloudinary.service.js";
import { detectResourceType } from "../resource-form/resource-form.js";
import { resources as staticResources } from "../../../data/resources.data.js";
import { readUserResources, updateUserResource, deleteUserResource } from "../../../services/resource-storage.service.js";

const COMPONENT_URL = import.meta.url;
const HTML_URL = new URL("./manage-resource-form-content.html", COMPONENT_URL);
const CSS_URL = new URL("./manage-resource-form-content.css", COMPONENT_URL);
const SHARED_CSS_URL = new URL("../resource-form/resource-form-content.css", COMPONENT_URL);

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

function formatFileSize(bytes) {
  if (!bytes) return "";
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
}

/**
 * Construye el DOM del formulario de gestión (editar/eliminar) de recursos,
 * listo para pasarle a base-modal.open({ content, footer }).
 */
export async function createManageResourceForm() {
  const [html, css, sharedCss] = await loadTemplates();

  const root = document.createElement("div");
  root.innerHTML = html;

  const sharedStyle = document.createElement("style");
  sharedStyle.textContent = sharedCss;
  const style = document.createElement("style");
  style.textContent = css;
  root.prepend(style);
  root.prepend(sharedStyle);

  const form = root.querySelector("#mrf-form");
  const select = root.querySelector("#mrf-select");
  const details = root.querySelector("#mrf-details");
  const staticNote = root.querySelector("[data-static-note]");
  const titleInput = root.querySelector("#mrf-title");
  const categoryInput = root.querySelector("#mrf-category");
  const descriptionInput = root.querySelector("#mrf-description");
  const fileInput = root.querySelector("#mrf-file");
  const currentFileName = root.querySelector("[data-current-file-name]");
  const currentFileMeta = root.querySelector("[data-current-file-meta]");
  const footer = root.querySelector("#mrf-footer");
  const saveBtn = root.querySelector("#mrf-save");
  const deleteBtn = root.querySelector("#mrf-delete");
  const errors = {
    title: root.querySelector('[data-error="title"]'),
    category: root.querySelector('[data-error="category"]'),
    description: root.querySelector('[data-error="description"]'),
    file: root.querySelector('[data-error="file"]'),
  };

  footer.remove();

  let currentResource = null;

  function getAllResourcesWithMeta() {
    const staticWithMeta = staticResources.map((r) => ({ ...r, isStatic: true }));
    const userResources = readUserResources().map((r) => ({ ...r, isStatic: false }));
    return [...staticWithMeta, ...userResources];
  }

  function populateSelect() {
    const all = getAllResourcesWithMeta();
    select.innerHTML =
      '<option value="">Seleccionar recurso...</option>' +
      all
        .map(
          (r) =>
            `<option value="${escapeHtml(String(r.id))}">${escapeHtml(r.title)}${r.isStatic ? " (predeterminado)" : ""}</option>`
        )
        .join("");
  }

  function clearErrors() {
    Object.values(errors).forEach((el) => (el.textContent = ""));
  }

  function fillForm(resource) {
    currentResource = resource;
    details.hidden = false;
    staticNote.hidden = !resource.isStatic;
    clearErrors();

    titleInput.value = resource.title;
    categoryInput.value = resource.category;
    descriptionInput.value = resource.description;
    fileInput.value = "";

    if (resource.fileName) {
      currentFileName.textContent = resource.fileName;
      currentFileMeta.textContent = [resource.type, formatFileSize(resource.fileSize)].filter(Boolean).join(" · ");
    } else {
      currentFileName.textContent = `Recurso tipo ${resource.type}`;
      currentFileMeta.textContent = "Sin archivo adjunto registrado.";
    }

    const readOnly = resource.isStatic;
    titleInput.disabled = readOnly;
    categoryInput.disabled = readOnly;
    descriptionInput.disabled = readOnly;
    fileInput.disabled = readOnly;
    saveBtn.disabled = readOnly;
    deleteBtn.disabled = readOnly;
  }

  select.addEventListener("change", () => {
    const id = select.value;
    if (!id) {
      details.hidden = true;
      currentResource = null;
      return;
    }
    const resource = getAllResourcesWithMeta().find((r) => String(r.id) === id);
    if (resource) fillForm(resource);
  });

  async function collectAndValidate() {
    clearErrors();
    if (!currentResource || currentResource.isStatic) return { errors: true };

    let hasError = false;
    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const description = descriptionInput.value.trim();

    if (!title) { errors.title.textContent = "El título es obligatorio."; hasError = true; }
    if (!category) { errors.category.textContent = "Selecciona una categoría."; hasError = true; }
    if (!description) { errors.description.textContent = "Agrega una descripción."; hasError = true; }

    if (hasError) return { errors: true };

    const updates = { title, category, description };
    const newFile = fileInput.files[0];

    if (newFile) {
      try {
        const fileUrl = await uploadVideo(newFile);
        const { type, action } = detectResourceType(newFile.name);
        Object.assign(updates, { fileUrl, fileName: newFile.name, fileSize: newFile.size, type, action });
      } catch (error) {
        errors.file.textContent = error.message ?? "No se pudo subir el archivo.";
        return { errors: true };
      }
    }

    return { updates };
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const result = await collectAndValidate();
    if (result.errors) return;

    const updated = updateUserResource(currentResource.id, result.updates);
    root.dispatchEvent(new CustomEvent("resource-updated", { detail: updated, bubbles: true, composed: true }));
  });

  deleteBtn.addEventListener("click", () => {
    if (!currentResource || currentResource.isStatic) return;

    const confirmed = window.confirm("¿Estás seguro de eliminar este recurso? Esta acción no se puede deshacer.");
    if (!confirmed) return;

    deleteUserResource(currentResource.id);
    root.dispatchEvent(new CustomEvent("resource-deleted", { detail: { id: currentResource.id }, bubbles: true, composed: true }));
  });

  root.querySelector('[data-action="close"]')?.addEventListener("click", () => {
    root.dispatchEvent(new CustomEvent("manage-resource-cancel", { bubbles: true, composed: true }));
  });

  populateSelect();

  return { element: root, footerElement: footer };
}