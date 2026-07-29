import { createVideoCard } from "../../components/cards/video-card/video-card.js";
import { initialVideos } from "../../data/videos.data.js";
import { uploadVideo } from "../../services/cloudinary.service.js";
import { initializeVideos, readVideos, saveVideo } from "../../services/video-storage.service.js";

const form = document.querySelector("#formulario_video");
const searchInput = document.querySelector("#busqueda-sesiones");
const resultsContainer = document.querySelector("#tarjetas-grabaciones");
const tabs = document.querySelectorAll(".tabs__list__tab");
const tabContents = document.querySelectorAll(".tabs__content");
const filterLinks = document.querySelectorAll(".filtros-busqueda-sesiones a");
const urlInput = document.querySelector("#videoUrl");
const categoryInput = document.querySelector("#category");
const descriptionInput = document.querySelector("#description");
const fileError = document.querySelector("#video-file-error");
const urlPattern = /^(https?:\/\/)([\w-]+\.)+[\w]{2,}(\/[\w-._~:/?#[\]@!$&'()*+,;=%]*)?$/;

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

function setError(input, message) {
  input.nextElementSibling.textContent = message;
}

function clearErrors() {
  [urlInput, categoryInput, descriptionInput].forEach((input) => setError(input, ""));
  fileError.textContent = "";
}

function getActiveTab() {
  return document.querySelector(".tabs__list__tab--active").dataset.tab;
}

tabs.forEach((tab) => tab.addEventListener("click", () => {
  tabs.forEach((item) => item.classList.toggle("tabs__list__tab--active", item === tab));
  tabContents.forEach((content) => content.classList.toggle("tabs__content--active", content.dataset.content === tab.dataset.tab));
}));

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

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearErrors();
  let valid = true;

  if (!categoryInput.value) { setError(categoryInput, "Selecciona una categoría."); valid = false; }
  if (!descriptionInput.value.trim()) { setError(descriptionInput, "Agrega una descripción."); valid = false; }

  let videoSource;
  if (getActiveTab() === "1") {
    const file = document.querySelector("#videoFile").files[0];
    try {
      videoSource = await uploadVideo(file);
      if (!videoSource) { fileError.textContent = "Selecciona un archivo de video válido."; valid = false; }
    } catch (error) {
      fileError.textContent = error.message;
      valid = false;
    }
  } else if (!urlInput.value.trim()) {
    setError(urlInput, "Este campo es obligatorio.");
    valid = false;
  } else if (!urlPattern.test(urlInput.value.trim())) {
    setError(urlInput, "Ingresa una URL válida.");
    valid = false;
  } else {
    videoSource = { link: urlInput.value.trim(), thumbnail: "" };
  }

  if (!valid) return;

  saveVideo({
    ...videoSource,
    category: categoryInput.value,
    title: descriptionInput.value.trim(),
    date: "Jun 2026",
    author: "UsuarioActual",
    duration: "59:59",
  });
  form.reset();
  renderVideos();
});

renderVideos();
