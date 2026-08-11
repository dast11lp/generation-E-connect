(async function loadFooter() {
  const scriptUrl = document.currentScript?.src;
  const container = document.querySelector("#footer-container");
  if (!scriptUrl || !container) return;

  try {
    const response = await fetch(new URL("footer.html", scriptUrl));
    if (!response.ok) throw new Error("No fue posible cargar el pie de página.");

    container.innerHTML = await response.text();
    container.querySelectorAll("img[src]").forEach((image) => {
      const src = image.getAttribute("src");
      if (!src || /^https?:/i.test(src) || src.startsWith("data:")) return;
      image.src = new URL(src.replace(/^\/+/, ""), new URL("../../../../", scriptUrl)).href;
    });
  } catch (error) {
    console.error(error);
  }
})();

async function initFooterAuth(container, scriptUrl) {
  const loginLink = container.querySelector("#footer-login-link");
  const logoutLink = container.querySelector("#footer-logout-link");
  if (!loginLink || !logoutLink) return;

  try {
    const authServiceUrl = new URL("../../../services/auth.service.js", scriptUrl);
    const authService = await import(authServiceUrl.href);

    const updateVisibility = () => {
      const loggedIn = authService.isLoggedIn();
      loginLink.hidden = loggedIn;
      logoutLink.hidden = !loggedIn;
    };
    updateVisibility();

    logoutLink.addEventListener("click", (event) => {
      event.preventDefault();
      authService.logout();
      window.location.href = "/src/pages/login/login.html";
    });

    scheduleAutoLogout(authService);
  } catch (error) {
    console.error(error);
  }
}

function decodeJwtPayload(token) {
  const payload = token.split(".")[1];
  if (!payload) return null;

  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + "=".repeat(padding);

  try {
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function scheduleAutoLogout(authService) {
  const token = authService.getToken();
  if (!token) return;

  const claims = decodeJwtPayload(token);
  if (!claims?.exp) return;

  const msRemaining = claims.exp * 1000 - Date.now();

  if (msRemaining <= 0) {
    handleTokenExpired(authService);
    return;
  }

  setTimeout(() => handleTokenExpired(authService), msRemaining);
}

async function handleTokenExpired(authService) {
  authService.logout();
  const { mostrarAlerta } = await import("../alert/alert.js");
  mostrarAlerta("Tu sesión ha expirado. Por favor inicia sesión de nuevo.", "warning", { duration: 2500 });
  setTimeout(() => {
    window.location.href = "/src/pages/login/login.html";
  }, 2500);
}