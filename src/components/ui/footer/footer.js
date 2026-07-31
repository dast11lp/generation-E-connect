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
