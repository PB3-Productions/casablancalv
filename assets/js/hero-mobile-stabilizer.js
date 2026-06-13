/* =========================================================
   CASABLANCA MOBILE HERO STABILIZER
   Purpose: Mobile-only fallback image guard + readable 3-line title overlay.
   ========================================================= */
(function () {
  const mobileQuery = window.matchMedia("(max-width: 768px)");
  const firstTitle = "Off-Strip Paradise";
  const lastTitle = "Put Your Feet In the Sand";
  let lastRenderedTitle = "";
  let observerStarted = false;
  let syncTimer = null;

  function isMobile() {
    return mobileQuery.matches;
  }

  function splitTitle(title) {
    const words = title.split(" ").filter(Boolean);
    if (title === "Something For Everyone") return ["Something", "For", "Everyone"];
    if (title === "Your Personal Oasis") return ["Your", "Personal", "Oasis"];
    if (title === "Modern & Spacious") return ["Modern", "&", "Spacious"];
    if (title === "Your New Vegas Night") return ["Your", "New Vegas", "Night"];
    if (title === "Unwind or Entertain") return ["Unwind", "or", "Entertain"];
    if (title === "Put Your Feet In the Sand") return ["Put Your", "Feet In the", "Sand"];
    if (title === "Beauty Redefined") return ["Beauty", "", "Redefined"];
    if (title === firstTitle) return ["Off-Strip", "", "Paradise"];
    if (words.length >= 3) return [words[0], words.slice(1, -1).join(" "), words[words.length - 1]];
    if (words.length === 2) return [words[0], "", words[1]];
    return [title, "", ""];
  }

  function getCleanTitle() {
    const dynamic = document.getElementById("dynamic-title");
    const text = (dynamic?.textContent || "").replace(/\s+/g, " ").trim();
    if (!text) return "";
    if (text.includes(firstTitle) && text.includes(lastTitle)) return firstTitle;
    return text;
  }

  function ensureStyle() {
    let style = document.getElementById("casablancaMobileHeroStabilizerStyles");
    if (!style) {
      style = document.createElement("style");
      style.id = "casablancaMobileHeroStabilizerStyles";
    }

    style.textContent = `
      @media (max-width: 768px) {
        body.casa-mobile-hero-guard .casa-webgl-hero .hero-fallback,
        body.casa-mobile-hero-guard .casa-webgl-stage.is-ready + .hero-fallback {
          z-index: 28 !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        body.casa-mobile-hero-guard .casa-webgl-hero .hero-fallback img {
          opacity: 1 !important;
          visibility: visible !important;
        }

        .casa-webgl-hero .hero-text,
        .casa-webgl-hero #dynamic-title {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        .casa-mobile-title-stabilizer {
          position: absolute !important;
          inset: 0 !important;
          z-index: 60 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100% !important;
          height: 100% !important;
          box-sizing: border-box !important;
          padding: 0 max(8px, env(safe-area-inset-left)) 0 max(8px, env(safe-area-inset-right)) !important;
          overflow: hidden !important;
          pointer-events: none !important;
          text-align: center !important;
          perspective: 1100px !important;
          transform: scale(var(--casa-mobile-title-scale, 1)) !important;
          transform-origin: center center !important;
          font-family: Impact, Haettenschweiler, "Arial Narrow Bold", "Arial Black", sans-serif !important;
          font-size: clamp(4.15rem, 23.5vw, 8.8rem) !important;
          font-weight: 900 !important;
          line-height: .8 !important;
          letter-spacing: -0.035em !important;
          text-transform: uppercase !important;
          color: #ffd400 !important;
          text-shadow:
            0 3px 0 rgba(75, 43, 0, .92),
            0 8px 18px rgba(0, 0, 0, .74),
            0 0 28px rgba(255, 212, 0, .22) !important;
        }

        .casa-mobile-title-stabilizer__line {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100% !important;
          max-width: 100% !important;
          white-space: nowrap !important;
          overflow: visible !important;
          text-align: center !important;
          transform-style: preserve-3d !important;
        }

        .casa-mobile-title-stabilizer__line + .casa-mobile-title-stabilizer__line {
          margin-top: clamp(.12rem, .9vh, .55rem) !important;
        }

        .casa-mobile-title-stabilizer .word-container {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex: 0 1 auto !important;
          margin-left: .035em !important;
          margin-right: .035em !important;
          padding: 0 !important;
          overflow: visible !important;
        }

        .casa-mobile-title-stabilizer .word {
          display: inline-flex !important;
          white-space: nowrap !important;
          overflow: visible !important;
        }

        .casa-mobile-title-stabilizer .char {
          display: inline-block !important;
          overflow: visible !important;
          will-change: transform, opacity, filter !important;
          transform-style: preserve-3d !important;
        }
      }

      @media (max-width: 380px) {
        .casa-mobile-title-stabilizer {
          font-size: clamp(3.75rem, 22.5vw, 7.3rem) !important;
          line-height: .82 !important;
          letter-spacing: -0.045em !important;
        }
      }

      @media (max-width: 300px) {
        .casa-mobile-title-stabilizer {
          font-size: clamp(3.15rem, 21.5vw, 5.1rem) !important;
          letter-spacing: -0.055em !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function ensureOverlay() {
    const hero = document.querySelector(".casa-webgl-hero");
    if (!hero) return null;
    let overlay = hero.querySelector(".casa-mobile-title-stabilizer");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "casa-mobile-title-stabilizer";
      overlay.setAttribute("aria-hidden", "true");
      hero.appendChild(overlay);
    }
    return overlay;
  }

  function addChars(text, line) {
    text.split(" ").filter(Boolean).forEach((word, wordIndex, words) => {
      const wordContainer = document.createElement("span");
      wordContainer.className = "word-container";

      const wordSpan = document.createElement("span");
      wordSpan.className = "word";

      Array.from(word).forEach((letter) => {
        const char = document.createElement("span");
        char.className = "char";
        char.textContent = letter;
        wordSpan.appendChild(char);
      });

      wordContainer.appendChild(wordSpan);
      line.appendChild(wordContainer);
      if (wordIndex < words.length - 1) line.appendChild(document.createTextNode(" "));
    });
  }

  function fitOverlay(overlay) {
    if (!isMobile() || !overlay) return;
    overlay.style.setProperty("--casa-mobile-title-scale", "1");
    window.requestAnimationFrame(() => {
      const lines = Array.from(overlay.querySelectorAll(".casa-mobile-title-stabilizer__line"));
      if (!lines.length) return;
      const widest = Math.max(...lines.map((line) => line.scrollWidth));
      const available = window.innerWidth * 0.96;
      const scale = Math.min(1, available / Math.max(widest, 1));
      overlay.style.setProperty("--casa-mobile-title-scale", String(Math.max(0.58, scale)));
    });
  }

  function animateOverlay(overlay) {
    const gsapRef = window.gsap;
    const topChars = overlay.querySelectorAll(".casa-mobile-title-stabilizer__line--top .char");
    const middleChars = overlay.querySelectorAll(".casa-mobile-title-stabilizer__line--middle .char");
    const bottomChars = overlay.querySelectorAll(".casa-mobile-title-stabilizer__line--bottom .char");

    if (!gsapRef) {
      overlay.querySelectorAll(".char").forEach((char) => {
        char.style.opacity = "1";
        char.style.transform = "translate3d(0, 0, 0) scale(1)";
        char.style.filter = "blur(0px)";
      });
      return;
    }

    gsapRef.killTweensOf(overlay.querySelectorAll(".char"));
    gsapRef.set(topChars, { y: "-135%", opacity: 0, rotateZ: -4 });
    gsapRef.set(middleChars, { opacity: 0, scale: 0.55, z: -220, filter: "blur(18px)" });
    gsapRef.set(bottomChars, { y: "135%", opacity: 0, rotateZ: 4 });

    gsapRef.to(topChars, { y: "0%", opacity: 1, rotateZ: 0, duration: 0.9, ease: "expo.out", stagger: { each: 0.024, from: "start" } });
    gsapRef.to(middleChars, { opacity: 1, scale: 1, z: 0, filter: "blur(0px)", duration: 1.02, ease: "expo.out", stagger: { each: 0.03, from: "center" }, delay: 0.08 });
    gsapRef.to(bottomChars, { y: "0%", opacity: 1, rotateZ: 0, duration: 0.9, ease: "expo.out", stagger: { each: 0.024, from: "start" }, delay: 0.04 });
  }

  function renderTitle() {
    if (!isMobile()) return;
    ensureStyle();
    const title = getCleanTitle();
    if (!title) return;

    const overlay = ensureOverlay();
    if (!overlay) return;
    if (lastRenderedTitle === title && overlay.childElementCount) {
      fitOverlay(overlay);
      return;
    }

    lastRenderedTitle = title;
    overlay.textContent = "";
    overlay.style.setProperty("--casa-mobile-title-scale", "1");

    const [top, middle, bottom] = splitTitle(title);
    [["top", top], ["middle", middle], ["bottom", bottom]].forEach(([position, text]) => {
      if (!text) return;
      const line = document.createElement("span");
      line.className = `casa-mobile-title-stabilizer__line casa-mobile-title-stabilizer__line--${position}`;
      addChars(text, line);
      overlay.appendChild(line);
    });

    fitOverlay(overlay);
    animateOverlay(overlay);

    if (title !== firstTitle) {
      document.body.classList.remove("casa-mobile-hero-guard");
    }
  }

  function startObserver() {
    const hero = document.querySelector(".casa-webgl-hero");
    if (!hero || observerStarted) return;
    observerStarted = true;
    const observer = new MutationObserver(() => {
      window.clearTimeout(syncTimer);
      syncTimer = window.setTimeout(renderTitle, 30);
    });
    observer.observe(hero, { childList: true, subtree: true, characterData: true });
    renderTitle();
  }

  if (isMobile()) document.body.classList.add("casa-mobile-hero-guard");
  ensureStyle();
  window.setTimeout(startObserver, 0);
  window.setTimeout(renderTitle, 150);
  window.setTimeout(renderTitle, 650);
  window.setTimeout(renderTitle, 1300);
  window.setInterval(() => {
    ensureStyle();
    renderTitle();
  }, 1250);
  window.addEventListener("resize", () => fitOverlay(document.querySelector(".casa-mobile-title-stabilizer")), { passive: true });
})();