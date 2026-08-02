const STORAGE_KEY = "trainingPrograms";

function initStorage() {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing === null) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trainingProgramsSeed));
    }
}

function getPrograms() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch (err) {
        console.error("No se pudo leer trainingPrograms de localStorage:", err);
        return [];
    }
}

function savePrograms(programs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
}

function addProgram(program) {
    const programs = getPrograms();

    const nextId = programs.length
        ? Math.max(...programs.map((p) => p.id)) + 1
        : 1;

    const newProgram = { ...program, id: nextId };
    programs.push(newProgram);
    savePrograms(programs);
    return newProgram;
}

function updateProgram(id, updates) {
  const programs = getPrograms();
  const index = programs.findIndex((p) => p.id === id);
  if (index === -1) return null;

  programs[index] = { ...programs[index], ...updates, id }; // conserva el id original
  savePrograms(programs);
  return programs[index];
}

function deleteProgram(id) {
  const programs = getPrograms();
  const filtered = programs.filter((p) => p.id !== id);
  savePrograms(filtered);
  return filtered.length !== programs.length;
}