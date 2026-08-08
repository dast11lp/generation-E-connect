import { apiFetch } from "./api-client.js";

function toJobBoardPayload(job) {
  return {
    name: job.name,
    description: job.description,
    url: job.url,
    category: job.category,
    logoUrl: job.image,
  };
}

function fromJobBoardDTO(dto) {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    url: dto.url,
    category: dto.category,
    image: dto.logoUrl,
    active: dto.active,
  };
}

export async function fetchJobBoards() {
  const dtos = await apiFetch("/job-boards", { auth: false });
  return dtos.map(fromJobBoardDTO);
}

export async function createJobBoard(job) {
  const dto = await apiFetch("/job-boards", {
    method: "POST",
    body: toJobBoardPayload(job),
  });
  return fromJobBoardDTO(dto);
}

export async function updateJobBoard(id, updates) {
  const dto = await apiFetch(`/job-boards/${id}`, {
    method: "PUT",
    body: toJobBoardPayload(updates),
  });
  return fromJobBoardDTO(dto);
}

export async function deleteJobBoard(id) {
  await apiFetch(`/job-boards/${id}`, { method: "DELETE" });
  return true;
}