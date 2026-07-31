export function createFilterButton(category, isActive) {
  const label = category === "Todos" ? "Todos" : category;
  return `
    <button class="filtro-chip ${isActive ? "activo" : ""}" data-category="${label}">
      ${label}
    </button>
  `;
}
