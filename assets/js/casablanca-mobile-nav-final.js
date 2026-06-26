/* =========================================================
   CASABLANCA MOBILE NAV FINAL OVERRIDE
   Purpose: Mobile-only standalone nav. This intentionally hides the
   original site-header on mobile so no legacy hamburger/menu layer can sit
   behind the new button or cause the enlarge/shrink blip.
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
        <div class="casa-mobile-nav-spacer" aria-hidden="true"></div>
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
      #${NAV_ID} {
        display: none;
      }

      @media (max-width: 1023px) {
        :root {
          --casa-mobile-nav-height: 94px;
          --casa-mobile-nav-size: 72px;
          --casa-mobile-logo-size: 70px;
          --casa-mobile-nav-pad-x: 18px;
        }

        html {
          scroll-padding-top: var(--casa-mobile-nav-height) !important;
        }

        body {
          padding-top: var(--casa-mobile-nav-height) !important;
        }

        /* Hide the original mobile header entirely. This removes the second
           hidden/legacy hamburger layer that was causing the blip. */
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
          bottom: auto !important;
          z-index: 2147483000 !important;
          width: 100vw !important;
          height: var(--casa-mobile-nav-height) !important;
          min-height: var(--casa-mobile-nav-height) !important;
          max-height: var(--casa-mobile-nav-height) !important;
          display: grid !important;
          grid-template-columns: var(--casa-mobile-nav-size) minmax(0, 1fr) var(--casa-mobile-nav-size) !important;
          align-items: center !important;
          gap: 0 !important;
          padding: 0 var(--casa-mobile-nav-pad-x) !important;
          margin: 0 !important;
          border: 0 !important;
          border-bottom: 1px solid rgba(185, 138, 56, .28) !important;
          border-radius: 0 !important;
          background: rgba(255, 250, 240, .995) !important;
          background-image: linear-gradient(180deg, #fffdf7 0%, #f6efe3 100%) !important;
          box-shadow: 0 12px 28px rgba(58, 40, 18, .13) !important;
          overflow: visible !important;
          transform: none !important;
          translate: none !important;
          scale: 1 !important;
          animation: none !important;
          transition: none !important;
          contain: layout style !important;
          box-sizing: border-box !important;
        }

        #${NAV_ID},
        #${NAV_ID} *,
        #${NAV_ID} *::before,
        #${NAV_ID} *::after {
          box-sizing: border-box !important;
          animation: none !important;
          transition: none !important;
        }

        .casa-mobile-logo-link,
        .casa-mobile-menu-button {
          width: var(--casa-mobile-nav-size) !important;
          height: var(--casa-mobile-nav-size) !important;
          min-width: var(--casa-mobile-nav-size) !important;
          min-height: var(--casa-mobile-nav-size) !important;
          max-width: var(--casa-mobile-nav-size) !important;
          max-height: var(--casa-mobile-nav-size) !important;
          display: grid !important;
          place-items: center !important;
          align-self: center !important;
          margin: 0 !important;
          padding: 0 !important;
          border-radius: 50% !important;
          overflow: visible !important;
          transform: none !important;
          translate: none !important;
          scale: 1 !important;
          contain: none !important;
        }

        .casa-mobile-logo-link {
          grid-column: 1 !important;
          justify-self: start !important;
          text-decoration: none !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
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
          transform: none !important;
          translate: none !important;
          scale: 1 !important;
          filter: none !important;
          clip-path: none !important;
        }

        .casa-mobile-nav-spacer {
          grid-column: 2 !important;
          min-width: 0 !important;
          height: 1px !important;
        }

        .casa-mobile-menu-button {
          grid-column: 3 !important;
          justify-self: end !important;
          border: 2px solid #050504 !important;
          background: #050504 !important;
          background-image: none !important;
          color: transparent !important;
          font-size: 0 !important;
          line-height: 0 !important;
          letter-spacing: 0 !important;
          text-indent: 0 !important;
          box-shadow: none !important;
          cursor: pointer !important;
          appearance: none !important;
          -webkit-appearance: none !important;
        }

        .casa-mobile-menu-button::before,
        .casa-mobile-menu-button::after {
          content: none !important;
          display: none !important;
        }

        .casa-mobile-menu-lines {
          width: 27px !important;
          height: 20px !important;
          min-width: 27px !important;
          min-height: 20px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .casa-mobile-menu-lines span {
          display: block !important;
          width: 27px !important;
          height: 3px !important;
          min-height: 3px !important;
          border-radius: 999px !important;
          background: #fffaf0 !important;
          box-shadow: none !important;
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
          top: calc(var(--casa-mobile-nav-height) + 12px) !important;
          right: var(--casa-mobile-nav-pad-x) !important;
          left: auto !important;
          width: min(390px, calc(100vw - (var(--casa-mobile-nav-pad-x) * 2))) !important;
          max-height: calc(100svh - var(--casa-mobile-nav-height) - 28px) !important;
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

        /* Lightbox close button clears the sticky mobile nav. */
        #lightboxClose,
        .lightbox-close {
          position: fixed !important;
          top: calc(var(--casa-mobile-nav-height) + 16px) !important;
          right: 18px !important;
          z-index: 2147483001 !important;
          color: #1b1712 !important;
          background: rgba(255, 250, 240, .96) !important;
          border: 1px solid rgba(185, 138, 56, .38) !important;
          box-shadow: 0 10px 24px rgba(0, 0, 0, .18) !important;
          text-shadow: none !important;
        }

        /* Availability review badges. Inline styles are overridden here. */
        #availability .trust-strip .badge,
        #availability .badge,
        .trust-strip .badge {
          color: #1b1712 !important;
          background: rgba(255, 250, 240, .92) !important;
          border: 1px solid rgba(185, 138, 56, .34) !important;
          box-shadow: 0 10px 24px rgba(58, 40, 18, .10) !important;
          text-shadow: none !important;
        }

        /* Footer Explore heading and links must stay readable on cream. */
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
          --casa-mobile-nav-height: 90px;
          --casa-mobile-nav-size: 68px;
          --casa-mobile-logo-size: 66px;
          --casa-mobile-nav-pad-x: 16px;
        }
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