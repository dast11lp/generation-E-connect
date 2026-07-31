import { createVideoCard } from "../../components/cards/video-card/video-card.js";
import { initialVideos } from "../../data/videos.data.js";
import { initializeVideos, readVideos, saveVideo } from "../../services/video-storage.service.js";
import { createVideoForm } from "../../components/forms/video-form/video-form.js";

const searchInput = document.querySelector("#busqueda-sesiones");
const resultsContainer = document.querySelector("#tarjetas-grabaciones");
const filterLinks = document.querySelectorAll(".filtros-busqueda-sesiones a");
const openFormBtn = document.querySelector("#open-video-form");
const videoFormModal = document.querySelector("#video-form-modal");

initializeVideos(initialVideos);
let activeFilter = "all";

function matchesActiveFilter(video) {
  if (activeFilter === "all") return true;

  const filter = activeFilter.toLowerCase();
  const category = video.category.toLowerCase();

  if (filter.includes("guest")) return category.includes("guest");
  if (filter.includes("webinar")) return category.includes("webinar");
  if (filter.includes("taller")) return category.includes("taller");
  if (filter.includes("charla")) return category.includes("charla");
  if (filter.includes("sesion")) return category.includes("sesion");

  return category === filter;
}

function getFilteredVideos() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const videos = readVideos();

  return videos.filter((video) => {
    const matchesSearch = !searchTerm || [video.category, video.title, video.author].some((value) => value.toLowerCase().includes(searchTerm));
    return matchesSearch && matchesActiveFilter(video);
  });
}

function renderVideos(videos = getFilteredVideos()) {
  resultsContainer.innerHTML = videos.length
    ? videos.map(createVideoCard).join("")
    : "<h3>No se encontraron grabaciones.</h3>";
}

function searchVideos() {
  renderVideos(getFilteredVideos());
}

filterLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    activeFilter = link.dataset.filter || "all";
    filterLinks.forEach((item) => item.classList.toggle("active", item === link));
    renderVideos(getFilteredVideos());
  });
});

document.querySelector(".btn-buscar-sesiones").addEventListener("click", searchVideos);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") searchVideos();
});

// ============ Apertura del modal con el formulario específico de video ============

openFormBtn.addEventListener("click", async () => {
  await customElements.whenDefined("base-modal");

  const videoForm = await createVideoForm();

  videoForm.element.addEventListener("video-created", (event) => {
    saveVideo(event.detail);
    renderVideos();
    videoFormModal.close();
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

renderVideos();