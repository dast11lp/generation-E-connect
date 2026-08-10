import { escapeHtml } from "../../utils/html.js";

export function createExploreCard(section) {
  return `
    <a href="${escapeHtml(section.href)}" class="explora-card">
      <div class="icono" style="background: ${escapeHtml(section.color)}"></div>
      <div>
        <h3>${escapeHtml(section.title)}</h3>
        <p>${escapeHtml(section.subtitle)}</p>
      </div>
    </a>
  `;
}