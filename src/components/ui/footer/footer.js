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

    await initFooterAuth(container, scriptUrl);
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
    
    authService.scheduleAutoLogout();
  } catch (error) {
    console.error(error);
  }
}