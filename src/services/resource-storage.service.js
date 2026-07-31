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

export function updateUserResource(id, updates) {
  const resources = readUserResources();
  const index = resources.findIndex((r) => r.id === id);
  if (index === -1) return null;

  resources[index] = { ...resources[index], ...updates };
  saveUserResources(resources);
  return resources[index];
}

export function deleteUserResource(id) {
  const resources = readUserResources();
  const filtered = resources.filter((r) => r.id !== id);
  saveUserResources(filtered);
  return filtered.length !== resources.length;
}