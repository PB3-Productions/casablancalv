/* =========================================================
   CASABLANCA SITE REFRESH JS
   Purpose: Lightweight final-state cleanup. No WebGL dependency, no yellow
   hero text, no seventh slide, no legacy hero assets.
   ========================================================= */
(function () {
  const MOBILE_QUERY = window.matchMedia("(max-width: 768px)");
  const LOGO_SVG_URL = "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a40929689d9cd8dc2f3df9c.png";
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

  const HOLD_DURATION_MS = 2550;
  const FADE_DURATION_MS = 1200;
  let heroTimer = null;
  let currentHeroIndex = 0;

  function activeSlides() {
    return HERO_SLIDES.map((slide) => MOBILE_QUERY.matches && slide.mobileImage ? slide.mobileImage : slide.image);
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
        image.src = LOGO_SVG_URL;
        image.srcset = `${LOGO_SVG_URL} 512w`;
        image.sizes = "(max-width: 1023px) 390px, 300px";
        image.alt = "Casablanca Las Vegas";
      });
  }

  function initLogoFlip() {
    const targets = [
      ...document.querySelectorAll(".logo-wrapper, .footer-brand-block"),
      ...document.querySelectorAll(".drawer-logo")
    ];

    targets.forEach((target) => {
      if (!target || target.dataset.casaLogoFlipReady === "true") return;
      target.dataset.casaLogoFlipReady = "true";
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "0");
      target.setAttribute("role", target.tagName.toLowerCase() === "a" ? "link" : "button");

      const flip = (event) => {
        if (target.classList.contains("logo-wrapper")) event.preventDefault();
        const currentRotation = Number(target.dataset.casaLogoRotation || "0") + 1080;
        target.dataset.casaLogoRotation = String(currentRotation);
        target.style.setProperty("--casa-logo-flip-rotation", `${currentRotation}deg`);
      };

      target.addEventListener("click", flip);
      target.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        flip(event);
      });
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

  function replaceTextNodes(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const replacements = [
      [/10 possible bedrooms/gi, "6 luxury suites"],
      [/10 Possible Bedrooms/g, "6 Luxury Suites"],
      [/Possible Bedrooms/g, "Luxury Suites"],
      [/~5 Mi/g, "5 Mi"]
    ];

    while (walker.nextNode()) {
      const node = walker.currentNode;
      let value = node.nodeValue;
      replacements.forEach(([pattern, replacement]) => { value = value.replace(pattern, replacement); });
      node.nodeValue = value;
    }

    document.querySelectorAll(".stat").forEach((stat) => {
      const label = stat.querySelector("span");
      const number = stat.querySelector("b");
      if (label && /Luxury Suites/i.test(label.textContent || "")) {
        label.textContent = "Luxury Suites";
        if (number) number.textContent = "6";
      }
    });
  }

  function updateHeroFallback(firstImage) {
    const source = document.querySelector(".casa-webgl-hero .hero-fallback source");
    const img = document.querySelector(".casa-webgl-hero .hero-fallback img");
    if (source) source.srcset = `${firstImage} 1920w`;
    if (img) {
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
        --casa-new-logo: url('${LOGO_SVG_URL}');
        --casa-hero-first: url('${SOCIAL_HERO_IMAGE}');
        --casa-ivory: #fffaf0;
        --casa-cream: #f6efe3;
        --casa-ink: #1b1712;
        --casa-text: #30291f;
        --casa-green: #0d3a2f;
        --casa-bronze: #a8752c;
        --casa-border: rgba(168,117,44,.26);
      }

      html, body { background: var(--casa-cream) !important; color: var(--casa-ink) !important; }

      .logo-wrapper,
      .footer-brand-block {
        perspective: 1000px !important;
        cursor: pointer !important;
      }

      .logo-wrapper::before,
      .footer-brand-block::before {
        transform: rotateY(var(--casa-logo-flip-rotation, 0deg)) !important;
        transform-style: preserve-3d !important;
        backface-visibility: hidden !important;
        transition: transform 1.5s cubic-bezier(0.4, 0.2, 0.2, 1) !important;
        border-radius: 50% !important;
        background-image: var(--casa-new-logo) !important;
        background-size: 108% auto !important;
        background-position: 48% center !important;
        box-shadow: 0 15px 35px rgba(0,0,0,.28) !important;
      }

      .main-logo, .drawer-logo, .footer-brand-block img, .site-footer-luxury img, .logo-wrapper img {
        content: var(--casa-new-logo) !important;
        object-fit: contain !important;
      }

      .drawer-logo {
        cursor: pointer !important;
        border-radius: 50% !important;
        transform: rotateY(var(--casa-logo-flip-rotation, 0deg)) scale(1.08) translateX(-2%) !important;
        transform-style: preserve-3d !important;
        backface-visibility: hidden !important;
        transition: transform 1.5s cubic-bezier(0.4, 0.2, 0.2, 1) !important;
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

      .casa-webgl-hero, .casa-webgl-stage, .casa-webgl-stage canvas { background: var(--casa-cream) !important; }
      .casa-webgl-hero .hero-fallback img { content: var(--casa-hero-first) !important; }

      #matterport, .drawer-nav a[href="#matterport"], .nav-link[href="#matterport"] {
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

      .section.bg-cream, .section.bg-ivory, .map-positioning-section, .floorplan-section {
        background: var(--casa-ivory) !important;
        color: var(--casa-ink) !important;
      }

      .lead, .lead.light, p, li { color: var(--casa-text) !important; }
      .title-lg, .title-md, .font-display, h1, h2, h3 { color: var(--casa-ink) !important; }
      .eyebrow, .eyebrow.center { color: var(--casa-bronze) !important; }

      .card-dark, .mini-card, .price-card, .estate-summary-card, .policy-grid .mini-card, .concierge-option {
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

      .site-footer *, .site-footer-luxury *, footer * { color: var(--casa-ink) !important; }
    `;
  }

  function initHeroFade() {
    const stage = document.getElementById("casaWebglHero");
    if (!stage) return;

    const slides = activeSlides();
    if (!slides.length) return;

    window.clearTimeout(heroTimer);
    currentHeroIndex = 0;
    updateHeroFallback(slides[0]);

    stage.innerHTML = `
      <div class="casa-fade-hero-layer casa-fade-hero-layer-a is-active"></div>
      <div class="casa-fade-hero-layer casa-fade-hero-layer-b"></div>
    `;

    const layerA = stage.querySelector(".casa-fade-hero-layer-a");
    const layerB = stage.querySelector(".casa-fade-hero-layer-b");
    let activeLayer = layerA;
    let nextLayer = layerB;

    const setLayerImage = (layer, src) => {
      layer.style.backgroundImage = `url("${src}")`;
    };

    setLayerImage(activeLayer, slides[0]);
    stage.classList.add("is-ready");

    slides.slice(1).forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });

    const advance = () => {
      currentHeroIndex = (currentHeroIndex + 1) % slides.length;
      setLayerImage(nextLayer, slides[currentHeroIndex]);
      nextLayer.classList.add("is-active");
      activeLayer.classList.remove("is-active");
      [activeLayer, nextLayer] = [nextLayer, activeLayer];
      heroTimer = window.setTimeout(advance, HOLD_DURATION_MS + FADE_DURATION_MS);
    };

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && slides.length > 1) {
      heroTimer = window.setTimeout(advance, HOLD_DURATION_MS);
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
    if (!gsapRef || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
    initLogoFlip();
    removePrivateMatterport();
    removeHeroText();
    replaceTextNodes(document.body);
    initMapAndFloorplanLightbox();
    initSplitMergeAnimation();
    initHeroFade();

    window.setTimeout(() => {
      syncLogos();
      initLogoFlip();
      removeHeroText();
      replaceTextNodes(document.body);
    }, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCasablancaRefresh, { once: true });
  } else {
    initCasablancaRefresh();
  }

  window.addEventListener("load", () => {
    syncMetaPreview();
    injectRefreshStyles();
    syncLogos();
    initLogoFlip();
    removePrivateMatterport();
    removeHeroText();
    replaceTextNodes(document.body);
  }, { once: true });

  MOBILE_QUERY.addEventListener?.("change", () => window.location.reload());
})();