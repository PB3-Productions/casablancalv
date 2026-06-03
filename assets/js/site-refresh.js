/* =========================================================
   BLOCK 1 START: CASABLANCA SITE REFRESH JS
   Purpose: Keep the uploaded Oscar-style WebGL hero behavior intact,
   add mobile-specific hero images, mobile split-title animation, floating
   mobile CTAs, floorplan swap, policy layout polish, Matterport removal,
   and page-specific cleanup/lightbox behavior.
   ========================================================= */

import * as THREE from "https://unpkg.com/three@0.128.0/build/three.module.js";

/* =========================================================
   BLOCK 2 START: HERO SLIDE DATA
   ========================================================= */
const rawSlides = [
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
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1faa0bbce897da752c1750.jpg",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e5f8c5a3e6e89b62fa02e.webp",
    title: ""
  }
];

const MOBILE_BREAKPOINT = "(max-width: 768px)";
const mobileMediaQuery = window.matchMedia(MOBILE_BREAKPOINT);
let slides = [];
let imageUrls = [];
let slideTitles = [];

function getPreferredSlideImage(slide) {
  return mobileMediaQuery.matches && slide.mobileImage ? slide.mobileImage : slide.image;
}

function buildActiveSlides() {
  const seen = new Set();

  return rawSlides
    .map((slide) => ({
      image: getPreferredSlideImage(slide).trim(),
      title: slide.title
    }))
    .filter((slide) => {
      if (seen.has(slide.image)) return false;
      seen.add(slide.image);
      return true;
    });
}

function refreshActiveSlideData() {
  slides = buildActiveSlides();
  imageUrls = slides.map((slide) => slide.image);
  slideTitles = slides.map((slide) => slide.title);
}
/* =========================================================
   BLOCK 2 END: HERO SLIDE DATA
   ========================================================= */

/* =========================================================
   BLOCK 3 START: CONFIG
   ========================================================= */
const HOLD_DURATION = 1.98;
const FINAL_SLIDE_HOLD_DURATION = 1.98;
const TRANSITION_DURATION = 1.72;
const MAX_PIXEL_RATIO = 2;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const FLOORPLAN_IMAGE = "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1f8bc1098539f71824b491.webp";

let currentIndex = 0;
let texturesLoaded = [];
let scene;
let camera;
let renderer;
let material;
let mesh;
let uniforms;
let transitionTimer = null;
let textSwapTimer = null;
let isTransitioning = false;
let heroStarted = false;

const clock = new THREE.Clock();

function getHoldDuration(index) {
  const lastIndex = imageUrls.length - 1;
  return index === lastIndex ? FINAL_SLIDE_HOLD_DURATION : HOLD_DURATION;
}
/* =========================================================
   BLOCK 3 END: CONFIG
   ========================================================= */

/* =========================================================
   BLOCK 4 START: GLOBAL STYLE PATCHES
   ========================================================= */
function injectMobileLayoutStyles() {
  if (document.getElementById("casablancaMobileHeavyStyles")) return;

  const style = document.createElement("style");
  style.id = "casablancaMobileHeavyStyles";
  style.textContent = `
    #matterport,
    .drawer-nav a[href="#matterport"] {
      display: none !important;
    }

    .mobile-floating-actions {
      position: fixed;
      left: 50%;
      bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
      z-index: 80;
      display: none;
      transform: translate(-50%, 18px);
      opacity: 0;
      pointer-events: none;
      transition: opacity .36s ease, transform .36s ease;
      width: min(92vw, 370px);
    }

    .mobile-floating-actions__inner {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.72rem;
      width: 100%;
    }

    .mobile-floating-actions .btn {
      min-height: 48px !important;
      width: 100% !important;
      min-width: 0 !important;
      padding: .78rem 1rem !important;
      border-radius: 999px !important;
      font-size: clamp(.76rem, 3.15vw, .93rem) !important;
      letter-spacing: .105em !important;
      line-height: 1.08 !important;
      white-space: nowrap !important;
      text-align: center !important;
      justify-content: center !important;
    }

    .mobile-floating-actions.is-visible:not(.is-hidden):not(.is-scrolling) {
      opacity: 1;
      transform: translate(-50%, 0);
      pointer-events: auto;
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
      font-size: clamp(.86rem, .9vw, .98rem) !important;
      line-height: 1.58 !important;
    }

    @media (max-width: 1200px) {
      #policies .policy-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      }
    }

    @media (max-width: 768px) {
      .mobile-floating-actions {
        display: block;
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
      .gallery-heading-centered .lead,
      .floorplan-section .lead,
      #policies .lead,
      #availability .lead,
      .footer-cta-card p,
      .footer-brand-block p {
        max-width: min(92vw, 34rem) !important;
      }

      .hero-intro-section .title-lg,
      .estate-summary-card .title-lg,
      .floorplan-section .title-lg,
      #policies .title-lg,
      #availability .title-lg {
        text-align: center !important;
      }

      #policies .policy-grid {
        grid-template-columns: 1fr !important;
        max-width: min(92vw, 520px) !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      .hero-intro-buttons {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: .82rem !important;
        max-width: min(92vw, 360px) !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      .hero-intro-buttons .btn {
        min-height: 50px !important;
        font-size: clamp(.78rem, 3.2vw, .92rem) !important;
        letter-spacing: .09em !important;
      }
    }
  `;

  document.head.appendChild(style);
}
/* =========================================================
   BLOCK 4 END: GLOBAL STYLE PATCHES
   ========================================================= */

/* =========================================================
   BLOCK 5 START: PAGE-SPECIFIC DOM PATCHES
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

  if (main.firstElementChild !== approvedHero) {
    main.insertBefore(approvedHero, main.firstElementChild);
  }

  const welcome = document.getElementById("welcome");
  if (welcome && approvedHero.nextElementSibling !== welcome) {
    main.insertBefore(welcome, approvedHero.nextElementSibling);
  }
}

function patchContentFlow() {
  injectMobileLayoutStyles();
  removeLegacyHeroConflicts();

  const welcome = document.querySelector("#welcome .narrow-shell");
  const summaryCard = document.querySelector(".estate-summary-card");
  const availabilityHeading = document.querySelector("#availability h2");
  const matterport = document.getElementById("matterport");
  const conciergeCards = Array.from(document.querySelectorAll(".concierge-option"));
  const footerExploreTitle = document.querySelector(".footer-links-card h3");
  const floorplanImage = document.querySelector(".framed-floorplan img");

  matterport?.remove();
  document.querySelectorAll('a[href="#matterport"]').forEach((link) => link.remove());

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

  if (summaryCard) {
    const cardTitle = summaryCard.querySelector("h2");
    const cardLead = summaryCard.querySelector(".lead");
    const duplicateButtons = summaryCard.querySelector(".intro-button-row");
    if (cardTitle) cardTitle.textContent = "A Private Las Vegas Estate Designed for Groups, Events & VIP Stays";
    if (cardLead) {
      cardLead.textContent = "A private, high-end estate for guests who want the space of a luxury residence, the discretion of a private booking team, and the service layer of a VIP concierge experience. Casablanca Las Vegas is positioned for elevated group stays, private retreats, productions, professional networking events, weddings, and premium day events close to the Strip without placing the exact address in front of every casual browser.";
    }
    duplicateButtons?.remove();
  }

  if (availabilityHeading) availabilityHeading.textContent = "Check Dates For Availability";
  if (footerExploreTitle) footerExploreTitle.textContent = "Explore";

  document.querySelectorAll(".btn").forEach((button) => {
    if ((button.textContent || "").trim().toLowerCase().includes("check your dates")) {
      button.textContent = "Check Available Dates";
    }
  });

  if (floorplanImage) {
    floorplanImage.src = FLOORPLAN_IMAGE;
    floorplanImage.srcset = `${FLOORPLAN_IMAGE} 1600w`;
    floorplanImage.sizes = "(max-width: 900px) 100vw, 72vw";
    floorplanImage.alt = "Updated Casablanca Las Vegas estate floorplan showing sleeping layout and room flow";
  }

  conciergeCards.forEach((card) => {
    card.removeAttribute("href");
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.addEventListener("click", (event) => event.preventDefault());
  });
}
/* =========================================================
   BLOCK 5 END: PAGE-SPECIFIC DOM PATCHES
   ========================================================= */

/* =========================================================
   BLOCK 6 START: MOBILE FLOATING CTA BUTTONS
   ========================================================= */
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

  const isInsideHero = () => {
    const heroHeight = hero.offsetHeight || window.innerHeight;
    return window.scrollY < heroHeight * 0.82;
  };

  const syncState = () => {
    const shouldHide = !mobileMediaQuery.matches || isInsideHero();
    actions.classList.toggle("is-hidden", shouldHide);
    actions.classList.toggle("is-scrolling", isScrolling);
    actions.classList.toggle("is-visible", mobileMediaQuery.matches && !shouldHide);
  };

  window.addEventListener("scroll", () => {
    isScrolling = true;
    syncState();
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      isScrolling = false;
      syncState();
    }, 3000);
  }, { passive: true });

  window.addEventListener("resize", syncState, { passive: true });
  syncState();
}
/* =========================================================
   BLOCK 6 END: MOBILE FLOATING CTA BUTTONS
   ========================================================= */

/* =========================================================
   BLOCK 7 START: EXACT UPLOADED TEXT CSS + STRUCTURE
   ========================================================= */
function injectExactHeroTextStyles() {
  if (document.getElementById("exactUploadedHeroTextStyles")) return;

  const style = document.createElement("style");
  style.id = "exactUploadedHeroTextStyles";
  style.textContent = `
    .casa-hero-slide-title {
      display: none !important;
    }

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
      line-height: 0.74 !important;
      letter-spacing: -0.045em !important;
      text-align: center !important;
      text-wrap: balance !important;
      overflow: visible !important;
      text-shadow:
        0 3px 7px rgba(0, 0, 0, 0.72),
        0 10px 24px rgba(0, 0, 0, 0.54),
        0 0 24px rgba(255, 212, 0, 0.16) !important;
    }

    .casa-webgl-hero .word-container {
      display: inline-flex !important;
      vertical-align: top !important;
      margin: 0 0.16em !important;
      padding: 0.04em 0.02em 0.12em !important;
      overflow: visible !important;
    }

    .casa-webgl-hero .word {
      display: inline-flex !important;
      white-space: nowrap !important;
      overflow: visible !important;
    }

    .casa-webgl-hero .char {
      display: inline-block !important;
      transform: translateY(115%);
      opacity: 0;
      will-change: transform, opacity;
      overflow: visible !important;
    }

    .casa-webgl-hero .mobile-title-line {
      display: block !important;
      width: 100% !important;
      overflow: visible !important;
    }

    .casa-webgl-hero .mobile-title-line + .mobile-title-line {
      margin-top: clamp(.3rem, 1.5vh, .85rem) !important;
    }

    @media (max-width: 768px) {
      .casa-webgl-hero #dynamic-title {
        font-size: clamp(2rem, 11vw, 4.4rem) !important;
        line-height: 0.78 !important;
        letter-spacing: -0.04em !important;
        padding-bottom: 0.36em !important;
      }

      .casa-webgl-hero .word-container {
        margin: 0 0.105em !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .casa-webgl-hero .char {
        transform: translateY(0) !important;
        opacity: 1 !important;
      }
    }
  `;
  document.head.appendChild(style);
}

function ensureExactHeroText() {
  injectExactHeroTextStyles();

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

  return heroText.querySelector("#dynamic-title");
}
/* =========================================================
   BLOCK 7 END: EXACT UPLOADED TEXT CSS + STRUCTURE
   ========================================================= */

/* =========================================================
   BLOCK 8 START: WATERFALL TEXT ANIMATION
   ========================================================= */
function createWordSpans(text, container) {
  const words = text.split(" ").filter(Boolean);

  words.forEach((word, wordIndex) => {
    const wordContainer = document.createElement("span");
    wordContainer.className = "word-container";

    const wordSpan = document.createElement("span");
    wordSpan.className = "word";

    Array.from(word).forEach((letter) => {
      const charSpan = document.createElement("span");
      charSpan.className = "char";
      charSpan.textContent = letter;
      wordSpan.appendChild(charSpan);
    });

    wordContainer.appendChild(wordSpan);
    container.appendChild(wordContainer);

    if (wordIndex < words.length - 1) {
      container.appendChild(document.createTextNode(" "));
    }
  });
}

function splitMobileTitle(title) {
  const words = title.split(" ").filter(Boolean);
  if (words.length <= 1) return [title, ""];

  const splitIndex = title === "Put Your Feet In the Sand"
    ? 3
    : Math.ceil(words.length / 2);

  return [
    words.slice(0, splitIndex).join(" "),
    words.slice(splitIndex).join(" ")
  ];
}

function animateTextIn(title) {
  const titleContainer = ensureExactHeroText();
  if (!titleContainer) return;

  titleContainer.textContent = "";

  if (!title || !title.trim()) {
    return;
  }

  const useMobileSplit = mobileMediaQuery.matches;

  if (useMobileSplit) {
    const [topLine, bottomLine] = splitMobileTitle(title);
    const topWrapper = document.createElement("span");
    const bottomWrapper = document.createElement("span");
    topWrapper.className = "mobile-title-line mobile-title-line-top";
    bottomWrapper.className = "mobile-title-line mobile-title-line-bottom";
    createWordSpans(topLine, topWrapper);
    createWordSpans(bottomLine, bottomWrapper);
    titleContainer.appendChild(topWrapper);
    if (bottomLine) titleContainer.appendChild(bottomWrapper);
  } else {
    createWordSpans(title, titleContainer);
  }

  const chars = titleContainer.querySelectorAll(".char");
  const gsapRef = window.gsap;

  if (prefersReducedMotion || !gsapRef) {
    chars.forEach((char) => {
      char.style.transform = "translateY(0%)";
      char.style.opacity = "1";
      char.style.rotate = "0deg";
    });
    return;
  }

  if (useMobileSplit) {
    const topChars = titleContainer.querySelectorAll(".mobile-title-line-top .char");
    const bottomChars = titleContainer.querySelectorAll(".mobile-title-line-bottom .char");

    gsapRef.set(topChars, { y: "-135%", opacity: 0, rotateZ: -5 });
    gsapRef.set(bottomChars, { y: "135%", opacity: 0, rotateZ: 5 });

    gsapRef.to(topChars, {
      y: "0%",
      opacity: 1,
      rotateZ: 0,
      duration: 0.9,
      ease: "expo.out",
      stagger: { each: 0.026, from: "start" }
    });

    gsapRef.to(bottomChars, {
      y: "0%",
      opacity: 1,
      rotateZ: 0,
      duration: 0.9,
      ease: "expo.out",
      stagger: { each: 0.026, from: "start" }
    });
    return;
  }

  gsapRef.set(chars, {
    y: "112%",
    opacity: 0,
    rotateZ: 5
  });

  gsapRef.to(chars, {
    y: "0%",
    opacity: 1,
    rotateZ: 0,
    duration: 0.82,
    ease: "expo.out",
    stagger: {
      each: 0.024,
      from: "start"
    }
  });
}

function animateTextOut() {
  const titleContainer = document.querySelector("#dynamic-title");
  const chars = titleContainer?.querySelectorAll(".char") || [];
  const gsapRef = window.gsap;

  if (!chars.length || prefersReducedMotion || !gsapRef) {
    return;
  }

  if (mobileMediaQuery.matches) {
    const topChars = titleContainer.querySelectorAll(".mobile-title-line-top .char");
    const bottomChars = titleContainer.querySelectorAll(".mobile-title-line-bottom .char");

    gsapRef.to(topChars, {
      y: "-135%",
      opacity: 0,
      rotateZ: -5,
      duration: 0.42,
      ease: "power2.in",
      stagger: { each: 0.014, from: "start" }
    });

    gsapRef.to(bottomChars, {
      y: "135%",
      opacity: 0,
      rotateZ: 5,
      duration: 0.42,
      ease: "power2.in",
      stagger: { each: 0.014, from: "start" }
    });
    return;
  }

  gsapRef.to(chars, {
    y: "-112%",
    opacity: 0,
    rotateZ: -5,
    duration: 0.42,
    ease: "power2.in",
    stagger: {
      each: 0.014,
      from: "start"
    }
  });
}
/* =========================================================
   BLOCK 8 END: WATERFALL TEXT ANIMATION
   ========================================================= */

/* =========================================================
   BLOCK 9 START: TEXTURE LOADING
   ========================================================= */
const loader = new THREE.TextureLoader();
loader.crossOrigin = "anonymous";

function prepareTexture(texture) {
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

function loadAllTextures() {
  return Promise.all(
    imageUrls.map((url) => {
      return new Promise((resolve, reject) => {
        loader.load(
          url,
          (texture) => resolve(prepareTexture(texture)),
          undefined,
          reject
        );
      });
    })
  );
}
/* =========================================================
   BLOCK 9 END: TEXTURE LOADING
   ========================================================= */

/* =========================================================
   BLOCK 10 START: WEBGL SHADERS
   ========================================================= */
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

  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  vec2 coverUv(vec2 uv, vec2 imageSize, vec2 resolution) {
    vec2 centeredUv = uv - 0.5;

    float screenAspect = resolution.x / resolution.y;
    float imageAspect = imageSize.x / imageSize.y;

    if (screenAspect < imageAspect) {
      centeredUv.x *= screenAspect / imageAspect;
    } else {
      centeredUv.y *= imageAspect / screenAspect;
    }

    return centeredUv + 0.5;
  }

  vec4 sampleWithSoftClamp(sampler2D textureMap, vec2 uv) {
    vec2 clampedUv = clamp(uv, vec2(0.001), vec2(0.999));
    return texture2D(textureMap, clampedUv);
  }

  void main() {
    vec2 baseUv = vUv;

    vec2 uv1 = coverUv(baseUv, uTexture1Size, uResolution);
    vec2 uv2 = coverUv(baseUv, uTexture2Size, uResolution);

    float transitionStrength = sin(uProgress * 3.14159265);
    float band = 0.28;
    float revealLine = uProgress * (1.0 + band * 2.0) - band;

    float revealNoise =
      sin(baseUv.y * 15.0 + uTime * 1.65) * 0.035 * transitionStrength +
      sin(baseUv.y * 43.0 - uTime * 2.05) * 0.018 * transitionStrength;

    float revealMask = 1.0 - smoothstep(
      revealLine - band,
      revealLine + band,
      baseUv.x + revealNoise
    );

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
/* =========================================================
   BLOCK 10 END: WEBGL SHADERS
   ========================================================= */

/* =========================================================
   BLOCK 11 START: THREE.JS SETUP
   ========================================================= */
function initWebGL() {
  const heroStage = document.getElementById("casaWebglHero");
  if (!heroStage) return;

  scene = new THREE.Scene();

  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance"
  });

  heroStage.innerHTML = "";
  heroStage.appendChild(renderer.domElement);

  const rect = heroStage.getBoundingClientRect();
  const width = Math.max(1, rect.width || window.innerWidth);
  const height = Math.max(1, rect.height || window.innerHeight);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
  renderer.setSize(width, height, false);

  uniforms = {
    uTexture1: { value: texturesLoaded[0] },
    uTexture2: { value: texturesLoaded[getNextIndex(0)] },
    uTexture1Size: { value: new THREE.Vector2(1, 1) },
    uTexture2Size: { value: new THREE.Vector2(1, 1) },
    uResolution: { value: new THREE.Vector2(width, height) },
    uProgress: { value: 0 },
    uTime: { value: 0 }
  };

  setTextureSize("uTexture1Size", texturesLoaded[0]);
  setTextureSize("uTexture2Size", texturesLoaded[getNextIndex(0)]);

  material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: false
  });

  const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  heroStage.classList.add("is-ready");
}

function setTextureSize(uniformName, texture) {
  const image = texture && texture.image;

  if (!image) {
    uniforms[uniformName].value.set(1, 1);
    return;
  }

  uniforms[uniformName].value.set(image.width || 1, image.height || 1);
}

function resizeRenderer() {
  const heroStage = document.getElementById("casaWebglHero");
  if (!renderer || !uniforms || !heroStage) return;

  const rect = heroStage.getBoundingClientRect();
  const width = Math.max(1, rect.width || window.innerWidth);
  const height = Math.max(1, rect.height || window.innerHeight);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
  renderer.setSize(width, height, false);
  uniforms.uResolution.value.set(width, height);
}
/* =========================================================
   BLOCK 11 END: THREE.JS SETUP
   ========================================================= */

/* =========================================================
   BLOCK 12 START: SAFE IMAGE SEQUENCING
   ========================================================= */
function getNextIndex(index) {
  if (imageUrls.length <= 1) {
    return index;
  }

  const total = imageUrls.length;
  let next = (index + 1) % total;
  let guard = 0;

  while (imageUrls[next] === imageUrls[index] && guard < total) {
    next = (next + 1) % total;
    guard++;
  }

  return next;
}
/* =========================================================
   BLOCK 12 END: SAFE IMAGE SEQUENCING
   ========================================================= */

/* =========================================================
   BLOCK 13 START: TRANSITION LOOP
   ========================================================= */
function transitionToNext() {
  if (isTransitioning || texturesLoaded.length < 2) {
    return;
  }

  isTransitioning = true;

  const targetIndex = getNextIndex(currentIndex);
  const currentTexture = texturesLoaded[currentIndex];
  const targetTexture = texturesLoaded[targetIndex];

  uniforms.uTexture1.value = currentTexture;
  uniforms.uTexture2.value = targetTexture;
  setTextureSize("uTexture1Size", currentTexture);
  setTextureSize("uTexture2Size", targetTexture);
  uniforms.uProgress.value = 0;

  animateTextOut();

  if (textSwapTimer) {
    clearTimeout(textSwapTimer);
  }

  textSwapTimer = setTimeout(() => {
    animateTextIn(slideTitles[targetIndex]);
  }, TRANSITION_DURATION * 430);

  const gsapRef = window.gsap;

  if (!gsapRef || prefersReducedMotion) {
    uniforms.uProgress.value = 1;
    currentIndex = targetIndex;
    const futureIndex = getNextIndex(currentIndex);
    uniforms.uTexture1.value = texturesLoaded[currentIndex];
    uniforms.uTexture2.value = texturesLoaded[futureIndex];
    setTextureSize("uTexture1Size", texturesLoaded[currentIndex]);
    setTextureSize("uTexture2Size", texturesLoaded[futureIndex]);
    uniforms.uProgress.value = 0;
    isTransitioning = false;
    transitionTimer = setTimeout(transitionToNext, getHoldDuration(currentIndex) * 1000);
    return;
  }

  gsapRef.killTweensOf(uniforms.uProgress);

  gsapRef.to(uniforms.uProgress, {
    value: 1,
    duration: TRANSITION_DURATION,
    ease: "power3.inOut",
    onComplete: () => {
      currentIndex = targetIndex;

      const futureIndex = getNextIndex(currentIndex);

      uniforms.uTexture1.value = texturesLoaded[currentIndex];
      uniforms.uTexture2.value = texturesLoaded[futureIndex];
      setTextureSize("uTexture1Size", texturesLoaded[currentIndex]);
      setTextureSize("uTexture2Size", texturesLoaded[futureIndex]);
      uniforms.uProgress.value = 0;

      isTransitioning = false;

      if (transitionTimer) {
        clearTimeout(transitionTimer);
      }

      transitionTimer = setTimeout(
        transitionToNext,
        getHoldDuration(currentIndex) * 1000
      );
    }
  });
}
/* =========================================================
   BLOCK 13 END: TRANSITION LOOP
   ========================================================= */

/* =========================================================
   BLOCK 14 START: RENDER LOOP
   ========================================================= */
function render() {
  if (uniforms) {
    uniforms.uTime.value += clock.getDelta();
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }

  requestAnimationFrame(render);
}
/* =========================================================
   BLOCK 14 END: RENDER LOOP
   ========================================================= */

/* =========================================================
   BLOCK 15 START: MAP + FLOORPLAN LIGHTBOX
   ========================================================= */
function initMapAndFloorplanLightbox() {
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const zoomImages = Array.from(document.querySelectorAll(".framed-map-card img, .framed-floorplan img"));

  if (!lightbox || !lightboxImage || !zoomImages.length) return;

  const openImage = (image) => {
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "Casablanca Las Vegas estate image";
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeImage = () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  };

  zoomImages.forEach((image) => {
    image.classList.add(image.closest(".framed-map-card") ? "map-lightbox-image" : "floorplan-lightbox-image");
    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `Open larger view of ${image.alt || "estate image"}`);
    image.addEventListener("click", () => openImage(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openImage(image);
      }
    });
  });

  lightboxClose?.addEventListener("click", closeImage);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeImage();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("active")) closeImage();
  });
}
/* =========================================================
   BLOCK 15 END: MAP + FLOORPLAN LIGHTBOX
   ========================================================= */

/* =========================================================
   BLOCK 16 START: GSAP SPLIT-MERGE SECTION
   ========================================================= */
function initSplitMergeAnimation() {
  const gsapRef = window.gsap;
  if (!gsapRef || prefersReducedMotion) return;

  const left = document.querySelector(".split-half-left");
  const right = document.querySelector(".split-half-right");
  const section = document.querySelector(".split-merge-section");
  if (!left || !right || !section) return;

  const runTween = () => {
    gsapRef.fromTo(left, { x: "-18vw", opacity: 0.35 }, { x: 0, opacity: 1, duration: 1.15, ease: "power3.out" });
    gsapRef.fromTo(right, { x: "18vw", opacity: 0.35 }, { x: 0, opacity: 1, duration: 1.15, ease: "power3.out" });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      runTween();
      observer.disconnect();
    });
  }, { threshold: 0.28 });

  observer.observe(section);
}
/* =========================================================
   BLOCK 16 END: GSAP SPLIT-MERGE SECTION
   ========================================================= */

/* =========================================================
   BLOCK 17 START: INITIALIZATION
   ========================================================= */
async function startHero() {
  if (heroStarted) return;
  heroStarted = true;

  try {
    refreshActiveSlideData();
    ensureExactHeroText();
    texturesLoaded = await loadAllTextures();

    if (!texturesLoaded.length) {
      throw new Error("No textures loaded.");
    }

    currentIndex = 0;
    initWebGL();
    animateTextIn(slideTitles[0]);
    render();

    if (texturesLoaded.length > 1) {
      transitionTimer = setTimeout(
        transitionToNext,
        getHoldDuration(currentIndex) * 1000
      );
    }

    window.addEventListener("resize", resizeRenderer, { passive: true });
  } catch (error) {
    console.error("Hero transition failed to initialize:", error);
    animateTextIn("Luxury Awaits");
  }
}

function initCasablancaRefresh() {
  patchContentFlow();
  ensureExactHeroText();
  initMobileFloatingActions();
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
   BLOCK 17 END: INITIALIZATION
   ========================================================= */

/* =========================================================
   BLOCK 1 END: CASABLANCA SITE REFRESH JS
   ========================================================= */
