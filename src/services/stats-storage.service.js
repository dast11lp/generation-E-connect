import { apiFetch } from "./api-client.js";

function fromDashboardStatsDTO(dto) {
  return [
    { id: "recursos", numero: String(dto.resources), etiqueta: "Recursos" },
    { id: "categorias", numero: String(dto.categories), etiqueta: "Categorías" },
    { id: "grabaciones", numero: String(dto.recordings), etiqueta: "Grabaciones" },
    { id: "programas", numero: String(dto.programs), etiqueta: "Programas" },
  ];
}

export async function fetchHomeStats() {
  const dto = await apiFetch("/stats/dashboard", { auth: false });
  return fromDashboardStatsDTO(dto);
}