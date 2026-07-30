const COMPONENT_URL = import.meta.url;
const HTML_URL = new URL("./program-form-content.html", COMPONENT_URL);
const CSS_URL = new URL("./program-form-content.css", COMPONENT_URL);

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
 * Construye el DOM del formulario de programas, listo para pasarle
 * a base-modal.open({ content, footer }). No conoce el modal ni localStorage.
 */
export async function createProgramForm() {
  const [html, css] = await loadTemplates();

  const root = document.createElement("div");
  root.innerHTML = html;

  const style = document.createElement("style");
  style.textContent = css;
  root.prepend(style);

  const form = root.querySelector("#pf-form");
  const nameInput = root.querySelector("#pf-name");
  const routesContainer = root.querySelector("#pf-routes");
  const routeTemplate = root.querySelector("#route-template");
  const topicTemplate = root.querySelector("#topic-template");
  const generalError = root.querySelector('[data-error="general"]');
  const nameError = root.querySelector('[data-error="name"]');
  const footer = root.querySelector("#pf-footer");

  footer.remove(); // se entrega aparte para el slot de footer del modal

  function addRoute() {
    routesContainer.appendChild(routeTemplate.content.cloneNode(true));
    addTopic(routesContainer.lastElementChild);
  }

  function removeRoute(routeEl) {
    if (!routeEl || routesContainer.children.length <= 1) return;
    routeEl.remove();
  }

  function addTopic(routeEl) {
    if (!routeEl) return;
    routeEl.querySelector("[data-topics]").appendChild(topicTemplate.content.cloneNode(true));
  }

  function removeTopic(topicEl) {
    if (!topicEl) return;
    const topicsContainer = topicEl.closest("[data-topics]");
    if (topicsContainer.children.length <= 1) return;
    topicEl.remove();
  }

  function clearErrors() {
    root.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
    root.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
  }

  function collectAndValidate() {
    clearErrors();
    let hasError = false;
    const name = nameInput.value.trim();

    if (!name) {
      nameError.textContent = "El nombre del programa es obligatorio.";
      nameInput.classList.add("invalid");
      hasError = true;
    }

    const routeEls = [...routesContainer.querySelectorAll("[data-route]")];
    if (routeEls.length === 0) {
      generalError.textContent = "El programa necesita al menos una ruta.";
      hasError = true;
    }

    const routes = [];
    routeEls.forEach((routeEl, index) => {
      const titleInput = routeEl.querySelector('[data-field="route-title"]');
      const title = titleInput.value.trim();
      const routeError = routeEl.querySelector('[data-error="route"]');
      const topics = [...routeEl.querySelectorAll('[data-field="topic-value"]')]
        .map((i) => i.value.trim())
        .filter(Boolean);

      let routeHasError = false;
      if (!title) {
        titleInput.classList.add("invalid");
        routeHasError = true;
      }
      if (topics.length === 0) {
        routeError.textContent = "Esta ruta necesita al menos un topic.";
        routeHasError = true;
      }

      if (routeHasError) {
        hasError = true;
        if (!title) {
          routeError.textContent = routeError.textContent
            ? "Título y topics son obligatorios."
            : "El título de la ruta es obligatorio.";
        }
        return;
      }

      routes.push({ id: index + 1, title, topics });
    });

    if (hasError) return { errors: true };
    return { program: { name, routes } };
  }

  function resetForm() {
    form.reset();
    routesContainer.innerHTML = "";
    clearErrors();
    addRoute();
  }

  root.addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    if (!action) return;
    if (action === "add-route") addRoute();
    if (action === "remove-route") removeRoute(e.target.closest("[data-route]"));
    if (action === "add-topic") addTopic(e.target.closest("[data-route]"));
    if (action === "remove-topic") removeTopic(e.target.closest("[data-topic]"));
    if (action === "cancel") {
      root.dispatchEvent(new CustomEvent("program-form-cancel", { bubbles: true, composed: true }));
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const result = collectAndValidate();
    if (result.errors) return;

    root.dispatchEvent(
      new CustomEvent("program-created", {
        detail: result.program,
        bubbles: true,
        composed: true,
      })
    );
  });

  resetForm();

  return { element: root, footerElement: footer, reset: resetForm };
}