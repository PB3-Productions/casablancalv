/* =========================================================
   CASABLANCA MOBILE HERO TITLE PATCH — DISABLED
   Yellow hero title overlays have been intentionally removed from both
   desktop and mobile. This compatibility hook now loads the final polish
   fixes after the main refresh script.
   ========================================================= */
(function () {
  document.querySelectorAll(".casa-mobile-title-stabilizer").forEach((node) => node.remove());
  document.body.classList.remove("casa-mobile-hero-guard", "casa-mobile-first-slide");

  function loadPolishFixes() {
    if (document.getElementById("casablancaPolishFixScript")) return;
    const script = document.createElement("script");
    script.id = "casablancaPolishFixScript";
    script.defer = true;
    script.src = "/assets/js/casablanca-polish-fixes.js";
    document.head.appendChild(script);
  }

  loadPolishFixes();
  window.setTimeout(loadPolishFixes, 250);
})();