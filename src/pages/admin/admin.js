import { createVideoCard } from "../../components/cards/video-card/video-card.js";
import { fetchVideos, createVideo } from "../../services/video-storage.service.js";
import { createVideoForm } from "../../components/forms/video-form/video-form.js";
import { createManageVideoForm } from "../../components/forms/manage-video-form/manage-video-form.js";
import { syncAdminControls } from "../../services/auth.service.js";
import { ApiError } from "../../services/api-client.js";
import { resourceCategories } from "../../data/resources.data.js";

const searchInput = document.querySelector("#busqueda-sesiones");
const resultsContainer = document.querySelector("#tarjetas-grabaciones");
const filtersContainer = document.querySelector(".filtros-busqueda-sesiones");
const openFormBtn = document.querySelector("#open-video-form");
const videoFormModal = document.querySelector("#video-form-modal");
const openManageVideoBtn = document.querySelector("#open-manage-video-form");

syncAdminControls();

let activeFilter = "Todos";
let allVideos = [];

function matchesActiveFilter(video) {
  return activeFilter === "Todos" || video.category === activeFilter;
}

function getFilteredVideos() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  return allVideos.filter((video) => {
    const matchesSearch = !searchTerm || [video.category, video.title, video.author].some((value) => value.toLowerCase().includes(searchTerm));
    return matchesSearch && matchesActiveFilter(video);
  });
}

function renderFilters() {
  if (!filtersContainer) return;

  filtersContainer.innerHTML = resourceCategories
    .map((category) => `<a href="#" data-filter="${category}" class="${category === activeFilter ? "active" : ""}">${category}</a>`)
    .join("");
}

function renderVideos(videos = getFilteredVideos()) {
  resultsContainer.innerHTML = videos.length
    ? videos.map(createVideoCard).join("")
    : "<h3>No se encontraron grabaciones.</h3>";
}

async function loadVideos() {
  try {
    allVideos = await fetchVideos();
    renderVideos();
  } catch (error) {
    const mensaje = error instanceof ApiError
      ? error.message
      : "No fue posible cargar las grabaciones.";
    resultsContainer.innerHTML = `<p class="error-state">${mensaje}</p>`;
  }
}

function searchVideos() {
  renderVideos(getFilteredVideos());
}

filtersContainer?.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-filter]");
  if (!link) return;
  event.preventDefault();
  activeFilter = link.dataset.filter;
  renderFilters();
  renderVideos(getFilteredVideos());
});

document.querySelector(".btn-buscar-sesiones").addEventListener("click", searchVideos);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") searchVideos();
});

openFormBtn.addEventListener("click", async () => {
  await customElements.whenDefined("base-modal");

  const videoForm = await createVideoForm();

  videoForm.element.addEventListener("video-created", async (event) => {
    try {
      await createVideo(event.detail);
      await loadVideos();
      videoFormModal.close();
    } catch (error) {
      const mensaje = error instanceof ApiError
        ? error.message
        : "No fue posible guardar el video.";
      window.alert(mensaje);
    }
  });

  videoForm.element.addEventListener("video-form-cancel", () => {
    videoFormModal.close();
  });

  videoFormModal.open({
    title: "Agregar video",
    content: videoForm.element,
    footer: videoForm.footerElement,
  });
});

openManageVideoBtn.addEventListener("click", async () => {
  await customElements.whenDefined("base-modal");

  const manageForm = await createManageVideoForm();

  manageForm.element.addEventListener("video-updated", async () => {
    await loadVideos();
    videoFormModal.close();
  });

  manageForm.element.addEventListener("video-deleted", async () => {
    await loadVideos();
    videoFormModal.close();
  });

  manageForm.element.addEventListener("manage-video-cancel", () => {
    videoFormModal.close();
  });

  videoFormModal.open({
    title: "Administrar videos",
    content: manageForm.element,
    footer: manageForm.footerElement,
  });
});

async function init() {
  renderFilters();
  await loadVideos();
}

init();