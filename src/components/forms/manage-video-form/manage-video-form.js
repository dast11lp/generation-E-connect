import { uploadVideo } from "../../../services/cloudinary.service.js";
import { readVideos, updateVideo, deleteVideo } from "../../../services/video-storage.service.js";

const COMPONENT_URL = import.meta.url;
const HTML_URL = new URL("./manage-video-form-content.html", COMPONENT_URL);
const CSS_URL = new URL("./manage-video-form-content.css", COMPONENT_URL);
const SHARED_CSS_URL = new URL("../video-form/video-form-content.css", COMPONENT_URL);

const urlPattern = /^(https?:\/\/)([\w-]+\.)+[\w]{2,}(\/[\w-._~:/?#[\]@!$&'()*+,;=%]*)?$/;

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

/**
 * Construye el DOM del formulario de gestión (editar/eliminar) de videos,
 * listo para pasarle a base-modal.open({ content, footer }).
 */
export async function createManageVideoForm() {
  const [html, css, sharedCss] = await loadTemplates();

  const root = document.createElement("div");
  root.innerHTML = html;

  const sharedStyle = document.createElement("style");
  sharedStyle.textContent = sharedCss;
  const style = document.createElement("style");
  style.textContent = css;
  root.prepend(style);
  root.prepend(sharedStyle);

  const form = root.querySelector("#mvf-form");
  const select = root.querySelector("#mvf-select");
  const details = root.querySelector("#mvf-details");
  const categoryInput = root.querySelector("#mvf-category");
  const descriptionInput = root.querySelector("#mvf-description");
  const fileBlock = root.querySelector("#mvf-file-block");
  const urlBlock = root.querySelector("#mvf-url-block");
  const fileInput = root.querySelector("#mvf-file");
  const urlInput = root.querySelector("#mvf-url");
  const currentFileName = root.querySelector("[data-current-file-name]");
  const footer = root.querySelector("#mvf-footer");
  const saveBtn = root.querySelector("#mvf-save");
  const deleteBtn = root.querySelector("#mvf-delete");
  const errors = {
    category: root.querySelector('[data-error="category"]'),
    description: root.querySelector('[data-error="description"]'),
    file: root.querySelector('[data-error="file"]'),
    url: root.querySelector('[data-error="url"]'),
  };

  footer.remove();

  let currentVideo = null;

  function populateSelect() {
    const videos = readVideos();
    select.innerHTML =
      '<option value="">Seleccionar video...</option>' +
      videos.map((v) => `<option value="${v.id}">${v.title}</option>`).join("");
  }

  function clearErrors() {
    Object.values(errors).forEach((el) => (el.textContent = ""));
  }

  function fillForm(video) {
    currentVideo = video;
    details.hidden = false;
    clearErrors();

    categoryInput.value = video.category;
    descriptionInput.value = video.title;
    fileInput.value = "";

    const isFileMode = video.sourceType === "file";
    fileBlock.hidden = !isFileMode;
    urlBlock.hidden = isFileMode;

    if (isFileMode) {
      currentFileName.textContent = video.link || "Archivo sin referencia disponible";
    } else {
      urlInput.value = video.link || "";
    }

    saveBtn.disabled = false;
    deleteBtn.disabled = false;
  }

  select.addEventListener("change", () => {
    const id = Number(select.value);
    if (!id) {
      details.hidden = true;
      currentVideo = null;
      return;
    }
    const video = readVideos().find((v) => v.id === id);
    if (video) fillForm(video);
  });

  async function collectAndValidate() {
    clearErrors();
    if (!currentVideo) return { errors: true };

    let hasError = false;
    const category = categoryInput.value;
    const title = descriptionInput.value.trim();

    if (!category) { errors.category.textContent = "Selecciona una categoría."; hasError = true; }
    if (!title) { errors.description.textContent = "Agrega una descripción."; hasError = true; }

    const updates = { category, title };

    if (currentVideo.sourceType === "file") {
      const newFile = fileInput.files[0];
      if (newFile) {
        try {
          const uploaded = await uploadVideo(newFile);
          if (!uploaded) {
            errors.file.textContent = "Selecciona un archivo de video válido.";
            hasError = true;
          } else {
            Object.assign(updates, uploaded); // { link, thumbnail }
          }
        } catch (error) {
          errors.file.textContent = error.message;
          hasError = true;
        }
      }
    } else {
      const newUrl = urlInput.value.trim();
      if (!newUrl) {
        errors.url.textContent = "Este campo es obligatorio.";
        hasError = true;
      } else if (!urlPattern.test(newUrl)) {
        errors.url.textContent = "Ingresa una URL válida.";
        hasError = true;
      } else {
        updates.link = newUrl;
      }
    }

    if (hasError) return { errors: true };
    return { updates };
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const result = await collectAndValidate();
    if (result.errors) return;

    const updated = updateVideo(currentVideo.id, result.updates);
    root.dispatchEvent(new CustomEvent("video-updated", { detail: updated, bubbles: true, composed: true }));
  });

  deleteBtn.addEventListener("click", () => {
    if (!currentVideo) return;

    const confirmed = window.confirm("¿Estás seguro de eliminar este video? Esta acción no se puede deshacer.");
    if (!confirmed) return;

    deleteVideo(currentVideo.id);
    root.dispatchEvent(new CustomEvent("video-deleted", { detail: { id: currentVideo.id }, bubbles: true, composed: true }));
  });

  root.querySelector('[data-action="close"]')?.addEventListener("click", () => {
    root.dispatchEvent(new CustomEvent("manage-video-cancel", { bubbles: true, composed: true }));
  });

  populateSelect();

  return { element: root, footerElement: footer };
}