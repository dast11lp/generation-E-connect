import { apiFetch } from "./api-client.js";

export async function fetchPrograms() {
  return apiFetch("/programs", { auth: false });
}

export async function fetchFullProgram(id) {
  const dto = await apiFetch(`/programs/full/${id}`, { auth: false });
  return mapFullProgramToViewShape(dto);
}

export async function createFullProgram(programFormResult) {
  const payload = mapFormResultToRequest(programFormResult);
  const dto = await apiFetch("/programs/full", { method: "POST", body: payload });
  return mapCreationResponseToViewShape(dto);
}

export async function updateFullProgram(id, programFormResult) {
  const payload = mapFormResultToRequest(programFormResult);
  const dto = await apiFetch(`/programs/full/${id}`, { method: "PUT", body: payload });
  return mapCreationResponseToViewShape(dto);
}

export async function deleteProgram(id) {
  await apiFetch(`/programs/${id}`, { method: "DELETE" });
}

function mapFullProgramToViewShape(fullProgramDTO) {
  const { program, learningPaths } = fullProgramDTO;
  return {
    id: program.id,
    name: program.name,
    description: program.description,
    routes: (learningPaths || []).map((lp) => ({
      id: lp.id,
      title: lp.name,
      topics: (lp.skills || []).map((skill) => ({
        title: skill.skillName,
        links: skill.links || [],
      })),
    })),
  };
}

async function mapCreationResponseToViewShape(dto) {
  return fetchFullProgram(dto.program.id);
}

function mapFormResultToRequest(programFormResult) {
  return {
    name: programFormResult.name,
    description: programFormResult.description ?? null,
    routes: (programFormResult.routes || []).map((route) => ({
      id: route.id ?? null,
      title: route.title,
      topics: (route.topics || []).map((topic) => ({
        title: topic.title,
        links: topic.links || [],
      })),
    })),
  };
}