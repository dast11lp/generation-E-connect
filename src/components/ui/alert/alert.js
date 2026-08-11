const COMPONENT_URL = import.meta.url;
const HTML_URL = new URL("./alert.html", COMPONENT_URL);
const CSS_URL = new URL("./alert.css", COMPONENT_URL);

const ICONS = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

const DEFAULT_DURATIONS = {
  success: 4000,
  info: 4500,
  warning: 6000,
  error: 7000,
};

/**
 * Contenedor (singleton) de alertas visuales tipo "toast".
 * Se monta a sí mismo en document.body la primera vez que se necesita,
 * por lo que no requiere agregar ninguna etiqueta en el HTML de las páginas.
 */
class ToastStack extends HTMLElement {
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
    this.$stack = this.shadowRoot.querySelector("#at-stack");
  }

  /**
   * Muestra una alerta visual.
   * @param {string} mensaje
   * @param {"success"|"error"|"warning"|"info"} tipo
   * @param {{ duration?: number }} [opciones] duration en ms; 0 = no se cierra sola.
   * @returns {{ close: () => void }}
   */
  show(mensaje, tipo = "info", opciones = {}) {
    const type = ICONS[tipo] ? tipo : "info";
    const duration = opciones.duration ?? DEFAULT_DURATIONS[type];

    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.setAttribute("role", type === "error" ? "alert" : "status");
    toast.innerHTML = `
      <span class="toast__icon" aria-hidden="true">${ICONS[type]}</span>
      <p class="toast__message"></p>
      <button type="button" class="toast__close" aria-label="Cerrar">&times;</button>
    `;
    toast.querySelector(".toast__message").textContent = mensaje;

    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      toast.classList.remove("toast--visible");
      toast.classList.add("toast--leaving");
      toast.addEventListener("transitionend", () => toast.remove(), { once: true });
      setTimeout(() => toast.remove(), 400);
    };

    toast.querySelector(".toast__close").addEventListener("click", close);

    this.$stack.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("toast--visible"));

    if (duration > 0) {
      setTimeout(close, duration);
    }

    return { close };
  }
}

customElements.define("toast-stack", ToastStack);

let stackInstance = null;

async function getStack() {
  if (!stackInstance) {
    stackInstance = document.createElement("toast-stack");
    document.body.appendChild(stackInstance);
  }
  await stackInstance._ready;
  return stackInstance;
}

/**
 * API pública para mostrar alertas visuales en lugar de alert() nativo.
 * @param {string} mensaje
 * @param {"success"|"error"|"warning"|"info"} [tipo]
 * @param {{ duration?: number }} [opciones]
 */
export async function mostrarAlerta(mensaje, tipo = "info", opciones = {}) {
  const stack = await getStack();
  return stack.show(mensaje, tipo, opciones);
}
