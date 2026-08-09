import { apiFetch } from "./api-client.js";

const FALLBACK_PHOTO = "https://randomuser.me/api/portraits/lego/1.jpg";

function toStoryPayload(story) {
  const year = (story.year || "").trim();
  const publicationDate = /^\d{4}$/.test(year) ? `${year}-01-01` : undefined;

  return {
    alumniName: story.name,
    program: story.category,
    company: story.company,
    role: story.role,
    timeToHire: story.timeToHire,
    photoUrl: story.photo || null,
    testimonial: story.testimony,
    publicationDate,
    featured: false,
  };
}

function fromStoryDTO(dto) {
  const year = dto.publicationDate ? dto.publicationDate.slice(0, 4) : "";
  return {
    id: dto.id,
    name: dto.alumniName,
    category: dto.program,
    company: dto.company || "",
    role: dto.role || "",
    timeToHire: dto.timeToHire || "",
    testimony: dto.testimonial || "",
    year,
    photo: dto.photoUrl || FALLBACK_PHOTO,
    featured: !!dto.featured,
  };
}

export async function fetchStories() {
  const dtos = await apiFetch("/stories", { auth: false });
  return dtos.map(fromStoryDTO);
}

export async function fetchFeaturedStories() {
  const dtos = await apiFetch("/stories?featured=true", { auth: false });
  return dtos.map(fromStoryDTO);
}

export async function createStory(story) {
  const dto = await apiFetch("/stories", {
    method: "POST",
    auth: false,
    body: toStoryPayload(story),
  });
  return fromStoryDTO(dto);
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function toFeaturedStory(story) {
  return {
    id: story.id,
    initials: getInitials(story.name),
    name: story.name,
    role: story.role,
    cohort: story.year ? `Cohorte ${story.year}` : story.category,
    company: story.company,
    timeToHire: story.timeToHire,
    quote: story.testimony,
  };
}

export async function fetchRecentStories() {
  const dtos = await apiFetch("/stories/recent", { auth: false });
  return dtos.map(fromStoryDTO).map(toFeaturedStory);
}