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
