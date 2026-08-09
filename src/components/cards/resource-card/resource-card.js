import { escapeHtml } from "../../utils/html.js";

export function createResourceCard(resource) {
  const typeClass = resource.type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
 
  return `
    <article class="recurso-card">
      <span class="badge ${typeClass}">${escapeHtml(resource.type)}</span>
      <h3>${escapeHtml(resource.title)}</h3>
      <p class="meta">${escapeHtml(resource.category)} · ${escapeHtml(resource.date)}</p>
      <p class="descripcion">${escapeHtml(resource.description)}</p>
      <a href="${resource?.fileUrl}" target="_blank" class="btn-card" data-resource-id="${resource.id}" data-event-type="${resource.type?.toLowerCase() === "video" ? "view" : "download"}">${escapeHtml(resource.action)}</a>
    </article>
  `;
}