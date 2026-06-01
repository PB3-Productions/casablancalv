/* =========================================================
   BLOCK 1 START: CASABLANCA SITE REFRESH JS
   Purpose: Oscar-style WebGL hero transition, below-hero layout fixes,
   map/floorplan lightbox, GSAP split-merge, Matterport privacy cleanup,
   concierge card behavior, and copy adjustments.
   ========================================================= */

import * as THREE from "https://unpkg.com/three@0.128.0/build/three.module.js";

/* =========================================================
   BLOCK 2 START: CONFIG
   ========================================================= */
const HERO_SLIDES_RAW = [
  "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabb5a3e6e89b6028b15.webp",
  "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabbff82912d65b40a8f.webp",
  "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabb8acf4e863e398382.webp",
  "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabbff82912d65b40a8e.webp",
  "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabd045e32379f1bec11.webp",
  "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabdff82912d65b40ade.webp",
  "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabb5a3e6e89b6028b14.webp",
  "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1baabbd53fc25488ce16d3.webp",
  "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1c9db5ff82912d65c21a12.webp"
];

const HERO_SLIDES = HERO_SLIDES_RAW.filter((url, index, arr) => arr.indexOf(url) === index);
const HOLD_DURATION_MS = 1980;
const TRANSITION_DURATION_MS = 1720;
const MAX_PIXEL_RATIO = 2;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
/* =========================================================
   BLOCK 2 END: CONFIG
   ========================================================= */

/* =========================================================
   BLOCK 3 START: DOM PATCHES
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

  const firstNonHero = Array.from(main.children).find((node) => node.tagName && node.tagName.toLowerCase() === "section" && node !== approvedHero);
  if (main.firstElementChild !== approvedHero) {
    main.insertBefore(approvedHero, main.firstElementChild);
  }
  if (firstNonHero && firstNonHero.id !== "welcome") {
    const welcome = document.getElementById("welcome");
    if (welcome && approvedHero.nextElementSibling !== welcome) {
      main.insertBefore(welcome, approvedHero.nextElementSibling);
    }
  }
}

function patchContentFlow() {
  removeLegacyHeroConflicts();

  const welcome = document.querySelector("#welcome .narrow-shell");
  const summaryCard = document.querySelector(".estate-summary-card");
  const availabilityHeading = document.querySelector("#availability h2");
  const matterportFrame = document.querySelector(".matterport-shell iframe");
  const conciergeCards = Array.from(document.querySelectorAll(".concierge-option"));
  const footerExploreTitle = document.querySelector(".footer-links-card h3");

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

  if (matterportFrame) {
    const baseUrl = "https://my.matterport.com/show/?m=SJM6jmmgauy";
    matterportFrame.setAttribute("src", `${baseUrl}&brand=0&help=0&mls=0&mt=0&qs=1&search=0&hr=0`);
    matterportFrame.setAttribute("title", "Casablanca Las Vegas private estate Matterport 3D virtual tour");
  }

  conciergeCards.forEach((card) => {
    card.removeAttribute("href");
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.addEventListener("click", (event) => event.preventDefault());
  });
}
/* =========================================================
   BLOCK 3 END: DOM PATCHES
   ========================================================= */

/* =========================================================
   BLOCK 4 START: MAP + FLOORPLAN LIGHTBOX
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
   BLOCK 4 END: MAP + FLOORPLAN LIGHTBOX
   ========================================================= */

/* =========================================================
   BLOCK 5 START: OSCAR-STYLE WEBGL HERO
   ========================================================= */
function initWebglHero() {
  const heroStage = document.getElementById("casaWebglHero");
  if (!heroStage || prefersReducedMotion || HERO_SLIDES.length < 2) return;

  const loader = new THREE.TextureLoader();
  loader.crossOrigin = "anonymous";

  const prepareTexture = (texture) => {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
  };

  const loadTexture = (url) => new Promise((resolve, reject) => {
    loader.load(url, (texture) => resolve(prepareTexture(texture)), undefined, reject);
  });

  Promise.all(HERO_SLIDES.map(loadTexture)).then((textures) => {
    if (!textures.length) return;

    let currentIndex = 0;
    let targetIndex = 1;
    let transitionStart = null;
    let holdTimer = null;
    let isTransitioning = false;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });

    heroStage.innerHTML = "";
    heroStage.appendChild(renderer.domElement);

    const uniforms = {
      uTexture1: { value: textures[currentIndex] },
      uTexture2: { value: textures[targetIndex] },
      uTexture1Size: { value: new THREE.Vector2(1, 1) },
      uTexture2Size: { value: new THREE.Vector2(1, 1) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uProgress: { value: 0 },
      uTime: { value: 0 }
    };

    const setTextureSize = (uniformName, texture) => {
      const image = texture?.image;
      uniforms[uniformName].value.set(image?.width || 1, image?.height || 1);
    };

    const resize = () => {
      const rect = heroStage.getBoundingClientRect();
      const width = Math.max(1, rect.width || window.innerWidth);
      const height = Math.max(1, rect.height || window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };

    const getNextIndex = (index) => textures.length <= 1 ? index : (index + 1) % textures.length;

    setTextureSize("uTexture1Size", textures[currentIndex]);
    setTextureSize("uTexture2Size", textures[targetIndex]);

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
        if (screenAspect < imageAspect) {
          centeredUv.x *= screenAspect / imageAspect;
        } else {
          centeredUv.y *= imageAspect / screenAspect;
        }
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

    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 1, 1), material);
    scene.add(mesh);

    const clock = new THREE.Clock();
    const easeInOutCubic = (x) => x < 0.5 ? 4.0 * x * x * x : 1.0 - Math.pow(-2.0 * x + 2.0, 3.0) / 2.0;

    const beginTransition = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      targetIndex = getNextIndex(currentIndex);
      uniforms.uTexture1.value = textures[currentIndex];
      uniforms.uTexture2.value = textures[targetIndex];
      setTextureSize("uTexture1Size", textures[currentIndex]);
      setTextureSize("uTexture2Size", textures[targetIndex]);
      uniforms.uProgress.value = 0;
      transitionStart = performance.now();
    };

    const finishTransition = () => {
      currentIndex = targetIndex;
      targetIndex = getNextIndex(currentIndex);
      uniforms.uTexture1.value = textures[currentIndex];
      uniforms.uTexture2.value = textures[targetIndex];
      setTextureSize("uTexture1Size", textures[currentIndex]);
      setTextureSize("uTexture2Size", textures[targetIndex]);
      uniforms.uProgress.value = 0;
      isTransitioning = false;
      transitionStart = null;
      window.clearTimeout(holdTimer);
      holdTimer = window.setTimeout(beginTransition, HOLD_DURATION_MS);
    };

    const render = () => {
      uniforms.uTime.value += clock.getDelta();
      if (isTransitioning && transitionStart !== null) {
        const elapsed = performance.now() - transitionStart;
        const rawProgress = Math.min(1, elapsed / TRANSITION_DURATION_MS);
        uniforms.uProgress.value = easeInOutCubic(rawProgress);
        if (rawProgress >= 1) finishTransition();
      }
      renderer.render(scene, camera);
      window.requestAnimationFrame(render);
    };

    resize();
    render();
    heroStage.classList.add("is-ready");
    holdTimer = window.setTimeout(beginTransition, HOLD_DURATION_MS);
    window.addEventListener("resize", resize, { passive: true });
  }).catch((error) => {
    console.error("Casablanca WebGL hero failed; fallback hero image remains active.", error);
  });
}
/* =========================================================
   BLOCK 5 END: OSCAR-STYLE WEBGL HERO
   ========================================================= */

/* =========================================================
   BLOCK 6 START: GSAP SPLIT-MERGE SECTION
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
   BLOCK 6 END: GSAP SPLIT-MERGE SECTION
   ========================================================= */

/* =========================================================
   BLOCK 7 START: INIT
   ========================================================= */
function initCasablancaRefresh() {
  patchContentFlow();
  initMapAndFloorplanLightbox();
  initWebglHero();
  initSplitMergeAnimation();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCasablancaRefresh, { once: true });
} else {
  initCasablancaRefresh();
}

window.addEventListener("load", removeLegacyHeroConflicts, { once: true });
/* =========================================================
   BLOCK 7 END: INIT
   ========================================================= */

/* =========================================================
   BLOCK 1 END: CASABLANCA SITE REFRESH JS
   ========================================================= */
