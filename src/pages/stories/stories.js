import { createStoryCard } from "../../components/cards/story-card/story-card.js";
import { renderStoriesCarousel } from "../../components/stories/stories-carousel/stories-carousel.js";
import { initialStories } from "../../data/stories.data.js";

const stories = [...initialStories];
let activeFilter = "todas";

const storiesContainer = document.querySelector("#tarjetas-historias");
const carouselContainer = document.querySelector("#carrusel");
const filterButtons = document.querySelectorAll("[data-filtro]");
const modal = document.querySelector("#modal-historia");
const storyForm = document.querySelector("#form-historia");

const getVisibleStories = () => activeFilter === "todas"
  ? stories
  : stories.filter((story) => story.category === activeFilter);

function renderStories() {
  const visibleStories = getVisibleStories();
  storiesContainer.innerHTML = visibleStories.length
    ? visibleStories.map(createStoryCard).join("")
    : "<p>No hay historias para esta categoría todavía.</p>";
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

storyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(storyForm);
  stories.push({
    name: formData.get("name").trim(),
    company: formData.get("company").trim(),
    timeToHire: formData.get("timeToHire").trim(),
    testimony: formData.get("testimony").trim(),
    role: formData.get("role").trim(),
    year: formData.get("year").trim(),
    category: formData.get("category"),
    photo: formData.get("photo").trim() || "https://randomuser.me/api/portraits/lego/1.jpg",
  });
  storyForm.reset();
  closeModal();
  renderStories();
  renderStoriesCarousel(carouselContainer, stories);
});

renderStories();
renderStoriesCarousel(carouselContainer, stories);
