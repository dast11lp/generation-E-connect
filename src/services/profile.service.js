import { apiFetch } from "./api-client.js";

export async function getMyProfile() {
  return apiFetch("/profile/me", { method: "GET" });
}

export async function updateMyProfile(payload) {
  return apiFetch("/profile/me", { method: "PUT", body: payload });
}