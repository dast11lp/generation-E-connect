import { escapeHtml } from "../../utils/html.js";
import { mostrarAlerta } from "../../ui/alert/alert.js";
import { confirmarAccion } from "../../ui/confirm/confirm.js";
import { uploadVideo, uploadImage, uploadResource } from "../../../services/cloudinary.service.js";
import { detectResourceType } from "../resource-form/resource-form.js";
import { fetchCategories } from "../../../services/category-storage.service.js";
import { fetchResourceTypes } from "../../../services/resource-type-storage.service.js";
import {
  CATEGORY_LABELS,
  fetchResources,
  updateResource,
  deleteResource,
} from "../../../services/resource-storage.service.js";

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
  let allResources = [];
  let resourceTypes = [];

  function populateResourceSelect() {
    select.innerHTML =
      '<option value="">Seleccionar recurso...</option>' +
      allResources
        .map((r) => `<option value="${escapeHtml(String(r.id))}">${escapeHtml(r.title)}</option>`)
        .join("");
  }

  function populateCategorySelect(categories) {
    categoryInput.innerHTML =
      '<option value="">Seleccione una categoría</option>' +
      categories
        .map((c) => `<option value="${c.id}">${escapeHtml(CATEGORY_LABELS[c.categoryType] ?? c.categoryType)}</option>`)
        .join("");
  }

  function clearErrors() {
    Object.values(errors).forEach((el) => (el.textContent = ""));
  }

  function fillForm(resource) {
    currentResource = resource;
    details.hidden = false;
    clearErrors();

    titleInput.value = resource.title;
    categoryInput.value = String(resource.categoryId ?? "");
    descriptionInput.value = resource.description;
    fileInput.value = "";

    if (resource.fileName) {
      currentFileName.textContent = resource.fileName;
      currentFileMeta.textContent = [resource.type, formatFileSize(resource.fileSize)].filter(Boolean).join(" · ");
    } else {
      currentFileName.textContent = `Recurso tipo ${resource.type}`;
      currentFileMeta.textContent = "Sin archivo adjunto registrado.";
    }

    [titleInput, categoryInput, descriptionInput, fileInput].forEach((el) => (el.disabled = false));
    saveBtn.disabled = false;
    deleteBtn.disabled = false;
  }

  select.addEventListener("change", () => {
    const id = select.value;
    if (!id) {
      details.hidden = true;
      currentResource = null;
      return;
    }
    const resource = allResources.find((r) => String(r.id) === id);
    if (resource) fillForm(resource);
  });

  async function collectAndValidate() {
    clearErrors();
    if (!currentResource) return { errors: true };

    let hasError = false;
    const title = titleInput.value.trim();
    const categoryId = categoryInput.value;
    const description = descriptionInput.value.trim();

    if (!title) { errors.title.textContent = "El título es obligatorio."; hasError = true; }
    if (!categoryId) { errors.category.textContent = "Selecciona una categoría."; hasError = true; }
    if (!description) { errors.description.textContent = "Agrega una descripción."; hasError = true; }

    if (hasError) return { errors: true };

    const updates = {
      title,
      description,
      categoryId: Number(categoryId),
      resourceTypeId: currentResource.resourceTypeId,
      fileUrl: currentResource.fileUrl,
      fileName: currentResource.fileName,
      fileSize: currentResource.fileSize,
      featured: currentResource.featured,
      active: currentResource.active ?? true,
    };

    const newFile = fileInput.files[0];

    if (newFile) {
      const { type } = detectResourceType(newFile.name);
      const matchingType = resourceTypes.find((t) => t.name.toLowerCase() === type.toLowerCase());

      if (!matchingType) {
        errors.file.textContent = `No existe un tipo de recurso "${type}" en el backend.`;
        return { errors: true };
      }

      try {
        const fileType = newFile.type.split("/")[0];
        let fileUrl;

        switch (fileType) {
          case "video": {
            const uploaded = await uploadVideo(newFile);
            fileUrl = uploaded?.link;
            break;
          }
          case "image": {
            const uploaded = await uploadImage(newFile);
            fileUrl = uploaded?.url;
            break;
          }
          default:
            fileUrl = await uploadResource(newFile);
        }

        if (!fileUrl) {
          errors.file.textContent = "No se pudo subir el archivo.";
          return { errors: true };
        }

        Object.assign(updates, {
          resourceTypeId: matchingType.id,
          fileUrl,
          fileName: newFile.name,
          fileSize: newFile.size,
        });
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

    try {
      const updated = await updateResource(currentResource.id, result.updates);
      root.dispatchEvent(new CustomEvent("resource-updated", { detail: updated, bubbles: true, composed: true }));
    } catch (error) {
      errors.title.textContent = error.message ?? "No se pudo guardar el recurso.";
    }
  });

  deleteBtn.addEventListener("click", async () => {
    if (!currentResource) return;

    const confirmed = await confirmarAccion("¿Estás seguro de eliminar este recurso? Esta acción no se puede deshacer.");
    if (!confirmed) return;

    try {
      await deleteResource(currentResource.id);
      root.dispatchEvent(new CustomEvent("resource-deleted", { detail: { id: currentResource.id }, bubbles: true, composed: true }));
    } catch (error) {
      mostrarAlerta(error.message ?? "No se pudo eliminar el recurso.", "error");
    }
  });

  root.querySelector('[data-action="close"]')?.addEventListener("click", () => {
    root.dispatchEvent(new CustomEvent("manage-resource-cancel", { bubbles: true, composed: true }));
  });

  const [resources, categories, types] = await Promise.all([
    fetchResources(),
    fetchCategories("library"),
    fetchResourceTypes(),
  ]);
  allResources = resources;
  resourceTypes = types;
  populateResourceSelect();
  populateCategorySelect(categories);

  return { element: root, footerElement: footer };
}