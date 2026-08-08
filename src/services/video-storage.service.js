import { apiFetch } from "./api-client.js";
import { fetchCategories } from "./category-storage.service.js";
import { CATEGORY_LABELS } from "./resource-storage.service.js";

function formatDuration(minutes) {
  if (minutes === null || minutes === undefined) return "";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${hours}h ${mins}min` : `${hours}h`;
}

function formatDateEs(dateStr) {
  if (!dateStr) return "";
  const date = new Date(`${dateStr}T00:00:00`);
  const formatted = new Intl.DateTimeFormat("es", { month: "short", year: "numeric" }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1).replace(".", "");
}

function inferLinkSourceType(link = "") {
  return link.includes("res.cloudinary.com") ? "file" : "url";
}

function toVideoPayload(video) {
  return {
    title: video.title,
    description: video.description ?? "",
    categoryId: video.categoryId,
    resourceTypeId: video.resourceTypeId ?? null,
    section: "recording",
    url: video.link,
    thumbnailUrl: video.thumbnail ?? null,
    durationMinutes: video.durationMinutes ?? null,
    publicationDate: video.publicationDate ?? new Date().toISOString().slice(0, 10),
    featured: video.featured ?? false,
    active: video.active ?? true,
    fileName: video.fileName ?? null,
    fileSize: video.fileSize ?? null,
  };
}

function fromRecordingDTO(dto, categoryMap) {
  const dateValue = dto.publicationDate ?? (dto.createdAt ? dto.createdAt.slice(0, 10) : "");

  return {
    id: dto.id,
    categoryId: dto.categoryId,
    resourceTypeId: dto.resourceTypeId ?? null,
    category: categoryMap.get(dto.categoryId) ?? "Sin categoría",
    title: dto.title,
    description: dto.description ?? "",
    author: "Equipo Generation", // el backend aún no guarda un presentador por grabación
    date: formatDateEs(dateValue),
    dateValue,
    duration: formatDuration(dto.durationMinutes),
    thumbnail: dto.thumbnailUrl ?? "",
    link: dto.url,
    sourceType: inferLinkSourceType(dto.url),
    featured: !!dto.featured,
    active: !!dto.active,
    fileName: dto.fileName,
    fileSize: dto.fileSize,
  };
}

async function loadCategoryMap() {
  const categories = await fetchCategories();
  return new Map(
    categories.map((c) => [c.id, CATEGORY_LABELS[c.categoryType] ?? c.description ?? c.categoryType])
  );
}

export async function fetchVideos() {
  const [dtos, categoryMap] = await Promise.all([
    apiFetch("/resources?section=recording", { auth: false }),
    loadCategoryMap(),
  ]);
  return dtos.map((dto) => fromRecordingDTO(dto, categoryMap));
}

export async function createVideo(video) {
  const dto = await apiFetch("/resources", { method: "POST", body: toVideoPayload(video) });
  const categoryMap = await loadCategoryMap();
  return fromRecordingDTO(dto, categoryMap);
}

export async function updateVideo(id, updates) {
  const dto = await apiFetch(`/resources/${id}`, { method: "PUT", body: toVideoPayload(updates) });
  const categoryMap = await loadCategoryMap();
  return fromRecordingDTO(dto, categoryMap);
}

export async function deleteVideo(id) {
  await apiFetch(`/resources/${id}`, { method: "DELETE" });
  return true;
}