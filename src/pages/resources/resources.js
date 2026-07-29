import { createResourceCard } from "../../components/cards/resource-card/resource-card.js";
import { createFilterButton } from "../../components/ui/resource-filters.js";
import { resourceCategories, resources } from "../../data/resources.data.js";

const resourcesContainer = document.querySelector(".contenedor-recursos");
const filtersContainer = document.querySelector(".categorias");
const summary = document.querySelector(".contenedor-recursos-filtro p");
const searchInput = document.querySelector(".contenido-principal input[type='text']");
const sortInputs = document.querySelectorAll("input[name='orden']");
const dateInput = document.querySelector("#fecha");

let activeCategory = "Todos";
let activeSort = "recientes";
let activeDate = "";
let searchQuery = "";

function normalizeText(value = "") {
  return String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getFilteredResources() {
  const filtered = resources.filter((resource) => {
    const matchesCategory = activeCategory === "Todos" || resource.category === activeCategory;
    const matchesSearch = normalizeText(resource.title).includes(normalizeText(searchQuery))
      || normalizeText(resource.description).includes(normalizeText(searchQuery));
    const matchesDate = !activeDate || resource.dateValue <= activeDate;
    return matchesCategory && matchesSearch && matchesDate;
  });

  const sorted = [...filtered].sort((left, right) => {
    if (activeSort === "descargas") return right.downloads - left.downloads;
    if (activeSort === "destacados") return Number(right.featured) - Number(left.featured);
    return right.dateValue.localeCompare(left.dateValue);
  });

  return sorted;
}

function renderFilters() {
  if (!filtersContainer) return;
  filtersContainer.innerHTML = resourceCategories
    .map((category) => createFilterButton(category, category === activeCategory))
    .join("");
}

function renderResources() {
  const visibleResources = getFilteredResources();
  if (!resourcesContainer) return;

  resourcesContainer.innerHTML = visibleResources.length
    ? visibleResources.map(createResourceCard).join("")
    : '<p class="empty-state">No hay recursos que coincidan con los filtros seleccionados.</p>';

  if (summary) {
    summary.textContent = `${visibleResources.length} recursos encontrados`;
  }
}

function bindEvents() {
  filtersContainer?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    renderFilters();
    renderResources();
  });

  searchInput?.addEventListener("input", (event) => {
    searchQuery = event.target.value.trim();
    renderResources();
  });

  sortInputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      activeSort = event.target.value;
      renderResources();
    });
  });

  dateInput?.addEventListener("change", (event) => {
    activeDate = event.target.value;
    renderResources();
  });
}

function init() {
  renderFilters();
  renderResources();
  bindEvents();
}

init();
