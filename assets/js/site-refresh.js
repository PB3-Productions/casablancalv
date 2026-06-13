/* =========================================================
   BLOCK 1 START: CASABLANCA SITE REFRESH JS
   Purpose: Final hero, mobile layout, floorplan/Matterport helpers,
   lightbox overrides, and first-visit hero wave scroll.
   ========================================================= */

import * as THREE from "https://unpkg.com/three@0.128.0/build/three.module.js";

/* =========================================================
   BLOCK 2 START: HERO SLIDES
   ========================================================= */
const MOBILE_QUERY = window.matchMedia("(max-width: 768px)");
const HERO_SLIDES = [
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabb5a3e6e89b6028b15.webp",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e22f8d7322952d1866b94.png",
    title: "Off-Strip Paradise"
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabbff82912d65b40a8f.webp",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e22f8bb0618436a527c7d.png",
    title: "Your New Vegas Night"
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabb8acf4e863e398382.webp",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e5d7a282a51721af02845.webp",
    title: "Beauty Redefined"
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabbff82912d65b40a8e.webp",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e5de4ff82912d65e10a7c.webp",
    title: "Your Personal Oasis"
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabd045e32379f1bec11.webp",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e5fa4d7322952d18a1007.webp",
    title: "Unwind or Entertain"
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e2d0cf258f15ece4451fc.webp",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e2d515a3e6e89b62c63c9.webp",
    title: "Modern & Spacious"
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabb5a3e6e89b6028b14.webp",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e2e4fff82912d65ddfa4c.webp",
    title: "Something For Everyone"
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabbd53fc25488ce16d3.webp",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e2dabf563bf237f8c12f5.webp",
    title: "Put Your Feet In the Sand"
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1fbffa9e7a0d5a8b40bfe9.jpg",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e5f8c5a3e6e89b62fa02e.webp",
    title: ""
  }
];

const HOLD_DURATION = 1.98;
const TRANSITION_DURATION = 1.72;
const FLOORPLAN_IMAGE = "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1f8bc1098539f71824b491.webp";
const ADVENTURE_SCROLL_KEY = "casablancaHeroAdventureScrollComplete";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let activeSlides = [];
let imageUrls = [];
let slideTitles = [];
let validSlides = [];
let currentIndex = 0;
let renderer;
let scene;
let camera;
let uniforms;
let clock = new THREE.Clock();
let transitionTimer = null;
let textSwapTimer = null;
let isTransitioning = false;
let heroStarted = false;

function refreshActiveSlides() {
  const seen = new Set();
  activeSlides = HERO_SLIDES
    .map((slide) => ({
      image: MOBILE_QUERY.matches && slide.mobileImage ? slide.mobileImage : slide.image,
      title: slide.title
    }))
    .filter((slide) => {
      if (seen.has(slide.image)) return false;
      seen.add(slide.image);
      return true;
    });

  imageUrls = activeSlides.map((slide) => slide.image);
  slideTitles = activeSlides.map((slide) => slide.title);
}
/* =========================================================
   BLOCK 2 END: HERO SLIDES
   ========================================================= */


/* =========================================================
   BLOCK 3 START: FINAL OVERRIDE STYLES
   ========================================================= */
function injectFinalStyles() {
  if (document.getElementById("casablancaFinalMobileStyles")) return;

  const style = document.createElement("style");
  style.id = "casablancaFinalMobileStyles";
  style.textContent = `
    #matterport,
    .drawer-nav a[href="#matterport"] {
      display: none !important;
    }

    .btn {
      padding-left: clamp(.78rem, 1.35vw, 1.05rem) !important;
      padding-right: clamp(.78rem, 1.35vw, 1.05rem) !important;
    }

    .intro-button-row,
    .footer-button-row {
      gap: clamp(.85rem, 1.6vw, 1.15rem) !important;
    }

    .hero-intro-buttons .btn,
    .footer-button-row .btn {
      width: min(270px, 100%) !important;
      min-width: min(270px, 100%) !important;
    }

    .media-card.framed-floorplan,
    .framed-floorplan,
    .media-card.framed-map-card,
    .framed-map-card {
      padding: 0 !important;
      background: transparent !important;
      border: 0 !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
    }

    .framed-floorplan::before,
    .framed-floorplan::after,
    .framed-map-card::before,
    .framed-map-card::after {
      display: none !important;
      content: none !important;
    }

    .framed-floorplan img,
    .framed-map-card img {
      display: block !important;
      width: 100% !important;
      height: auto !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      object-fit: contain !important;
      cursor: zoom-in !important;
    }

    #policies .site-shell > .grid-2 {
      display: block !important;
    }

    #policies .site-shell > .grid-2 > .reveal:first-child {
      max-width: 980px !important;
      margin: 0 auto clamp(1.4rem, 3vw, 2.4rem) !important;
      text-align: center !important;
    }

    #policies .site-shell > .grid-2 > .reveal:first-child .eyebrow,
    #policies .site-shell > .grid-2 > .reveal:first-child h2,
    #policies .site-shell > .grid-2 > .reveal:first-child .lead {
      text-align: center !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }

    #policies .policy-grid {
      display: grid !important;
      grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
      gap: clamp(.7rem, 1vw, 1rem) !important;
      align-items: stretch !important;
    }

    #policies .policy-grid .mini-card {
      padding: clamp(1rem, 1.2vw, 1.35rem) !important;
    }

    #policies .policy-grid .mini-card h3 {
      font-size: clamp(.95rem, 1vw, 1.12rem) !important;
    }

    #policies .policy-grid .mini-card p {
      font-size: clamp(.84rem, .9vw, .98rem) !important;
      line-height: 1.55 !important;
    }

    .mobile-floating-actions {
      position: fixed;
      left: 50%;
      bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
      z-index: 80;
      display: none;
      width: min(86vw, 320px);
      transform: translate(-50%, 18px);
      opacity: 0;
      pointer-events: none;
      transition: opacity .36s ease, transform .36s ease;
    }

    .mobile-floating-actions__inner {
      display: grid;
      grid-template-columns: 1fr;
      gap: .78rem;
    }

    .mobile-floating-actions .btn {
      width: 100% !important;
      min-width: 0 !important;
      min-height: 47px !important;
      padding: .72rem .82rem !important;
      border-radius: 999px !important;
      font-size: clamp(.76rem, 3.1vw, .91rem) !important;
      letter-spacing: .095em !important;
      line-height: 1.08 !important;
      white-space: nowrap !important;
      justify-content: center !important;
      text-align: center !important;
    }

    .mobile-floating-actions.is-visible:not(.is-hidden):not(.is-scrolling) {
      opacity: 1;
      transform: translate(-50%, 0);
      pointer-events: auto;
    }

    .casa-webgl-hero #dynamic-title {
      line-height: 1.1 !important;
    }

    .casa-webgl-hero .word-container {
      margin-left: .16em !important;
      margin-right: .16em !important;
    }

    @media (max-width: 1200px) {
      #policies .policy-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      }
    }

    @media (max-width: 768px) {
      /* PERFECT MOBILE HEADER HIDING (CSS ONLY) */
      #site-header,
      .site-header,
      header,
      .header-container,
      .brand-group,
      .main-logo,
      .nav-bar-container {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        height: 0 !important;
        overflow: hidden !important;
      }

      body {
        padding-top: 0 !important;
        overflow-x: hidden !important;
      }

      .mobile-floating-actions {
        display: block !important;
      }

      main p,
      main .lead,
      main .mini-card p,
      main .price-card p,
      main .count,
      main .status-note,
      main .badge,
      main li,
      main .feature-list span:not(.gold-svg-icon) {
        text-align: left !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      .hero-intro-section .intro-lead,
      .estate-summary-card .lead,
      .floorplan-section .lead,
      #policies .lead,
      #availability .lead,
      .footer-cta-card p,
      .footer-brand-block p {
        max-width: min(91vw, 34rem) !important;
      }

      .hero-intro-section .title-lg,
      .estate-summary-card .title-lg,
      .floorplan-section .title-lg,
      #policies .title-lg,
      #availability .title-lg {
        text-align: center !important;
      }

      .hero-intro-buttons {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: .85rem !important;
        max-width: min(86vw, 320px) !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      .hero-intro-buttons .btn,
      .footer-button-row .btn {
        width: 100% !important;
        min-width: 0 !important;
        min-height: 48px !important;
        padding-left: .82rem !important;
        padding-right: .82rem !important;
        font-size: clamp(.76rem, 3.08vw, .91rem) !important;
        letter-spacing: .086em !important;
        line-height: 1.08 !important;
      }

      .footer-button-row {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: .85rem !important;
        max-width: min(86vw, 320px) !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      #policies .policy-grid {
        grid-template-columns: 1fr !important;
        max-width: min(92vw, 520px) !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      #welcome .title-lg {
        font-size: 2.25rem !important;
        line-height: 1.2 !important;
        overflow-wrap: break-word !important;
        word-wrap: break-word !important;
        white-space: normal !important;
        padding: 0 10px !important;
      }
    }
  `;

  document.head.appendChild(style);
}
/* =========================================================
   BLOCK 3 END: FINAL OVERRIDE STYLES
   ========================================================= */


/* =========================================================
   BLOCK 4 START: CONTENT + MOBILE CTA HELPERS
   ========================================================= */
function removeLegacyHeroConflicts() {
  const approvedHero = document.querySelector(".casa-webgl-hero");
  const main = document.querySelector("main");
  if (!main || !approvedHero) return;

  Array.from(main.querySelectorAll("section.hero")).forEach((section) => {
    if (section !== approvedHero) section.remove();
  });

  Array.from(document.querySelectorAll(".hero-content, .hero-copy, .hero-grid, .intro-panel")).forEach((node) => {
    if (!approvedHero.contains(node)) node.remove();
  });

  if (main.firstElementChild !== approvedHero) main.insertBefore(approvedHero, main.firstElementChild);

  const welcome = document.getElementById("welcome");
  if (welcome && approvedHero.nextElementSibling !== welcome) main.insertBefore(welcome, approvedHero.nextElementSibling);

  document.querySelectorAll(".legacy-hero, .old-hero, .hero-split, .hero-panel").forEach((node) => node.remove());
}

function patchContentFlow() {
  injectFinalStyles();
  removeLegacyHeroConflicts();

  document.getElementById("matterport")?.remove();
  document.querySelectorAll('a[href="#matterport"]').forEach((link) => link.remove());

  const welcome = document.querySelector("#welcome .narrow-shell");
  if (welcome) {
    let introButtons = welcome.querySelector(".intro-button-row");
    if (!introButtons) {
      introButtons = document.createElement("div");
      introButtons.className = "intro-button-row hero-intro-buttons";
      welcome.appendChild(introButtons);
    }
    introButtons.innerHTML = `
      <a class="btn btn-gold" href="#availability">Check Available Dates</a>
      <a class="btn btn-outline" href="#video-tour">View the Estate Tour</a>
    `;
  }

  const summaryCard = document.querySelector(".estate-summary-card");
  if (summaryCard) {
    const cardTitle = summaryCard.querySelector("h2");
    const cardLead = summaryCard.querySelector(".lead");
    if (cardTitle) cardTitle.textContent = "A Private Las Vegas Estate Designed for Groups, Events & VIP Stays";
    if (cardLead) {
      cardLead.textContent = "A private, high-end estate for guests who want the space of a luxury residence, the discretion of a private booking team, and the service layer of a VIP concierge experience. Casablanca Las Vegas is positioned for elevated group stays, private retreats, productions, professional networking events, weddings, and premium day events close to the Strip without placing the exact address in front of every casual browser.";
    }
    summaryCard.querySelector(".intro-button-row")?.remove();
  }

  const availabilityHeading = document.querySelector("#availability h2");
  if (availabilityHeading) availabilityHeading.textContent = "Check Dates For Availability";

  const footerExploreTitle = document.querySelector(".footer-links-card h3");
  if (footerExploreTitle) footerExploreTitle.textContent = "Explore";

  document.querySelectorAll(".btn").forEach((button) => {
    const text = (button.textContent || "").trim().toLowerCase();
    if (text.includes("check your dates")) button.textContent = "Check Available Dates";
  });

  const floorplanImage = document.querySelector(".framed-floorplan img");
  if (floorplanImage) {
    floorplanImage.src = FLOORPLAN_IMAGE;
    floorplanImage.srcset = `${FLOORPLAN_IMAGE} 1600w`;
    floorplanImage.sizes = "(max-width: 900px) 100vw, 72vw";
    floorplanImage.alt = "Updated Casablanca Las Vegas estate floorplan showing sleeping layout and room flow";
  }

  document.querySelectorAll(".concierge-option").forEach((card) => {
    card.removeAttribute("href");
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.addEventListener("click", (event) => event.preventDefault());
  });
}

function ensureMobileFloatingActions() {
  let actions = document.querySelector(".mobile-floating-actions");
  if (actions) return actions;

  actions = document.createElement("div");
  actions.className = "mobile-floating-actions is-hidden";
  actions.setAttribute("aria-label", "Mobile booking actions");
  actions.innerHTML = `
    <div class="mobile-floating-actions__inner">
      <a class="btn btn-gold" href="#availability">Check Availability</a>
      <a class="btn btn-outline" href="tel:6167457148">Speak to Agent</a>
    </div>
  `;
  document.body.appendChild(actions);
  return actions;
}

function initMobileFloatingActions() {
  const actions = ensureMobileFloatingActions();
  const hero = document.querySelector(".casa-webgl-hero");
  if (!actions || !hero) return;

  let isScrolling = false;
  let scrollTimer = null;

  const isInsideHero = () => window.scrollY < (hero.offsetHeight || window.innerHeight) * 0.82;
  const sync = () => {
    const hidden = !MOBILE_QUERY.matches || isInsideHero();
    actions.classList.toggle("is-hidden", hidden);
    actions.classList.toggle("is-scrolling", isScrolling);
    actions.classList.toggle("is-visible", MOBILE_QUERY.matches && !hidden);
  };

  window.addEventListener("scroll", () => {
    isScrolling = true;
    sync();
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      isScrolling = false;
      sync();
    }, 3000);
  }, { passive: true });

  window.addEventListener("resize", sync, { passive: true });
  sync();
}
/* =========================================================
   BLOCK 4 END: CONTENT + MOBILE CTA HELPERS
   ========================================================= */


/* =========================================================
   BLOCK 5 START: HERO TEXT
   ========================================================= */
function ensureHeroText() {
  const hero = document.querySelector(".casa-webgl-hero");
  if (!hero) return null;

  let heroText = hero.querySelector(".hero-text");
  if (!heroText) {
    heroText = document.createElement("div");
    heroText.className = "hero-text";
    heroText.setAttribute("aria-live", "polite");
    heroText.innerHTML = `<h1 id="dynamic-title"></h1>`;
    hero.appendChild(heroText);
  }

  if (!document.getElementById("exactUploadedHeroTextStyles")) {
    const style = document.createElement("style");
    style.id = "exactUploadedHeroTextStyles";
    style.textContent = `
      .casa-hero-slide-title { display: none !important; }
      .casa-webgl-hero .hero-text {
        position: absolute !important;
        inset: 0 !important;
        z-index: 20 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        min-height: 100dvh !important;
        padding: clamp(22px, 5vw, 88px) !important;
        box-sizing: border-box !important;
        text-align: center !important;
        pointer-events: none !important;
        overflow: visible !important;
      }
      .casa-webgl-hero #dynamic-title {
        display: block !important;
        width: 100% !important;
        max-width: min(94vw, 1320px) !important;
        margin: 0 auto !important;
        padding: 0.18em 0.06em 0.32em !important;
        color: #ffd400 !important;
        font-size: clamp(2.35rem, 8vw, 7.25rem) !important;
        font-weight: 900 !important;
        line-height: 1.1 !important;
        letter-spacing: -0.045em !important;
        text-align: center !important;
        text-wrap: balance !important;
        overflow: visible !important;
        transform: scale(var(--mobile-title-scale, 1));
        transform-origin: center center;
        text-shadow: 0 3px 7px rgba(0,0,0,.72), 0 10px 24px rgba(0,0,0,.54), 0 0 24px rgba(255,212,0,.16) !important;
      }
      .casa-webgl-hero .word-container {
        display: inline-flex !important;
        vertical-align: top !important;
        margin: 0 .16em !important;
        padding: .04em .02em .12em !important;
        overflow: visible !important;
      }
      .casa-webgl-hero .word { display: inline-flex !important; white-space: nowrap !important; overflow: visible !important; }
      .casa-webgl-hero .char { display: inline-block !important; transform: translateY(115%); opacity: 0; will-change: transform, opacity; overflow: visible !important; }
      .casa-webgl-hero .mobile-title-line { display: block !important; width: 100% !important; overflow: visible !important; }
      .casa-webgl-hero .mobile-title-line + .mobile-title-line { margin-top: clamp(.42rem, 1.75vh, 1rem) !important; }
      
      @media (max-width: 768px) {
        .casa-webgl-hero #dynamic-title {
          max-width: 96vw !important;
          font-size: clamp(3.2rem, 16vw, 5.5rem) !important;
          line-height: 1.15 !important;
          letter-spacing: -0.04em !important;
          padding: 0 0 .38em 0 !important;
          transform: scale(var(--mobile-title-scale, 1)) !important;
          transform-origin: center center !important;
        }

        /* PURE CSS FLEXBOX MAGIC FOR MOBILE TEXT OVERLAPPING */
        .casa-webgl-hero .mobile-title-line {
          display: flex !important;
          flex-wrap: wrap !important;
          justify-content: center !important;
          align-items: center !important;
          width: 100% !important;
          max-width: 100% !important;
          column-gap: 0.25em !important;
          row-gap: 0.15em !important;
          margin-top: 0 !important;
        }
        .casa-webgl-hero .mobile-title-line + .mobile-title-line {
          margin-top: 0.15em !important;
        }
        .casa-webgl-hero .word-container {
          margin: 0 !important;
          padding: 0 !important;
          display: inline-flex !important;
        }
        .casa-webgl-hero .word {
          white-space: nowrap !important;
          display: inline-flex !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  return heroText.querySelector("#dynamic-title");
}

function createWordSpans(text, container) {
  text.split(" ").filter(Boolean).forEach((word, index, words) => {
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
    container.appendChild(wordContainer);
    if (index < words.length - 1) container.appendChild(document.createTextNode(" "));
  });
}

function splitMobileTitle(title) {
  const words = title.split(" ").filter(Boolean);
  if (words.length <= 1) return [title, ""];
  const splitIndex = title === "Put Your Feet In the Sand" ? 3 : Math.ceil(words.length / 2);
  return [words.slice(0, splitIndex).join(" "), words.slice(splitIndex).join(" ")];
}

function fitMobileTitleToViewport() {
  if (!MOBILE_QUERY.matches) return;

  const titleContainer = document.querySelector("#dynamic-title");
  if (!titleContainer) return;

  window.requestAnimationFrame(() => {
    // Math locked to 1. This guarantees text stays huge and forces the CSS Flexbox to safely wrap words to the next line.
    titleContainer.style.setProperty("--mobile-title-scale", "1");
  });
}

function animateTextIn(title) {
  const titleContainer = ensureHeroText();
  if (!titleContainer) return;

  titleContainer.textContent = "";
  titleContainer.style.setProperty("--mobile-title-scale", "1");

  // Safety: ensure title is a string
  if (Array.isArray(title)) title = title[0] || "";
  if (typeof title !== "string") title = String(title || "");
  title = title.trim();
  if (!title) return;

  if (MOBILE_QUERY.matches) {
    const [topLine, bottomLine] = splitMobileTitle(title);
    const top = document.createElement("span");
    const bottom = document.createElement("span");
    top.className = "mobile-title-line mobile-title-line-top";
    bottom.className = "mobile-title-line mobile-title-line-bottom";
    createWordSpans(topLine, top);
    if (bottomLine) {
        createWordSpans(bottomLine, bottom);
    }
    titleContainer.appendChild(top);
    if (bottomLine) titleContainer.appendChild(bottom);
    fitMobileTitleToViewport();
  } else {
    createWordSpans(title, titleContainer);
  }

  const gsapRef = window.gsap;
  const chars = titleContainer.querySelectorAll(".char");
  
  if (prefersReducedMotion || !gsapRef) {
    chars.forEach((char) => {
      char.style.transform = "translateY(0%) scale(1)";
      char.style.opacity = "1";
    });
    return;
  }

  if (MOBILE_QUERY.matches) {
    const topChars = titleContainer.querySelectorAll(".mobile-title-line-top .char");
    const bottomChars = titleContainer.querySelectorAll(".mobile-title-line-bottom .char");
    
    gsapRef.killTweensOf(chars);
    if (topChars.length) {
        gsapRef.set(topChars, { y: "-135%", opacity: 0, rotateZ: -5 });
        gsapRef.to(topChars, { y: "0%", opacity: 1, rotateZ: 0, duration: .9, ease: "expo.out", stagger: { each: .026, from: "start" } });
    }
    if (bottomChars.length) {
        gsapRef.set(bottomChars, { y: "135%", opacity: 0, rotateZ: 5 });
        gsapRef.to(bottomChars, { y: "0%", opacity: 1, rotateZ: 0, duration: .9, ease: "expo.out", stagger: { each: .026, from: "start" } });
    }
    return;
  }

  gsapRef.killTweensOf(chars);
  gsapRef.set(chars, { y: "112%", opacity: 0, rotateZ: 5 });
  gsapRef.to(chars, { y: "0%", opacity: 1, rotateZ: 0, duration: .82, ease: "expo.out", stagger: { each: .024, from: "start" } });
}

function animateTextOut() {
  const titleContainer = document.querySelector("#dynamic-title");
  const gsapRef = window.gsap;
  if (!titleContainer || !gsapRef || prefersReducedMotion) return;

  if (MOBILE_QUERY.matches) {
    const topChars = titleContainer.querySelectorAll(".mobile-title-line-top .char");
    const bottomChars = titleContainer.querySelectorAll(".mobile-title-line-bottom .char");

    if (topChars.length) gsapRef.to(topChars, { y: "-135%", opacity: 0, rotateZ: -5, duration: .42, ease: "power2.in", stagger: { each: .014, from: "start" } });
    if (bottomChars.length) gsapRef.to(bottomChars, { y: "135%", opacity: 0, rotateZ: 5, duration: .42, ease: "power2.in", stagger: { each: .014, from: "start" } });
    return;
  }

  gsapRef.to(titleContainer.querySelectorAll(".char"), { y: "-112%", opacity: 0, rotateZ: -5, duration: .42, ease: "power2.in", stagger: { each: .014, from: "start" } });
}
/* =========================================================
   BLOCK 5 END: HERO TEXT
   ========================================================= */


/* =========================================================
   BLOCK 6 START: WEBGL HERO
   ========================================================= */
const loader = new THREE.TextureLoader();
loader.crossOrigin = "anonymous";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform sampler2D uTexture1;
  uniform sampler2D uTexture2;
  uniform vec2 uTexture1Size;
  uniform vec2 uTexture2Size;
  uniform vec2 uResolution;
  uniform float uProgress;
  uniform float uTime;
  varying vec2 vUv;

  float hash(float n) { return fract(sin(n) * 43758.5453123); }

  vec2 coverUv(vec2 uv, vec2 imageSize, vec2 resolution) {
    vec2 centeredUv = uv - 0.5;
    float screenAspect = resolution.x / resolution.y;
    float imageAspect = imageSize.x / imageSize.y;
    if (screenAspect < imageAspect) centeredUv.x *= screenAspect / imageAspect;
    else centeredUv.y *= imageAspect / screenAspect;
    return centeredUv + 0.5;
  }

  vec4 sampleWithSoftClamp(sampler2D textureMap, vec2 uv) {
    return texture2D(textureMap, clamp(uv, vec2(0.001), vec2(0.999)));
  }

  void main() {
    vec2 baseUv = vUv;
    vec2 uv1 = coverUv(baseUv, uTexture1Size, uResolution);
    vec2 uv2 = coverUv(baseUv, uTexture2Size, uResolution);
    float transitionStrength = sin(uProgress * 3.14159265);
    float band = 0.28;
    float revealLine = uProgress * (1.0 + band * 2.0) - band;
    float revealNoise = sin(baseUv.y * 15.0 + uTime * 1.65) * 0.035 * transitionStrength + sin(baseUv.y * 43.0 - uTime * 2.05) * 0.018 * transitionStrength;
    float revealMask = 1.0 - smoothstep(revealLine - band, revealLine + band, baseUv.x + revealNoise);
    float sliceCount = 20.0;
    float sliceIndex = floor(baseUv.y * sliceCount);
    float sliceRandom = hash(sliceIndex + 11.0);
    float sliceOffset = (sliceRandom - 0.5) * 0.12 * transitionStrength;
    float verticalWave = sin(baseUv.y * 34.0 + uTime * 2.2) * 0.034 * transitionStrength;
    float horizontalWave = cos(baseUv.x * 24.0 - uTime * 1.65) * 0.018 * transitionStrength;
    vec2 displacement = vec2(verticalWave + sliceOffset, horizontalWave);
    vec2 directionalPull = vec2((revealMask - 0.5) * 0.16, 0.0) * transitionStrength;
    vec2 distortedUv1 = uv1 + displacement + directionalPull;
    vec2 distortedUv2 = uv2 - displacement - directionalPull;
    vec4 color1 = sampleWithSoftClamp(uTexture1, distortedUv1);
    vec4 color2 = sampleWithSoftClamp(uTexture2, distortedUv2);
    vec4 finalColor = mix(color1, color2, revealMask);
    float splitStrength = 0.01 * transitionStrength;
    vec4 redShift = sampleWithSoftClamp(uTexture2, distortedUv2 + vec2(splitStrength, 0.0));
    vec4 blueShift = sampleWithSoftClamp(uTexture1, distortedUv1 - vec2(splitStrength, 0.0));
    finalColor.r = mix(finalColor.r, redShift.r, transitionStrength * 0.24);
    finalColor.b = mix(finalColor.b, blueShift.b, transitionStrength * 0.18);
    float vignette = smoothstep(0.94, 0.20, distance(baseUv, vec2(0.5)));
    finalColor.rgb *= mix(0.76, 1.0, vignette);
    gl_FragColor = finalColor;
  }
`;

function textureSize(texture) {
  const image = texture && texture.image;
  return new THREE.Vector2(image?.width || 1, image?.height || 1);
}

function getNextIndex(index) {
  if (validSlides.length <= 1) return index;
  return (index + 1) % validSlides.length;
}

function setTexturePair(index) {
  const nextIndex = getNextIndex(index);
  const tex1 = validSlides[index]?.texture;
  const tex2 = validSlides[nextIndex]?.texture || tex1;
  if (!tex1 || !uniforms) return;

  uniforms.uTexture1.value = tex1;
  uniforms.uTexture2.value = tex2;
  uniforms.uTexture1Size.value = textureSize(tex1);
  uniforms.uTexture2Size.value = textureSize(tex2);
}

function resizeRenderer() {
  const stage = document.getElementById("casaWebglHero");
  if (!renderer || !uniforms || !stage) return;

  const rect = stage.getBoundingClientRect();
  const width = Math.max(1, rect.width || window.innerWidth);
  const height = Math.max(1, rect.height || window.innerHeight);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);
  uniforms.uResolution.value.set(width, height);
  fitMobileTitleToViewport();
}

function initWebGL() {
  const stage = document.getElementById("casaWebglHero");
  if (!stage || !validSlides[0]?.texture) return;

  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  stage.innerHTML = "";
  stage.appendChild(renderer.domElement);

  const firstTexture = validSlides[0].texture;
  uniforms = {
    uTexture1: { value: firstTexture },
    uTexture2: { value: firstTexture },
    uTexture1Size: { value: textureSize(firstTexture) },
    uTexture2Size: { value: textureSize(firstTexture) },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uProgress: { value: 0 },
    uTime: { value: 0 }
  };

  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: false });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 1, 1), material));
  resizeRenderer();
  stage.classList.add("is-ready");
}

function transitionToNext() {
  if (isTransitioning || validSlides.length < 2 || !uniforms) return;

  isTransitioning = true;
  const targetIndex = getNextIndex(currentIndex);
  setTexturePair(currentIndex);

  const shouldScrollAfterTransition = shouldRunAdventureScroll(currentIndex, targetIndex);

  if (textSwapTimer) window.clearTimeout(textSwapTimer);
  animateTextOut();
  textSwapTimer = window.setTimeout(() => {
    animateTextIn(validSlides[targetIndex].title);
  }, (TRANSITION_DURATION / 2) * 1000);

  const completeTransition = () => {
    currentIndex = targetIndex;
    const currentTexture = validSlides[currentIndex].texture;
    uniforms.uTexture1.value = currentTexture;
    uniforms.uTexture2.value = currentTexture;
    uniforms.uTexture1Size.value = textureSize(currentTexture);
    uniforms.uTexture2Size.value = textureSize(currentTexture);
    uniforms.uProgress.value = 0;
    isTransitioning = false;

    if (shouldScrollAfterTransition) runAdventureScroll();

    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(transitionToNext, HOLD_DURATION * 1000);
  };

  const gsapRef = window.gsap;
  if (!gsapRef || prefersReducedMotion) {
    uniforms.uProgress.value = 1;
    completeTransition();
    return;
  }

  gsapRef.killTweensOf(uniforms.uProgress);
  gsapRef.to(uniforms.uProgress, {
    value: 1,
    duration: TRANSITION_DURATION,
    ease: "power3.inOut",
    onComplete: completeTransition
  });
}

function render() {
  if (uniforms && renderer && scene && camera) {
    uniforms.uTime.value += clock.getDelta();
    renderer.render(scene, camera);
  }
  window.requestAnimationFrame(render);
}

async function startHero() {
  if (heroStarted) return;
  heroStarted = true;

  try {
    refreshActiveSlides();
    ensureHeroText();

    // Restored your exact working image loading logic!
    const tex0 = await new Promise((resolve) => {
        loader.load(imageUrls[0], (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.needsUpdate = true;
        resolve(texture);
      }, undefined, () => resolve(null));
    });

    if (!tex0) throw new Error("Primary image failed");

    // Fix: Only send the first title into the array, not all 9!
    validSlides.push({ texture: tex0, title: slideTitles[0] || "" });
    currentIndex = 0;

    initWebGL();
    animateTextIn(validSlides[0].title);
    render();
    window.addEventListener("resize", resizeRenderer, { passive: true });

    // Restored your exact working image loading logic for loop!
    for (let i = 1; i < imageUrls.length; i++) {
      const tex = await new Promise((resolve) => {
        loader.load(imageUrls[i], (texture) => {
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.needsUpdate = true;
          resolve(texture);
        }, undefined, () => resolve(null));
      });
      
      if (tex) {
        validSlides.push({ texture: tex, title: slideTitles[i] || "" });
        
        if (validSlides.length === 2) {
          transitionTimer = window.setTimeout(transitionToNext, HOLD_DURATION * 1000);
        }
      }
    }

  } catch (error) {
    console.error("Hero failed to initialize:", error);
    animateTextIn("Luxury Awaits");
  }
}
/* =========================================================
   BLOCK 6 END: WEBGL HERO
   ========================================================= */


/* =========================================================
   BLOCK 7 START: FIRST-VISIT HERO WAVE SCROLL
   ========================================================= */
function hasAdventureScrollRun() {
  try {
    return window.localStorage.getItem(ADVENTURE_SCROLL_KEY) === "true";
  } catch (error) {
    return false;
  }
}

function markAdventureScrollRun() {
  try {
    window.localStorage.setItem(ADVENTURE_SCROLL_KEY, "true");
  } catch (error) {
    // No-op
  }
}

function shouldRunAdventureScroll(fromIndex, toIndex) {
  const lastIndex = validSlides.length - 1;
  const hero = document.querySelector(".casa-webgl-hero");
  if (!hero || hasAdventureScrollRun()) return false;
  if (fromIndex !== lastIndex || toIndex !== 0) return false;
  return window.scrollY < (hero.offsetHeight || window.innerHeight) * 0.42;
}

function runAdventureScroll() {
  const target = document.getElementById("welcome") || document.querySelector("main section:not(.casa-webgl-hero)");
  if (!target) return;

  markAdventureScrollRun();

  const gsapRef = window.gsap;
  const targetTop = Math.max(0, target.getBoundingClientRect().top + window.scrollY);

  if (gsapRef && !prefersReducedMotion) {
    gsapRef.to(window, {
      scrollTo: { y: targetTop, autoKill: true },
      duration: 1.45,
      ease: "power3.inOut"
    });
    return;
  }

  window.scrollTo({ top: targetTop, behavior: prefersReducedMotion ? "auto" : "smooth" });
}
/* =========================================================
   BLOCK 7 END: FIRST-VISIT HERO WAVE SCROLL
   ========================================================= */


/* =========================================================
   BLOCK 8 START: LIGHTBOX + SPLIT ANIMATION
   ========================================================= */
function initMapAndFloorplanLightbox() {
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const zoomImages = Array.from(document.querySelectorAll(".framed-map-card img, .framed-floorplan img"));
  if (!lightbox || !lightboxImage || !zoomImages.length) return;

  const openImage = (image) => {
    lightboxImage.src = image.currentSrc || image.src || FLOORPLAN_IMAGE;
    lightboxImage.alt = image.alt || "Casablanca Las Vegas estate image";
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeImage = () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  };

  zoomImages.forEach((image) => {
    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");
    image.addEventListener("click", () => openImage(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openImage(image);
      }
    });
  });

  lightboxClose?.addEventListener("click", closeImage);
  lightbox.addEventListener("click", (event) => { if (event.target === lightbox) closeImage(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && lightbox.classList.contains("active")) closeImage(); });
}

function initSplitMergeAnimation() {
  const gsapRef = window.gsap;
  if (!gsapRef || prefersReducedMotion) return;

  const left = document.querySelector(".split-half-left");
  const right = document.querySelector(".split-half-right");
  const section = document.querySelector(".split-merge-section");
  if (!left || !right || !section) return;

  const runTween = () => {
    gsapRef.fromTo(left, { x: "-18vw", opacity: .35 }, { x: 0, opacity: 1, duration: 1.15, ease: "power3.out" });
    gsapRef.fromTo(right, { x: "18vw", opacity: .35 }, { x: 0, opacity: 1, duration: 1.15, ease: "power3.out" });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      runTween();
      observer.disconnect();
    });
  }, { threshold: .28 });

  observer.observe(section);
}
/* =========================================================
   BLOCK 8 END: LIGHTBOX + SPLIT ANIMATION
   ========================================================= */


/* =========================================================
   BLOCK 9 START: INIT
   ========================================================= */
function initCasablancaRefresh() {
  patchContentFlow();
  ensureMobileFloatingActions();
  initMobileFloatingActions();
  ensureHeroText();
  initMapAndFloorplanLightbox();
  initSplitMergeAnimation();
  startHero();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCasablancaRefresh, { once: true });
} else {
  initCasablancaRefresh();
}

window.addEventListener("load", removeLegacyHeroConflicts, { once: true });
/* =========================================================
   BLOCK 9 END: INIT
   ========================================================= */
