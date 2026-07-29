import { createJobCard } from "../../components/cards/job-card/job-card.js";
import { jobPortals } from "../../data/jobs.data.js";

const grid = document.querySelector(".grid_portales");

if (grid) {
  grid.innerHTML = jobPortals.map(createJobCard).join("") + `
    <article class="consejo_box">
      <div class="consejo_titulo">
        <span class="icon"></span>Consejo del equipo
      </div>
      <p class="consejo_texto">Empieza con LinkedIn + Get on Board para roles tech en Colombia y Latam. Si buscas trabajo remoto en USD, Wellfound y Remote OK son exelentes puntos de partida.</p>
    </article>
  `;
}
