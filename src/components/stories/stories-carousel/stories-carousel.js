import { escapeHtml } from "../../utils/html.js";

let autoplayId = null;

/** Renderiza y controla el carrusel de historias destacado. */
export function renderStoriesCarousel(container, stories) {
  window.clearInterval(autoplayId);

  if (!stories.length) {
    container.innerHTML = "";
    return;
  }

  let currentIndex = 0;
  const slides = stories.map((story) => `
    <article class="carrusel-slide">
      <img src="${escapeHtml(story.photo)}" alt="Foto de ${escapeHtml(story.name)}">
      <div>
        <p class="testimonio">“${escapeHtml(story.testimony)}”</p>
        <p class="nombre">${escapeHtml(story.name)}</p>
        <p class="empresa">${escapeHtml(story.company)} · ${escapeHtml(story.role)}</p>
      </div>
    </article>
  `).join("");
  const indicators = stories.map((_, index) => `
    <button class="carrusel-punto ${index === 0 ? "activo" : ""}" data-index="${index}" aria-label="Ir a historia ${index + 1}"></button>
  `).join("");

  container.innerHTML = `
    <button class="carrusel-flecha anterior" type="button" aria-label="Historia anterior">&#10094;</button>
    <div class="carrusel-track">${slides}</div>
    <button class="carrusel-flecha siguiente" type="button" aria-label="Historia siguiente">&#10095;</button>
    <div class="carrusel-puntos">${indicators}</div>
  `;

  const track = container.querySelector(".carrusel-track");
  const dots = container.querySelectorAll(".carrusel-punto");
  const goTo = (index) => {
    currentIndex = (index + stories.length) % stories.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, dotIndex) => dot.classList.toggle("activo", dotIndex === currentIndex));
  };
  const restartAutoplay = () => {
    window.clearInterval(autoplayId);
    autoplayId = window.setInterval(() => goTo(currentIndex + 1), 4000);
  };

  container.querySelector(".anterior").addEventListener("click", () => { goTo(currentIndex - 1); restartAutoplay(); });
  container.querySelector(".siguiente").addEventListener("click", () => { goTo(currentIndex + 1); restartAutoplay(); });
  dots.forEach((dot) => dot.addEventListener("click", () => { goTo(Number(dot.dataset.index)); restartAutoplay(); }));
  restartAutoplay();
}
