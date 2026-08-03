const COMPONENT_URL = import.meta.url;
const HTML_URL = new URL("./base-modal.html", COMPONENT_URL);
const CSS_URL = new URL("./base-modal.css", COMPONENT_URL);

class BaseModal extends HTMLElement {
  static get observedAttributes() {
    return ["open"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ready = this._init();
    this._lastFocusedElement = null;
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
    this.$title = this.shadowRoot.querySelector(".modal__title");
    this.$body = this.shadowRoot.querySelector("#bm-body");
    this.$footer = this.shadowRoot.querySelector("#bm-footer");

    this._bindStaticEvents();
    this._syncOverlayVisibility();
  }

  connectedCallback() {
    this._syncOverlayVisibility();
  }

  attributeChangedCallback(name) {
    if (name === "open") this._syncOverlayVisibility();
  }

  _bindStaticEvents() {
    this.shadowRoot.addEventListener("click", (e) => {
      if (e.target.dataset.action === "close") this.close();
    });

    this.$overlay.addEventListener("click", (e) => {
      if (e.target === this.$overlay) this.close();
    });

    this.shadowRoot.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close();
    });
  }

  _syncOverlayVisibility() {
    if (!this.$overlay) return;
    this.$overlay.style.display = this.hasAttribute("open") ? "flex" : "none";
  }

  _setContent(container, content) {
    container.innerHTML = "";
    if (content == null) return;
    if (typeof content === "string") {
      container.innerHTML = content;
    } else {
      container.appendChild(content);
    }
  }

  /**
   * API pública única para abrir el modal con cualquier contenido.
   * @param {Object} options
   * @param {string} options.title
   * @param {string|Node} options.content
   * @param {string|Node} [options.footer]
   */
  async open({ title = "", content = null, footer = null } = {}) {
    await this._ready;

    this.$title.textContent = title;
    this._setContent(this.$body, content);
    this._setContent(this.$footer, footer);
    this.$footer.style.display = footer ? "flex" : "none";

    this._lastFocusedElement = document.activeElement;
    this.setAttribute("open", "");

    this.dispatchEvent(new CustomEvent("modal-open", { bubbles: true, composed: true }));

    const focusable = this.$body.querySelector("input, textarea, select, button, [tabindex]");
    focusable?.focus();
  }

  close() {
    this.removeAttribute("open");
    this.dispatchEvent(new CustomEvent("modal-close", { bubbles: true, composed: true }));
    this._lastFocusedElement?.focus?.();
  }
}

customElements.define("base-modal", BaseModal);