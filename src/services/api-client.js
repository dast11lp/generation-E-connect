const LOCAL_HOSTNAMES = ["localhost", "127.0.0.1"];
const isLocal = LOCAL_HOSTNAMES.includes(window.location.hostname);

const API_BASE_URL = isLocal
  ? "http://localhost:8083/api"
  : "https://ec-c094f9e61f034e029869900306b99827.ecs.us-east-1.on.aws/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getStoredToken() {
  return localStorage.getItem("authToken");
}

async function parseErrorMessage(response) {
  const fallback = `Error ${response.status}: ${response.statusText}`;
  try {
    const body = await response.json();
    if (typeof body?.message === "string" && body.message.trim() !== "") {
      return body.message;
    }
    if (Array.isArray(body?.errors) && body.errors.length > 0) {
      return body.errors.map((e) => e.defaultMessage || e.message || e).join(" ");
    }
    if (typeof body?.error === "string") {
      return body.error;
    }
  } catch {
    // el cuerpo no era JSON, usamos el mensaje genérico
  }
  return fallback;
}

/**
 * Módulo único de consumo de la API. Cualquier servicio (auth, resources, stories...)
 * debería pasar por acá en vez de llamar fetch() directamente.
 *
 * @param {string} path - ej: "/auth/login", "/resources"
 * @param {{method?: string, body?: any, auth?: boolean, headers?: object}} options
 *        auth=false para endpoints públicos (login, GET de recursos, etc.)
 */
export async function apiFetch(path, { method = "GET", body, auth = true, headers = {} } = {}) {
  const finalHeaders = { "Content-Type": "application/json", ...headers };

  if (auth) {
    const token = getStoredToken();
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";
  return contentType.includes("application/json") ? response.json() : null;
}