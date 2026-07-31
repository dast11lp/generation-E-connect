import { uploadVideo } from "../../../services/cloudinary.service.js";

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
 * a base-modal.open({ content, footer }). No conoce el modal ni localStorage.
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
  const fileInput = root.querySelector("#vf-videoFile");
  const urlInput = root.querySelector("#vf-videoUrl");
  const categoryInput = root.querySelector("#vf-category");
  const descriptionInput = root.querySelector("#vf-description");
  const footer = root.querySelector("#vf-footer");
  const errors = {
    file: root.querySelector('[data-error="file"]'),
    url: root.querySelector('[data-error="url"]'),
    category: root.querySelector('[data-error="category"]'),
    description: root.querySelector('[data-error="description"]'),
  };

  footer.remove(); // se entrega aparte para el slot de footer del modal

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

    if (!categoryInput.value) {
      errors.category.textContent = "Selecciona una categoría.";
      hasError = true;
    }
    if (!descriptionInput.value.trim()) {
      errors.description.textContent = "Agrega una descripción.";
      hasError = true;
    }

    let videoSource;

    if (getActiveTab() === "1") {
      const file = fileInput.files[0];
      try {
        videoSource = await uploadVideo(file);
        if (!videoSource) {
          errors.file.textContent = "Selecciona un archivo de video válido.";
          hasError = true;
        }
      } catch (error) {
        errors.file.textContent = error.message;
        hasError = true;
      }
    } else if (!urlInput.value.trim()) {
      errors.url.textContent = "Este campo es obligatorio.";
      hasError = true;
    } else if (!urlPattern.test(urlInput.value.trim())) {
      errors.url.textContent = "Ingresa una URL válida.";
      hasError = true;
    } else {
      videoSource = { link: urlInput.value.trim(), thumbnail: "" };
    }

    if (hasError) return { errors: true };

    return {
      video: {
        ...videoSource,
        category: categoryInput.value,
        title: descriptionInput.value.trim(),
        date: "Jun 2026",
        author: "UsuarioActual",
        duration: "59:59",
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

  return { element: root, footerElement: footer, reset: resetForm };
}