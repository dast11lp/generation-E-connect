import { apiFetch } from "./api-client.js";
import { fetchCategories } from "./category-storage.service.js";
import { fetchResourceTypes } from "./resource-type-storage.service.js";

// Traduce el enum CategoryType (backend) a las mismas etiquetas en español
// que ya usa `resourceCategories` en data/resources.data.js
export const CATEGORY_LABELS = {
  CV: "Hoja de vida",
  LINKEDIN: "LinkedIn",
  INTERVIEW: "Entrevistas",
  NETWORKING: "Networking",
  ENGLISH: "Inglés",
  PORTFOLIO: "Portafolio",
  NEGOTIATION: "Negociación",
  PERSONAL_DEV: "Desarrollo",
};

function formatDateEs(dateStr) {
  if (!dateStr) return "";
  const date = new Date(`${dateStr}T00:00:00`);
  const formatted = new Intl.DateTimeFormat("es", { month: "short", year: "numeric" }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1).replace(".", "");
}

function toResourcePayload(resource) {
  return {
    title: resource.title,
    description: resource.description,
    categoryId: resource.categoryId,
    resourceTypeId: resource.resourceTypeId,
    section: resource.section ?? "library",
    url: resource.fileUrl,
    thumbnailUrl: resource.thumbnailUrl ?? null,
    durationMinutes: resource.durationMinutes ?? null,
    publicationDate: resource.publicationDate ?? new Date().toISOString().slice(0, 10),
    featured: resource.featured ?? false,
    active: resource.active ?? true,
    fileName: resource.fileName ?? null,
    fileSize: resource.fileSize ?? null,
  };
}

function fromResourceDTO(dto, categoryMap, typeMap) {
  const dateValue = dto.publicationDate ?? (dto.createdAt ? dto.createdAt.slice(0, 10) : "");
  const typeLabel = typeMap.get(dto.resourceTypeId) ?? "Recurso";

  return {
    id: dto.id,
    categoryId: dto.categoryId,
    resourceTypeId: dto.resourceTypeId,
    type: typeLabel,
    title: dto.title,
    category: categoryMap.get(dto.categoryId) ?? "Sin categoría",
    date: formatDateEs(dateValue),
    dateValue,
    description: dto.description,
    action: typeLabel.toLowerCase() === "video" ? "Ver video" : "Descargar",
    downloads: dto.downloads ?? 0,
    featured: !!dto.featured,
    active: !!dto.active,
    fileUrl: dto.url,
    fileName: dto.fileName,
    fileSize: dto.fileSize,
  };
}

async function loadCategoryAndTypeMaps() {
  const [categories, types] = await Promise.all([fetchCategories(), fetchResourceTypes()]);
  const categoryMap = new Map(
    categories.map((c) => [c.id, CATEGORY_LABELS[c.categoryType] ?? c.description ?? c.categoryType])
  );
  const typeMap = new Map(types.map((t) => [t.id, t.name]));
  return { categoryMap, typeMap };
}

export async function fetchResources() {
  const [dtos, { categoryMap, typeMap }] = await Promise.all([
    apiFetch("/resources", { auth: false }),
    loadCategoryAndTypeMaps(),
  ]);
  return dtos.map((dto) => fromResourceDTO(dto, categoryMap, typeMap));
}

export async function createResource(resource) {
  const dto = await apiFetch("/resources", { method: "POST", body: toResourcePayload(resource) });
  const { categoryMap, typeMap } = await loadCategoryAndTypeMaps();
  return fromResourceDTO(dto, categoryMap, typeMap);
}

export async function updateResource(id, updates) {
  const dto = await apiFetch(`/resources/${id}`, { method: "PUT", body: toResourcePayload(updates) });
  const { categoryMap, typeMap } = await loadCategoryAndTypeMaps();
  return fromResourceDTO(dto, categoryMap, typeMap);
}

export async function deleteResource(id) {
  await apiFetch(`/resources/${id}`, { method: "DELETE" });
  return true;
}