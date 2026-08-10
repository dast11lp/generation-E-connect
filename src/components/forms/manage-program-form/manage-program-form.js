import { createProgramForm } from "../program-form/program-form.js";
import {
  fetchPrograms,
  fetchFullProgram,
  updateFullProgram,
  deleteProgram,
} from "../../../services/program-storage.service.js";
import { ApiError } from "../../../services/api-client.js";

const COMPONENT_URL = import.meta.url;
const HTML_URL = new URL("./manage-program-form-content.html", COMPONENT_URL);
const CSS_URL = new URL("./manage-program-form-content.css", COMPONENT_URL);

let templatesPromise = null;
function loadTemplates() {
  if (!templatesPromise) {
    templatesPromise = Promise.all([
      fetch(HTML_URL).then((r) => r.text()),
      fetch(CSS_URL).then((r) => r.text()),
    ]);
  }
  return templatesPromise;
}

function apiErrorMessage(error, fallback) {
  return error instanceof ApiError ? error.message : fallback;
}

export async function createManageProgramForm() {
  const [html, css] = await loadTemplates();

  const root = document.createElement("div");
  root.innerHTML = html;

  const style = document.createElement("style");
  style.textContent = css;
  root.prepend(style);

  const select = root.querySelector("#mpf-select");
  const slot = root.querySelector("#mpf-form-slot");
  const footer = root.querySelector("#mpf-footer");
  const saveBtn = root.querySelector("#mpf-save");
  const deleteBtn = root.querySelector("#mpf-delete");

  footer.remove();

  let currentProgram = null;

  async function populateSelect() {
    let programs = [];
    try {
      programs = await fetchPrograms();
    } catch (error) {
      window.alert(apiErrorMessage(error, "No fue posible cargar los programas."));
    }
    select.innerHTML =
      '<option value="">Seleccionar programa...</option>' +
      programs.map((p) => `<option value="${p.id}">${p.name}</option>`).join("");
  }

  async function loadProgramIntoForm(programId) {
    slot.innerHTML = "";
    let fullProgram;
    try {
      fullProgram = await fetchFullProgram(programId); // trae rutas + topics + links reales
    } catch (error) {
      slot.innerHTML = `<p class="error-state">${apiErrorMessage(error, "No fue posible cargar el programa.")}</p>`;
      return;
    }

    currentProgram = fullProgram;

    const innerForm = await createProgramForm({ program: fullProgram });
    slot.appendChild(innerForm.element);

    innerForm.element.addEventListener("program-updated", async (e) => {
      saveBtn.disabled = true;
      try {
        const updated = await updateFullProgram(currentProgram.id, e.detail);
        root.dispatchEvent(new CustomEvent("program-form-updated", { detail: updated, bubbles: true, composed: true }));
      } catch (error) {
        window.alert(apiErrorMessage(error, "No fue posible guardar los cambios."));
      } finally {
        saveBtn.disabled = false;
      }
    });

    saveBtn.disabled = false;
    deleteBtn.disabled = false;
  }

  select.addEventListener("change", async () => {
    const id = Number(select.value);
    if (!id) {
      slot.innerHTML = "";
      currentProgram = null;
      saveBtn.disabled = true;
      deleteBtn.disabled = true;
      return;
    }
    await loadProgramIntoForm(id);
  });

  deleteBtn.addEventListener("click", async () => {
    if (!currentProgram) return;

    const confirmed = window.confirm(
      "¿Estás seguro de eliminar este programa?\nTambién se eliminarán todas sus rutas asociadas.\nEsta acción no se puede deshacer."
    );
    if (!confirmed) return;

    try {
      await deleteProgram(currentProgram.id);
      root.dispatchEvent(new CustomEvent("program-form-deleted", { detail: { id: currentProgram.id }, bubbles: true, composed: true }));
    } catch (error) {
      window.alert(apiErrorMessage(error, "No fue posible eliminar el programa."));
    }
  });

  root.querySelector('[data-action="close"]')?.addEventListener("click", () => {
    root.dispatchEvent(new CustomEvent("manage-program-cancel", { bubbles: true, composed: true }));
  });

  await populateSelect();

  return { element: root, footerElement: footer };
}