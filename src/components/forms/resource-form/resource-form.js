import { uploadVideo, uploadImage, uploadResource } from "../../../services/cloudinary.service.js";
// ⚠️ Si cloudinary.service.js solo acepta video, cambia esta línea por
// import { uploadFile } from "../../../services/cloudinary.service.js";
// y renombra la llamada más abajo (uploadVideo -> uploadFile).

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

// cambio 1: exportar para reutilizar en manage-resource-form.js
export function detectResourceType(fileName) {
  const ext = fileName.split(".").pop().toLowerCase();
  const rule = TYPE_RULES.find((r) => r.extensions.includes(ext));
  return rule ?? { type: "Guía", action: "Descargar" };
}

function formatDateEs(date) {
  const formatted = new Intl.DateTimeFormat("es", { month: "short", year: "numeric" }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1).replace(".", "");
}

/**
 * Construye el DOM del formulario de recursos, listo para pasarle
 * a base-modal.open({ content, footer }). No conoce el modal ni localStorage.
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

  footer.remove(); // se entrega aparte para el slot de footer del modal

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
    const category = categoryInput.value;
    const description = descriptionInput.value.trim();
    const file = fileInput.files[0];

    if (!title) {
      errors.title.textContent = "El título es obligatorio.";
      hasError = true;
    }
    if (!category) {
      errors.category.textContent = "Selecciona una categoría.";
      hasError = true;
    }
    if (!description) {
      errors.description.textContent = "Agrega una descripción.";
      hasError = true;
    }
    if (!file) {
      errors.file.textContent = "Selecciona un archivo.";
      hasError = true;
    }

    if (hasError) return { errors: true };

    let fileUrl;
    console.log("me ejecuto?");

    try {
      const fileType = file.type.split("/")[0];

      switch (fileType) {
        case "video":
          fileUrl = await uploadVideo(file);
          break;
        case "image":
          fileUrl = await uploadImage(file);
          break;
        case "application":
          fileUrl = await uploadResource(file);
          break;
      }

      console.log("me ejecuto? x2");
    } catch (error) {
      errors.file.textContent = error.message ?? "No se pudo subir el archivo.";
      return { errors: true };
    }

    const { type, action } = detectResourceType(file.name);
    const now = new Date();

    return {
      resource: {
        id: `resource-${Date.now()}`,
        type,
        title,
        category,
        description,
        action,
        date: formatDateEs(now),
        dateValue: now.toISOString().slice(0, 10),
        downloads: 0,
        featured: false,
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

  return { element: root, footerElement: footer, reset: resetForm };
}