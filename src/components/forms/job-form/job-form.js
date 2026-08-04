import { uploadImage } from "../../../services/cloudinary.service.js";

const COMPONENT_URL = import.meta.url;
const HTML_URL = new URL("./job-form-content.html", COMPONENT_URL);
const CSS_URL = new URL("./job-form-content.css", COMPONENT_URL);

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
 * Construye el DOM del formulario de creación de portales de empleo,
 * listo para pasarle a base-modal.open({ content, footer }).
 */
export async function createJobForm() {
  const [html, css] = await loadTemplates();

  const root = document.createElement("div");
  root.innerHTML = html;

  const style = document.createElement("style");
  style.textContent = css;
  root.prepend(style);

  const form = root.querySelector("#jf-form");
  const nameInput = root.querySelector("#jf-name");
  const descriptionInput = root.querySelector("#jf-description");
  const urlInput = root.querySelector("#jf-url");
  const categoryInput = root.querySelector("#jf-category");
  const imageInput = root.querySelector("#jf-image");
  const footer = root.querySelector("#jf-footer");
  const errors = {
    name: root.querySelector('[data-error="name"]'),
    description: root.querySelector('[data-error="description"]'),
    url: root.querySelector('[data-error="url"]'),
    category: root.querySelector('[data-error="category"]'),
    image: root.querySelector('[data-error="image"]'),
  };

  footer.remove();

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

    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();
    const url = urlInput.value.trim();
    const category = categoryInput.value;
    const file = imageInput.files[0];

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
    if (!file) { errors.image.textContent = "Selecciona una imagen."; hasError = true; }

    if (hasError) return { errors: true };

    let uploaded;
    try {
      uploaded = await uploadImage(file);
      if (!uploaded) {
        errors.image.textContent = "Selecciona una imagen válida.";
        return { errors: true };
      }
    } catch (error) {
      errors.image.textContent = error.message ?? "No se pudo subir la imagen.";
      return { errors: true };
    }

    return {
      job: {
        id: `job-${Date.now()}`,
        name,
        description,
        url,
        category,
        image: uploaded.url,
      },
    };
  }

  root.querySelector('[data-action="cancel"]')?.addEventListener("click", () => {
    root.dispatchEvent(new CustomEvent("job-form-cancel", { bubbles: true, composed: true }));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const result = await collectAndValidate();
    if (result.errors) return;

    root.dispatchEvent(
      new CustomEvent("job-created", { detail: result.job, bubbles: true, composed: true })
    );
  });

  return { element: root, footerElement: footer, reset: resetForm };
}