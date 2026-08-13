import { escapeHtml } from "../../utils/html.js";

export function createStatCard(stat) {
  return `
    <div class="card-base bloque_recurso">
      <span class="numero">${escapeHtml(stat.numero)}</span>
      <span class="etiqueta">${escapeHtml(stat.etiqueta)}</span>
    </div>
  `;
}