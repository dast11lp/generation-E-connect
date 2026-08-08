import { createResourceCard } from "../../components/cards/resource-card/resource-card.js";
import { createFilterButton } from "../../components/ui/resource-filters.js";
import { fetchCategories } from "../../services/category-storage.service.js";
import { CATEGORY_LABELS } from "../../services/resource-storage.service.js";
import { fetchResources, createResource } from "../../services/resource-storage.service.js";
import { createResourceForm } from "../../components/forms/resource-form/resource-form.js";
import { createManageResourceForm } from "../../components/forms/manage-resource-form/manage-resource-form.js";
import { syncAdminControls } from "../../services/auth.service.js";
import { ApiError } from "../../services/api-client.js";

const resourcesContainer = document.querySelector(".contenedor-recursos");
const filtersContainer = document.querySelector(".categorias");
const summary = document.querySelector(".contenedor-recursos-filtro p");
const searchInput = document.querySelector(".contenido-principal input[type='text']");
const sortInputs = document.querySelectorAll("input[name='orden']");
const typeInputs = document.querySelectorAll("input[name='tipo-recurso']");
const dateInput = document.querySelector("#fecha");
const openFormBtn = document.querySelector("#open-resource-form");
const resourceFormModal = document.querySelector("#resource-form-modal");
const openManageBtn = document.querySelector("#open-manage-resource-form");

let activeCategory = "Todos";

let activeSort = "recientes";
let activeDate = "";
let searchQuery = "";
let activeTypes = new Set();
let allResources = [];

let categoryLabels = ["Todos"];

async function loadCategoryLabels() {
  try {
    const categories = await fetchCategories("library");
    categoryLabels = ["Todos", ...categories.map((c) => CATEGORY_LABELS[c.categoryType] ?? c.description ?? c.categoryType)];
  } catch (error) {
    console.error("No se pudieron cargar las categorías:", error);
    categoryLabels = ["Todos"];
  }
}

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getFilteredResources() {
  const filtered = allResources.filter((resource) => {
    const matchesCategory =
      activeCategory === "Todos" || resource.category === activeCategory;

    const matchesSearch =
      normalizeText(resource.title).includes(normalizeText(searchQuery)) ||
      normalizeText(resource.description).includes(normalizeText(searchQuery));

    const matchesDate =
      !activeDate || resource.dateValue <= activeDate;

    const matchesType =
      activeTypes.size === 0 || activeTypes.has(resource.type);

    return matchesCategory && matchesSearch && matchesDate && matchesType;
  });

  const sorted = [...filtered].sort((left, right) => {
    if (activeSort === "descargas") {
      return right.downloads - left.downloads;
    }
    if (activeSort === "destacados") {
      return Number(right.featured) - Number(left.featured);
    }
    return right.dateValue.localeCompare(left.dateValue);
  });

  return sorted;
}

function renderFilters() {
  if (!filtersContainer) return;

  filtersContainer.innerHTML = categoryLabels
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

async function loadResources() {
  if (!resourcesContainer) return;
  try {
    allResources = await fetchResources();
    renderResources();
  } catch (error) {
    const mensaje = error instanceof ApiError
      ? error.message
      : "No fue posible cargar los recursos.";
    resourcesContainer.innerHTML = `<p class="error-state">${mensaje}</p>`;
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

  typeInputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      if (event.target.checked) {
        activeTypes.add(event.target.value);
      } else {
        activeTypes.delete(event.target.value);
      }
      renderResources();
    });
  });

  dateInput?.addEventListener("change", (event) => {
    activeDate = event.target.value;
    renderResources();
  });

  openFormBtn?.addEventListener("click", async () => {
    await customElements.whenDefined("base-modal");

    const resourceForm = await createResourceForm();

    resourceForm.element.addEventListener("resource-created", async (event) => {
      try {
        await createResource(event.detail);
        await loadResources();
        resourceFormModal.close();
      } catch (error) {
        const mensaje = error instanceof ApiError
          ? error.message
          : "No fue posible guardar el recurso.";
        window.alert(mensaje);
      }
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

    manageForm.element.addEventListener("resource-updated", async () => {
      await loadResources();
      resourceFormModal.close();
    });

    manageForm.element.addEventListener("resource-deleted", async () => {
      await loadResources();
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

async function init() {
  syncAdminControls();
  await loadCategoryLabels();
  renderFilters();
  bindEvents();
  await loadResources();
}

init();