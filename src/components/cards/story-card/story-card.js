import { escapeHtml } from "../../utils/html.js";

/** Renderiza una tarjeta de historia de éxito. */
export function createStoryCard(story) {
  return `
    <article class="card-historia">
      <header class="header-historia">
        <img src="${escapeHtml(story.photo)}" alt="Foto de ${escapeHtml(story.name)}" class="foto-perfil">
        <div>
          <h3 class="nombre">${escapeHtml(story.name)}</h3>
          <p class="empresa">${escapeHtml(story.company)} · ${escapeHtml(story.timeToHire)}</p>
        </div>
      </header>
      <p class="testimonio">“${escapeHtml(story.testimony)}”</p>
      <span class="badge-rol">${escapeHtml(story.role)} · ${escapeHtml(story.year)}</span>
      <a href="#" class="btn-ver-mas">Ver más</a>
    </article>
  `;
}
