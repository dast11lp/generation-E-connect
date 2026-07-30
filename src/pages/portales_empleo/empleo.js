import { createJobCard } from "../../components/cards/job-card/job-card.js";
import { jobPortals } from "../../data/jobs.data.js";

const grid = document.querySelector(".grid_portales");

if (grid) {
  grid.innerHTML = jobPortals.map(createJobCard).join("");
}
