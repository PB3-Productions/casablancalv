/* =========================================================
   CASABLANCA FINAL SPACING FIXES
   Purpose: Left-centered paragraph alignment for selected content blocks
   and mobile nav balance between the logo and hamburger button.
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
         MOBILE NAV BALANCE
         Logo moves farther left; hamburger and logo get equal side spacing.
      ========================================================== */
      @media (max-width: 1023px) {
        .site-header,
        .site-header.is-scrolled {
          left: 14px !important;
          right: 14px !important;
          height: 78px !important;
          min-height: 78px !important;
          max-height: 78px !important;
          overflow: hidden !important;
        }

        .header-container,
        .site-header.is-scrolled .header-container {
          display: grid !important;
          grid-template-columns: minmax(116px, 136px) 1fr 48px !important;
          align-items: center !important;
          column-gap: 0 !important;
          height: 78px !important;
          min-height: 78px !important;
          max-height: 78px !important;
          padding-left: 14px !important;
          padding-right: 14px !important;
          justify-content: normal !important;
          overflow: hidden !important;
        }

        .brand-group,
        .site-header.is-scrolled .brand-group {
          grid-column: 1 !important;
          justify-self: start !important;
          position: relative !important;
          top: auto !important;
          left: auto !important;
          width: 132px !important;
          height: 66px !important;
          max-height: 66px !important;
          transform: none !important;
          overflow: hidden !important;
          margin: 0 !important;
        }

        .logo-wrapper,
        .site-header.is-scrolled .logo-wrapper {
          width: 132px !important;
          height: 66px !important;
          max-height: 66px !important;
          display: grid !important;
          place-items: center !important;
          overflow: hidden !important;
          transform: none !important;
        }

        .main-logo,
        .site-header.is-scrolled .main-logo {
          width: 128px !important;
          max-width: 128px !important;
          max-height: 64px !important;
          object-fit: contain !important;
          transform: none !important;
        }

        .nav-bar-container,
        .site-header.is-scrolled .nav-bar-container {
          grid-column: 3 !important;
          justify-self: end !important;
          display: flex !important;
          width: 48px !important;
          min-width: 48px !important;
          height: 78px !important;
          min-height: 78px !important;
          margin-left: 0 !important;
          align-items: center !important;
          justify-content: center !important;
        }

        #hamburger-btn,
        .hamburger-btn,
        .site-header.is-scrolled #hamburger-btn,
        .site-header.is-scrolled .hamburger-btn {
          width: 48px !important;
          height: 48px !important;
          min-width: 48px !important;
          margin: 0 !important;
          justify-self: end !important;
        }
      }

      @media (max-width: 340px) {
        .header-container,
        .site-header.is-scrolled .header-container {
          grid-template-columns: minmax(104px, 122px) 1fr 46px !important;
          padding-left: 12px !important;
          padding-right: 12px !important;
        }

        .brand-group,
        .site-header.is-scrolled .brand-group,
        .logo-wrapper,
        .site-header.is-scrolled .logo-wrapper {
          width: 118px !important;
        }

        .main-logo,
        .site-header.is-scrolled .main-logo {
          width: 114px !important;
          max-width: 114px !important;
        }

        #hamburger-btn,
        .hamburger-btn,
        .site-header.is-scrolled #hamburger-btn,
        .site-header.is-scrolled .hamburger-btn {
          width: 46px !important;
          height: 46px !important;
          min-width: 46px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  installFinalSpacingStyles();
  window.setTimeout(installFinalSpacingStyles, 100);
  window.setTimeout(installFinalSpacingStyles, 400);
  window.setTimeout(installFinalSpacingStyles, 1200);
  window.setInterval(installFinalSpacingStyles, 1800);
})();