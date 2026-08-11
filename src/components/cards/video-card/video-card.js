import { escapeHtml } from "../../utils/html.js";

export function createVideoCard(video) {
  const thumbnail = video.thumbnail
    ? `<img src="${escapeHtml(video.thumbnail)}" alt="Miniatura de ${escapeHtml(video.title)}">`
    : "";
  return `
    <a href="${escapeHtml(video.link)}" class="card" target="_blank" rel="noopener noreferrer">
      <div class="thumbnail">
        ${thumbnail}
      </div>
      <div class="card-content">
        <span class="categoria">${escapeHtml(video.category)}</span>
        <h3>${escapeHtml(video.title)}</h3>
        <p class="info">${escapeHtml(video.author)} · ${escapeHtml(video.date)}</p>
      </div>
    </a>
  `;
}
