/* =========================================================
   CASABLANCA FINAL SPACING FIXES
   Purpose: Left-centered paragraph alignment for selected content blocks
   and full-width mobile nav balance with equal logo/hamburger sizing.
   ========================================================= */
(function () {
  function installFinalSpacingStyles() {
    let style = document.getElementById("casablancaFinalSpacingFixes");
    if (!style) {
      style = document.createElement("style");
      style.id = "casablancaFinalSpacingFixes";
    }

    style.textContent = `
      /* =========================================================
         LEFT-CENTERED CONTENT ALIGNMENT
         Text stays left-aligned, while the content block remains centered.
      ========================================================== */
      #welcome .narrow-shell {
        text-align: left !important;
        max-width: min(980px, calc(100% - clamp(1.25rem, 6vw, 6rem))) !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      #welcome .title-lg,
      #welcome .intro-lead {
        text-align: left !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      #welcome .intro-lead {
        max-width: 930px !important;
      }

      .private-estate-card-section .estate-summary-card {
        text-align: left !important;
      }

      .private-estate-card-section .estate-summary-card > .eyebrow.center {
        justify-content: flex-start !important;
        text-align: left !important;
      }

      .private-estate-card-section .estate-summary-card > .eyebrow.center::after {
        display: none !important;
      }

      .private-estate-card-section .estate-summary-card > .title-lg,
      .private-estate-card-section .estate-summary-card > .lead {
        text-align: left !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      .private-estate-card-section .estate-summary-card > .lead {
        max-width: 980px !important;
      }

      #sleeping-layout .floorplan-grid > .reveal:first-child,
      #sleeping-layout .floorplan-grid > .reveal:first-child .eyebrow,
      #sleeping-layout .floorplan-grid > .reveal:first-child .title-lg,
      #sleeping-layout .floorplan-grid > .reveal:first-child .lead {
        text-align: left !important;
      }

      #sleeping-layout .floorplan-grid > .reveal:first-child .lead {
        max-width: 720px !important;
        margin-left: 0 !important;
        margin-right: auto !important;
      }

      /* =========================================================
         FULL-WIDTH FLOATING MOBILE NAV
         Logo and hamburger are exactly the same visual size.
      ========================================================== */
      @media (max-width: 1023px) {
        body {
          padding-top: 82px !important;
        }

        .site-header,
        .site-header.is-scrolled {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          width: 100vw !important;
          height: 82px !important;
          min-height: 82px !important;
          max-height: 82px !important;
          padding: 0 !important;
          margin: 0 !important;
          border-radius: 0 0 22px 22px !important;
          background: rgba(255,250,240,.992) !important;
          background-image: linear-gradient(180deg, rgba(255,253,247,.995), rgba(246,239,227,.98)) !important;
          border: 0 !important;
          border-bottom: 1px solid rgba(185,138,56,.26) !important;
          box-shadow: 0 14px 30px rgba(58,40,18,.12) !important;
          overflow: hidden !important;
          transform: none !important;
          backdrop-filter: blur(12px) !important;
          z-index: 9999 !important;
        }

        .header-container,
        .site-header.is-scrolled .header-container {
          width: 100% !important;
          height: 82px !important;
          min-height: 82px !important;
          max-height: 82px !important;
          display: grid !important;
          grid-template-columns: 56px 1fr 56px !important;
          align-items: center !important;
          column-gap: 0 !important;
          padding: 0 16px !important;
          margin: 0 auto !important;
          justify-content: normal !important;
          overflow: hidden !important;
          position: relative !important;
          transform: none !important;
        }

        .nav-list,
        .nav-left,
        .nav-right,
        .desktop-nav,
        .desktop-only {
          display: none !important;
        }

        .brand-group,
        .site-header.is-scrolled .brand-group {
          grid-column: 1 !important;
          justify-self: start !important;
          align-self: center !important;
          position: relative !important;
          top: auto !important;
          left: auto !important;
          width: 56px !important;
          height: 56px !important;
          min-width: 56px !important;
          min-height: 56px !important;
          max-width: 56px !important;
          max-height: 56px !important;
          margin: 0 !important;
          padding: 0 !important;
          transform: none !important;
          z-index: 3 !important;
          overflow: hidden !important;
          pointer-events: auto !important;
          border-radius: 50% !important;
        }

        .logo-wrapper,
        .site-header.is-scrolled .logo-wrapper {
          width: 56px !important;
          height: 56px !important;
          min-width: 56px !important;
          min-height: 56px !important;
          max-width: 56px !important;
          max-height: 56px !important;
          border-radius: 50% !important;
          display: grid !important;
          place-items: center !important;
          background: transparent !important;
          box-shadow: none !important;
          overflow: hidden !important;
          transform: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .main-logo,
        .site-header.is-scrolled .main-logo {
          width: 56px !important;
          height: 56px !important;
          min-width: 56px !important;
          min-height: 56px !important;
          max-width: 56px !important;
          max-height: 56px !important;
          object-fit: contain !important;
          display: block !important;
          margin: 0 !important;
          padding: 0 !important;
          transform: none !important;
          filter: none !important;
        }

        .nav-bar-container,
        .site-header.is-scrolled .nav-bar-container {
          grid-column: 3 !important;
          justify-self: end !important;
          align-self: center !important;
          display: grid !important;
          place-items: center !important;
          width: 56px !important;
          min-width: 56px !important;
          max-width: 56px !important;
          height: 56px !important;
          min-height: 56px !important;
          max-height: 56px !important;
          margin: 0 !important;
          padding: 0 !important;
          transform: none !important;
          overflow: hidden !important;
        }

        #hamburger-btn,
        .hamburger-btn,
        .site-header.is-scrolled #hamburger-btn,
        .site-header.is-scrolled .hamburger-btn {
          width: 56px !important;
          height: 56px !important;
          min-width: 56px !important;
          min-height: 56px !important;
          max-width: 56px !important;
          max-height: 56px !important;
          border-radius: 50% !important;
          border: 2px solid rgba(12,12,11,.96) !important;
          background: #050504 !important;
          color: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
          display: grid !important;
          place-items: center !important;
          position: relative !important;
          overflow: hidden !important;
          text-indent: 0 !important;
          font-size: 0 !important;
          line-height: 0 !important;
          letter-spacing: 0 !important;
          transform: none !important;
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
          z-index: 4 !important;
          width: 24px !important;
          height: 18px !important;
          min-width: 24px !important;
          min-height: 18px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          transform: none !important;
        }

        #hamburger-btn .hamburger-line,
        .hamburger-btn .hamburger-line {
          display: block !important;
          width: 24px !important;
          height: 3px !important;
          min-height: 3px !important;
          border-radius: 999px !important;
          background: #fffaf0 !important;
          box-shadow: none !important;
          margin: 0 !important;
          padding: 0 !important;
          transform: none !important;
        }

        .drawer,
        .drawer.open {
          top: 94px !important;
          right: 16px !important;
          left: auto !important;
          width: min(390px, calc(100vw - 32px)) !important;
          max-height: calc(100svh - 110px) !important;
          border-radius: 28px !important;
          background: rgba(255,250,240,.985) !important;
        }
      }

      @media (max-width: 360px) {
        body {
          padding-top: 78px !important;
        }

        .site-header,
        .site-header.is-scrolled,
        .header-container,
        .site-header.is-scrolled .header-container {
          height: 78px !important;
          min-height: 78px !important;
          max-height: 78px !important;
        }

        .header-container,
        .site-header.is-scrolled .header-container {
          grid-template-columns: 52px 1fr 52px !important;
          padding-left: 14px !important;
          padding-right: 14px !important;
        }

        .brand-group,
        .site-header.is-scrolled .brand-group,
        .logo-wrapper,
        .site-header.is-scrolled .logo-wrapper,
        .main-logo,
        .site-header.is-scrolled .main-logo,
        .nav-bar-container,
        .site-header.is-scrolled .nav-bar-container,
        #hamburger-btn,
        .hamburger-btn,
        .site-header.is-scrolled #hamburger-btn,
        .site-header.is-scrolled .hamburger-btn {
          width: 52px !important;
          height: 52px !important;
          min-width: 52px !important;
          min-height: 52px !important;
          max-width: 52px !important;
          max-height: 52px !important;
        }

        .drawer,
        .drawer.open {
          top: 90px !important;
          right: 14px !important;
          width: min(390px, calc(100vw - 28px)) !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  installFinalSpacingStyles();
  window.setTimeout(installFinalSpacingStyles, 60);
  window.setTimeout(installFinalSpacingStyles, 180);
  window.setTimeout(installFinalSpacingStyles, 500);
  window.setTimeout(installFinalSpacingStyles, 1200);
  window.setInterval(installFinalSpacingStyles, 1600);
})();