import { createExploreCard } from "../../components/cards/explore-card/explore-card.js";
import { createFeaturedStoryCard } from "../../components/stories/featured-story-card/featured-story-card.js";
import { createResourceCard } from "../../components/cards/resource-card/resource-card.js";
import { createStatCard } from "../../components/cards/stat-card/stat-card.js";
import { exploreSections } from "../../data/home.data.js";
import { fetchHomeStats } from "../../services/stats-storage.service.js";
import { fetchRecentStories } from "../../services/story-storage.service.js";
import { fetchFeaturedResources } from "../../services/resource-storage.service.js";

const resourcesContainer = document.querySelector("#recursos-grid");
const exploreContainer = document.querySelector("#explora-grid");
const storiesContainer = document.querySelector("#historia-grid");
const statsContainer = document.querySelector("#stats-grid");
const toggleResourcesLink = document.querySelector("#ver-todos-recursos");
let showAllResources = false;
let featuredResources = [];

function renderResources() {
  const resourcesToRender = showAllResources ? featuredResources : featuredResources.slice(0, 3);
  resourcesContainer.innerHTML = resourcesToRender.length
    ? resourcesToRender.map(createResourceCard).join("")
    : "<p>Todavía no hay recursos destacados.</p>";
  toggleResourcesLink.textContent = showAllResources ? "Ver menos" : "Ver todas";
}

async function loadFeaturedResources() {
  try {
    featuredResources = await fetchFeaturedResources();
  } catch (error) {
    console.error("No se pudieron cargar los recursos destacados:", error);
    featuredResources = [];
  }
  renderResources();
}

function renderHome() {
  exploreContainer.innerHTML = exploreSections.map(createExploreCard).join("");
}

async function loadRecentStories() {
  try {
    const stories = await fetchRecentStories();
    storiesContainer.innerHTML = stories.length
      ? stories.map(createFeaturedStoryCard).join("")
      : "<p>Todavía no hay historias publicadas.</p>";
  } catch (error) {
    console.error("No se pudieron cargar las historias recientes:", error);
    storiesContainer.innerHTML = "<p>No pudimos cargar las historias.</p>";
  }
}

async function loadStats() {
  try {
    const stats = await fetchHomeStats();
    statsContainer.innerHTML = stats.map(createStatCard).join("");
  } catch (error) {
    console.error("No se pudieron cargar las estadísticas:", error);
    statsContainer.innerHTML = "";
  }
}

toggleResourcesLink.addEventListener("click", (event) => {
  event.preventDefault();
  showAllResources = !showAllResources;
  renderResources();
});

renderHome();
loadStats();
loadRecentStories();
loadFeaturedResources();