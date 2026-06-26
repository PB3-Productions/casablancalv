/* =========================================================
   CASABLANCA MOBILE HERO TITLE PATCH — DISABLED
   Yellow hero title overlays have been intentionally removed from both
   desktop and mobile. This compatibility hook now loads the final polish
   fixes after the main refresh script.
   ========================================================= */
(function () {
  document.querySelectorAll(".casa-mobile-title-stabilizer").forEach((node) => node.remove());
  document.body.classList.remove("casa-mobile-hero-guard", "casa-mobile-first-slide");

  function loadScriptOnce(id, src) {
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.defer = true;
    script.src = src;
    document.head.appendChild(script);
  }

  function loadPolishFixes() {
    loadScriptOnce("casablancaPolishFixScript", "/assets/js/casablanca-polish-fixes.js");
    window.setTimeout(() => {
      loadScriptOnce("casablancaFinalSpacingFixScript", "/assets/js/casablanca-final-spacing-fixes.js");
    }, 120);
    window.setTimeout(() => {
      loadScriptOnce("casablancaMobileNavFinalScript", "/assets/js/casablanca-mobile-nav-final.js");
    }, 260);
  }

  loadPolishFixes();
  window.setTimeout(loadPolishFixes, 250);
})();