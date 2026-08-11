import { createJobCard } from "../../components/cards/job-card/job-card.js";
import { fetchJobBoards, createJobBoard } from "../../services/job-storage.service.js";
import { createJobForm } from "../../components/forms/job-form/job-form.js";
import { createManageJobForm } from "../../components/forms/manage-job-form/manage-job-form.js";
import { syncAdminControls } from "../../services/auth.service.js";
import { ApiError } from "../../services/api-client.js";
import { mostrarAlerta } from "../../components/ui/alert/alert.js";

const grid = document.querySelector(".grid_portales");
const filtersContainer = document.querySelector(".filtros-portales");
const openFormBtn = document.querySelector("#open-job-form");
const openManageBtn = document.querySelector("#open-manage-job-form");
const jobFormModal = document.querySelector("#job-form-modal");

let activeCategory = "all";
let allJobs = [];

function getFilteredJobs() {
  if (activeCategory === "all") return allJobs;
  return allJobs.filter((portal) => portal.category === activeCategory);
}

function renderJobs() {
  if (!grid) return;
  grid.innerHTML = getFilteredJobs().map(createJobCard).join("");
}

async function loadJobs() {
  if (!grid) return;
  try {
    allJobs = await fetchJobBoards();
    renderJobs();
  } catch (error) {
    const mensaje = error instanceof ApiError
      ? error.message
      : "No fue posible cargar los portales de empleo.";
    grid.innerHTML = `<p class="error-state">${mensaje}</p>`;
  }
}

function updateActiveButton() {
  filtersContainer?.querySelectorAll("button[data-category]").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === activeCategory);
  });
}

function bindFilterEvents() {
  filtersContainer?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    updateActiveButton();
    renderJobs();
  });
}

openFormBtn?.addEventListener("click", async () => {
  await customElements.whenDefined("base-modal");
  const jobForm = await createJobForm();

  jobForm.element.addEventListener("job-created", async (event) => {
    try {
      await createJobBoard(event.detail);
      await loadJobs();
      jobFormModal.close();
    } catch (error) {
      const mensaje = error instanceof ApiError
        ? error.message
        : "No fue posible guardar el portal de empleo.";
      mostrarAlerta(mensaje, "error");
    }
  });

  jobForm.element.addEventListener("job-form-cancel", () => jobFormModal.close());

  jobFormModal.open({ title: "Agregar empleo", content: jobForm.element, footer: jobForm.footerElement });
});

openManageBtn?.addEventListener("click", async () => {
  await customElements.whenDefined("base-modal");
  const manageForm = await createManageJobForm();

  manageForm.element.addEventListener("job-updated", async () => {
    await loadJobs();
    jobFormModal.close();
  });
  manageForm.element.addEventListener("job-deleted", async () => {
    await loadJobs();
    jobFormModal.close();
  });
  manageForm.element.addEventListener("manage-job-cancel", () => jobFormModal.close());

  jobFormModal.open({ title: "Administrar empleos", content: manageForm.element, footer: manageForm.footerElement });
});

async function init() {
  syncAdminControls();
  updateActiveButton();
  bindFilterEvents();
  await loadJobs();
}

init();