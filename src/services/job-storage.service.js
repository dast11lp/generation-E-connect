const STORAGE_KEY = "userJobs";

export function initializeUserJobs() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing === null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
}

export function readUserJobs() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("No se pudo leer userJobs de localStorage:", err);
    return [];
  }
}

function saveUserJobs(jobs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

export function saveUserJob(job) {
  const jobs = readUserJobs();
  jobs.push(job);
  saveUserJobs(jobs);
  return job;
}

export function updateUserJob(id, updates) {
  const jobs = readUserJobs();
  const index = jobs.findIndex((j) => j.id === id);
  if (index === -1) return null;

  jobs[index] = { ...jobs[index], ...updates };
  saveUserJobs(jobs);
  return jobs[index];
}

export function deleteUserJob(id) {
  const jobs = readUserJobs();
  const filtered = jobs.filter((j) => j.id !== id);
  saveUserJobs(filtered);
  return filtered.length !== jobs.length;
}