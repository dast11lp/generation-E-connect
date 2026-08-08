import { uploadVideo } from "../../../services/cloudinary.service.js";
import { fetchCategories } from "../../../services/category-storage.service.js";
import { fetchResourceTypes } from "../../../services/resource-type-storage.service.js";
import { CATEGORY_LABELS } from "../../../services/resource-storage.service.js";

const COMPONENT_URL = import.meta.url;
const HTML_URL = new URL("./video-form-content.html", COMPONENT_URL);
const CSS_URL = new URL("./video-form-content.css", COMPONENT_URL);

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

const urlPattern = /^(https?:\/\/)([\w-]+\.)+[\w]{2,}(\/[\w-._~:/?#[\]@!$&'()*+,;=%]*)?$/;

/**
 * Construye el DOM del formulario de video, listo para pasarle
 * a base-modal.open({ content, footer }). No conoce el modal ni la API.
 */
export async function createVideoForm() {
  const [html, css] = await loadTemplates();

  const root = document.createElement("div");
  root.innerHTML = html;

  const style = document.createElement("style");
  style.textContent = css;
  root.prepend(style);

  const form = root.querySelector("#vf-form");
  const tabs = root.querySelectorAll(".tabs__list__tab");
  const tabContents = root.querySelectorAll(".tabs__content");
  const titleInput = root.querySelector("#vf-title");
  const fileInput = root.querySelector("#vf-videoFile");
  const urlInput = root.querySelector("#vf-videoUrl");
  const categoryInput = root.querySelector("#vf-category");
  const descriptionInput = root.querySelector("#vf-description");
  const footer = root.querySelector("#vf-footer");
  const errors = {
    title: root.querySelector('[data-error="title"]'),
    file: root.querySelector('[data-error="file"]'),
    url: root.querySelector('[data-error="url"]'),
    category: root.querySelector('[data-error="category"]'),
    description: root.querySelector('[data-error="description"]'),
  };

  footer.remove(); // se entrega aparte para el slot de footer del modal

  let resourceTypes = [];

  async function loadOptions() {
    try {
      const [categories, types] = await Promise.all([fetchCategories("recording"), fetchResourceTypes()]);
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

  function getActiveTab() {
    return root.querySelector(".tabs__list__tab--active").dataset.tab;
  }

  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.toggle("tabs__list__tab--active", item === tab));
      tabContents.forEach((content) =>
        content.classList.toggle("tabs__content--active", content.dataset.content === tab.dataset.tab)
      );
    })
  );

  function clearErrors() {
    Object.values(errors).forEach((el) => (el.textContent = ""));
  }

  function resetForm() {
    form.reset();
    clearErrors();
    tabs.forEach((item) => item.classList.toggle("tabs__list__tab--active", item.dataset.tab === "1"));
    tabContents.forEach((content) => content.classList.toggle("tabs__content--active", content.dataset.content === "1"));
  }

  async function collectAndValidate() {
    clearErrors();
    let hasError = false;

    const title = titleInput.value.trim();
    const categoryId = categoryInput.value;
    const description = descriptionInput.value.trim();

    if (!title) { errors.title.textContent = "El título es obligatorio."; hasError = true; }
    if (!categoryId) { errors.category.textContent = "Selecciona una categoría."; hasError = true; }
    if (!description) { errors.description.textContent = "Agrega una descripción."; hasError = true; }

    let fileUrl;
    let thumbnailUrl = null;
    let fileName = null;
    let fileSize = null;

    if (getActiveTab() === "1") {
      const file = fileInput.files[0];
      if (!file) {
        errors.file.textContent = "Selecciona un archivo de video.";
        hasError = true;
      } else {
        try {
          const uploaded = await uploadVideo(file);
          if (!uploaded) {
            errors.file.textContent = "Selecciona un archivo de video válido.";
            hasError = true;
          } else {
            fileUrl = uploaded.link;
            thumbnailUrl = uploaded.thumbnail;
            fileName = file.name;
            fileSize = file.size;
          }
        } catch (error) {
          errors.file.textContent = error.message ?? "No se pudo subir el video.";
          hasError = true;
        }
      }
    } else if (!urlInput.value.trim()) {
      errors.url.textContent = "Este campo es obligatorio.";
      hasError = true;
    } else if (!urlPattern.test(urlInput.value.trim())) {
      errors.url.textContent = "Ingresa una URL válida.";
      hasError = true;
    } else {
      fileUrl = urlInput.value.trim();
    }

    if (hasError) return { errors: true };

    const matchingType = resourceTypes.find((t) => t.name.toLowerCase() === "video");

    return {
      video: {
        title,
        categoryId: Number(categoryId),
        resourceTypeId: matchingType?.id ?? null,
        description,
        link: fileUrl,
        thumbnail: thumbnailUrl,
        fileName,
        fileSize,
        sourceType: getActiveTab() === "1" ? "file" : "url",
      },
    };
  }

  root.querySelector('[data-action="cancel"]')?.addEventListener("click", () => {
    root.dispatchEvent(new CustomEvent("video-form-cancel", { bubbles: true, composed: true }));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const result = await collectAndValidate();
    if (result.errors) return;

    root.dispatchEvent(
      new CustomEvent("video-created", {
        detail: result.video,
        bubbles: true,
        composed: true,
      })
    );
  });

  await loadOptions();

  return { element: root, footerElement: footer, reset: resetForm };
}