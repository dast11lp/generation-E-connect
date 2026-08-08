import { apiFetch } from "./api-client.js";

export async function fetchResourceTypes() {
  return apiFetch("/resource-types", { auth: false });
}