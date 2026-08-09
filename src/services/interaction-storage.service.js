import { apiFetch } from "./api-client.js";

const SESSION_ID_KEY = "interactionSessionId";

function getOrCreateSessionId() {
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

export async function registerResourceView(resourceId) {
  return apiFetch(`/resources/${resourceId}/view`, { method: "PATCH", auth: false });
}

export async function registerResourceDownload(resourceId) {
  return apiFetch(`/resources/${resourceId}/download`, { method: "PATCH", auth: false });
}

export async function logInteraction(resourceId, eventType) {
  return apiFetch("/interactions", {
    method: "POST",
    auth: false,
    body: {
      resourceId,
      eventType,
      sessionId: getOrCreateSessionId(),
    },
  });
}

export function trackResourceEvent(resourceId, eventType) {
  const registerCount = eventType === "download"
    ? registerResourceDownload(resourceId)
    : registerResourceView(resourceId);

  Promise.allSettled([registerCount, logInteraction(resourceId, eventType)])
    .then((results) => {
      results.forEach((result) => {
        if (result.status === "rejected") {
          console.error("No se pudo registrar la interacción:", result.reason);
        }
      });
    });
}