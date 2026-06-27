/* =========================================================
   CASABLANCA MOBILE NAV FINAL OVERRIDE
   Purpose: Mobile-only standalone nav. Original site-header is hidden on
   mobile. The replacement uses no sticky bar background: centered logo only
   with a plain three-line hamburger at the right.
   ========================================================= */
(function () {
  const STYLE_ID = "casablancaMobileNavFinalOverride";
  const NAV_ID = "casaMobileNavFinalBar";
  const LOGO_SVG_URL = "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a3eec33e2763b2eec1f94f4.svg";

  function getDrawer() {
    return document.getElementById("drawer") || document.querySelector(".drawer");
  }

  function getOverlay() {
    return document.getElementById("drawerOverlay") || document.querySelector(".overlay");
  }

  function closeDrawer() {
    const drawer = getDrawer();
    const overlay = getOverlay();
    drawer?.classList.remove("open");
    overlay?.classList.remove("active");
    document.body.classList.remove("drawer-open", "nav-open", "menu-open");

    const button = document.getElementById("casaMobileMenuButton");
    if (button) button.setAttribute("aria-expanded", "false");
  }

  function toggleDrawer() {
    const drawer = getDrawer();
    const overlay = getOverlay();
    if (!drawer) return;

    const isOpening = !drawer.classList.contains("open");
    drawer.classList.toggle("open", isOpening);
    overlay?.classList.toggle("active", isOpening);
    document.body.classList.toggle("drawer-open", isOpening);

    const button = document.getElementById("casaMobileMenuButton");
    if (button) button.setAttribute("aria-expanded", isOpening ? "true" : "false");
  }

  function buildMobileNav() {
    let nav = document.getElementById(NAV_ID);
    if (!nav) {
      nav = document.createElement("header");
      nav.id = NAV_ID;
      nav.setAttribute("aria-label", "Casablanca Las Vegas mobile navigation");
      nav.innerHTML = `
        <a class="casa-mobile-logo-link" href="#top" aria-label="Casablanca Las Vegas home">
          <img class="casa-mobile-logo-img" src="${LOGO_SVG_URL}" alt="Casablanca Las Vegas" width="512" height="512" decoding="async" />
        </a>
        <button class="casa-mobile-menu-button" id="casaMobileMenuButton" type="button" aria-label="Open menu" aria-controls="drawer" aria-expanded="false">
          <span class="casa-mobile-menu-lines" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      `;
      document.body.prepend(nav);
    }

    const logo = nav.querySelector(".casa-mobile-logo-img");
    if (logo) {
      logo.src = LOGO_SVG_URL;
      logo.alt = "Casablanca Las Vegas";
    }

    const button = nav.querySelector("#casaMobileMenuButton");
    if (button && button.dataset.casaStandaloneReady !== "true") {
      button.dataset.casaStandaloneReady = "true";
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleDrawer();
      });
    }
  }

  function bindCloseHandlers() {
    const overlay = getOverlay();
    if (overlay && overlay.dataset.casaStandaloneCloseReady !== "true") {
      overlay.dataset.casaStandaloneCloseReady = "true";
      overlay.addEventListener("click", closeDrawer);
    }

    document.querySelectorAll(".close-btn, .drawer-close, .drawer-nav a, .drawer-actions a").forEach((node) => {
      if (node.dataset.casaStandaloneCloseReady === "true") return;
      node.dataset.casaStandaloneCloseReady = "true";
      node.addEventListener("click", closeDrawer);
    });

    if (document.body.dataset.casaEscapeCloseReady !== "true") {
      document.body.dataset.casaEscapeCloseReady = "true";
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeDrawer();
      });
    }
  }

  function installStyles() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = `
      #${NAV_ID} { display: none; }

      @media (max-width: 1023px) {
        :root {
          --casa-mobile-nav-height: 114px;
          --casa-mobile-logo-size: 104px;
          --casa-mobile-menu-width: 82px;
          --casa-mobile-menu-right: 22px;
          --casa-mobile-menu-top: 34px;
        }

        html { scroll-padding-top: 0 !important; }
        body { padding-top: 0 !important; }

        #site-header,
        .site-header {
          display: none !important;
          visibility: hidden !important;
          pointer-events: none !important;
          opacity: 0 !important;
        }

        #${NAV_ID} {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 2147483000 !important;
          width: 100vw !important;
          height: var(--casa-mobile-nav-height) !important;
          min-height: var(--casa-mobile-nav-height) !important;
          display: block !important;
          padding: 0 !important;
          margin: 0 !important;
          border: 0 !important;
          background: transparent !important;
          background-image: none !important;
          box-shadow: none !important;
          pointer-events: none !important;
          overflow: visible !important;
          transform: none !important;
          animation: none !important;
          transition: none !important;
          box-sizing: border-box !important;
        }

        #${NAV_ID}, #${NAV_ID} *, #${NAV_ID} *::before, #${NAV_ID} *::after {
          box-sizing: border-box !important;
          animation: none !important;
          transition: none !important;
        }

        .casa-mobile-logo-link {
          position: absolute !important;
          top: 8px !important;
          left: 50% !important;
          width: var(--casa-mobile-logo-size) !important;
          height: var(--casa-mobile-logo-size) !important;
          transform: translateX(-50%) !important;
          display: grid !important;
          place-items: center !important;
          margin: 0 !important;
          padding: 0 !important;
          border: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          pointer-events: auto !important;
          overflow: visible !important;
          text-decoration: none !important;
        }

        .casa-mobile-logo-img {
          display: block !important;
          width: var(--casa-mobile-logo-size) !important;
          height: var(--casa-mobile-logo-size) !important;
          min-width: var(--casa-mobile-logo-size) !important;
          min-height: var(--casa-mobile-logo-size) !important;
          max-width: var(--casa-mobile-logo-size) !important;
          max-height: var(--casa-mobile-logo-size) !important;
          object-fit: contain !important;
          object-position: center !important;
          margin: 0 !important;
          padding: 0 !important;
          border: 0 !important;
          border-radius: 50% !important;
          background: transparent !important;
          box-shadow: none !important;
          clip-path: none !important;
          transform: none !important;
          filter: drop-shadow(0 8px 14px rgba(0,0,0,.26)) !important;
        }

        .casa-mobile-menu-button {
          position: absolute !important;
          top: var(--casa-mobile-menu-top) !important;
          right: var(--casa-mobile-menu-right) !important;
          width: var(--casa-mobile-menu-width) !important;
          height: 48px !important;
          display: grid !important;
          place-items: center !important;
          margin: 0 !important;
          padding: 0 !important;
          border: 0 !important;
          border-radius: 0 !important;
          background: transparent !important;
          background-image: none !important;
          color: transparent !important;
          font-size: 0 !important;
          line-height: 0 !important;
          box-shadow: none !important;
          cursor: pointer !important;
          appearance: none !important;
          -webkit-appearance: none !important;
          pointer-events: auto !important;
          overflow: visible !important;
          transform: none !important;
        }

        .casa-mobile-menu-button::before,
        .casa-mobile-menu-button::after { content: none !important; display: none !important; }

        .casa-mobile-menu-lines {
          width: 74px !important;
          height: 42px !important;
          min-width: 74px !important;
          min-height: 42px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: stretch !important;
          justify-content: space-between !important;
          gap: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .casa-mobile-menu-lines span {
          display: block !important;
          width: 74px !important;
          height: 9px !important;
          min-height: 9px !important;
          border-radius: 999px !important;
          background: #0b0b0a !important;
          box-shadow: 0 2px 6px rgba(255,255,255,.18) !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        #drawerOverlay,
        .overlay {
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        #drawerOverlay.active,
        .overlay.active {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
        }

        #drawer,
        .drawer {
          position: fixed !important;
          top: 118px !important;
          right: 16px !important;
          left: auto !important;
          width: min(390px, calc(100vw - 32px)) !important;
          max-height: calc(100svh - 136px) !important;
          border-radius: 28px !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          transform: translate3d(0, -12px, 0) scale(.98) !important;
          transition: opacity .22s ease, transform .22s ease, visibility .22s ease !important;
          z-index: 2147482999 !important;
        }

        #drawer.open,
        .drawer.open {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
          transform: translate3d(0, 0, 0) scale(1) !important;
        }

        #drawer .close-btn,
        #drawer .drawer-close,
        .drawer .close-btn,
        .drawer .drawer-close,
        .close-btn {
          color: #1b1712 !important;
          background: rgba(255, 250, 240, .96) !important;
          border: 1px solid rgba(185, 138, 56, .36) !important;
          box-shadow: 0 8px 20px rgba(58, 40, 18, .12) !important;
          text-shadow: none !important;
        }

        #lightboxClose,
        .lightbox-close {
          position: fixed !important;
          top: 124px !important;
          right: 18px !important;
          z-index: 2147483001 !important;
          color: #1b1712 !important;
          background: rgba(255, 250, 240, .96) !important;
          border: 1px solid rgba(185, 138, 56, .38) !important;
          box-shadow: 0 10px 24px rgba(0, 0, 0, .18) !important;
          text-shadow: none !important;
        }

        #availability .trust-strip .badge,
        #availability .badge,
        .trust-strip .badge {
          color: #1b1712 !important;
          background: rgba(255, 250, 240, .92) !important;
          border: 1px solid rgba(185, 138, 56, .34) !important;
          box-shadow: 0 10px 24px rgba(58, 40, 18, .10) !important;
          text-shadow: none !important;
        }

        .site-footer-luxury .footer-links-card h3,
        .site-footer-luxury .footer-links-card a,
        .footer-links-card h3,
        .footer-links-card a,
        footer .footer-links-card h3,
        footer .footer-links-card a {
          color: #0d3a2f !important;
          text-shadow: none !important;
        }
      }

      @media (max-width: 360px) {
        :root {
          --casa-mobile-nav-height: 108px;
          --casa-mobile-logo-size: 96px;
          --casa-mobile-menu-width: 72px;
          --casa-mobile-menu-right: 16px;
          --casa-mobile-menu-top: 32px;
        }

        .casa-mobile-menu-lines,
        .casa-mobile-menu-lines span { width: 64px !important; }
        .casa-mobile-menu-lines { height: 36px !important; min-height: 36px !important; }
        .casa-mobile-menu-lines span { height: 8px !important; min-height: 8px !important; }
      }
    `;
  }

  function run() {
    buildMobileNav();
    closeDrawer();
    bindCloseHandlers();
    installStyles();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }

  window.addEventListener("load", () => {
    buildMobileNav();
    bindCloseHandlers();
    installStyles();
  }, { once: true });
})();