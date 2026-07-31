/**
 * program-form.js
 * -----------------------------------------------------------------------
 * Web Component: <program-form-modal>
 *
 * - Se muestra/oculta con los métodos .open() / .close(), o el
 *   atributo booleano "open".
 * - Permite construir un trainingProgram con rutas y topics dinámicos
 *   (botones "+ Agregar ruta" / "+ Agregar topic").
 * - Validación obligatoria:
 *      -> el programa necesita al menos 1 ruta
 *      -> cada ruta necesita al menos 1 topic
 * - Al guardar, dispara un CustomEvent "program-created" con el
 *   programa armado en event.detail. NO toca localStorage directamente:
 *   eso es responsabilidad de quien use el componente (learn.js),
 *   así el componente queda desacoplado y reutilizable.
 *
 * Usa Shadow DOM. Las variables CSS (--color-azul-institucional, etc.)
 * se heredan igual dentro del shadow root porque las custom properties
 * de CSS atraviesan el límite del Shadow DOM.
 * -----------------------------------------------------------------------
 */

const COMPONENT_URL = import.meta.url;
const HTML_URL = new URL("./program-form.html", COMPONENT_URL);
const CSS_URL = new URL("./program-form.css", COMPONENT_URL);

class ProgramFormModal extends HTMLElement {
    static get observedAttributes() {
        return ["open"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._ready = this._init();
    }

    async _init() {
        const [html, css] = await Promise.all([
            fetch(HTML_URL).then((r) => r.text()),
            fetch(CSS_URL).then((r) => r.text()),
        ]);

        const style = document.createElement("style");
        style.textContent = css;

        const wrapper = document.createElement("div");
        wrapper.innerHTML = html;

        this.shadowRoot.append(style, wrapper);

        this.$overlay = this.shadowRoot.querySelector(".overlay");
        this.$form = this.shadowRoot.querySelector("#pf-form");
        this.$nameInput = this.shadowRoot.querySelector("#pf-name");
        this.$routesContainer = this.shadowRoot.querySelector("#pf-routes");
        this.$routeTemplate = this.shadowRoot.querySelector("#route-template");
        this.$topicTemplate = this.shadowRoot.querySelector("#topic-template");
        this.$generalError = this.shadowRoot.querySelector('[data-error="general"]');
        this.$nameError = this.shadowRoot.querySelector('[data-error="name"]');

        this._bindStaticEvents();
        this._resetForm();
    }

    connectedCallback() {
        this._syncOverlayVisibility();
    }

    attributeChangedCallback(name) {
        if (name === "open") this._syncOverlayVisibility();
    }

    get open_() {
        return this.hasAttribute("open");
    }

    async open() {
        await this._ready;
        this._resetForm();
        this.setAttribute("open", "");
    }

    close() {
        this.removeAttribute("open");
    }

    _syncOverlayVisibility() {
        if (!this.$overlay) return;
        this.$overlay.style.display = this.hasAttribute("open") ? "flex" : "none";
    }

    _bindStaticEvents() {
        this.shadowRoot.addEventListener("click", (e) => {
            const action = e.target.dataset.action;
            if (!action) return;

            if (action === "close") this.close();
            if (action === "add-route") this._addRoute();
            if (action === "remove-route") this._removeRoute(e.target.closest("[data-route]"));
            if (action === "add-topic") this._addTopic(e.target.closest("[data-route]"));
            if (action === "remove-topic") this._removeTopic(e.target.closest("[data-topic]"));
        });

        // Cerrar al hacer click fuera del modal (sobre el overlay)
        this.$overlay.addEventListener("click", (e) => {
            if (e.target === this.$overlay) this.close();
        });

        this.$form.addEventListener("submit", (e) => {
            e.preventDefault();
            this._handleSubmit();
        });
    }

    _resetForm() {
        this.$form.reset();
        this.$routesContainer.innerHTML = "";
        this._clearErrors();
        this._addRoute(); // arranca con 1 ruta lista para llenar
    }

    _addRoute() {
        const fragment = this.$routeTemplate.content.cloneNode(true);
        this.$routesContainer.appendChild(fragment);

        const routeEl = this.$routesContainer.lastElementChild;
        this._addTopic(routeEl); // arranca con 1 topic lista para llenar
    }

    _removeRoute(routeEl) {
        if (!routeEl) return;
        // Siempre debe quedar al menos 1 ruta en el formulario
        if (this.$routesContainer.children.length <= 1) return;
        routeEl.remove();
    }

    _addTopic(routeEl) {
        if (!routeEl) return;
        const topicsContainer = routeEl.querySelector("[data-topics]");
        const fragment = this.$topicTemplate.content.cloneNode(true);
        topicsContainer.appendChild(fragment);
    }

    _removeTopic(topicEl) {
        if (!topicEl) return;
        const topicsContainer = topicEl.closest("[data-topics]");
        // Siempre debe quedar al menos 1 topic por ruta
        if (topicsContainer.children.length <= 1) return;
        topicEl.remove();
    }

    _clearErrors() {
        this.shadowRoot.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
        this.shadowRoot.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
    }

    /**
     * Lee el formulario, valida y arma el objeto trainingProgram.
     * Devuelve { program } o { errors } (nunca ambos).
     */
    _collectAndValidate() {
        this._clearErrors();
        let hasError = false;
        const name = this.$nameInput.value.trim();

        if (!name) {
            this.$nameError.textContent = "El nombre del programa es obligatorio.";
            this.$nameInput.classList.add("invalid");
            hasError = true;
        }

        const routeEls = [...this.$routesContainer.querySelectorAll("[data-route]")];

        if (routeEls.length === 0) {
            this.$generalError.textContent = "El programa necesita al menos una ruta.";
            hasError = true;
        }

        const routes = [];

        routeEls.forEach((routeEl, index) => {
            const titleInput = routeEl.querySelector('[data-field="route-title"]');
            const title = titleInput.value.trim();
            const routeError = routeEl.querySelector('[data-error="route"]');

            const topicInputs = [...routeEl.querySelectorAll('[data-field="topic-value"]')];
            const topics = topicInputs
                .map((input) => input.value.trim())
                .filter((value) => value.length > 0);

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

        return {
            program: { name, routes },
        };
    }

    _handleSubmit() {
        const result = this._collectAndValidate();
        if (result.errors) return;

        this.dispatchEvent(
            new CustomEvent("program-created", {
                detail: result.program,
                bubbles: true,
                composed: true, // para que el evento atraviese el Shadow DOM
            })
        );

        this.close();
    }
}

customElements.define("program-form-modal", ProgramFormModal);
