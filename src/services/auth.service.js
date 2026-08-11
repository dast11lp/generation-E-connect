

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
  "open-manage-story-form",
  "btn-agregar-historia",
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

export async function register({ name, email, password, profile }) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: { name, email, password, profile },
  });
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ACTIVE_SESSION_KEY);
}

export function getTokenExpiration(token = getToken()) {
  if (!token) return null;

  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padding = (4 - (normalized.length % 4)) % 4;
    const claims = JSON.parse(atob(normalized + "=".repeat(padding)));
    return typeof claims.exp === "number" ? claims.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token = getToken()) {
  const expiresAt = getTokenExpiration(token);
  if (expiresAt === null) return true;
  return Date.now() >= expiresAt;
}

let sessionExpiredHandled = false;
let autoLogoutTimer = null;

export function handleSessionExpired(message = "Tu sesión ha expirado. Debes iniciar sesión nuevamente.") {
  if (sessionExpiredHandled) return;
  sessionExpiredHandled = true;

  if (autoLogoutTimer) {
    clearTimeout(autoLogoutTimer);
    autoLogoutTimer = null;
  }

  logout();
  alert(message);
  window.location.href = "/src/pages/login/login.html";
}

export function scheduleAutoLogout() {
  if (autoLogoutTimer) {
    clearTimeout(autoLogoutTimer);
    autoLogoutTimer = null;
  }

  if (!isLoggedIn()) return;

  const token = getToken();
  if (isTokenExpired(token)) {
    handleSessionExpired();
    return;
  }

  const msRemaining = getTokenExpiration(token) - Date.now();
  autoLogoutTimer = setTimeout(() => handleSessionExpired(), msRemaining);
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

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function updateStoredSession(patch) {
  const current = getCurrentUser() || {};
  localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({ ...current, ...patch }));
}