/* =========================================================
   CASABLANCA MOBILE NAV + UNIVERSAL LOGO OVERRIDE
   Purpose: Keep the final mobile nav behavior intact and force the latest
   supplied logo across desktop, mobile, drawer, footer, and CSS-mask logos.
   Logo spin/flip interactions and logo halo/shadow effects are disabled.
   ========================================================= */
(function () {
  const STYLE_ID = "casablancaMobileNavFinalOverride";
  const NAV_ID = "casaMobileNavFinalBar";
  const LOGO_URL = "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a413e7fd50c4ff184301d24.svg";
  const HAMBURGER_SVG_URL = "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a407a8b89d9cd8dc2f2565c.svg";
  const LOGO_IMAGE_SELECTOR = [
    ".main-logo",
    ".drawer-logo",
    ".footer-brand-block img",
    ".site-footer-luxury img",
    ".logo-wrapper img",
    ".casa-mobile-logo-img"
  ].join(", ");

  function getDrawer() {
    return document.getElementById("drawer") || document.querySelector(".drawer");
  }

  function getOverlay() {
    return document.getElementById("drawerOverlay") || document.querySelector(".overlay");
  }

  function syncLogoImages() {
    document.querySelectorAll(LOGO_IMAGE_SELECTOR).forEach((image) => {
      if (!(image instanceof HTMLImageElement)) return;
      image.src = LOGO_URL;
      image.srcset = `${LOGO_URL} 1024w`;
      image.sizes = image.classList.contains("casa-mobile-logo-img") ? "273px" : "(max-width: 1023px) 273px, 345px";
      image.alt = "Casablanca Las Vegas";
    });
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
          <img class="casa-mobile-logo-img" src="${LOGO_URL}" alt="Casablanca Las Vegas" width="512" height="512" decoding="async" />
        </a>
        <button class="casa-mobile-menu-button" id="casaMobileMenuButton" type="button" aria-label="Open menu" aria-controls="drawer" aria-expanded="false">
          <img class="casa-mobile-menu-icon" src="${HAMBURGER_SVG_URL}" alt="" aria-hidden="true" width="120" height="68" decoding="async" />
        </button>
      `;
      document.body.prepend(nav);
    }

    const logo = nav.querySelector(".casa-mobile-logo-img");
    if (logo) {
      logo.src = LOGO_URL;
      logo.srcset = `${LOGO_URL} 1024w`;
      logo.alt = "Casablanca Las Vegas";
    }

    const icon = nav.querySelector(".casa-mobile-menu-icon");
    if (icon) icon.src = HAMBURGER_SVG_URL;

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

  function bindMobileLogoScrollAnimation() {
    const nav = document.getElementById(NAV_ID);
    const logoLink = nav?.querySelector(".casa-mobile-logo-link");
    const hero = document.querySelector(".casa-webgl-hero");
    const mobileQuery = window.matchMedia("(max-width: 1023px)");

    if (!nav || !logoLink || !hero || nav.dataset.casaLogoScrollReady === "true") return;
    nav.dataset.casaLogoScrollReady = "true";

    let ticking = false;
    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

    const updateLogoPosition = () => {
      if (!mobileQuery.matches) {
        nav.style.removeProperty("--casa-logo-scroll-y");
        nav.style.removeProperty("--casa-logo-scroll-scale");
        nav.style.removeProperty("--casa-logo-scroll-opacity");
        logoLink.style.pointerEvents = "none";
        ticking = false;
        return;
      }

      const heroTop = hero.offsetTop || 0;
      const heroHeight = Math.max(hero.offsetHeight || 0, window.innerHeight || 1);
      const start = heroTop + heroHeight * 0.18;
      const end = heroTop + heroHeight * 0.92;
      const progress = clamp((window.scrollY - start) / Math.max(1, end - start));
      const eased = easeOutCubic(progress);

      nav.style.setProperty("--casa-logo-scroll-y", `${Math.round(-96 * eased)}px`);
      nav.style.setProperty("--casa-logo-scroll-scale", `${(1 - 0.22 * eased).toFixed(3)}`);
      nav.style.setProperty("--casa-logo-scroll-opacity", `${(1 - eased).toFixed(3)}`);
      logoLink.style.pointerEvents = "none";
      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateLogoPosition);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    requestUpdate();
    window.setTimeout(requestUpdate, 300);
  }

  function applyRequestedTextTweaks() {
    document.querySelectorAll("h1, h2, h3, .eyebrow").forEach((node) => {
      const text = (node.textContent || "").trim();
      if (/^Bedr?oom-by-Bedroom Layout$/i.test(text) || /^Bedroom-by-Bedroom Layout$/i.test(text)) {
        node.textContent = "Room-By-Room Layout";
      }
      if (text === "Private Booking Support") {
        node.textContent = "Booking Support";
      }
    });
  }

  function installStyles() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
    }

    style.textContent = `
      :root {
        --casa-new-logo: url('${LOGO_URL}') !important;
        --casa-new-badge: url('${LOGO_URL}') !important;
      }

      html body .logo-wrapper::before,
      html body .footer-brand-block::before {
        background-image: url('${LOGO_URL}') !important;
        background-repeat: no-repeat !important;
        background-position: center center !important;
        background-size: contain !important;
        border-radius: 50% !important;
        box-shadow: none !important;
        filter: none !important;
        transform: none !important;
        transform-style: flat !important;
        backface-visibility: visible !important;
        transition: none !important;
      }

      html body .main-logo,
      html body .drawer-logo,
      html body .footer-brand-block img,
      html body .site-footer-luxury img,
      html body .logo-wrapper img,
      html body .casa-mobile-logo-img {
        content: var(--casa-new-logo) !important;
        object-fit: contain !important;
        box-shadow: none !important;
        filter: none !important;
      }

      html body .drawer-logo {
        border-radius: 50% !important;
        box-shadow: none !important;
        filter: none !important;
        transform: scale(1.08) translateX(-2%) !important;
        transform-style: flat !important;
        backface-visibility: visible !important;
        transition: none !important;
      }

      section.bg-dark h1,
      section.bg-dark h2,
      .section.bg-dark h1,
      .section.bg-dark h2 {
        text-align: center !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      .luxury-feature-list li:nth-child(2) .gold-svg-icon svg {
        display: none !important;
      }

      .luxury-feature-list li:nth-child(2) .gold-svg-icon::before {
        content: "" !important;
        display: block !important;
        width: 2rem !important;
        height: 2rem !important;
        background-color: currentColor !important;
        -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' d='M3 14c3 0 3-2 6-2s3 2 6 2 3-2 6-2M3 19c3 0 3-2 6-2s3 2 6 2 3-2 6-2'/%3E%3C/svg%3E") center / contain no-repeat !important;
        mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' d='M3 14c3 0 3-2 6-2s3 2 6 2 3-2 6-2M3 19c3 0 3-2 6-2s3 2 6 2 3-2 6-2'/%3E%3C/svg%3E") center / contain no-repeat !important;
      }

      #${NAV_ID} { display: none; }

      @media (min-width: 1024px) {
        #site-header .brand-group,
        #site-header.site-header.is-scrolled .brand-group {
          top: 50% !important;
          left: 50% !important;
          width: clamp(250px, 17.5vw, 340px) !important;
          height: clamp(124px, 8.7vw, 176px) !important;
          transform: translate(-50%, -50%) !important;
          transition: none !important;
        }

        #site-header .logo-wrapper,
        #site-header.site-header.is-scrolled .logo-wrapper {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          display: block !important;
          width: clamp(252px, 18vw, 345px) !important;
          height: clamp(150px, 10.5vw, 200px) !important;
          transform: translate(-50%, -44%) !important;
          transition: none !important;
          overflow: visible !important;
        }

        #site-header .logo-wrapper::before,
        #site-header.site-header.is-scrolled .logo-wrapper::before {
          width: 100% !important;
          height: 100% !important;
          box-shadow: none !important;
          filter: none !important;
        }
      }

      @media (max-width: 1023px) {
        :root {
          --casa-mobile-nav-height: 100svh;
          --casa-mobile-logo-size: 273px;
          --casa-mobile-menu-width: 72px;
          --casa-mobile-menu-right: 18px;
          --casa-mobile-menu-top: 44px;
          --casa-mobile-menu-icon-width: 62px;
          --casa-mobile-menu-icon-height: 36px;
          --casa-logo-scroll-y: 0px;
          --casa-logo-scroll-scale: 1;
          --casa-logo-scroll-opacity: 1;
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
          display: block !important;
          pointer-events: none !important;
          overflow: visible !important;
          background: transparent !important;
          box-shadow: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }

        #${NAV_ID}, #${NAV_ID} *, #${NAV_ID} *::before, #${NAV_ID} *::after {
          box-sizing: border-box !important;
          -webkit-tap-highlight-color: transparent !important;
        }

        .casa-mobile-logo-link {
          position: absolute !important;
          top: 50svh !important;
          left: calc(50% + 6px) !important;
          width: var(--casa-mobile-logo-size) !important;
          height: var(--casa-mobile-logo-size) !important;
          transform: translateX(-50%) translateY(calc(-50% + var(--casa-logo-scroll-y))) scale(var(--casa-logo-scroll-scale)) !important;
          transform-origin: center center !important;
          opacity: var(--casa-logo-scroll-opacity) !important;
          display: grid !important;
          place-items: center !important;
          pointer-events: none !important;
          z-index: 2 !important;
          outline: none !important;
          -webkit-touch-callout: none !important;
          user-select: none !important;
          box-shadow: none !important;
          filter: none !important;
        }

        .casa-mobile-logo-link:focus,
        .casa-mobile-logo-link:focus-visible,
        .casa-mobile-logo-link:active {
          outline: none !important;
          box-shadow: none !important;
          filter: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }

        .casa-mobile-logo-img {
          display: block !important;
          width: var(--casa-mobile-logo-size) !important;
          height: var(--casa-mobile-logo-size) !important;
          min-width: var(--casa-mobile-logo-size) !important;
          min-height: var(--casa-mobile-logo-size) !important;
          max-width: var(--casa-mobile-logo-size) !important;
          max-height: var(--casa-mobile-logo-size) !important;
          object-fit: cover !important;
          object-position: center !important;
          border-radius: 50% !important;
          background: transparent !important;
          box-shadow: none !important;
          filter: none !important;
          transform: scale(1.08) translateX(-2%) !important;
          transform-style: flat !important;
          backface-visibility: visible !important;
          transition: none !important;
          outline: none !important;
          user-select: none !important;
        }

        .casa-mobile-menu-button {
          position: absolute !important;
          top: var(--casa-mobile-menu-top) !important;
          right: var(--casa-mobile-menu-right) !important;
          width: var(--casa-mobile-menu-width) !important;
          height: var(--casa-mobile-menu-icon-height) !important;
          display: grid !important;
          place-items: center !important;
          padding: 0 !important;
          border: 0 !important;
          background: transparent !important;
          cursor: pointer !important;
          appearance: none !important;
          -webkit-appearance: none !important;
          pointer-events: auto !important;
          z-index: 3 !important;
        }

        .casa-mobile-menu-button::before,
        .casa-mobile-menu-button::after,
        .casa-mobile-menu-lines,
        .casa-mobile-menu-lines span {
          content: none !important;
          display: none !important;
        }

        .casa-mobile-menu-icon {
          display: block !important;
          width: var(--casa-mobile-menu-icon-width) !important;
          height: var(--casa-mobile-menu-icon-height) !important;
          object-fit: contain !important;
          filter: drop-shadow(0 6px 9px rgba(0,0,0,.24)) !important;
        }

        #drawerOverlay,
        .overlay {
          z-index: 2147483001 !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        #drawerOverlay.active,
        .overlay.active {
          z-index: 2147483001 !important;
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
          z-index: 2147483002 !important;
        }

        #drawer.open,
        .drawer.open {
          z-index: 2147483002 !important;
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
          transform: translate3d(0, 0, 0) scale(1) !important;
        }

        #lightboxClose,
        .lightbox-close {
          left: 18px !important;
          right: auto !important;
          z-index: 2147483003 !important;
        }
      }

      @media (max-width: 360px) {
        :root {
          --casa-mobile-logo-size: 245px;
          --casa-mobile-menu-width: 64px;
          --casa-mobile-menu-right: 14px;
          --casa-mobile-menu-icon-width: 56px;
          --casa-mobile-menu-icon-height: 32px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function syncAllLogos() {
    installStyles();
    syncLogoImages();
  }

  function scheduleLogoSyncs() {
    [0, 50, 150, 300, 750, 1500, 3000, 5000].forEach((delay) => window.setTimeout(syncAllLogos, delay));
    const interval = window.setInterval(syncAllLogos, 750);
    window.setTimeout(() => window.clearInterval(interval), 12000);
  }

  function observeLogoChanges() {
    if (!document.documentElement || document.documentElement.dataset.casaUniversalLogoObserverReady === "true") return;
    document.documentElement.dataset.casaUniversalLogoObserverReady = "true";

    let syncTimer = null;
    const observer = new MutationObserver(() => {
      window.clearTimeout(syncTimer);
      syncTimer = window.setTimeout(() => {
        syncAllLogos();
        applyRequestedTextTweaks();
      }, 40);
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "srcset", "style", "class"]
    });
  }

  function run() {
    buildMobileNav();
    closeDrawer();
    bindCloseHandlers();
    bindMobileLogoScrollAnimation();
    syncAllLogos();
    applyRequestedTextTweaks();
    observeLogoChanges();
    scheduleLogoSyncs();
    window.setTimeout(applyRequestedTextTweaks, 300);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }

  window.addEventListener("load", () => {
    syncAllLogos();
    applyRequestedTextTweaks();
  }, { once: true });
})();