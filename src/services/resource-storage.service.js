const STORAGE_KEY = "userResources";

export function initializeUserResources() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing === null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
}

export function readUserResources() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("No se pudo leer userResources de localStorage:", err);
    return [];
  }
}

function saveUserResources(resources) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
}

export function saveUserResource(resource) {
  const resources = readUserResources();
  resources.push(resource);
  saveUserResources(resources);
  return resource;
}