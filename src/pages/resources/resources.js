import { createResourceCard } from "../../components/cards/resource-card/resource-card.js";
import { createFilterButton } from "../../components/ui/resource-filters.js";
import { resourceCategories, resources } from "../../data/resources.data.js";
import { initializeUserResources, readUserResources, saveUserResource } from "../../services/resource-storage.service.js";
import { createResourceForm } from "../../components/forms/resource-form/resource-form.js";
import { createManageResourceForm } from "../../components/forms/manage-resource-form/manage-resource-form.js";

const resourcesContainer = document.querySelector(".contenedor-recursos");
const filtersContainer = document.querySelector(".categorias");
const summary = document.querySelector(".contenedor-recursos-filtro p");
const searchInput = document.querySelector(".contenido-principal input[type='text']");
const sortInputs = document.querySelectorAll("input[name='orden']");
const dateInput = document.querySelector("#fecha");
const openFormBtn = document.querySelector("#open-resource-form");
const resourceFormModal = document.querySelector("#resource-form-modal");
const openManageBtn = document.querySelector("#open-manage-resource-form");

initializeUserResources(); // asegura la clave en localStorage

let activeCategory = "Todos";
let activeSort = "recientes";
let activeDate = "";
let searchQuery = "";

function normalizeText(value = "") {
  return String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// fusiona estáticos + creados por el usuario
function getAllResources() {
  return [...resources, ...readUserResources()];
}

function getFilteredResources() {
  const allResources = getAllResources(); // <-- antes era "resources"

  const filtered = allResources.filter((resource) => {
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

  // apertura del modal con el formulario de recursos
  openFormBtn?.addEventListener("click", async () => {
    await customElements.whenDefined("base-modal");

    const resourceForm = await createResourceForm();

    resourceForm.element.addEventListener("resource-created", (event) => {
      saveUserResource(event.detail);
      renderResources();
      resourceFormModal.close();
    });

    resourceForm.element.addEventListener("resource-form-cancel", () => {
      resourceFormModal.close();
    });

    resourceFormModal.open({
      title: "Agregar recurso",
      content: resourceForm.element,
      footer: resourceForm.footerElement,
    });
  });

  openManageBtn?.addEventListener("click", async () => {
    await customElements.whenDefined("base-modal");

    const manageForm = await createManageResourceForm();

    manageForm.element.addEventListener("resource-updated", () => {
      renderResources();
      resourceFormModal.close();
    });

    manageForm.element.addEventListener("resource-deleted", () => {
      renderResources();
      resourceFormModal.close();
    });

    manageForm.element.addEventListener("manage-resource-cancel", () => {
      resourceFormModal.close();
    });

    resourceFormModal.open({
      title: "Administrar recursos",
      content: manageForm.element,
      footer: manageForm.footerElement,
    });
  });
}

function init() {
  renderFilters();
  renderResources();
  bindEvents();
}

init();