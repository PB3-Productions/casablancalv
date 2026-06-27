/* =========================================================
   CASABLANCA MOBILE NAV LOADER
   Purpose: Legacy hero-title patches are disabled. This file now loads only
   the standalone mobile nav, preventing old polish/spacing override scripts
   from flashing legacy content before the final layout settles.
   ========================================================= */
(function () {
  document.querySelectorAll(".casa-mobile-title-stabilizer, .casa-hero-slide-title").forEach((node) => node.remove());
  document.body.classList.remove("casa-mobile-hero-guard", "casa-mobile-first-slide");

  function loadScriptOnce(id, src) {
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.defer = true;
    script.src = src;
    document.head.appendChild(script);
  }

  loadScriptOnce("casablancaMobileNavFinalScript", "/assets/js/casablanca-mobile-nav-final.js");
})();