import { escapeHtml } from "../../utils/html.js";

export function createFeaturedStoryCard(story) {
  return `
    <article class="historia-card">
      <div class="avatar">${escapeHtml(story.initials)}</div>
      <div>
        <h3>${escapeHtml(story.name)} — ${escapeHtml(story.role)} · ${escapeHtml(story.cohort)}</h3>
        <p class="verde">${escapeHtml(story.company)} · ${escapeHtml(story.timeToHire)}</p>
        <p class="frase">“${escapeHtml(story.quote)}”</p>
      </div>
    </article>
  `;
}
