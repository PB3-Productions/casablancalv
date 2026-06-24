/* =========================================================
   CASABLANCA MOBILE HERO TITLE PATCH — DISABLED
   Yellow hero title overlays have been intentionally removed from both
   desktop and mobile. This file remains as a harmless no-op because app.js
   still loads it for cache/backward compatibility.
   ========================================================= */
(function () {
  document.querySelectorAll(".casa-mobile-title-stabilizer").forEach((node) => node.remove());
  document.body.classList.remove("casa-mobile-hero-guard", "casa-mobile-first-slide");
})();