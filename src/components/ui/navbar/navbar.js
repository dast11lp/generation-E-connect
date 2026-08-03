(async function loadNavbar() {
  "use strict";

  const scriptUrl = document.currentScript?.src;
  const container = document.querySelector("#navbar-container");
  if (!scriptUrl || !container) return;

  try {
    const response = await fetch(new URL("navbar.html", scriptUrl));
    if (!response.ok) throw new Error("No fue posible cargar la navegación.");

    container.innerHTML = await response.text();
    rebaseComponentUrls(container, scriptUrl);
    initializeNavbar(container);
  } catch (error) {
    console.error(error);
  }
})();

function rebaseComponentUrls(container, scriptUrl) {
  const appRoot = new URL("../../../../", scriptUrl);
  container.querySelectorAll("a[href]").forEach((link) => {
    const route = link.dataset.route ?? link.getAttribute("href");
    if (!route || route === "#" || /^https?:/i.test(route)) return;
    const normalizedRoute = route.replace(/^((\.\.\/|\/)+)/, "");
    if (normalizedRoute.endsWith(".html")) link.href = new URL(normalizedRoute, appRoot).href;
  });
  container.querySelectorAll("img[src]").forEach((image) => {
    const src = image.getAttribute("src");
    if (!src || /^https?:/i.test(src) || src.startsWith("data:")) return;
    image.src = new URL(src.replace(/^\/+/, ""), appRoot).href;
  });
}

function initializeNavbar(container) {
  const navbar = container.querySelector("#header-navbar");
  const hamburger = container.querySelector("#hamburger");
  const mobileMenu = container.querySelector("#mobile-menu");
  if (!navbar || !hamburger || !mobileMenu) return;

  let ticking = false;
  const closeMenu = () => {
    mobileMenu.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", onClickOutside);
  };
  const onClickOutside = (event) => {
    if (!navbar.contains(event.target) && !mobileMenu.contains(event.target)) closeMenu();
  };
  const openMenu = () => {
    mobileMenu.classList.add("open");
    hamburger.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    document.addEventListener("click", onClickOutside);
  };

  window.addEventListener("scroll", () => {
    if (ticking) return;
    window.requestAnimationFrame(() => {
      const isScrolled = window.scrollY > 80;
      navbar.classList.toggle("scrolled", isScrolled);
      if (!isScrolled && mobileMenu.classList.contains("open")) closeMenu();
      ticking = false;
    });
    ticking = true;
  }, { passive: true });

  hamburger.addEventListener("click", (event) => {
    event.stopPropagation();
    mobileMenu.classList.contains("open") ? closeMenu() : openMenu();
  });
  mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenu.classList.contains("open")) {
      closeMenu();
      hamburger.focus();
    }
  });

  const currentPath = window.location.pathname.replace(/\/$/, "/index.html");
  navbar.querySelectorAll(".navegacion-principal a").forEach((link) => {
    link.classList.toggle("active", new URL(link.href).pathname === currentPath);
  });
}