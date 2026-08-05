import { createJobCard } from "../../components/cards/job-card/job-card.js";
import { jobPortals } from "../../data/jobs.data.js";
import { initializeUserJobs, readUserJobs, saveUserJob } from "../../services/job-storage.service.js";
import { createJobForm } from "../../components/forms/job-form/job-form.js";
import { createManageJobForm } from "../../components/forms/manage-job-form/manage-job-form.js";
import { syncAdminControls } from "../../services/auth.service.js";

const grid = document.querySelector(".grid_portales");
const filtersContainer = document.querySelector(".filtros-portales");
const openFormBtn = document.querySelector("#open-job-form");
const openManageBtn = document.querySelector("#open-manage-job-form");
const jobFormModal = document.querySelector("#job-form-modal");

initializeUserJobs();
let activeCategory = "all";


function getAllJobs() {
  return [...jobPortals, ...readUserJobs()];
}

function getFilteredJobs() {
  const allJobs = getAllJobs();
  if (activeCategory === "all") return allJobs;
  return allJobs.filter((portal) => portal.category === activeCategory);
}

function renderJobs() {
  if (!grid) return;
  grid.innerHTML = getFilteredJobs().map(createJobCard).join("");
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

  jobForm.element.addEventListener("job-created", (event) => {
    saveUserJob(event.detail);
    renderJobs();
    jobFormModal.close();
  });

  jobForm.element.addEventListener("job-form-cancel", () => jobFormModal.close());

  jobFormModal.open({ title: "Agregar empleo", content: jobForm.element, footer: jobForm.footerElement });
});

openManageBtn?.addEventListener("click", async () => {
  await customElements.whenDefined("base-modal");
  const manageForm = await createManageJobForm();

  manageForm.element.addEventListener("job-updated", () => {
    renderJobs();
    jobFormModal.close();
  });
  manageForm.element.addEventListener("job-deleted", () => {
    renderJobs();
    jobFormModal.close();
  });
  manageForm.element.addEventListener("manage-job-cancel", () => jobFormModal.close());

  jobFormModal.open({ title: "Administrar empleos", content: manageForm.element, footer: manageForm.footerElement });
});

function init() {
  syncAdminControls();
  renderJobs();
  updateActiveButton();
  bindFilterEvents();
}

init();
