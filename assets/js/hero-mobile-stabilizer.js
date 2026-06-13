/* =========================================================
   CASABLANCA MOBILE HERO TITLE PATCH
   Purpose: Enforce mobile line-height, font-size, wrap behavior, lower
   viewport scale floor, and correct the first-slide title-array bug.
   ========================================================= */
(function () {
  const mobileQuery = window.matchMedia("(max-width: 768px)");
  const firstTitle = "Off-Strip Paradise";
  const lastTitle = "Put Your Feet In the Sand";
  let syncTimer = null;

  if (!Array.prototype.__casablancaFirstHeroTitlePatch) {
    const nativeArrayToString = Array.prototype.toString;
    Object.defineProperty(Array.prototype, "__casablancaFirstHeroTitlePatch", {
      value: true,
      configurable: false,
      enumerable: false,
      writable: false
    });

    Array.prototype.toString = function casablancaFirstHeroTitleToString() {
      if (
        Array.isArray(this) &&
        this[0] === firstTitle &&
        this.some((item) => item === lastTitle)
      ) {
        return firstTitle;
      }
      return nativeArrayToString.call(this);
    };
  }

  function isMobile() {
    return mobileQuery.matches;
  }

  function removePreviousOverlayPatch() {
    document.querySelectorAll(".casa-mobile-title-stabilizer").forEach((node) => node.remove());
    document.body.classList.remove("casa-mobile-hero-guard");
  }

  function getTitleElement() {
    return document.getElementById("dynamic-title");
  }

  function getCleanTitleText() {
    const title = getTitleElement();
    const text = (title?.textContent || "").replace(/\s+/g, " ").trim();
    if (!text) return "";
    if (text.includes(firstTitle) && text.includes(lastTitle)) return firstTitle;
    return text;
  }

  function normalizeOverloadedFirstTitle() {
    const title = getTitleElement();
    if (!title) return "";

    const text = (title.textContent || "").replace(/\s+/g, " ").trim();
    if (text.includes(firstTitle) && text.includes(lastTitle)) {
      title.textContent = firstTitle;
      title.style.setProperty("--mobile-title-scale", "1");
      return firstTitle;
    }

    return text;
  }

  function ensureStyleIsLast() {
    let style = document.getElementById("casablancaMobileHeroStabilizerStyles");
    if (!style) {
      style = document.createElement("style");
      style.id = "casablancaMobileHeroStabilizerStyles";
    }

    style.textContent = `
      @media screen and (max-width: 768px) {
        body.casa-mobile-first-slide .casa-webgl-hero .hero-fallback,
        body.casa-mobile-first-slide .casa-webgl-stage.is-ready + .hero-fallback {
          z-index: 8 !important;
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: none !important;
        }

        body.casa-mobile-first-slide .casa-webgl-hero .hero-fallback img {
          opacity: 1 !important;
          visibility: visible !important;
        }

        .casa-webgl-hero .hero-text {
          overflow: visible !important;
          padding-left: max(10px, env(safe-area-inset-left)) !important;
          padding-right: max(10px, env(safe-area-inset-right)) !important;
        }

        .casa-webgl-hero #dynamic-title {
          max-width: 96vw !important;
          font-size: clamp(2.5rem, 14vw, 4.5rem) !important;
          line-height: 1.1 !important;
          letter-spacing: -0.04em !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
          padding-bottom: .38em !important;
          overflow-wrap: break-word !important;
          word-wrap: break-word !important;
          white-space: normal !important;
          transform: scale(var(--mobile-title-scale, 1)) !important;
          transform-origin: center center !important;
        }

        .casa-webgl-hero .mobile-title-line {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          line-height: 1.1 !important;
          white-space: normal !important;
          overflow: visible !important;
        }

        .casa-webgl-hero .mobile-title-line + .mobile-title-line {
          margin-top: clamp(.18rem, .9vh, .55rem) !important;
        }

        .casa-webgl-hero .word-container {
          margin: 0 .07em !important;
          padding: 0 .01em .08em !important;
          overflow: visible !important;
        }

        .casa-webgl-hero .word {
          white-space: nowrap !important;
          overflow: visible !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function relaxMobileScaleFloor() {
    if (!isMobile()) return;

    const title = getTitleElement();
    if (!title) return;

    window.requestAnimationFrame(() => {
      const lines = Array.from(title.querySelectorAll(".mobile-title-line"));
      const measureTargets = lines.length ? lines : [title];
      const maxLineWidth = Math.max(...measureTargets.map((line) => line.scrollWidth));
      const availableWidth = window.innerWidth * 0.96;
      const scale = Math.min(1, availableWidth / Math.max(maxLineWidth, 1));
      title.style.setProperty("--mobile-title-scale", String(Math.max(0.4, scale)));
    });
  }

  function syncMobileHeroTitlePatch() {
    if (!isMobile()) return;

    removePreviousOverlayPatch();
    ensureStyleIsLast();
    normalizeOverloadedFirstTitle();

    const currentTitle = getCleanTitleText();
    document.body.classList.toggle("casa-mobile-first-slide", currentTitle === firstTitle);

    relaxMobileScaleFloor();
  }

  function startObserver() {
    const hero = document.querySelector(".casa-webgl-hero");
    if (!hero || hero.dataset.mobileTitlePatchObserved === "true") return;
    hero.dataset.mobileTitlePatchObserved = "true";

    const observer = new MutationObserver(() => {
      window.clearTimeout(syncTimer);
      syncTimer = window.setTimeout(syncMobileHeroTitlePatch, 30);
    });

    observer.observe(hero, { childList: true, subtree: true, characterData: true });
  }

  syncMobileHeroTitlePatch();
  window.setTimeout(startObserver, 0);
  window.setTimeout(syncMobileHeroTitlePatch, 80);
  window.setTimeout(syncMobileHeroTitlePatch, 180);
  window.setTimeout(syncMobileHeroTitlePatch, 450);
  window.setTimeout(syncMobileHeroTitlePatch, 1000);
  window.setTimeout(syncMobileHeroTitlePatch, 1800);
  window.setInterval(syncMobileHeroTitlePatch, 1200);
  window.addEventListener("resize", syncMobileHeroTitlePatch, { passive: true });
})();