import { escapeHtml } from "../../utils/html.js";

export function createJobCard(portal) {
  return `
    <article class="targeta">
      <div class="icono_portal">
        <img src="${escapeHtml(portal.image)}" alt="${escapeHtml(portal.name)}">
      </div>
      <h2>${escapeHtml(portal.name)}</h2>
      <p>${escapeHtml(portal.description)}</p>
      <a href="${escapeHtml(portal.url)}" class="boton" target="_blank" rel="noopener noreferrer">Abrir portal</a>
    </article>
  `;
}
