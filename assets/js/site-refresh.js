/* =========================================================
   BLOCK 1 START: CASABLANCA SITE REFRESH JS
   Purpose: Oscar-style WebGL hero transition, GSAP split-merge animation,
   fallback-safe initialization, and refined interaction support.
   ========================================================= */

import * as THREE from "https://unpkg.com/three@0.128.0/build/three.module.js";

/* BLOCK 1.1 START: WEBGL HERO TRANSITION */
const heroStage = document.getElementById("casaWebglHero");

const rawSlides = [
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

const slides = rawSlides.filter((url, index, arr) => arr.indexOf(url) === index);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const gsapRef = window.gsap;

function getNextIndex(index) {
  if (slides.length <= 1) return index;
  return (index + 1) % slides.length;
}

function initWebglHero() {
  if (!heroStage || prefersReducedMotion || !gsapRef || slides.length < 2) return;

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

  Promise.all(slides.map((url) => new Promise((resolve, reject) => {
    loader.load(url, (texture) => resolve(prepareTexture(texture)), undefined, reject);
  }))).then((textures) => {
    let currentIndex = 0;
    let isTransitioning = false;
    let transitionTimer = null;

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
      uTexture1: { value: textures[0] },
      uTexture2: { value: textures[getNextIndex(0)] },
      uTexture1Size: { value: new THREE.Vector2(1, 1) },
      uTexture2Size: { value: new THREE.Vector2(1, 1) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uProgress: { value: 0 },
      uTime: { value: 0 }
    };

    const setTextureSize = (uniformName, texture) => {
      const image = texture && texture.image;
      uniforms[uniformName].value.set(image?.width || 1, image?.height || 1);
    };

    const resize = () => {
      const rect = heroStage.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };

    setTextureSize("uTexture1Size", textures[0]);
    setTextureSize("uTexture2Size", textures[getNextIndex(0)]);

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

      vec4 sampleWithClamp(sampler2D textureMap, vec2 uv) {
        return texture2D(textureMap, clamp(uv, vec2(0.001), vec2(0.999)));
      }

      void main() {
        vec2 baseUv = vUv;
        vec2 uv1 = coverUv(baseUv, uTexture1Size, uResolution);
        vec2 uv2 = coverUv(baseUv, uTexture2Size, uResolution);

        float strength = sin(uProgress * 3.14159265);
        float band = 0.28;
        float revealLine = uProgress * (1.0 + band * 2.0) - band;
        float revealNoise =
          sin(baseUv.y * 15.0 + uTime * 1.65) * 0.035 * strength +
          sin(baseUv.y * 43.0 - uTime * 2.05) * 0.018 * strength;

        float revealMask = 1.0 - smoothstep(
          revealLine - band,
          revealLine + band,
          baseUv.x + revealNoise
        );

        float sliceCount = 20.0;
        float sliceIndex = floor(baseUv.y * sliceCount);
        float sliceRandom = hash(sliceIndex + 11.0);
        float sliceOffset = (sliceRandom - 0.5) * 0.12 * strength;
        float verticalWave = sin(baseUv.y * 34.0 + uTime * 2.2) * 0.034 * strength;
        float horizontalWave = cos(baseUv.x * 24.0 - uTime * 1.65) * 0.018 * strength;

        vec2 displacement = vec2(verticalWave + sliceOffset, horizontalWave);
        vec2 directionalPull = vec2((revealMask - 0.5) * 0.16, 0.0) * strength;
        vec2 distortedUv1 = uv1 + displacement + directionalPull;
        vec2 distortedUv2 = uv2 - displacement - directionalPull;

        vec4 color1 = sampleWithClamp(uTexture1, distortedUv1);
        vec4 color2 = sampleWithClamp(uTexture2, distortedUv2);
        vec4 finalColor = mix(color1, color2, revealMask);

        float splitStrength = 0.01 * strength;
        vec4 redShift = sampleWithClamp(uTexture2, distortedUv2 + vec2(splitStrength, 0.0));
        vec4 blueShift = sampleWithClamp(uTexture1, distortedUv1 - vec2(splitStrength, 0.0));
        finalColor.r = mix(finalColor.r, redShift.r, strength * 0.24);
        finalColor.b = mix(finalColor.b, blueShift.b, strength * 0.18);

        float vignette = smoothstep(0.94, 0.20, distance(baseUv, vec2(0.5)));
        finalColor.rgb *= mix(0.78, 1.0, vignette);
        gl_FragColor = finalColor;
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: false
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 1, 1), material);
    scene.add(mesh);

    const clock = new THREE.Clock();

    const render = () => {
      uniforms.uTime.value += clock.getDelta();
      renderer.render(scene, camera);
      window.requestAnimationFrame(render);
    };

    const transitionToNext = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      const targetIndex = getNextIndex(currentIndex);
      const currentTexture = textures[currentIndex];
      const targetTexture = textures[targetIndex];

      uniforms.uTexture1.value = currentTexture;
      uniforms.uTexture2.value = targetTexture;
      setTextureSize("uTexture1Size", currentTexture);
      setTextureSize("uTexture2Size", targetTexture);
      uniforms.uProgress.value = 0;

      gsapRef.killTweensOf(uniforms.uProgress);
      gsapRef.to(uniforms.uProgress, {
        value: 1,
        duration: 1.72,
        ease: "power3.inOut",
        onComplete: () => {
          currentIndex = targetIndex;
          const futureIndex = getNextIndex(currentIndex);
          uniforms.uTexture1.value = textures[currentIndex];
          uniforms.uTexture2.value = textures[futureIndex];
          setTextureSize("uTexture1Size", textures[currentIndex]);
          setTextureSize("uTexture2Size", textures[futureIndex]);
          uniforms.uProgress.value = 0;
          isTransitioning = false;
          window.clearTimeout(transitionTimer);
          transitionTimer = window.setTimeout(transitionToNext, 1980);
        }
      });
    };

    resize();
    render();
    heroStage.classList.add("is-ready");
    transitionTimer = window.setTimeout(transitionToNext, 1980);
    window.addEventListener("resize", resize, { passive: true });
  }).catch((error) => {
    console.error("Casablanca WebGL hero failed; fallback image remains active.", error);
  });
}
/* BLOCK 1.1 END: WEBGL HERO TRANSITION */

/* BLOCK 1.2 START: GSAP SPLIT-MERGE SECTION */
function initSplitMergeAnimation() {
  if (!gsapRef || prefersReducedMotion) return;

  const left = document.querySelector(".split-half-left");
  const right = document.querySelector(".split-half-right");
  const section = document.querySelector(".split-merge-section");
  if (!left || !right || !section) return;

  const runTween = () => {
    gsapRef.fromTo(left,
      { x: "-18vw", opacity: 0.35 },
      { x: 0, opacity: 1, duration: 1.15, ease: "power3.out" }
    );
    gsapRef.fromTo(right,
      { x: "18vw", opacity: 0.35 },
      { x: 0, opacity: 1, duration: 1.15, ease: "power3.out" }
    );
  };

  if (gsapRef.ScrollTrigger) {
    gsapRef.ScrollTrigger.create({
      trigger: section,
      start: "top 72%",
      once: true,
      onEnter: runTween
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      runTween();
      observer.disconnect();
    });
  }, { threshold: 0.28 });

  observer.observe(section);
}
/* BLOCK 1.2 END: GSAP SPLIT-MERGE SECTION */

/* BLOCK 1.3 START: INIT */
initWebglHero();
window.addEventListener("load", initSplitMergeAnimation, { once: true });
/* BLOCK 1.3 END: INIT */

/* =========================================================
   BLOCK 1 END: CASABLANCA SITE REFRESH JS
   ========================================================= */
