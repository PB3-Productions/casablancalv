/* =========================================================
   CASABLANCA SITE REFRESH JS
   Purpose: Single current hero system, current logo/meta helpers, privacy
   cleanup, and simple fade-only transitions. Legacy hero lettering and the
   seventh slide are intentionally omitted.
   ========================================================= */

import * as THREE from "https://unpkg.com/three@0.128.0/build/three.module.js";

const MOBILE_QUERY = window.matchMedia("(max-width: 768px)");
const NEW_LOGO_URL = "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a3eec33e2763b2eec1f94f4.svg";
const SOCIAL_HERO_IMAGE = "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a3ea3fea24b71f0b2f265b2.png";

const HERO_SLIDES = [
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a3ea3fea24b71f0b2f265b2.png",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a3ea4275aefbd076b97fd36.png"
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a3edcca5aefbd076ba45f4b.png",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a3ea427e2763b2eec10ccc6.png"
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a3ea3fec492ddc24c6f59c2.png",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a3ea427d50c4ff184d81233.png"
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a3ea3ff5dd1fd13ce64717c.png",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a3ea4273c38d825b93d6ab5.png"
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a3ea3fe3c38d825b93d65ad.png",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a3ea427cb92c4e0c89d7c97.png"
  },
  {
    image: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a3ea3fed50c4ff184d80d63.png",
    mobileImage: "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a3ea42714a2b82bfeea3e4c.png"
  }
];

const HOLD_DURATION = 2.55;
const TRANSITION_DURATION = 1.2;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function getActiveSlides() {
  const seen = new Set();
  return HERO_SLIDES
    .map((slide) => ({ image: MOBILE_QUERY.matches && slide.mobileImage ? slide.mobileImage : slide.image }))
    .filter((slide) => {
      if (!slide.image || seen.has(slide.image)) return false;
      seen.add(slide.image);
      return true;
    });
}

function setMeta(selector, value) {
  const tag = document.querySelector(selector);
  if (tag) tag.setAttribute("content", value);
}

function syncMetaPreview() {
  setMeta("meta[property='og:image']", SOCIAL_HERO_IMAGE);
  setMeta("meta[name='twitter:image']", SOCIAL_HERO_IMAGE);
  setMeta("meta[name='description']", "Explore Casablanca Las Vegas, an ultra-private luxury estate near the Las Vegas Strip with resort pool, 6 luxury suites, concierge add-ons, event pricing, estate tour, and VIP booking support.");
  setMeta("meta[name='twitter:description']", "Ultra-private Las Vegas luxury estate with resort-style outdoor space, 6 luxury suites, concierge add-ons, and guided availability review.");
}

function syncLogos() {
  document
    .querySelectorAll(".main-logo, .drawer-logo, .footer-brand-block img, .site-footer-luxury img, .logo-wrapper img")
    .forEach((image) => {
      image.src = NEW_LOGO_URL;
      image.srcset = `${NEW_LOGO_URL} 512w`;
      image.sizes = "(max-width: 1023px) 104px, 300px";
      image.alt = "Casablanca Las Vegas";
    });
}

function removePrivateMatterport() {
  document
    .querySelectorAll("#matterport, .drawer-nav a[href='#matterport'], .nav-link[href='#matterport']")
    .forEach((node) => node.remove());
}

function removeHeroText() {
  document
    .querySelectorAll(".casa-webgl-hero .hero-text, #dynamic-title, .casa-hero-slide-title, .casa-mobile-title-stabilizer")
    .forEach((node) => node.remove());
}

function updateVisibleCopy() {
  document.body.innerHTML = document.body.innerHTML
    .replace(/10 possible bedrooms/gi, "6 luxury suites")
    .replace(/10 Possible Bedrooms/g, "6 Luxury Suites")
    .replace(/Possible Bedrooms/g, "Luxury Suites")
    .replace(/>10<\/b><span>Luxury Suites<\/span>/g, ">6</b><span>Luxury Suites</span>")
    .replace(/~5 Mi/g, "5 Mi");
}

function updateHeroFallback(firstImage) {
  const picture = document.querySelector(".casa-webgl-hero .hero-fallback");
  const source = picture?.querySelector("source");
  const img = picture?.querySelector("img");
  if (source && firstImage) source.srcset = `${firstImage} 1920w`;
  if (img && firstImage) {
    img.src = firstImage;
    img.srcset = `${firstImage} 1920w`;
  }
}

function injectRefreshStyles() {
  let style = document.getElementById("casablancaSiteRefreshStyles");
  if (!style) {
    style = document.createElement("style");
    style.id = "casablancaSiteRefreshStyles";
    document.head.appendChild(style);
  }

  style.textContent = `
    :root {
      --casa-new-logo: url('${NEW_LOGO_URL}');
      --casa-hero-first: url('${SOCIAL_HERO_IMAGE}');
      --casa-ivory: #fffaf0;
      --casa-cream: #f6efe3;
      --casa-ink: #1b1712;
      --casa-text: #30291f;
      --casa-green: #0d3a2f;
      --casa-bronze: #a8752c;
      --casa-border: rgba(168,117,44,.26);
    }

    html, body {
      background: var(--casa-cream) !important;
      color: var(--casa-ink) !important;
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

    .casa-webgl-hero,
    .casa-webgl-stage,
    .casa-webgl-stage canvas {
      background: var(--casa-cream) !important;
    }

    .casa-webgl-hero .hero-fallback img {
      content: var(--casa-hero-first) !important;
    }

    #matterport,
    .drawer-nav a[href="#matterport"],
    .nav-link[href="#matterport"] {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }

    .hero-intro-section,
    .private-estate-card-section,
    .pricing-black-section,
    .concierge-luxury-section,
    section.bg-dark,
    .section.bg-dark {
      background: var(--casa-cream) !important;
      background-image: radial-gradient(circle at 50% 0%, rgba(168,117,44,.10), transparent 34rem), linear-gradient(180deg, var(--casa-ivory), var(--casa-cream)) !important;
      color: var(--casa-ink) !important;
    }

    .section.bg-cream,
    .section.bg-ivory,
    .map-positioning-section,
    .floorplan-section {
      background: var(--casa-ivory) !important;
      color: var(--casa-ink) !important;
    }

    .lead, .lead.light, p, li {
      color: var(--casa-text) !important;
    }

    .title-lg, .title-md, .font-display, h1, h2, h3 {
      color: var(--casa-ink) !important;
    }

    .eyebrow, .eyebrow.center {
      color: var(--casa-bronze) !important;
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

    .site-footer, .site-footer-luxury, footer {
      background: #f1e5d2 !important;
      background-image: linear-gradient(180deg, #fffaf0, #eadcc8) !important;
      color: var(--casa-ink) !important;
      border-top: 1px solid rgba(185,138,56,.28) !important;
    }

    .site-footer *, .site-footer-luxury *, footer * {
      color: var(--casa-ink) !important;
    }
  `;
}

let activeSlides = [];
let validSlides = [];
let currentIndex = 0;
let renderer;
let scene;
let camera;
let uniforms;
let transitionTimer = null;
let isTransitioning = false;
let heroStarted = false;
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
    gl_FragColor = mix(color1, color2, smoothstep(0.0, 1.0, uProgress));
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

function getNextIndex(index) {
  if (validSlides.length <= 1) return index;
  return (index + 1) % validSlides.length;
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
    uProgress: { value: 0 }
  };

  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: false });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 1, 1), material));
  resizeRenderer();
  stage.classList.add("is-ready");
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

function transitionToNext() {
  if (isTransitioning || validSlides.length < 2 || !uniforms) return;
  isTransitioning = true;
  const targetIndex = getNextIndex(currentIndex);
  setTexturePair(currentIndex);

  const completeTransition = () => {
    currentIndex = targetIndex;
    const currentTexture = validSlides[currentIndex].texture;
    uniforms.uTexture1.value = currentTexture;
    uniforms.uTexture2.value = currentTexture;
    uniforms.uTexture1Size.value = textureSize(currentTexture);
    uniforms.uTexture2Size.value = textureSize(currentTexture);
    uniforms.uProgress.value = 0;
    isTransitioning = false;
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
  if (uniforms && renderer && scene && camera) renderer.render(scene, camera);
  window.requestAnimationFrame(render);
}

async function startHero() {
  if (heroStarted) return;
  heroStarted = true;
  activeSlides = getActiveSlides();
  updateHeroFallback(activeSlides[0]?.image);

  try {
    const firstTexture = await loadHeroTexture(activeSlides[0]?.image);
    if (!firstTexture) throw new Error("Primary image failed");
    validSlides.push({ texture: firstTexture });
    currentIndex = 0;
    initWebGL();
    render();
    window.addEventListener("resize", resizeRenderer, { passive: true });

    for (let i = 1; i < activeSlides.length; i += 1) {
      const texture = await loadHeroTexture(activeSlides[i].image);
      if (!texture) continue;
      validSlides.push({ texture });
      if (validSlides.length === 2) transitionTimer = window.setTimeout(transitionToNext, HOLD_DURATION * 1000);
    }
  } catch (error) {
    console.error("Hero failed to initialize:", error);
  }
}

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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      gsapRef.fromTo(left, { x: "-18vw", opacity: .35 }, { x: 0, opacity: 1, duration: 1.15, ease: "power3.out" });
      gsapRef.fromTo(right, { x: "18vw", opacity: .35 }, { x: 0, opacity: 1, duration: 1.15, ease: "power3.out" });
      observer.disconnect();
    });
  }, { threshold: .28 });
  observer.observe(section);
}

function initCasablancaRefresh() {
  syncMetaPreview();
  injectRefreshStyles();
  syncLogos();
  removePrivateMatterport();
  removeHeroText();
  updateVisibleCopy();
  initMapAndFloorplanLightbox();
  initSplitMergeAnimation();
  startHero();

  window.setTimeout(() => {
    syncLogos();
    removeHeroText();
  }, 250);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCasablancaRefresh, { once: true });
} else {
  initCasablancaRefresh();
}

window.addEventListener("load", () => {
  syncMetaPreview();
  syncLogos();
  removePrivateMatterport();
  removeHeroText();
}, { once: true });

MOBILE_QUERY.addEventListener?.("change", () => window.location.reload());