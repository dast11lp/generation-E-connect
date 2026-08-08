import { apiFetch } from "./api-client.js";

export async function fetchCategories() {
  return apiFetch("/categories", { auth: false });
}