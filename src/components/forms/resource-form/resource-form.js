import { uploadVideo, uploadImage, uploadResource } from "../../../services/cloudinary.service.js";
import { fetchCategories } from "../../../services/category-storage.service.js";
import { fetchResourceTypes } from "../../../services/resource-type-storage.service.js";
import { CATEGORY_LABELS } from "../../../services/resource-storage.service.js";

const COMPONENT_URL = import.meta.url;
const HTML_URL = new URL("./resource-form-content.html", COMPONENT_URL);
const CSS_URL = new URL("./resource-form-content.css", COMPONENT_URL);

let templatesPromise = null;
function loadTemplates() {
  if (!templatesPromise) {
    templatesPromise = Promise.all([
      fetch(HTML_URL).then((r) => r.text()),
      fetch(CSS_URL).then((r) => r.text()),
    ]);
  }
  return templatesPromise;
}

const TYPE_RULES = [
  { extensions: ["pdf"], type: "PDF", action: "Descargar" },
  { extensions: ["mp4", "mov", "webm", "avi"], type: "Video", action: "Ver video" },
  { extensions: ["ppt", "pptx", "doc", "docx", "xls", "xlsx"], type: "Plantilla", action: "Usar plantilla" },
];

// exportado para reutilizar en manage-resource-form.js
export function detectResourceType(fileName) {
  const ext = fileName.split(".").pop().toLowerCase();
  const rule = TYPE_RULES.find((r) => r.extensions.includes(ext));
  return rule ?? { type: "Guía", action: "Descargar" };
}

/**
 * Construye el DOM del formulario de recursos, listo para pasarle
 * a base-modal.open({ content, footer }). No conoce el modal ni la API.
 */
export async function createResourceForm() {
  const [html, css] = await loadTemplates();

  const root = document.createElement("div");
  root.innerHTML = html;

  const style = document.createElement("style");
  style.textContent = css;
  root.prepend(style);

  const form = root.querySelector("#rf-form");
  const titleInput = root.querySelector("#rf-title");
  const categoryInput = root.querySelector("#rf-category");
  const descriptionInput = root.querySelector("#rf-description");
  const fileInput = root.querySelector("#rf-file");
  const footer = root.querySelector("#rf-footer");
  const errors = {
    title: root.querySelector('[data-error="title"]'),
    category: root.querySelector('[data-error="category"]'),
    description: root.querySelector('[data-error="description"]'),
    file: root.querySelector('[data-error="file"]'),
  };

  footer.remove();

  let resourceTypes = [];

  async function loadOptions() {
    try {
      const [categories, types] = await Promise.all([fetchCategories("library"), fetchResourceTypes()]);
      resourceTypes = types;

      categoryInput.innerHTML =
        '<option value="">Seleccione una categoría</option>' +
        categories
          .map((c) => `<option value="${c.id}">${CATEGORY_LABELS[c.categoryType] ?? c.description ?? c.categoryType}</option>`)
          .join("");

      if (categories.length === 0) {
        errors.category.textContent = "Aún no hay categorías creadas en el backend.";
      }
    } catch (error) {
      errors.category.textContent = "No se pudieron cargar las categorías.";
    }
  }

  function clearErrors() {
    Object.values(errors).forEach((el) => (el.textContent = ""));
  }

  function resetForm() {
    form.reset();
    clearErrors();
  }

  async function collectAndValidate() {
    clearErrors();
    let hasError = false;

    const title = titleInput.value.trim();
    const categoryId = categoryInput.value;
    const description = descriptionInput.value.trim();
    const file = fileInput.files[0];

    if (!title) { errors.title.textContent = "El título es obligatorio."; hasError = true; }
    if (!categoryId) { errors.category.textContent = "Selecciona una categoría."; hasError = true; }
    if (!description) { errors.description.textContent = "Agrega una descripción."; hasError = true; }
    if (!file) { errors.file.textContent = "Selecciona un archivo."; hasError = true; }

    if (hasError) return { errors: true };

    const { type } = detectResourceType(file.name);
    const matchingType = resourceTypes.find((t) => t.name.toLowerCase() === type.toLowerCase());

    if (!matchingType) {
      errors.file.textContent = `No existe un tipo de recurso "${type}" en el backend. Créalo en /api/resource-types.`;
      return { errors: true };
    }

    let fileUrl;
    try {
      const fileType = file.type.split("/")[0];

      switch (fileType) {
        case "video": {
          const uploaded = await uploadVideo(file);
          fileUrl = uploaded?.link;
          break;
        }
        case "image": {
          const uploaded = await uploadImage(file);
          fileUrl = uploaded?.url;
          break;
        }
        default:
          fileUrl = await uploadResource(file);
      }

      if (!fileUrl) {
        errors.file.textContent = "No se pudo subir el archivo.";
        return { errors: true };
      }
    } catch (error) {
      errors.file.textContent = error.message ?? "No se pudo subir el archivo.";
      return { errors: true };
    }

    return {
      resource: {
        title,
        categoryId: Number(categoryId),
        resourceTypeId: matchingType.id,
        description,
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
      },
    };
  }

  root.querySelector('[data-action="cancel"]')?.addEventListener("click", () => {
    root.dispatchEvent(new CustomEvent("resource-form-cancel", { bubbles: true, composed: true }));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const result = await collectAndValidate();
    if (result.errors) return;

    root.dispatchEvent(
      new CustomEvent("resource-created", {
        detail: result.resource,
        bubbles: true,
        composed: true,
      })
    );
  });

  await loadOptions();

  return { element: root, footerElement: footer, reset: resetForm };
}