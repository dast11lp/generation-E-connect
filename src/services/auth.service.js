const ACTIVE_SESSION_KEY = "sesionActiva";

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
  return getCurrentUser() !== null;
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