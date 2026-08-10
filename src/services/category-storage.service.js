import { apiFetch } from "./api-client.js";

export async function fetchCategories(section) {
  const query = section ? `?section=${encodeURIComponent(section)}` : "";
  return apiFetch(`/categories${query}`, { auth: false });
}