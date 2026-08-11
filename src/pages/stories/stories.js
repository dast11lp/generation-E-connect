import { createStoryCard } from "../../components/cards/story-card/story-card.js";
import { renderStoriesCarousel } from "../../components/stories/stories-carousel/stories-carousel.js";
import { fetchStories, createStory } from "../../services/story-storage.service.js";
import { createManageStoryForm } from "../../components/forms/manage-story-form/manage-story-form.js";
import { syncAdminControls } from "../../services/auth.service.js";
import { ApiError } from "../../services/api-client.js";

const MAX_CAROUSEL_STORIES = 4;

let stories = [];
let activeFilter = "todas";

const storiesContainer = document.querySelector("#tarjetas-historias");
const carouselContainer = document.querySelector("#carrusel");
const filterButtons = document.querySelectorAll("[data-filtro]");
const modal = document.querySelector("#modal-historia");
const storyForm = document.querySelector("#form-historia");
const submitButton = storyForm.querySelector("button[type='submit']");
const openManageBtn = document.querySelector("#open-manage-story-form");
const storyFormModal = document.querySelector("#story-form-modal");

const getVisibleStories = () => activeFilter === "todas"
  ? stories
  : stories.filter((story) => story.category === activeFilter);

function renderStories() {
  const visibleStories = getVisibleStories();
  storiesContainer.innerHTML = visibleStories.length
    ? visibleStories.map(createStoryCard).join("")
    : "<p>No hay historias para esta categoría todavía.</p>";
}

function getCarouselStories() {
  return stories.slice(0, MAX_CAROUSEL_STORIES);
}

function closeModal() { modal.classList.add("oculto"); }
function openModal() {
  modal.classList.remove("oculto");
  document.querySelector("#input-nombre").focus();
}

filterButtons.forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filtro;
  filterButtons.forEach((item) => item.classList.toggle("activo", item === button));
  renderStories();
}));

document.querySelector("#btn-agregar-historia").addEventListener("click", openModal);
document.querySelector("#btn-cerrar-modal").addEventListener("click", closeModal);
modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.classList.contains("oculto")) closeModal();
});

storyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(storyForm);
  const payload = {
    name: formData.get("name").trim(),
    company: formData.get("company").trim(),
    timeToHire: formData.get("timeToHire").trim(),
    testimony: formData.get("testimony").trim(),
    role: formData.get("role").trim(),
    year: formData.get("year").trim(),
    category: formData.get("category"),
    photo: formData.get("photo").trim(),
  };

  submitButton.disabled = true;
  submitButton.textContent = "Publicando...";

  try {
    const savedStory = await createStory(payload);
    stories.push(savedStory);
    storyForm.reset();
    closeModal();
    renderStories();
    renderStoriesCarousel(carouselContainer, getCarouselStories());
  } catch (error) {
    const message = error instanceof ApiError
      ? error.message
      : "No pudimos publicar tu historia. Intenta de nuevo en unos minutos.";
    alert(message);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Publicar historia";
  }
});

openManageBtn?.addEventListener("click", async () => {
  await customElements.whenDefined("base-modal");
  const manageForm = await createManageStoryForm();

  manageForm.element.addEventListener("story-updated", async () => {
    await reloadStories();
    storyFormModal.close();
  });
  manageForm.element.addEventListener("story-deleted", async () => {
    await reloadStories();
    storyFormModal.close();
  });
  manageForm.element.addEventListener("manage-story-cancel", () => storyFormModal.close());

  storyFormModal.open({
    title: "Administrar historias",
    content: manageForm.element,
    footer: manageForm.footerElement,
  });
});

async function reloadStories() {
  stories = await fetchStories();
  renderStories();
  renderStoriesCarousel(carouselContainer, getCarouselStories());
}

async function init() {
  syncAdminControls();
  storiesContainer.innerHTML = "<p>Cargando historias...</p>";
  try {
    stories = await fetchStories();
  } catch (error) {
    stories = [];
    storiesContainer.innerHTML = "<p>No pudimos cargar las historias. Intenta más tarde.</p>";
    console.error("Error al cargar historias:", error);
    return;
  }
  renderStories();
  renderStoriesCarousel(carouselContainer, getCarouselStories());
}

init();