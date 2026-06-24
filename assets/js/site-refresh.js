/* =========================================================
   BLOCK 1 START: CASABLANCA SITE REFRESH JS
   Purpose: Clean Mediterranean refresh: simple fading hero, no yellow
   hero lettering, lighter cream/ivory sections, floating mobile nav,
   tighter desktop nav, and updated Casablanca logo.
   ========================================================= */

import * as THREE from "https://unpkg.com/three@0.128.0/build/three.module.js";

/* =========================================================
   BLOCK 2 START: HERO SLIDES + BRAND CONSTANTS
   ========================================================= */
const MOBILE_QUERY = window.matchMedia("(max-width: 768px)");
const NEW_LOGO_URL = "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a20dd265cd41fa7c6b88dfa.webp";
const HERO_SLIDES = [
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabb5a3e6e89b6028b15.webp",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e22f8d7322952d1866b94.png",
    title: ""
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabbff82912d65b40a8f.webp",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e22f8bb0618436a527c7d.png",
    title: ""
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabb8acf4e863e398382.webp",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e5d7a282a51721af02845.webp",
    title: ""
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabbff82912d65b40a8e.webp",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e5de4ff82912d65e10a7c.webp",
    title: ""
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabd045e32379f1bec11.webp",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e5fa4d7322952d18a1007.webp",
    title: ""
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e2d0cf258f15ece4451fc.webp",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e2d515a3e6e89b62c63c9.webp",
    title: ""
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabb5a3e6e89b6028b14.webp",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e2e4fff82912d65ddfa4c.webp",
    title: ""
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabbd53fc25488ce16d3.webp",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e2dabf563bf237f8c12f5.webp",
    title: ""
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1fbffa9e7a0d5a8b40bfe9.jpg",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e5f8c5a3e6e89b62fa02e.webp",
    title: ""
  }
];

const HOLD_DURATION = 2.55;
const TRANSITION_DURATION = 1.2;
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
let isTransitioning = false;
let heroStarted = false;

function refreshActiveSlides() {
  const seen = new Set();
  activeSlides = HERO_SLIDES
    .map((slide) => ({
      image: MOBILE_QUERY.matches && slide.mobileImage ? slide.mobileImage : slide.image,
      title: slide.title || ""
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
   BLOCK 2 END: HERO SLIDES + BRAND CONSTANTS
   ========================================================= */


/* =========================================================
   BLOCK 3 START: MEDITERRANEAN VISUAL REFRESH STYLES
   ========================================================= */
function injectFinalStyles() {
  if (document.getElementById("casablancaMediterraneanRefreshStyles")) return;

  const style = document.createElement("style");
  style.id = "casablancaMediterraneanRefreshStyles";
  style.textContent = `
    :root {
      --casa-new-logo: url('${NEW_LOGO_URL}');
      --casa-ivory: #fffaf0;
      --casa-cream: #f6efe3;
      --casa-sand: #eadcc8;
      --casa-stone: #d8c7ad;
      --casa-ink: #1b1712;
      --casa-muted: #665f55;
      --casa-green: #0d3a2f;
      --casa-green-2: #153f35;
      --casa-bronze: #a8752c;
      --casa-bronze-light: #c79a50;
      --casa-border: rgba(168,117,44,.26);
      --lux-black: var(--casa-cream) !important;
      --lux-black-2: var(--casa-ivory) !important;
      --lux-card: var(--casa-ivory) !important;
      --lux-gold: var(--casa-bronze) !important;
      --lux-gold-light: var(--casa-bronze-light) !important;
    }

    html,
    body {
      background: var(--casa-cream) !important;
      color: var(--casa-ink) !important;
    }

    body {
      background-image:
        radial-gradient(circle at 50% 0%, rgba(199,154,80,.16), transparent 34rem),
        linear-gradient(180deg, var(--casa-ivory) 0%, var(--casa-cream) 100%) !important;
    }

    .main-logo,
    .drawer-logo,
    .footer-brand-block img,
    .site-footer-luxury img,
    .logo-wrapper img {
      content: var(--casa-new-logo) !important;
      object-fit: contain !important;
    }

    .casa-webgl-hero .hero-text,
    .casa-webgl-hero #dynamic-title,
    .casa-hero-slide-title,
    .casa-mobile-title-stabilizer {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }

    .casa-webgl-hero {
      background: var(--casa-cream) !important;
    }

    .casa-webgl-stage,
    .casa-webgl-stage canvas {
      background: var(--casa-cream) !important;
    }

    .casa-webgl-hero::after {
      background:
        linear-gradient(90deg, rgba(0,0,0,.30) 0%, rgba(0,0,0,.08) 42%, rgba(0,0,0,.08) 100%),
        linear-gradient(180deg, rgba(0,0,0,.08), rgba(0,0,0,.02) 52%, rgba(0,0,0,.10)) !important;
    }

    .hero-intro-section,
    .private-estate-card-section,
    .pricing-black-section,
    .concierge-luxury-section,
    section.bg-dark,
    .section.bg-dark {
      background: var(--casa-cream) !important;
      background-image:
        radial-gradient(circle at 50% 0%, rgba(168,117,44,.10), transparent 34rem),
        linear-gradient(180deg, var(--casa-ivory), var(--casa-cream)) !important;
      color: var(--casa-ink) !important;
    }

    .section.bg-cream,
    .section.bg-ivory,
    .map-positioning-section,
    .floorplan-section {
      background: var(--casa-ivory) !important;
      color: var(--casa-ink) !important;
    }

    .lead,
    .lead.light,
    .section.bg-dark .lead,
    .section.bg-dark .lead.light,
    .hero-intro-section .intro-lead,
    .concierge-luxury-section .lead.light,
    .pricing-black-section .lead.light {
      color: rgba(27,23,18,.72) !important;
    }

    .title-lg,
    .title-md,
    .font-display,
    h1,
    h2,
    h3 {
      color: var(--casa-ink) !important;
    }

    .eyebrow,
    .eyebrow.center {
      color: var(--casa-bronze) !important;
      letter-spacing: .18em !important;
    }

    .card-dark,
    .mini-card,
    .price-card,
    .estate-summary-card,
    .policy-grid .mini-card,
    .concierge-option {
      background: rgba(255,250,240,.94) !important;
      color: var(--casa-ink) !important;
      border: 1px solid var(--casa-border) !important;
      box-shadow: 0 28px 70px rgba(63,47,28,.12), inset 0 1px 0 rgba(255,255,255,.7) !important;
    }

    .card-dark p,
    .mini-card p,
    .price-card .count,
    .policy-grid p,
    .concierge-option p {
      color: rgba(27,23,18,.70) !important;
    }

    .btn,
    .btn-gold,
    .drawer-actions .btn,
    .intro-button-row .btn,
    .footer-button-row .btn {
      border-radius: 0 !important;
      letter-spacing: .14em !important;
      box-shadow: none !important;
    }

    .btn-gold,
    .drawer-actions .btn-gold {
      background: var(--casa-green) !important;
      color: var(--casa-ivory) !important;
      border: 1px solid var(--casa-green) !important;
    }

    .btn-outline,
    .drawer-actions .btn-outline {
      background: transparent !important;
      color: var(--casa-green) !important;
      border: 1px solid rgba(13,58,47,.55) !important;
    }

    .trust-strip .badge,
    .badge {
      background: rgba(255,250,240,.86) !important;
      color: var(--casa-green) !important;
      border: 1px solid var(--casa-border) !important;
    }

    .gold-svg-icon {
      position: relative !important;
      width: 2.85rem !important;
      height: 2.85rem !important;
      min-width: 2.85rem !important;
      display: inline-grid !important;
      place-items: center !important;
      border-radius: 999px !important;
      color: var(--casa-bronze) !important;
      background: rgba(255,250,240,.92) !important;
      border: 1px solid rgba(168,117,44,.34) !important;
      box-shadow: 0 12px 28px rgba(63,47,28,.10), inset 0 1px 0 rgba(255,255,255,.8) !important;
    }

    .gold-svg-icon svg {
      display: none !important;
    }

    .gold-svg-icon::before {
      content: "";
      width: 1.16rem;
      height: .86rem;
      border: 2px solid currentColor;
      border-bottom: 0;
      border-radius: 999px 999px 0 0;
      transform: translateY(.08rem);
    }

    .gold-svg-icon::after {
      content: "";
      position: absolute;
      width: 1.28rem;
      height: 2px;
      background: currentColor;
      bottom: .72rem;
      opacity: .9;
    }

    .site-header,
    .site-header.is-scrolled {
      background: rgba(255,250,240,.92) !important;
      background-image: linear-gradient(180deg, rgba(255,253,247,.96), rgba(246,239,227,.91)) !important;
      border-bottom: 1px solid rgba(168,117,44,.24) !important;
      box-shadow: 0 18px 42px rgba(58,40,18,.12) !important;
      backdrop-filter: blur(18px) saturate(1.06) !important;
    }

    .nav-link {
      color: var(--casa-green) !important;
      border: 1px solid rgba(168,117,44,.30) !important;
      background: rgba(255,250,240,.62) !important;
      border-radius: 999px !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }

    .nav-link:hover,
    .nav-link:focus-visible {
      color: var(--casa-ivory) !important;
      background: var(--casa-green) !important;
      border-color: var(--casa-green) !important;
    }

    .hamburger-btn,
    .close-btn {
      color: var(--casa-green) !important;
      background: rgba(255,250,240,.78) !important;
      border: 1px solid rgba(168,117,44,.34) !important;
      box-shadow: 0 10px 24px rgba(63,47,28,.10) !important;
    }

    .drawer {
      background: rgba(255,250,240,.98) !important;
      color: var(--casa-ink) !important;
      border: 1px solid var(--casa-border) !important;
      box-shadow: 0 30px 90px rgba(63,47,28,.22) !important;
    }

    .drawer-nav a {
      color: var(--casa-green) !important;
      border-bottom-color: rgba(168,117,44,.18) !important;
    }

    .overlay.active {
      background: rgba(27,23,18,.28) !important;
      backdrop-filter: blur(4px) !important;
    }

    .mobile-floating-actions {
      display: none !important;
    }

    .site-footer,
    .site-footer-luxury {
      background: var(--casa-green) !important;
      color: var(--casa-ivory) !important;
    }

    @media (min-width: 1024px) {
      .site-header,
      .header-container,
      .nav-bar-container {
        overflow: visible !important;
      }

      .site-header {
        min-height: clamp(88px, 6vw, 108px) !important;
      }

      .header-container {
        max-width: min(1540px, calc(100% - 4vw)) !important;
        margin-inline: auto !important;
      }

      .nav-bar-container {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) clamp(176px, 13vw, 230px) minmax(0, 1fr) !important;
        align-items: center !important;
        column-gap: clamp(.38rem, .75vw, .9rem) !important;
        min-height: clamp(88px, 6vw, 108px) !important;
      }

      .brand-group {
        position: absolute !important;
        top: 50% !important;
        left: 50% !important;
        width: clamp(168px, 12.5vw, 225px) !important;
        height: clamp(82px, 6vw, 112px) !important;
        transform: translate(-50%, -46%) !important;
        z-index: 44 !important;
        pointer-events: auto !important;
      }

      .logo-wrapper {
        position: relative !important;
        top: auto !important;
        left: auto !important;
        display: grid !important;
        place-items: center !important;
        transform: none !important;
      }

      .main-logo {
        width: clamp(165px, 12.5vw, 220px) !important;
        max-width: none !important;
        height: auto !important;
        filter: drop-shadow(0 12px 16px rgba(63,47,28,.18)) !important;
      }

      .nav-left,
      .nav-right {
        display: flex !important;
        align-items: center !important;
        gap: clamp(.38rem, .65vw, .72rem) !important;
        margin: 0 !important;
      }

      .nav-left {
        grid-column: 1 !important;
        justify-self: end !important;
        padding-right: clamp(.2rem, .5vw, .65rem) !important;
      }

      .nav-right {
        grid-column: 3 !important;
        justify-self: start !important;
        padding-left: clamp(.2rem, .5vw, .65rem) !important;
      }

      .nav-link {
        min-width: auto !important;
        padding: .78rem clamp(.82rem, 1.05vw, 1.2rem) !important;
        font-size: clamp(.64rem, .62vw, .78rem) !important;
        letter-spacing: .12em !important;
      }

      .hamburger-btn {
        display: none !important;
      }
    }

    @media (max-width: 1023px) {
      .site-header,
      .site-header.is-scrolled {
        position: fixed !important;
        top: max(10px, env(safe-area-inset-top)) !important;
        left: 12px !important;
        right: 12px !important;
        width: auto !important;
        min-height: 66px !important;
        border-radius: 999px !important;
        border: 1px solid rgba(168,117,44,.28) !important;
        z-index: 999 !important;
        overflow: visible !important;
      }

      .header-container {
        min-height: 66px !important;
        padding: 0 .85rem 0 1rem !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
      }

      .brand-group {
        position: relative !important;
        top: auto !important;
        left: auto !important;
        width: clamp(135px, 42vw, 172px) !important;
        height: auto !important;
        transform: none !important;
        z-index: 2 !important;
      }

      .logo-wrapper {
        position: relative !important;
        top: auto !important;
        left: auto !important;
        display: block !important;
        transform: none !important;
      }

      .main-logo {
        width: clamp(132px, 40vw, 168px) !important;
        max-width: 100% !important;
        height: auto !important;
        filter: drop-shadow(0 8px 10px rgba(63,47,28,.16)) !important;
      }

      .nav-bar-container {
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        width: auto !important;
        min-height: 0 !important;
        margin-left: auto !important;
      }

      .nav-list,
      .nav-left,
      .nav-right {
        display: none !important;
      }

      .hamburger-btn {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 46px !important;
        height: 46px !important;
        min-width: 46px !important;
        border-radius: 999px !important;
        font-size: 1.55rem !important;
        line-height: 1 !important;
      }

      .drawer {
        position: fixed !important;
        top: calc(max(10px, env(safe-area-inset-top)) + 76px) !important;
        right: 12px !important;
        left: auto !important;
        width: min(390px, calc(100vw - 24px)) !important;
        height: auto !important;
        max-height: calc(100svh - 102px) !important;
        border-radius: 28px !important;
        overflow-y: auto !important;
        transform: translate3d(110%, 0, 0) !important;
      }

      .drawer.open {
        transform: translate3d(0, 0, 0) !important;
      }

      .drawer-header {
        padding: 1.05rem 1.05rem .5rem !important;
      }

      .drawer-logo {
        width: clamp(150px, 48vw, 205px) !important;
        height: auto !important;
      }

      .drawer-nav {
        padding: .25rem 1.2rem 1.1rem !important;
      }

      .drawer-actions {
        padding: 0 1.2rem 1.25rem !important;
      }

      .casa-webgl-hero {
        min-height: 88svh !important;
        height: 88svh !important;
      }

      .casa-webgl-hero .hero-picture,
      .casa-webgl-hero .hero-picture img,
      .casa-webgl-hero .hero-fallback img {
        min-height: 88svh !important;
      }
    }
  `;

  document.head.appendChild(style);
}
/* =========================================================
   BLOCK 3 END: MEDITERRANEAN VISUAL REFRESH STYLES
   ========================================================= */


/* =========================================================
   BLOCK 4 START: PAGE HELPERS
   ========================================================= */
function syncLogoImages() {
  document
    .querySelectorAll(".main-logo, .drawer-logo, .footer-brand-block img, .site-footer-luxury img, .logo-wrapper img")
    .forEach((image) => {
      image.setAttribute("src", NEW_LOGO_URL);
      image.setAttribute("srcset", `${NEW_LOGO_URL} 800w`);
      image.setAttribute("sizes", "(max-width: 768px) 42vw, 220px");
      image.setAttribute("alt", "Casablanca Las Vegas");
    });
}

function removeLegacyHeroConflicts() {
  document.querySelectorAll(".legacy-hero, .old-hero, .hero-split, .hero-panel, .casa-mobile-title-stabilizer").forEach((node) => node.remove());
}

function patchContentFlow() {
  injectFinalStyles();
  syncLogoImages();
  removeLegacyHeroConflicts();
}

function ensureMobileFloatingActions() {
  const existing = document.getElementById("mobileFloatingActions");
  if (existing) existing.remove();
}

function initMobileFloatingActions() {
  ensureMobileFloatingActions();
}
/* =========================================================
   BLOCK 4 END: PAGE HELPERS
   ========================================================= */


/* =========================================================
   BLOCK 5 START: HERO TEXT REMOVAL
   ========================================================= */
function ensureHeroText() {
  document.querySelectorAll(".casa-webgl-hero .hero-text, #dynamic-title, .casa-hero-slide-title, .casa-mobile-title-stabilizer").forEach((node) => node.remove());
  return null;
}

function fitMobileTitleToViewport() {
  return null;
}

function animateTextIn() {
  ensureHeroText();
}

function animateTextOut() {
  ensureHeroText();
}
/* =========================================================
   BLOCK 5 END: HERO TEXT REMOVAL
   ========================================================= */


/* =========================================================
   BLOCK 6 START: SIMPLE FADE WEBGL HERO
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

  vec2 coverUv(vec2 uv, vec2 imageSize, vec2 resolution) {
    vec2 centeredUv = uv - 0.5;
    float screenAspect = resolution.x / resolution.y;
    float imageAspect = imageSize.x / imageSize.y;
    if (screenAspect < imageAspect) centeredUv.x *= screenAspect / imageAspect;
    else centeredUv.y *= imageAspect / screenAspect;
    return centeredUv + 0.5;
  }

  vec4 sampleCover(sampler2D textureMap, vec2 uv, vec2 imageSize, vec2 resolution) {
    return texture2D(textureMap, clamp(coverUv(uv, imageSize, resolution), vec2(0.001), vec2(0.999)));
  }

  void main() {
    vec4 color1 = sampleCover(uTexture1, vUv, uTexture1Size, uResolution);
    vec4 color2 = sampleCover(uTexture2, vUv, uTexture2Size, uResolution);
    float fade = smoothstep(0.0, 1.0, uProgress);
    gl_FragColor = mix(color1, color2, fade);
  }
`;

function applyTextureSettings(texture) {
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

function loadHeroTexture(url) {
  return new Promise((resolve) => {
    loader.load(url, (texture) => resolve(applyTextureSettings(texture)), undefined, () => resolve(null));
  });
}

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
    ease: "power2.inOut",
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

    const tex0 = await loadHeroTexture(imageUrls[0]);
    if (!tex0) throw new Error("Primary image failed");

    validSlides.push({ texture: tex0, title: slideTitles[0] || "" });
    currentIndex = 0;

    initWebGL();
    render();
    window.addEventListener("resize", resizeRenderer, { passive: true });

    for (let i = 1; i < imageUrls.length; i++) {
      const tex = await loadHeroTexture(imageUrls[i]);
      if (!tex) continue;

      validSlides.push({ texture: tex, title: slideTitles[i] || "" });

      if (validSlides.length === 2) {
        transitionTimer = window.setTimeout(transitionToNext, HOLD_DURATION * 1000);
      }
    }
  } catch (error) {
    console.error("Hero failed to initialize:", error);
  }
}
/* =========================================================
   BLOCK 6 END: SIMPLE FADE WEBGL HERO
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

  const targetTop = Math.max(0, target.getBoundingClientRect().top + window.scrollY);
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
  window.setTimeout(syncLogoImages, 250);
  window.setTimeout(syncLogoImages, 1000);
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