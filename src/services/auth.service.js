

import { apiFetch } from "./api-client.js";

const ACTIVE_SESSION_KEY = "sesionActiva";
const TOKEN_KEY = "authToken";

const ADMIN_CONTROL_IDS = [
  "open-resource-form",
  "open-manage-resource-form",
  "open-program-form",
  "open-manage-program-form",
  "open-job-form",
  "open-manage-job-form",
  "open-video-form",
  "open-manage-video-form",
];

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser() {
  const session = localStorage.getItem(ACTIVE_SESSION_KEY);
  if (!session) return null;

  try {
    const user = JSON.parse(session);
    const hasEmail = typeof user?.email === "string" && user.email.trim().length > 0;
    return user && typeof user === "object" && !Array.isArray(user) && hasEmail ? user : null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return getCurrentUser() !== null && getToken() !== null;
}

/**
 * Llama al backend real, guarda el token y los datos del usuario en localStorage.
 * Cualquier página puede llamar a esto (login.html) y cualquier otra puede
 * leer la sesión después con getCurrentUser() / getToken() / isLoggedIn().
 */
export async function login(email, password) {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    auth: false,
    body: { email, password },
  });

  localStorage.setItem(TOKEN_KEY, response.token);
  localStorage.setItem(
    ACTIVE_SESSION_KEY,
    JSON.stringify({ name: response.name, email: response.email, role: response.role })
  );

  return response;
}

export async function register(name, email, password) {
  return apiFetch("/auth/register", {
    method: "POST",
    auth: false,
    body: { name, email, password },
  });
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ACTIVE_SESSION_KEY);
}

export function syncAdminControls(root = document) {
  const shouldShowControls = isLoggedIn();

  ADMIN_CONTROL_IDS.forEach((id) => {
    const control = root.querySelector(`#${id}`);
    if (!control) return;

    control.hidden = !shouldShowControls;

    if (shouldShowControls) {
      control.style.removeProperty("display");
    } else {
      control.style.setProperty("display", "none", "important");
    }
  });
}
