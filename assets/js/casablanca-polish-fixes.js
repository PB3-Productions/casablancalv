/* =========================================================
   CASABLANCA POLISH FIXES
   Purpose: Post-refresh override for buttons, header/logo stability,
   cloche tray icons, Matterport privacy removal, footer readability,
   and mobile floating nav consistency.
   ========================================================= */
(function () {
  const NEW_LOGO_URL = "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a20dd265cd41fa7c6b88dfa.webp";

  function syncLogos() {
    document
      .querySelectorAll(".main-logo, .drawer-logo, .footer-brand-block img, .site-footer-luxury img, .logo-wrapper img")
      .forEach((image) => {
        image.src = NEW_LOGO_URL;
        image.srcset = `${NEW_LOGO_URL} 800w`;
        image.sizes = "(max-width: 1023px) 44vw, 300px";
        image.alt = "Casablanca Las Vegas";
      });
  }

  function removePrivateMatterport() {
    document.querySelectorAll("#matterport, .drawer-nav a[href='#matterport'], .nav-link[href='#matterport']").forEach((node) => node.remove());
  }

  function installStyles() {
    let style = document.getElementById("casablancaPolishFixes");
    if (!style) {
      style = document.createElement("style");
      style.id = "casablancaPolishFixes";
    }

    style.textContent = `
      :root {
        --casa-ivory: #fffaf0;
        --casa-cream: #f6efe3;
        --casa-ink: #18140f;
        --casa-text: #30291f;
        --casa-muted: #665f55;
        --casa-green: #0d3a2f;
        --casa-gold: #b98a38;
        --casa-gold-light: #f3d990;
        --casa-button-black: #050504;
      }

      /* PRIVATE MATTERPORT / ADDRESS PROTECTION */
      #matterport,
      .drawer-nav a[href="#matterport"],
      .nav-link[href="#matterport"] {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }

      /* GLOBAL READABILITY ON LIGHT MEDITERRANEAN BACKGROUND */
      body,
      .section,
      .section.bg-dark,
      .section.bg-ivory,
      .section.bg-cream,
      .hero-intro-section,
      .pricing-black-section,
      .concierge-luxury-section,
      .floorplan-section,
      .map-positioning-section {
        color: var(--casa-text) !important;
      }

      p,
      li,
      .lead,
      .lead.light,
      .feature-list li,
      .luxury-feature-list li,
      .feature-list li span:not(.gold-svg-icon),
      .luxury-feature-list li span:not(.gold-svg-icon),
      .card-dark p,
      .mini-card p,
      .price-card .count,
      .concierge-option p,
      .policy-grid p,
      .footer-cta-card p,
      .footer-links-card a {
        color: var(--casa-text) !important;
      }

      .title-lg,
      .title-md,
      .title-sm,
      .font-display,
      h1,
      h2,
      h3,
      h4 {
        color: var(--casa-ink) !important;
      }

      .eyebrow,
      .eyebrow.center,
      .mini-card h3,
      .concierge-option h3,
      .price-card h3 {
        color: #9a691f !important;
      }

      /* RESTORE VISIBLE GLOSSY BUTTONS */
      .nav-link,
      .btn,
      .btn-gold,
      .btn-outline,
      .gallery-btn,
      .video-control,
      .drawer-actions a,
      .intro-button-row a,
      .footer-button-row a,
      button[type="submit"],
      #submitBooking {
        position: relative !important;
        isolation: isolate !important;
        overflow: hidden !important;
        color: #f8e7b5 !important;
        text-shadow: 0 1px 0 rgba(0,0,0,.75), 0 0 10px rgba(243,217,144,.18) !important;
        background:
          radial-gradient(circle at 50% 0%, rgba(255,255,255,.18), transparent 42%),
          linear-gradient(180deg, #1b1a15 0%, #050504 48%, #11100d 100%) !important;
        border: 1px solid rgba(243,217,144,.72) !important;
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,.22),
          inset 0 -2px 0 rgba(0,0,0,.88),
          0 0 0 1px rgba(104,69,22,.42),
          0 .55rem 1.25rem rgba(62,45,20,.16) !important;
        text-decoration: none !important;
      }

      .nav-link::before,
      .btn::before,
      .gallery-btn::before,
      .video-control::before,
      .drawer-actions a::before,
      .intro-button-row a::before,
      .footer-button-row a::before,
      button[type="submit"]::before,
      #submitBooking::before {
        content: "" !important;
        position: absolute !important;
        inset: 2px 4px auto 4px !important;
        height: 46% !important;
        z-index: -1 !important;
        border-radius: inherit !important;
        background: linear-gradient(180deg, rgba(255,255,255,.30), rgba(255,255,255,.05)) !important;
        pointer-events: none !important;
      }

      .nav-link::after,
      .btn::after,
      .gallery-btn::after,
      .video-control::after,
      .drawer-actions a::after,
      .intro-button-row a::after,
      .footer-button-row a::after,
      button[type="submit"]::after,
      #submitBooking::after {
        content: "" !important;
        position: absolute !important;
        top: -85% !important;
        left: -92% !important;
        width: 56% !important;
        height: 250% !important;
        z-index: -1 !important;
        background: linear-gradient(115deg, transparent 0%, rgba(255,255,255,.16) 30%, rgba(255,255,255,.76) 50%, rgba(255,255,255,.13) 70%, transparent 100%) !important;
        transform: rotate(18deg) !important;
        opacity: .76 !important;
        pointer-events: none !important;
        transition: left .55s ease !important;
      }

      .nav-link:hover,
      .nav-link:focus-visible,
      .btn:hover,
      .btn:focus-visible,
      .gallery-btn:hover,
      .gallery-btn:focus-visible,
      .video-control:hover,
      .video-control:focus-visible,
      .drawer-actions a:hover,
      .drawer-actions a:focus-visible,
      button[type="submit"]:hover,
      button[type="submit"]:focus-visible,
      #submitBooking:hover,
      #submitBooking:focus-visible {
        color: #fff4cd !important;
        background:
          radial-gradient(circle at 50% 0%, rgba(255,255,255,.24), transparent 44%),
          linear-gradient(180deg, #29271f 0%, #070604 46%, #17150f 100%) !important;
        filter: brightness(1.08) saturate(1.08) !important;
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,.30),
          inset 0 -2px 0 rgba(0,0,0,.9),
          0 0 0 1px rgba(104,69,22,.44),
          0 0 .95rem rgba(243,217,144,.32),
          0 .7rem 1.4rem rgba(62,45,20,.18) !important;
      }

      .nav-link:hover::after,
      .nav-link:focus-visible::after,
      .btn:hover::after,
      .btn:focus-visible::after,
      .gallery-btn:hover::after,
      .gallery-btn:focus-visible::after,
      .video-control:hover::after,
      .video-control:focus-visible::after,
      .drawer-actions a:hover::after,
      .drawer-actions a:focus-visible::after,
      button[type="submit"]:hover::after,
      button[type="submit"]:focus-visible::after,
      #submitBooking:hover::after,
      #submitBooking:focus-visible::after {
        left: 132% !important;
      }

      .nav-link:active,
      .btn:active,
      .drawer-actions a:active,
      button[type="submit"]:active,
      #submitBooking:active {
        transform: translateY(1px) !important;
        filter: brightness(.98) !important;
      }

      /* HEADER / LOGO STABILITY */
      .site-header,
      .site-header.is-scrolled {
        background: rgba(255,250,240,.98) !important;
        background-image: linear-gradient(180deg, rgba(255,253,247,.99), rgba(246,239,227,.97)) !important;
        border-bottom: 1px solid rgba(185,138,56,.28) !important;
        box-shadow: 0 16px 34px rgba(58,40,18,.13) !important;
        transform: none !important;
      }

      .header-container,
      .site-header.is-scrolled .header-container {
        position: relative !important;
        transform: none !important;
      }

      @media (min-width: 1024px) {
        .site-header,
        .site-header.is-scrolled {
          min-height: 122px !important;
          height: 122px !important;
          overflow: visible !important;
        }

        .header-container,
        .site-header.is-scrolled .header-container {
          max-width: min(1520px, calc(100% - 5vw)) !important;
          min-height: 122px !important;
          height: 122px !important;
          margin: 0 auto !important;
          padding: 0 !important;
          overflow: visible !important;
        }

        .nav-bar-container,
        .site-header.is-scrolled .nav-bar-container {
          display: grid !important;
          grid-template-columns: minmax(0, 1fr) clamp(238px, 16vw, 305px) minmax(0, 1fr) !important;
          min-height: 122px !important;
          height: 122px !important;
          align-items: center !important;
          column-gap: clamp(.38rem, .8vw, .92rem) !important;
          transform: none !important;
        }

        .brand-group,
        .site-header.is-scrolled .brand-group {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          width: clamp(235px, 16vw, 305px) !important;
          height: clamp(118px, 8vw, 154px) !important;
          transform: translate(-50%, -50%) !important;
          z-index: 60 !important;
          overflow: visible !important;
        }

        .logo-wrapper,
        .site-header.is-scrolled .logo-wrapper {
          position: relative !important;
          top: auto !important;
          left: auto !important;
          display: grid !important;
          place-items: center !important;
          width: 100% !important;
          height: 100% !important;
          transform: none !important;
          overflow: visible !important;
        }

        .main-logo,
        .site-header.is-scrolled .main-logo {
          width: clamp(230px, 15.6vw, 298px) !important;
          max-width: none !important;
          height: auto !important;
          transform: none !important;
          filter: drop-shadow(0 13px 16px rgba(63,47,28,.20)) !important;
        }

        .nav-left,
        .site-header.is-scrolled .nav-left {
          grid-column: 1 !important;
          justify-self: end !important;
          padding-right: clamp(.28rem, .65vw, .9rem) !important;
        }

        .nav-right,
        .site-header.is-scrolled .nav-right {
          grid-column: 3 !important;
          justify-self: start !important;
          padding-left: clamp(.28rem, .65vw, .9rem) !important;
        }

        .nav-left,
        .nav-right,
        .site-header.is-scrolled .nav-left,
        .site-header.is-scrolled .nav-right {
          gap: clamp(.56rem, .82vw, 1rem) !important;
        }

        .nav-link,
        .site-header.is-scrolled .nav-link {
          min-width: clamp(108px, 7vw, 142px) !important;
          padding: .82rem clamp(.9rem, 1.05vw, 1.24rem) !important;
          font-size: clamp(.66rem, .62vw, .78rem) !important;
          letter-spacing: .14em !important;
          text-align: center !important;
          border-radius: 999px !important;
        }
      }

      /* MOBILE: SOLID FLOATING HEADER, NO RESIZE ON SCROLL */
      @media (max-width: 1023px) {
        .site-header,
        .site-header.is-scrolled {
          position: fixed !important;
          top: max(10px, env(safe-area-inset-top)) !important;
          left: 12px !important;
          right: 12px !important;
          width: auto !important;
          height: 76px !important;
          min-height: 76px !important;
          max-height: 76px !important;
          border-radius: 999px !important;
          background: #fffaf0 !important;
          background-image: linear-gradient(180deg, #fffdf7, #f6efe3) !important;
          border: 1px solid rgba(185,138,56,.34) !important;
          box-shadow: 0 14px 34px rgba(58,40,18,.16) !important;
          overflow: visible !important;
          transform: none !important;
        }

        .header-container,
        .site-header.is-scrolled .header-container {
          height: 76px !important;
          min-height: 76px !important;
          max-height: 76px !important;
          padding: 0 .9rem 0 1rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          transform: none !important;
        }

        .brand-group,
        .site-header.is-scrolled .brand-group {
          position: relative !important;
          top: auto !important;
          left: auto !important;
          width: clamp(150px, 46vw, 188px) !important;
          height: 66px !important;
          transform: none !important;
          z-index: 3 !important;
        }

        .logo-wrapper,
        .site-header.is-scrolled .logo-wrapper {
          position: relative !important;
          inset: auto !important;
          width: 100% !important;
          height: 66px !important;
          display: grid !important;
          place-items: center !important;
          transform: none !important;
        }

        .main-logo,
        .site-header.is-scrolled .main-logo {
          width: clamp(148px, 44vw, 184px) !important;
          max-width: 100% !important;
          height: auto !important;
          transform: none !important;
        }

        .nav-bar-container,
        .site-header.is-scrolled .nav-bar-container {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-end !important;
          width: auto !important;
          height: 76px !important;
          min-height: 76px !important;
          margin-left: auto !important;
          transform: none !important;
        }

        .hamburger-btn,
        .site-header.is-scrolled .hamburger-btn {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 48px !important;
          height: 48px !important;
          min-width: 48px !important;
          border-radius: 999px !important;
          color: #f8e7b5 !important;
          background:
            radial-gradient(circle at 50% 0%, rgba(255,255,255,.20), transparent 42%),
            linear-gradient(180deg, #1b1a15 0%, #050504 52%, #11100d 100%) !important;
          border: 1px solid rgba(243,217,144,.72) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.24), 0 .45rem 1rem rgba(62,45,20,.16) !important;
          font-size: 1.55rem !important;
          line-height: 1 !important;
          transform: none !important;
        }

        .drawer,
        .drawer.open {
          background: rgba(255,250,240,.985) !important;
          color: var(--casa-ink) !important;
        }

        .drawer-actions .btn,
        .drawer-actions a {
          width: 100% !important;
          justify-content: center !important;
          color: #f8e7b5 !important;
        }
      }

      /* TRUE CLOCHE / SERVING-TRAY ICONS WITH KNOB */
      .gold-svg-icon {
        position: relative !important;
        display: inline-grid !important;
        place-items: center !important;
        width: 2.9rem !important;
        height: 2.9rem !important;
        min-width: 2.9rem !important;
        border-radius: 999px !important;
        color: var(--casa-gold) !important;
        background: rgba(255,250,240,.94) !important;
        border: 1px solid rgba(185,138,56,.36) !important;
        box-shadow: 0 12px 28px rgba(63,47,28,.10), inset 0 1px 0 rgba(255,255,255,.82) !important;
      }

      .gold-svg-icon svg {
        display: none !important;
      }

      .gold-svg-icon::before {
        content: "" !important;
        position: absolute !important;
        top: 1.03rem !important;
        left: 50% !important;
        width: 1.36rem !important;
        height: .72rem !important;
        border: 2px solid currentColor !important;
        border-bottom: 0 !important;
        border-radius: 1.36rem 1.36rem 0 0 !important;
        transform: translateX(-50%) !important;
        background: transparent !important;
      }

      .gold-svg-icon::after {
        content: "" !important;
        position: absolute !important;
        top: .72rem !important;
        left: 50% !important;
        width: 1.62rem !important;
        height: 1.18rem !important;
        transform: translateX(-50%) !important;
        background:
          radial-gradient(circle at 50% 10%, currentColor 0 2.35px, transparent 2.6px),
          linear-gradient(currentColor, currentColor) 50% 100% / 100% 2px no-repeat !important;
      }

      .feature-list,
      .luxury-feature-list {
        color: var(--casa-text) !important;
      }

      .feature-list li,
      .luxury-feature-list li {
        color: var(--casa-text) !important;
      }

      .card-dark,
      .p-card,
      .mini-card,
      .icon-card,
      .concierge-option,
      .price-card {
        background: rgba(255,250,240,.96) !important;
      }

      /* FOOTER READABILITY: NO UNREADABLE WHITE ON LIGHT SECTIONS */
      .site-footer,
      .site-footer-luxury,
      footer {
        background: #f1e5d2 !important;
        background-image: linear-gradient(180deg, #fffaf0, #eadcc8) !important;
        color: var(--casa-ink) !important;
        border-top: 1px solid rgba(185,138,56,.28) !important;
      }

      .site-footer *,
      .site-footer-luxury *,
      footer * {
        color: var(--casa-ink) !important;
      }

      .site-footer .btn,
      .site-footer-luxury .btn,
      footer .btn,
      .site-footer a.btn,
      footer a.btn {
        color: #f8e7b5 !important;
      }

      .footer-links-card a:not(.btn) {
        color: var(--casa-green) !important;
      }
    `;

    document.head.appendChild(style);
  }

  function runFixes() {
    syncLogos();
    removePrivateMatterport();
    installStyles();
  }

  runFixes();
  window.setTimeout(runFixes, 150);
  window.setTimeout(runFixes, 500);
  window.setTimeout(runFixes, 1200);
  window.setInterval(runFixes, 1800);
})();