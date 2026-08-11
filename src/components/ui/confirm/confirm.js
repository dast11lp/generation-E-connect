import "../modal/base-modal/base-modal.js";

// Estilos propios del botón de peligro, siguiendo la misma convención que
// usan los formularios "manage-*-form" (btn--danger no viene definido en
// base-modal.css, así que se declara aquí junto al contenido del diálogo).
const CONFIRM_STYLE = `
  .confirm-message {
    margin: 0;
    color: var(--color-gris-texto);
    line-height: 1.5;
    white-space: pre-line;
  }
  .btn--danger {
    background-color: #DC2626;
    color: var(--color-blanco);
    padding: 10px 20px;
    font-size: 0.9rem;
  }
  .btn--danger:hover {
    background-color: #B91C1C;
  }
`;

/**
 * Reemplazo visual de window.confirm(), reutilizando el componente
 * <base-modal> ya existente en el proyecto en lugar de crear un sistema
 * de modales duplicado.
 *
 * @param {string} mensaje
 * @param {{ title?: string, confirmText?: string, cancelText?: string }} [opciones]
 * @returns {Promise<boolean>} true si el usuario confirmó la acción.
 */
export async function confirmarAccion(mensaje, opciones = {}) {
  const {
    title = "Confirmar acción",
    confirmText = "Eliminar",
    cancelText = "Cancelar",
  } = opciones;

  await customElements.whenDefined("base-modal");

  return new Promise((resolve) => {
    const modal = document.createElement("base-modal");
    document.body.appendChild(modal);

    const content = document.createElement("div");
    const style = document.createElement("style");
    style.textContent = CONFIRM_STYLE;
    const message = document.createElement("p");
    message.className = "confirm-message";
    message.textContent = mensaje;
    content.append(style, message);

    const footer = document.createElement("div");
    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "btn btn--secondary";
    cancelBtn.textContent = cancelText;

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "btn btn--danger";
    confirmBtn.textContent = confirmText;

    footer.append(cancelBtn, confirmBtn);

    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
      modal.close();
    };

    cancelBtn.addEventListener("click", () => finish(false));
    confirmBtn.addEventListener("click", () => finish(true));
    modal.addEventListener("modal-close", () => {
      finish(false);
      modal.remove();
    });

    modal.open({ title, content, footer });
  });
}
