/* =========================================================
   CASABLANCA MOBILE NAV LOADER
   Purpose: Legacy hero-title patches are disabled. This file now loads only
   the standalone mobile nav, prevents old polish/spacing override scripts
   from flashing legacy content, and keeps the latest supplied logo asset
   synchronized across header, drawer, mobile hero coin, and footer logos.
   ========================================================= */
(function () {
  const LOGO_URL = "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a40c965c408020f97ee52e0.png";
  const LOGO_STYLE_ID = "casablancaUniversalLogoOverride";
  const LOGO_IMAGE_SELECTOR = [
    ".main-logo",
    ".drawer-logo",
    ".footer-brand-block img",
    ".site-footer-luxury img",
    ".logo-wrapper img",
    ".casa-mobile-logo-img"
  ].join(", ");

  document.querySelectorAll(".casa-mobile-title-stabilizer, .casa-hero-slide-title").forEach((node) => node.remove());
  document.body.classList.remove("casa-mobile-hero-guard", "casa-mobile-first-slide");

  function installLogoOverrideStyles() {
    let style = document.getElementById(LOGO_STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = LOGO_STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = `
      :root {
        --casa-new-logo: url('${LOGO_URL}') !important;
        --casa-new-badge: url('${LOGO_URL}') !important;
      }

      html body .logo-wrapper::before,
      html body .footer-brand-block::before {
        background-image: url('${LOGO_URL}') !important;
      }

      html body .main-logo,
      html body .drawer-logo,
      html body .footer-brand-block img,
      html body .site-footer-luxury img,
      html body .logo-wrapper img,
      html body .casa-mobile-logo-img {
        content: var(--casa-new-logo) !important;
        object-fit: contain !important;
      }
    `;
  }

  function syncLogoImages() {
    document.querySelectorAll(LOGO_IMAGE_SELECTOR).forEach((image) => {
      if (!(image instanceof HTMLImageElement)) return;
      image.src = LOGO_URL;
      image.srcset = `${LOGO_URL} 512w`;
      image.alt = "Casablanca Las Vegas";
    });
  }

  function syncAllLogos() {
    installLogoOverrideStyles();
    syncLogoImages();
  }

  function scheduleLogoSyncs() {
    [0, 100, 300, 750, 1500].forEach((delay) => window.setTimeout(syncAllLogos, delay));
  }

  function observeLogoChanges() {
    if (!document.documentElement || document.documentElement.dataset.casaLogoObserverReady === "true") return;
    document.documentElement.dataset.casaLogoObserverReady = "true";

    let syncTimer = null;
    const observer = new MutationObserver((mutations) => {
      if (!mutations.some((mutation) => mutation.addedNodes && mutation.addedNodes.length)) return;
      window.clearTimeout(syncTimer);
      syncTimer = window.setTimeout(syncAllLogos, 60);
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function loadScriptOnce(id, src) {
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.defer = true;
    script.src = src;
    document.head.appendChild(script);
  }

  syncAllLogos();
  scheduleLogoSyncs();
  observeLogoChanges();

  loadScriptOnce("casablancaMobileNavFinalScript", "/assets/js/casablanca-mobile-nav-final.js");

  window.addEventListener("load", syncAllLogos, { once: true });
})();