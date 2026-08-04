import { normalizeTopic } from "../../utils/topics.js";

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
export async function createProgramForm({ program = null } = {}) {
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
  const linkTemplate = root.querySelector("#link-template");
  const generalError = root.querySelector('[data-error="general"]');
  const nameError = root.querySelector('[data-error="name"]');
  const footer = root.querySelector("#pf-footer");

  footer.remove(); // se entrega aparte para el slot de footer del modal

  function addRoute(routeData = null) {
    routesContainer.appendChild(routeTemplate.content.cloneNode(true));
    const routeEl = routesContainer.lastElementChild;

    if (routeData) {
      routeEl.querySelector('[data-field="route-title"]').value = routeData.title ?? "";
    }

    const topicsData = routeData?.topics?.length
      ? routeData.topics.map(normalizeTopic) // <-- cambio: normaliza antes de usar
      : [null];

    topicsData.forEach((topicData) => addTopic(routeEl, topicData));
  }

  function removeRoute(routeEl) {
    if (!routeEl || routesContainer.children.length <= 1) return;
    routeEl.remove();
  }

  function addTopic(routeEl, topicData = null) {
    if (!routeEl) return;
    const topicsContainer = routeEl.querySelector("[data-topics]");
    topicsContainer.appendChild(topicTemplate.content.cloneNode(true));
    const topicEl = topicsContainer.lastElementChild;

    if (topicData) {
      topicEl.querySelector('[data-field="topic-title"]').value = topicData.title ?? "";
    }

    const linksData = topicData?.links?.length ? topicData.links : [null];
    linksData.forEach((linkValue) => addLink(topicEl, linkValue));
  }

  function removeTopic(topicEl) {
    if (!topicEl) return;
    const topicsContainer = topicEl.closest("[data-topics]");
    if (topicsContainer.children.length <= 1) return;
    topicEl.remove();
  }

  function addLink(topicEl, linkValue = null) {
    if (!topicEl) return;
    const linksContainer = topicEl.querySelector("[data-links]");
    linksContainer.appendChild(linkTemplate.content.cloneNode(true));
    if (linkValue) {
      linksContainer.lastElementChild.querySelector('[data-field="link-value"]').value = linkValue;
    }
  }

  function removeLink(linkEl) {
    if (!linkEl) return;
    const linksContainer = linkEl.closest("[data-links]");
    // Siempre debe quedar al menos 1 link por topic
    if (linksContainer.children.length <= 1) return;
    linkEl.remove();
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

    routeEls.forEach((routeEl, routeIndex) => {
      const titleInput = routeEl.querySelector('[data-field="route-title"]');
      const title = titleInput.value.trim();
      const routeError = routeEl.querySelector('[data-error="route"]');

      if (!title) {
        titleInput.classList.add("invalid");
        hasError = true;
      }

      const topicEls = [...routeEl.querySelectorAll("[data-topic]")];

      if (topicEls.length === 0) {
        routeError.textContent = "Esta ruta necesita al menos un topic.";
        hasError = true;
        return;
      }

      const topics = [];
      let routeHasTopicError = false;

      topicEls.forEach((topicEl) => {
        const topicTitleInput = topicEl.querySelector('[data-field="topic-title"]');
        const topicTitle = topicTitleInput.value.trim();
        const topicError = topicEl.querySelector('[data-error="topic"]');

        const linkInputs = [...topicEl.querySelectorAll('[data-field="link-value"]')];
        const links = linkInputs
          .map((input) => input.value.trim())
          .filter((value) => value.length > 0);

        let topicHasError = false;

        if (!topicTitle) {
          topicTitleInput.classList.add("invalid");
          topicHasError = true;
        }

        if (links.length === 0) {
          topicHasError = true;
        }

        if (topicHasError) {
          routeHasTopicError = true;
          topicError.textContent = !topicTitle
            ? links.length === 0
              ? "Título y al menos un link son obligatorios."
              : "El título del topic es obligatorio."
            : "Este topic necesita al menos un link.";
          return;
        }

        topics.push({ title: topicTitle, links });
      });

      if (routeHasTopicError) {
        hasError = true;
        return;
      }

      routes.push({ id: routeIndex + 1, title, topics });
    });

    if (hasError) return { errors: true };

    return {
      program: { name, routes },
    };
  }

  function resetForm() {
    form.reset();
    routesContainer.innerHTML = "";
    clearErrors();

    if (program) {
      nameInput.value = program.name ?? "";
      const routesData = program.routes?.length ? program.routes : [null];
      routesData.forEach((routeData) => addRoute(routeData));
    } else {
      addRoute();
    }
  }

  root.addEventListener("click", (e) => {
  const action = e.target.dataset.action;
    if (!action) return;
    if (action === "add-route") addRoute();
    if (action === "remove-route") removeRoute(e.target.closest("[data-route]"));
    if (action === "add-topic") addTopic(e.target.closest("[data-route]"));
    if (action === "remove-topic") removeTopic(e.target.closest("[data-topic]"));
    if (action === "add-link") addLink(e.target.closest("[data-topic]"));       // <-- nuevo
    if (action === "remove-link") removeLink(e.target.closest("[data-link]")); // <-- nuevo
    if (action === "cancel") {
      root.dispatchEvent(new CustomEvent("program-form-cancel", { bubbles: true, composed: true }));
    } 
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const result = collectAndValidate();
    if (result.errors) return;

    if (program) {
      // modo edición: conserva el id original
      root.dispatchEvent(
        new CustomEvent("program-updated", {
          detail: { ...result.program, id: program.id },
          bubbles: true,
          composed: true,
        })
      );
    } else {
      root.dispatchEvent(
        new CustomEvent("program-created", {
          detail: result.program,
          bubbles: true,
          composed: true,
        })
      );
    }
  });
  
  resetForm();

  return { element: root, footerElement: footer, reset: resetForm };
}