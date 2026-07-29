import { createExploreCard } from "../../components/cards/explore-card/explore-card.js";
import { createFeaturedStoryCard } from "../../components/stories/featured-story-card/featured-story-card.js";
import { createResourceCard } from "../../components/cards/resource-card/resource-card.js";
import { exploreSections, featuredResources, featuredStories } from "../../data/home.data.js";

const resourcesContainer = document.querySelector("#recursos-grid");
const exploreContainer = document.querySelector("#explora-grid");
const storiesContainer = document.querySelector("#historia-grid");
const toggleResourcesLink = document.querySelector("#ver-todos-recursos");
let showAllResources = false;

function renderResources() {
  const resourcesToRender = showAllResources ? featuredResources : featuredResources.slice(0, 3);
  resourcesContainer.innerHTML = resourcesToRender.map(createResourceCard).join("");
  toggleResourcesLink.textContent = showAllResources ? "Ver menos" : "Ver todas";
}

function renderHome() {
  exploreContainer.innerHTML = exploreSections.map(createExploreCard).join("");
  storiesContainer.innerHTML = featuredStories.map(createFeaturedStoryCard).join("");
  renderResources();
}

toggleResourcesLink.addEventListener("click", (event) => {
  event.preventDefault();
  showAllResources = !showAllResources;
  renderResources();
});

renderHome();
