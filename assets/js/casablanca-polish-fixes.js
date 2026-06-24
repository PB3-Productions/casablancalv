/* =========================================================
   CASABLANCA POLISH FIXES
   Purpose: Final override for premium button shine, stable header/logo,
   true mobile hamburger, private Matterport removal, icons, and readability.
   ========================================================= */
(function () {
  const NEW_LOGO_URL = "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a20dd265cd41fa7c6b88dfa.webp";

  function syncLogos() {
    document
      .querySelectorAll(".main-logo, .drawer-logo, .footer-brand-block img, .site-footer-luxury img, .logo-wrapper img")
      .forEach((image) => {
        image.src = NEW_LOGO_URL;
        image.srcset = `${NEW_LOGO_URL} 800w`;
        image.sizes = "(max-width: 1023px) 132px, 390px";
        image.alt = "Casablanca Las Vegas";
      });
  }

  function removePrivateMatterport() {
    document
      .querySelectorAll("#matterport, .drawer-nav a[href='#matterport'], .nav-link[href='#matterport']")
      .forEach((node) => node.remove());
  }

  function buildTrueHamburger() {
    document.querySelectorAll("#hamburger-btn, .hamburger-btn").forEach((button) => {
      button.dataset.casaHamburgerReady = "true";
      button.setAttribute("aria-label", "Open Casablanca Las Vegas menu");
      button.innerHTML = `
        <span class="hamburger-stack" aria-hidden="true">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </span>
      `;
    });
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
        --casa-green: #0d3a2f;
        --casa-gold: #b98a38;
        --casa-gold-light: #f3d990;
      }

      #matterport,
      .drawer-nav a[href="#matterport"],
      .nav-link[href="#matterport"] {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }

      body,
      .section,
      .section.bg-dark,
      .section.bg-ivory,
      .section.bg-cream,
      .hero-intro-section,
      .pricing-black-section,
      .concierge-luxury-section,
      .floorplan-section,
      .map-positioning-section,
      .site-footer,
      .site-footer-luxury,
      footer {
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

      /* Premium glossy black/gold button system with original-style hover flash */
      .nav-link,
      .btn,
      .btn-gold,
      .btn-outline,
      .gallery-btn,
      .video-control,
      .drawer-actions a,
      .drawer-actions .btn,
      .intro-button-row a,
      .footer-button-row a,
      button[type="submit"],
      #submitBooking {
        position: relative !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-sizing: border-box !important;
        isolation: isolate !important;
        min-height: 46px !important;
        padding: .82rem clamp(1.05rem, 1.35vw, 1.45rem) !important;
        overflow: hidden !important;
        border-radius: 999px !important;
        color: #fff1c3 !important;
        background:
          radial-gradient(ellipse at 50% 0%, rgba(255,255,255,.25) 0%, rgba(255,255,255,.11) 32%, transparent 62%),
          linear-gradient(180deg, #2b2a24 0%, #12100c 38%, #030302 63%, #15130f 100%) !important;
        border: 1px solid rgba(243,217,144,.82) !important;
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,.34),
          inset 0 -2px 0 rgba(0,0,0,.92),
          inset 0 0 0 1px rgba(126,87,29,.36),
          0 0 0 1px rgba(96,67,24,.34),
          0 .55rem 1.25rem rgba(62,45,20,.17) !important;
        font-weight: 800 !important;
        line-height: 1 !important;
        letter-spacing: .115em !important;
        text-align: center !important;
        text-decoration: none !important;
        text-shadow: 0 1px 0 rgba(0,0,0,.86), 0 0 10px rgba(243,217,144,.18) !important;
        white-space: nowrap !important;
        transform: translateZ(0) !important;
        transition: filter .22s ease, box-shadow .22s ease, transform .22s ease !important;
      }

      .nav-link > *,
      .btn > *,
      .gallery-btn > *,
      .video-control > *,
      .drawer-actions a > *,
      .intro-button-row a > *,
      .footer-button-row a > *,
      button[type="submit"] > *,
      #submitBooking > * {
        position: relative !important;
        z-index: 2 !important;
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
        top: -82% !important;
        left: -92% !important;
        z-index: 1 !important;
        width: 58% !important;
        height: 270% !important;
        background: linear-gradient(115deg, transparent 0%, rgba(255,255,255,.08) 28%, rgba(255,255,255,.78) 49%, rgba(255,255,255,.12) 68%, transparent 100%) !important;
        transform: rotate(18deg) !important;
        opacity: .82 !important;
        pointer-events: none !important;
        transition: left .62s cubic-bezier(.22, 1, .36, 1) !important;
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
        content: none !important;
        display: none !important;
      }

      .nav-link:hover::before,
      .nav-link:focus-visible::before,
      .btn:hover::before,
      .btn:focus-visible::before,
      .gallery-btn:hover::before,
      .gallery-btn:focus-visible::before,
      .video-control:hover::before,
      .video-control:focus-visible::before,
      .drawer-actions a:hover::before,
      .drawer-actions a:focus-visible::before,
      .intro-button-row a:hover::before,
      .intro-button-row a:focus-visible::before,
      .footer-button-row a:hover::before,
      .footer-button-row a:focus-visible::before,
      button[type="submit"]:hover::before,
      button[type="submit"]:focus-visible::before,
      #submitBooking:hover::before,
      #submitBooking:focus-visible::before {
        left: 134% !important;
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
        color: #fff7d8 !important;
        filter: brightness(1.08) saturate(1.08) !important;
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,.42),
          inset 0 -2px 0 rgba(0,0,0,.94),
          inset 0 0 0 1px rgba(126,87,29,.40),
          0 0 0 1px rgba(96,67,24,.40),
          0 0 1rem rgba(243,217,144,.30),
          0 .7rem 1.45rem rgba(62,45,20,.20) !important;
      }

      .nav-link:active,
      .btn:active,
      .drawer-actions a:active,
      button[type="submit"]:active,
      #submitBooking:active {
        transform: translateY(1px) !important;
        filter: brightness(.98) !important;
      }

      .site-header,
      .site-header.is-scrolled {
        background: rgba(255,250,240,.985) !important;
        background-image: linear-gradient(180deg, rgba(255,253,247,.995), rgba(246,239,227,.975)) !important;
        border-bottom: 1px solid rgba(185,138,56,.28) !important;
        box-shadow: 0 16px 34px rgba(58,40,18,.13) !important;
        transform: none !important;
      }

      .header-container,
      .site-header.is-scrolled .header-container,
      .nav-bar-container,
      .site-header.is-scrolled .nav-bar-container,
      .brand-group,
      .site-header.is-scrolled .brand-group,
      .logo-wrapper,
      .site-header.is-scrolled .logo-wrapper,
      .main-logo,
      .site-header.is-scrolled .main-logo {
        transform-origin: center center !important;
      }

      @media (min-width: 1024px) {
        .site-header,
        .site-header.is-scrolled {
          min-height: 120px !important;
          height: 120px !important;
          overflow: visible !important;
        }

        .header-container,
        .site-header.is-scrolled .header-container {
          position: relative !important;
          max-width: min(1585px, calc(100% - 4vw)) !important;
          min-height: 120px !important;
          height: 120px !important;
          margin: 0 auto !important;
          padding: 0 !important;
          overflow: visible !important;
          transform: none !important;
        }

        .nav-bar-container,
        .site-header.is-scrolled .nav-bar-container {
          display: grid !important;
          grid-template-columns: minmax(0, 1fr) clamp(320px, 20vw, 405px) minmax(0, 1fr) !important;
          min-height: 120px !important;
          height: 120px !important;
          align-items: center !important;
          column-gap: clamp(.6rem, 1vw, 1.2rem) !important;
          transform: none !important;
        }

        .brand-group,
        .site-header.is-scrolled .brand-group {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          width: clamp(320px, 20vw, 405px) !important;
          height: clamp(160px, 10.2vw, 202px) !important;
          transform: translate(-50%, -30%) !important;
          z-index: 60 !important;
          overflow: visible !important;
          pointer-events: auto !important;
        }

        .logo-wrapper,
        .site-header.is-scrolled .logo-wrapper {
          position: relative !important;
          inset: auto !important;
          display: grid !important;
          place-items: center !important;
          width: 100% !important;
          height: 100% !important;
          transform: none !important;
          overflow: visible !important;
        }

        .main-logo,
        .site-header.is-scrolled .main-logo {
          display: block !important;
          width: clamp(310px, 19.4vw, 390px) !important;
          max-width: none !important;
          height: auto !important;
          max-height: none !important;
          object-fit: contain !important;
          transform: none !important;
          filter: drop-shadow(0 14px 17px rgba(63,47,28,.22)) !important;
        }

        .nav-left,
        .site-header.is-scrolled .nav-left {
          grid-column: 1 !important;
          justify-self: end !important;
          padding-right: clamp(.5rem, .85vw, 1.15rem) !important;
        }

        .nav-right,
        .site-header.is-scrolled .nav-right {
          grid-column: 3 !important;
          justify-self: start !important;
          padding-left: clamp(.5rem, .85vw, 1.15rem) !important;
        }

        .nav-left,
        .nav-right,
        .site-header.is-scrolled .nav-left,
        .site-header.is-scrolled .nav-right {
          gap: clamp(.6rem, .95vw, 1.08rem) !important;
          display: flex !important;
          align-items: center !important;
        }

        .nav-link,
        .site-header.is-scrolled .nav-link {
          min-width: clamp(120px, 7.6vw, 152px) !important;
          max-width: clamp(128px, 8.2vw, 164px) !important;
          padding: .86rem clamp(.86rem, .96vw, 1.16rem) !important;
          font-size: clamp(.68rem, .65vw, .82rem) !important;
          letter-spacing: .12em !important;
          text-align: center !important;
          border-radius: 999px !important;
        }
      }

      @media (max-width: 1023px) {
        .site-header,
        .site-header.is-scrolled {
          position: fixed !important;
          top: max(12px, env(safe-area-inset-top)) !important;
          left: 14px !important;
          right: 14px !important;
          width: auto !important;
          height: 78px !important;
          min-height: 78px !important;
          max-height: 78px !important;
          border-radius: 999px !important;
          background: #fffaf0 !important;
          background-image: linear-gradient(180deg, #fffdf7, #f6efe3) !important;
          border: 1px solid rgba(185,138,56,.34) !important;
          box-shadow: 0 14px 34px rgba(58,40,18,.16) !important;
          overflow: hidden !important;
          transform: none !important;
        }

        .header-container,
        .site-header.is-scrolled .header-container {
          height: 78px !important;
          min-height: 78px !important;
          max-height: 78px !important;
          padding: 0 .9rem 0 1.05rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          overflow: hidden !important;
          transform: none !important;
        }

        .brand-group,
        .site-header.is-scrolled .brand-group {
          position: relative !important;
          top: auto !important;
          left: auto !important;
          width: clamp(120px, 42vw, 138px) !important;
          height: 66px !important;
          max-height: 66px !important;
          transform: none !important;
          z-index: 3 !important;
          overflow: hidden !important;
        }

        .logo-wrapper,
        .site-header.is-scrolled .logo-wrapper {
          position: relative !important;
          inset: auto !important;
          width: 100% !important;
          height: 66px !important;
          max-height: 66px !important;
          display: grid !important;
          place-items: center !important;
          transform: none !important;
          overflow: hidden !important;
        }

        .main-logo,
        .site-header.is-scrolled .main-logo {
          display: block !important;
          width: clamp(116px, 40vw, 132px) !important;
          max-width: 100% !important;
          height: auto !important;
          max-height: 64px !important;
          object-fit: contain !important;
          transform: none !important;
          filter: drop-shadow(0 5px 8px rgba(63,47,28,.16)) !important;
        }

        .nav-bar-container,
        .site-header.is-scrolled .nav-bar-container {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-end !important;
          width: auto !important;
          height: 78px !important;
          min-height: 78px !important;
          margin-left: auto !important;
          transform: none !important;
        }

        .nav-list,
        .nav-left,
        .nav-right {
          display: none !important;
        }

        #hamburger-btn,
        .hamburger-btn,
        .site-header.is-scrolled #hamburger-btn,
        .site-header.is-scrolled .hamburger-btn {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 48px !important;
          height: 48px !important;
          min-width: 48px !important;
          padding: 0 !important;
          border-radius: 999px !important;
          color: transparent !important;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(255,255,255,.25) 0%, rgba(255,255,255,.11) 32%, transparent 62%),
            linear-gradient(180deg, #2b2a24 0%, #12100c 38%, #030302 63%, #15130f 100%) !important;
          border: 1px solid rgba(243,217,144,.78) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.3), inset 0 -2px 0 rgba(0,0,0,.88), 0 .45rem 1rem rgba(62,45,20,.16) !important;
          font-size: 0 !important;
          line-height: 0 !important;
          letter-spacing: 0 !important;
          text-indent: 0 !important;
          overflow: hidden !important;
          transform: none !important;
        }

        #hamburger-btn::before,
        #hamburger-btn::after,
        .hamburger-btn::before,
        .hamburger-btn::after {
          content: none !important;
          display: none !important;
        }

        .hamburger-stack {
          position: relative !important;
          z-index: 3 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 5px !important;
          width: 22px !important;
          height: 18px !important;
        }

        .hamburger-line {
          display: block !important;
          width: 22px !important;
          height: 2px !important;
          border-radius: 999px !important;
          background: #f8e7b5 !important;
          box-shadow: 0 1px 0 rgba(0,0,0,.8), 0 0 7px rgba(243,217,144,.22) !important;
        }

        .drawer,
        .drawer.open {
          top: calc(max(12px, env(safe-area-inset-top)) + 88px) !important;
          right: 14px !important;
          left: auto !important;
          width: min(390px, calc(100vw - 28px)) !important;
          background: rgba(255,250,240,.985) !important;
          color: var(--casa-ink) !important;
          border-radius: 28px !important;
        }

        .drawer-nav a {
          color: var(--casa-green) !important;
        }

        .drawer-actions {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: .82rem !important;
          padding: .6rem 1.25rem 1.35rem !important;
        }

        .drawer-actions .btn,
        .drawer-actions a {
          width: 100% !important;
          max-width: 100% !important;
          min-height: 50px !important;
          padding: .9rem 1rem !important;
          border-radius: 999px !important;
          justify-content: center !important;
          color: #fff1c3 !important;
          font-size: .76rem !important;
          letter-spacing: .085em !important;
          white-space: nowrap !important;
          box-sizing: border-box !important;
        }
      }

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
      .luxury-feature-list,
      .feature-list li,
      .luxury-feature-list li {
        color: var(--casa-text) !important;
      }

      .card-dark,
      .p-card,
      .mini-card,
      .icon-card,
      .concierge-option,
      .price-card,
      .footer-cta-card,
      .footer-links-card,
      .footer-brand-block {
        background: rgba(255,250,240,.96) !important;
        color: var(--casa-text) !important;
      }

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
      footer a.btn,
      .footer-button-row .btn,
      .footer-button-row a {
        color: #fff1c3 !important;
        border-radius: 999px !important;
        min-width: min(100%, 265px) !important;
      }

      .footer-button-row {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: .82rem !important;
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
    buildTrueHamburger();
    installStyles();
  }

  runFixes();
  window.setTimeout(runFixes, 60);
  window.setTimeout(runFixes, 160);
  window.setTimeout(runFixes, 420);
  window.setTimeout(runFixes, 1000);
  window.setInterval(runFixes, 1600);
})();