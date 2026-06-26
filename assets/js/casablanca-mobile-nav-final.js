/* =========================================================
   CASABLANCA MOBILE NAV FINAL OVERRIDE
   Purpose: Last-load mobile header authority. Keeps the full-width
   mobile nav stable, prevents repeated hamburger DOM rewrites/blipping,
   equalizes logo + hamburger sizing, and keeps the drawer closed until
   the hamburger is clicked.
   ========================================================= */
(function () {
  const STYLE_ID = "casablancaMobileNavFinalOverride";
  let didInitialDrawerClose = false;
  const nativeInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");

  function setInnerHTML(element, html) {
    if (!element || !nativeInnerHTML?.set) return;
    nativeInnerHTML.set.call(element, html);
  }

  function lockHamburgerInnerHTML(button) {
    if (!button || button.dataset.casaHamburgerLocked === "true" || !nativeInnerHTML?.get || !nativeInnerHTML?.set) return;

    Object.defineProperty(button, "innerHTML", {
      configurable: true,
      enumerable: false,
      get() {
        return nativeInnerHTML.get.call(this);
      },
      set(value) {
        const incoming = String(value || "");
        const alreadyCorrect = this.querySelectorAll(".hamburger-line").length === 3;
        const isAnotherHamburgerRewrite = incoming.includes("hamburger-stack") || incoming.includes("hamburger-line");

        if (alreadyCorrect && isAnotherHamburgerRewrite) return;
        nativeInnerHTML.set.call(this, value);
      }
    });

    button.dataset.casaHamburgerLocked = "true";
  }

  function buildSingleHamburger() {
    document.querySelectorAll("#hamburger-btn, .hamburger-btn").forEach((button) => {
      if (!button) return;

      button.setAttribute("aria-label", "Open Casablanca Las Vegas menu");
      button.setAttribute("title", "Open menu");
      button.classList.add("casa-locked-hamburger");

      const hasCorrectMarkup = button.querySelectorAll(".hamburger-line").length === 3;
      if (!hasCorrectMarkup) {
        button.textContent = "";
        setInnerHTML(button, `
          <span class="hamburger-stack" aria-hidden="true">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </span>
        `);
      }

      lockHamburgerInnerHTML(button);
    });
  }

  function closeDrawerAtStartupOnly() {
    if (didInitialDrawerClose) return;
    didInitialDrawerClose = true;
    document.getElementById("drawer")?.classList.remove("open");
    document.getElementById("drawerOverlay")?.classList.remove("active");
    document.body.classList.remove("drawer-open", "nav-open", "menu-open");
  }

  function installStyles() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = `
      @media (max-width: 1023px) {
        html {
          scroll-padding-top: 82px !important;
        }

        body {
          padding-top: 82px !important;
        }

        #site-header,
        .site-header,
        #site-header.is-scrolled,
        .site-header.is-scrolled {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: auto !important;
          width: 100vw !important;
          max-width: 100vw !important;
          height: 82px !important;
          min-height: 82px !important;
          max-height: 82px !important;
          margin: 0 !important;
          padding: 0 !important;
          border-radius: 0 !important;
          border: 0 !important;
          border-bottom: 1px solid rgba(185, 138, 56, .28) !important;
          background: rgba(255, 250, 240, .995) !important;
          background-image: linear-gradient(180deg, #fffdf7 0%, #f6efe3 100%) !important;
          box-shadow: 0 12px 28px rgba(58, 40, 18, .13) !important;
          overflow: hidden !important;
          transform: none !important;
          translate: none !important;
          scale: 1 !important;
          animation: none !important;
          transition: none !important;
          backdrop-filter: blur(12px) saturate(1.03) !important;
          -webkit-backdrop-filter: blur(12px) saturate(1.03) !important;
          z-index: 99999 !important;
        }

        #site-header::before,
        #site-header::after,
        .site-header::before,
        .site-header::after {
          content: none !important;
          display: none !important;
        }

        #site-header .header-container,
        .site-header .header-container,
        #site-header.is-scrolled .header-container,
        .site-header.is-scrolled .header-container {
          position: relative !important;
          inset: auto !important;
          width: 100% !important;
          max-width: 100% !important;
          height: 82px !important;
          min-height: 82px !important;
          max-height: 82px !important;
          margin: 0 !important;
          padding: 0 16px !important;
          display: grid !important;
          grid-template-columns: 56px minmax(0, 1fr) 56px !important;
          align-items: center !important;
          justify-content: normal !important;
          column-gap: 0 !important;
          border: 0 !important;
          border-radius: 0 !important;
          background: transparent !important;
          background-image: none !important;
          box-shadow: none !important;
          overflow: hidden !important;
          transform: none !important;
          translate: none !important;
          scale: 1 !important;
          animation: none !important;
          transition: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        #site-header .header-container::before,
        #site-header .header-container::after,
        .site-header .header-container::before,
        .site-header .header-container::after {
          content: none !important;
          display: none !important;
        }

        .nav-list,
        .nav-left,
        .nav-right,
        .desktop-nav,
        .desktop-only {
          display: none !important;
        }

        #site-header .brand-group,
        .site-header .brand-group,
        #site-header.is-scrolled .brand-group,
        .site-header.is-scrolled .brand-group {
          grid-column: 1 !important;
          justify-self: start !important;
          align-self: center !important;
          position: relative !important;
          top: auto !important;
          left: auto !important;
          right: auto !important;
          bottom: auto !important;
          width: 56px !important;
          height: 56px !important;
          min-width: 56px !important;
          min-height: 56px !important;
          max-width: 56px !important;
          max-height: 56px !important;
          margin: 0 !important;
          padding: 0 !important;
          border-radius: 50% !important;
          background: transparent !important;
          box-shadow: none !important;
          overflow: hidden !important;
          transform: none !important;
          translate: none !important;
          scale: 1 !important;
          animation: none !important;
          transition: none !important;
          z-index: 2 !important;
        }

        #site-header .logo-wrapper,
        .site-header .logo-wrapper,
        #site-header.is-scrolled .logo-wrapper,
        .site-header.is-scrolled .logo-wrapper,
        #site-header .main-logo,
        .site-header .main-logo,
        #site-header.is-scrolled .main-logo,
        .site-header.is-scrolled .main-logo {
          position: relative !important;
          inset: auto !important;
          display: block !important;
          width: 56px !important;
          height: 56px !important;
          min-width: 56px !important;
          min-height: 56px !important;
          max-width: 56px !important;
          max-height: 56px !important;
          margin: 0 !important;
          padding: 0 !important;
          border-radius: 50% !important;
          object-fit: contain !important;
          background: transparent !important;
          box-shadow: none !important;
          overflow: hidden !important;
          transform: none !important;
          translate: none !important;
          scale: 1 !important;
          animation: none !important;
          transition: none !important;
          filter: none !important;
        }

        #site-header .logo-wrapper,
        .site-header .logo-wrapper,
        #site-header.is-scrolled .logo-wrapper,
        .site-header.is-scrolled .logo-wrapper {
          display: grid !important;
          place-items: center !important;
        }

        #site-header .nav-bar-container,
        .site-header .nav-bar-container,
        #site-header.is-scrolled .nav-bar-container,
        .site-header.is-scrolled .nav-bar-container {
          grid-column: 3 !important;
          justify-self: end !important;
          align-self: center !important;
          position: relative !important;
          inset: auto !important;
          width: 56px !important;
          height: 56px !important;
          min-width: 56px !important;
          min-height: 56px !important;
          max-width: 56px !important;
          max-height: 56px !important;
          margin: 0 !important;
          padding: 0 !important;
          display: grid !important;
          place-items: center !important;
          border: 0 !important;
          border-radius: 0 !important;
          background: transparent !important;
          background-image: none !important;
          box-shadow: none !important;
          overflow: hidden !important;
          transform: none !important;
          translate: none !important;
          scale: 1 !important;
          animation: none !important;
          transition: none !important;
        }

        #site-header .nav-bar-container::before,
        #site-header .nav-bar-container::after,
        .site-header .nav-bar-container::before,
        .site-header .nav-bar-container::after {
          content: none !important;
          display: none !important;
        }

        #hamburger-btn,
        .hamburger-btn,
        #site-header.is-scrolled #hamburger-btn,
        .site-header.is-scrolled .hamburger-btn {
          position: relative !important;
          inset: auto !important;
          display: grid !important;
          place-items: center !important;
          width: 56px !important;
          height: 56px !important;
          min-width: 56px !important;
          min-height: 56px !important;
          max-width: 56px !important;
          max-height: 56px !important;
          margin: 0 !important;
          padding: 0 !important;
          border-radius: 50% !important;
          border: 2px solid #050504 !important;
          background: #050504 !important;
          background-image: none !important;
          color: transparent !important;
          font-size: 0 !important;
          line-height: 0 !important;
          letter-spacing: 0 !important;
          text-indent: 0 !important;
          box-shadow: none !important;
          overflow: hidden !important;
          transform: none !important;
          translate: none !important;
          scale: 1 !important;
          animation: none !important;
          transition: none !important;
          will-change: auto !important;
          contain: layout paint style !important;
        }

        #hamburger-btn::before,
        #hamburger-btn::after,
        .hamburger-btn::before,
        .hamburger-btn::after {
          content: none !important;
          display: none !important;
        }

        #hamburger-btn .hamburger-stack,
        .hamburger-btn .hamburger-stack {
          position: relative !important;
          z-index: 5 !important;
          width: 24px !important;
          height: 18px !important;
          min-width: 24px !important;
          min-height: 18px !important;
          max-width: 24px !important;
          max-height: 18px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          transform: none !important;
          translate: none !important;
          scale: 1 !important;
          animation: none !important;
          transition: none !important;
        }

        #hamburger-btn .hamburger-line,
        .hamburger-btn .hamburger-line {
          display: block !important;
          width: 24px !important;
          height: 3px !important;
          min-height: 3px !important;
          max-height: 3px !important;
          margin: 0 !important;
          padding: 0 !important;
          border-radius: 999px !important;
          background: #fffaf0 !important;
          box-shadow: none !important;
          transform: none !important;
          translate: none !important;
          scale: 1 !important;
          animation: none !important;
          transition: none !important;
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
          top: 94px !important;
          right: 16px !important;
          left: auto !important;
          width: min(390px, calc(100vw - 32px)) !important;
          max-height: calc(100svh - 110px) !important;
          border-radius: 28px !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          transform: translate3d(0, -12px, 0) scale(.98) !important;
          transition: opacity .22s ease, transform .22s ease, visibility .22s ease !important;
        }

        #drawer.open,
        .drawer.open {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
          transform: translate3d(0, 0, 0) scale(1) !important;
        }
      }

      @media (max-width: 360px) {
        html {
          scroll-padding-top: 78px !important;
        }

        body {
          padding-top: 78px !important;
        }

        #site-header,
        .site-header,
        #site-header.is-scrolled,
        .site-header.is-scrolled,
        #site-header .header-container,
        .site-header .header-container,
        #site-header.is-scrolled .header-container,
        .site-header.is-scrolled .header-container {
          height: 78px !important;
          min-height: 78px !important;
          max-height: 78px !important;
        }

        #site-header .brand-group,
        .site-header .brand-group,
        #site-header.is-scrolled .brand-group,
        .site-header.is-scrolled .brand-group,
        #site-header .logo-wrapper,
        .site-header .logo-wrapper,
        #site-header.is-scrolled .logo-wrapper,
        .site-header.is-scrolled .logo-wrapper,
        #site-header .main-logo,
        .site-header .main-logo,
        #site-header.is-scrolled .main-logo,
        .site-header.is-scrolled .main-logo,
        #site-header .nav-bar-container,
        .site-header .nav-bar-container,
        #site-header.is-scrolled .nav-bar-container,
        .site-header.is-scrolled .nav-bar-container,
        #hamburger-btn,
        .hamburger-btn,
        #site-header.is-scrolled #hamburger-btn,
        .site-header.is-scrolled .hamburger-btn {
          width: 52px !important;
          height: 52px !important;
          min-width: 52px !important;
          min-height: 52px !important;
          max-width: 52px !important;
          max-height: 52px !important;
        }

        #drawer,
        .drawer {
          top: 90px !important;
          right: 14px !important;
          width: min(390px, calc(100vw - 28px)) !important;
        }
      }
    `;
  }

  function observeHamburger() {
    const header = document.querySelector("#site-header, .site-header");
    if (!header || header.dataset.casaHamburgerObserver === "true") return;

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(buildSingleHamburger);
    });

    observer.observe(header, { childList: true, subtree: true });
    header.dataset.casaHamburgerObserver = "true";
  }

  function run() {
    closeDrawerAtStartupOnly();
    buildSingleHamburger();
    installStyles();
    observeHamburger();
  }

  run();
  window.setTimeout(run, 50);
  window.setTimeout(run, 150);
  window.setTimeout(run, 400);
  window.setTimeout(run, 900);
  window.setTimeout(run, 1600);
})();