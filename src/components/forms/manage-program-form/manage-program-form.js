import { createProgramForm } from "../program-form/program-form.js";

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

/**
 * Construye el DOM del formulario de gestión (editar/eliminar) de programas.
 * Reutiliza createProgramForm() por completo para el árbol rutas/topics/links.
 */
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
  let activeInnerForm = null; // instancia devuelta por createProgramForm

  function populateSelect() {
    const programs = getPrograms(); // función global de storage.js
    select.innerHTML =
      '<option value="">Seleccionar programa...</option>' +
      programs.map((p) => `<option value="${p.id}">${p.name}</option>`).join("");
  }

  async function loadProgramIntoForm(program) {
    slot.innerHTML = "";
    currentProgram = program;

    activeInnerForm = await createProgramForm({ program });
    slot.appendChild(activeInnerForm.element);

    activeInnerForm.element.addEventListener("program-updated", (e) => {
      const updated = updateProgram(e.detail.id, e.detail); // función global de storage.js
      root.dispatchEvent(new CustomEvent("program-form-updated", { detail: updated, bubbles: true, composed: true }));
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
    const program = getPrograms().find((p) => p.id === id);
    if (program) await loadProgramIntoForm(program);
  });

  deleteBtn.addEventListener("click", () => {
    if (!currentProgram) return;

    const confirmed = window.confirm(
      "¿Estás seguro de eliminar este programa?\nTambién se eliminarán todas sus rutas, topics y links asociados.\nEsta acción no se puede deshacer."
    );
    if (!confirmed) return;

    deleteProgram(currentProgram.id); // función global de storage.js
    root.dispatchEvent(new CustomEvent("program-form-deleted", { detail: { id: currentProgram.id }, bubbles: true, composed: true }));
  });

  root.querySelector('[data-action="close"]')?.addEventListener("click", () => {
    root.dispatchEvent(new CustomEvent("manage-program-cancel", { bubbles: true, composed: true }));
  });

  populateSelect();

  return { element: root, footerElement: footer };
}