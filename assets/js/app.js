/* =========================================================
   BLOCK 1 START: CASABLANCA LAS VEGAS FRONTEND APPLICATION
   Purpose: Core navigation, reveals, gallery, video controls, booking form,
   and analytics only. The protected split-hero override was removed so the
   WebGL hero in site-refresh.js remains the only hero system.
   ========================================================= */
window.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = "";
  const analyticsLayer = window.dataLayer || (window.dataLayer = []);
  const trackEvent = (eventName, params = {}) => {
    analyticsLayer.push({ event: eventName, ...params });
    if (typeof window.gtag === "function") window.gtag("event", eventName, params);
  };
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  /* BLOCK 1A START: MOBILE HERO TITLE + FIRST-IMAGE SAFETY PATCH */
  const installHeroTitleSafetyPatch = () => {
    const MOBILE_QUERY = window.matchMedia("(max-width: 768px)");
    const FIRST_TITLE = "Off-Strip Paradise";
    const LAST_TITLE = "Put Your Feet In the Sand";
    const FIRST_MOBILE_IMAGE = "https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1e22f8d7322952d1866b94.png";

    let internalPatch = false;
    let lastRenderedTitle = "";

    document.body.classList.add("casa-hero-fallback-guard");

    if (!Array.prototype.__casablancaHeroTitleToStringPatched) {
      const nativeArrayToString = Array.prototype.toString;
      Object.defineProperty(Array.prototype, "__casablancaHeroTitleToStringPatched", {
        value: true,
        configurable: false,
        enumerable: false,
        writable: false
      });
      Array.prototype.toString = function patchedCasablancaHeroArrayToString() {
        if (
          Array.isArray(this) &&
          this[0] === FIRST_TITLE &&
          this.some((item) => item === LAST_TITLE)
        ) {
          return FIRST_TITLE;
        }
        return nativeArrayToString.call(this);
      };
    }

    const injectHeroPatchStyles = () => {
      let style = document.getElementById("casablancaMobileHeroFinalFixStyles");
      if (!style) {
        style = document.createElement("style");
        style.id = "casablancaMobileHeroFinalFixStyles";
        document.head.appendChild(style);
      }

      style.textContent = `
        @media (max-width: 768px) {
          .casa-webgl-hero .hero-text,
          .casa-webgl-hero #dynamic-title {
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
          }

          .casa-mobile-hero-fallback-layer {
            position: absolute !important;
            inset: 0 !important;
            z-index: 24 !important;
            display: block !important;
            background-image:
              linear-gradient(180deg, rgba(0,0,0,.08), rgba(0,0,0,.20)),
              url('${FIRST_MOBILE_IMAGE}') !important;
            background-size: cover !important;
            background-position: center center !important;
            background-repeat: no-repeat !important;
            opacity: 0 !important;
            pointer-events: none !important;
            transition: opacity .55s ease !important;
            transform: translateZ(0) !important;
          }

          body.casa-hero-fallback-guard .casa-mobile-hero-fallback-layer {
            opacity: 1 !important;
          }

          .casa-mobile-title-fix {
            position: absolute !important;
            inset: 0 !important;
            z-index: 48 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            height: 100% !important;
            padding: 0 max(7px, env(safe-area-inset-left)) 0 max(7px, env(safe-area-inset-right)) !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            pointer-events: none !important;
            text-align: center !important;
            perspective: 980px !important;
            transform: scale(var(--casa-mobile-title-scale, 1)) !important;
            transform-origin: center center !important;
            font-family: Impact, Haettenschweiler, "Arial Narrow Bold", "Arial Black", sans-serif !important;
            font-size: clamp(4.55rem, 30vw, 10.4rem) !important;
            font-weight: 900 !important;
            line-height: .62 !important;
            letter-spacing: -0.032em !important;
            text-transform: uppercase !important;
            color: #ffd400 !important;
            text-shadow:
              0 3px 0 rgba(75, 43, 0, .92),
              0 7px 16px rgba(0,0,0,.72),
              0 0 26px rgba(255,212,0,.22) !important;
          }

          .casa-mobile-title-fix__line {
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

          .casa-mobile-title-fix__line + .casa-mobile-title-fix__line {
            margin-top: clamp(.08rem, .62vh, .34rem) !important;
          }

          .casa-mobile-title-fix .word-container {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex: 0 1 auto !important;
            margin-left: .036em !important;
            margin-right: .036em !important;
            padding: 0 !important;
            overflow: visible !important;
          }

          .casa-mobile-title-fix .word {
            display: inline-flex !important;
            white-space: nowrap !important;
            overflow: visible !important;
          }

          .casa-mobile-title-fix .char {
            display: inline-block !important;
            overflow: visible !important;
            will-change: transform, opacity, filter !important;
            transform-style: preserve-3d !important;
          }
        }

        @media (max-width: 380px) {
          .casa-mobile-title-fix {
            font-size: clamp(4.15rem, 28vw, 7.7rem) !important;
            line-height: .63 !important;
            letter-spacing: -0.04em !important;
          }

          .casa-mobile-title-fix .word-container {
            margin-left: .026em !important;
            margin-right: .026em !important;
          }
        }

        @media (max-width: 300px) {
          .casa-mobile-title-fix {
            font-size: clamp(3.65rem, 26vw, 5.4rem) !important;
            letter-spacing: -0.052em !important;
          }
        }
      `;
    };

    const getHero = () => document.querySelector(".casa-webgl-hero");

    const ensureFallbackLayer = () => {
      const hero = getHero();
      if (!hero) return null;
      let layer = hero.querySelector(".casa-mobile-hero-fallback-layer");
      if (!layer) {
        layer = document.createElement("div");
        layer.className = "casa-mobile-hero-fallback-layer";
        layer.setAttribute("aria-hidden", "true");
        hero.prepend(layer);
      }
      return layer;
    };

    const ensureMobileTitleOverlay = () => {
      const hero = getHero();
      if (!hero) return null;
      let overlay = hero.querySelector(".casa-mobile-title-fix");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "casa-mobile-title-fix";
        overlay.setAttribute("aria-hidden", "true");
        hero.appendChild(overlay);
      }
      return overlay;
    };

    const splitHeroTitleIntoThreeLines = (titleText) => {
      const words = titleText.split(" ").filter(Boolean);
      if (titleText === "Something For Everyone") return ["Something", "For", "Everyone"];
      if (titleText === "Your Personal Oasis") return ["Your", "Personal", "Oasis"];
      if (titleText === "Modern & Spacious") return ["Modern", "&", "Spacious"];
      if (titleText === "Your New Vegas Night") return ["Your", "New Vegas", "Night"];
      if (titleText === "Put Your Feet In the Sand") return ["Put Your", "Feet In the", "Sand"];
      if (titleText === "Unwind or Entertain") return ["Unwind", "or", "Entertain"];
      if (titleText === "Beauty Redefined") return ["Beauty", "", "Redefined"];
      if (titleText === FIRST_TITLE) return ["Off-Strip", "", "Paradise"];
      if (words.length >= 3) return [words[0], words.slice(1, -1).join(" "), words[words.length - 1]];
      if (words.length === 2) return [words[0], "", words[1]];
      return [titleText, "", ""];
    };

    const addTitleCharacters = (lineText, lineElement) => {
      lineText.split(" ").filter(Boolean).forEach((word, index, words) => {
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
        lineElement.appendChild(wordContainer);
        if (index < words.length - 1) lineElement.appendChild(document.createTextNode(" "));
      });
    };

    const getCleanHeroTitleText = () => {
      const dynamicTitle = document.getElementById("dynamic-title");
      const rawText = (dynamicTitle?.textContent || "").replace(/\s+/g, " ").trim();
      if (!rawText) return "";
      if (rawText.includes(FIRST_TITLE) && rawText.includes(LAST_TITLE)) return FIRST_TITLE;
      return rawText;
    };

    const fitMobileTitle = (overlay) => {
      if (!MOBILE_QUERY.matches || !overlay) return;
      overlay.style.setProperty("--casa-mobile-title-scale", "1");

      window.requestAnimationFrame(() => {
        const lines = Array.from(overlay.querySelectorAll(".casa-mobile-title-fix__line"));
        if (!lines.length) return;
        const widestLine = Math.max(...lines.map((line) => line.scrollWidth));
        const availableWidth = window.innerWidth * 0.965;
        const scale = Math.min(1, availableWidth / Math.max(widestLine, 1));
        overlay.style.setProperty("--casa-mobile-title-scale", String(Math.max(0.42, scale)));
      });
    };

    const animateMobileTitle = (overlay) => {
      const gsapRef = window.gsap;
      const topChars = overlay.querySelectorAll(".casa-mobile-title-fix__line--top .char");
      const middleChars = overlay.querySelectorAll(".casa-mobile-title-fix__line--middle .char");
      const bottomChars = overlay.querySelectorAll(".casa-mobile-title-fix__line--bottom .char");

      if (!gsapRef) {
        overlay.querySelectorAll(".char").forEach((char) => {
          char.style.opacity = "1";
          char.style.transform = "translate3d(0, 0, 0) scale(1)";
          char.style.filter = "blur(0px)";
        });
        return;
      }

      gsapRef.killTweensOf(overlay.querySelectorAll(".char"));
      gsapRef.set(topChars, { y: "-142%", opacity: 0, rotateZ: -4 });
      gsapRef.set(middleChars, { opacity: 0, scale: 0.48, z: -260, filter: "blur(20px)" });
      gsapRef.set(bottomChars, { y: "142%", opacity: 0, rotateZ: 4 });

      gsapRef.to(topChars, {
        y: "0%",
        opacity: 1,
        rotateZ: 0,
        duration: 0.94,
        ease: "expo.out",
        stagger: { each: 0.026, from: "start" }
      });

      gsapRef.to(middleChars, {
        opacity: 1,
        scale: 1,
        z: 0,
        filter: "blur(0px)",
        duration: 1.08,
        ease: "expo.out",
        stagger: { each: 0.032, from: "center" },
        delay: 0.08
      });

      gsapRef.to(bottomChars, {
        y: "0%",
        opacity: 1,
        rotateZ: 0,
        duration: 0.94,
        ease: "expo.out",
        stagger: { each: 0.026, from: "start" },
        delay: 0.04
      });
    };

    const renderMobileHeroTitle = (titleText) => {
      if (!MOBILE_QUERY.matches || internalPatch || !titleText) return;
      const overlay = ensureMobileTitleOverlay();
      if (!overlay) return;
      if (lastRenderedTitle === titleText && overlay.childElementCount) return;

      internalPatch = true;
      lastRenderedTitle = titleText;
      overlay.textContent = "";
      overlay.style.setProperty("--casa-mobile-title-scale", "1");

      const [topLine, middleLine, bottomLine] = splitHeroTitleIntoThreeLines(titleText);
      [
        ["top", topLine],
        ["middle", middleLine],
        ["bottom", bottomLine]
      ].forEach(([position, lineText]) => {
        if (!lineText) return;
        const line = document.createElement("span");
        line.className = `casa-mobile-title-fix__line casa-mobile-title-fix__line--${position}`;
        addTitleCharacters(lineText, line);
        overlay.appendChild(line);
      });

      fitMobileTitle(overlay);
      animateMobileTitle(overlay);

      if (titleText !== FIRST_TITLE) {
        window.setTimeout(() => document.body.classList.remove("casa-hero-fallback-guard"), 450);
      } else {
        document.body.classList.add("casa-hero-fallback-guard");
      }

      internalPatch = false;
    };

    const syncHeroTitle = () => {
      injectHeroPatchStyles();
      ensureFallbackLayer();
      const titleText = getCleanHeroTitleText();
      if (!titleText) return;
      renderMobileHeroTitle(titleText);
    };

    const observeHeroTitle = () => {
      const hero = getHero();
      if (!hero || hero.dataset.mobileHeroFinalFixObserved === "true") return;
      hero.dataset.mobileHeroFinalFixObserved = "true";
      const observer = new MutationObserver(syncHeroTitle);
      observer.observe(hero, { childList: true, subtree: true, characterData: true });
      syncHeroTitle();
    };

    injectHeroPatchStyles();
    ensureFallbackLayer();
    window.setTimeout(observeHeroTitle, 0);
    window.setTimeout(syncHeroTitle, 120);
    window.setTimeout(syncHeroTitle, 500);
    window.setTimeout(syncHeroTitle, 1100);
    window.setInterval(syncHeroTitle, 1250);
    window.addEventListener("resize", () => fitMobileTitle(document.querySelector(".casa-mobile-title-fix")), { passive: true });
  };

  installHeroTitleSafetyPatch();
  /* BLOCK 1A END: MOBILE HERO TITLE + FIRST-IMAGE SAFETY PATCH */

  /* BLOCK 2 START: HEADER + DRAWER */
  const header = $("#site-header");
  const drawer = $("#drawer");
  const overlay = $("#drawerOverlay");
  const hamburger = $("#hamburger-btn");
  const closeDrawer = $("#close-drawer");

  const setShrunkHeader = (shouldShrink) => {
    if (!header) return;
    header.classList.toggle("is-scrolled", shouldShrink);
    header.style.backgroundColor = shouldShrink ? "#050505" : "";
    header.style.backgroundImage = shouldShrink ? "linear-gradient(180deg, rgba(5,5,5,.99), rgba(10,10,10,.96))" : "";
  };

  let lastScrollY = Math.max(window.scrollY || 0, 0);
  let ticking = false;
  const updateHeader = () => {
    const y = Math.max(window.scrollY || 0, 0);
    const delta = y - lastScrollY;
    if (y <= 24) setShrunkHeader(false);
    else if (delta > 4) setShrunkHeader(true);
    else if (delta < -4) setShrunkHeader(false);
    lastScrollY = y;
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateHeader);
  }, { passive: true });
  setShrunkHeader(lastScrollY > 24);

  const openDrawer = () => {
    drawer?.classList.add("open");
    overlay?.classList.add("active");
    trackEvent("mobile_menu_open");
  };
  const closeDrawerMenu = () => {
    drawer?.classList.remove("open");
    overlay?.classList.remove("active");
  };
  hamburger?.addEventListener("click", openDrawer);
  closeDrawer?.addEventListener("click", closeDrawerMenu);
  overlay?.addEventListener("click", closeDrawerMenu);
  $$(".drawer-nav a, .drawer-actions a").forEach((link) => link.addEventListener("click", closeDrawerMenu));

  const drawerButtons = $$(".drawer-actions a");
  if (drawerButtons[0]) {
    drawerButtons[0].textContent = "Check Availability";
    drawerButtons[0].setAttribute("href", "#availability");
  }
  if (drawerButtons[1]) {
    drawerButtons[1].textContent = "Call Sales Agent";
    drawerButtons[1].setAttribute("href", "tel:6167457148");
    drawerButtons[1].removeAttribute("target");
    drawerButtons[1].removeAttribute("rel");
  }
  /* BLOCK 2 END: HEADER + DRAWER */

  /* BLOCK 3 START: CONTENT CLEANUP */
  const availabilityIntro = $("#availability .lead.light");
  if (availabilityIntro) {
    availabilityIntro.textContent = "Our team reviews your date window, event type, guest count, and concierge needs personally. We typically respond within 24–48 hours. If you have immediate questions or need to book ASAP, please call and speak with a sales agent.";
  }
  const privateEstateProofGrid = $$(".proof-grid").find((grid) => {
    const text = grid.textContent || "";
    return text.includes("Matterport 3D Tour") && text.includes("Calendar-Connected") && text.includes("VIP Concierge Layer");
  });
  privateEstateProofGrid?.remove();
  /* BLOCK 3 END: CONTENT CLEANUP */

  /* BLOCK 4 START: SCROLL REVEALS */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach((element) => revealObserver.observe(element));
  /* BLOCK 4 END: SCROLL REVEALS */

  /* BLOCK 5 START: STRUCTURED GALLERY */
  let galleryImages = [];
  let galleryIndex = 0;
  const galleryFeatured = $("#galleryFeatured");
  const galleryThumbs = $("#galleryThumbs");
  const galleryPrev = $("#galleryPrev");
  const galleryNext = $("#galleryNext");
  const lightbox = $("#galleryLightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxClose = $("#lightboxClose");
  const srcSetFor = (src) => `${src} 1600w`;

  const setGalleryImage = (index, source = "click") => {
    if (!galleryImages.length || !galleryFeatured) return;
    galleryIndex = (index + galleryImages.length) % galleryImages.length;
    const image = galleryImages[galleryIndex];
    galleryFeatured.src = image.src;
    galleryFeatured.srcset = srcSetFor(image.src);
    galleryFeatured.alt = image.alt;
    galleryFeatured.width = image.width || 1600;
    galleryFeatured.height = image.height || 1067;
    $$(".gallery-thumb", galleryThumbs).forEach((thumb, thumbIndex) => thumb.classList.toggle("is-active", thumbIndex === galleryIndex));
    trackEvent("gallery_image_view", { gallery_index: galleryIndex + 1, source });
  };

  const renderGallery = (images) => {
    galleryImages = images;
    if (!galleryThumbs || !galleryImages.length) return;
    galleryThumbs.innerHTML = galleryImages.map((image, index) => `
      <button class="gallery-thumb ${index === 0 ? "is-active" : ""}" type="button" aria-label="Open ${image.alt}">
        <img src="${image.src}" srcset="${srcSetFor(image.src)}" sizes="(max-width: 700px) 33vw, 136px" width="${image.width || 1600}" height="${image.height || 1067}" alt="${image.alt}" loading="lazy" decoding="async">
      </button>
    `).join("");
    $$(".gallery-thumb", galleryThumbs).forEach((button, index) => button.addEventListener("click", () => setGalleryImage(index, "thumbnail")));
    setGalleryImage(0, "initial");
  };

  fetch("/assets/data/gallery.json")
    .then((response) => response.json())
    .then((data) => renderGallery(data.gallery || []))
    .catch((error) => console.error("Gallery JSON failed:", error));

  galleryPrev?.addEventListener("click", () => setGalleryImage(galleryIndex - 1, "prev"));
  galleryNext?.addEventListener("click", () => setGalleryImage(galleryIndex + 1, "next"));
  galleryFeatured?.addEventListener("click", () => {
    const image = galleryImages[galleryIndex];
    if (!image || !lightboxImage) return;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox?.classList.add("active");
    trackEvent("gallery_lightbox_open", { gallery_index: galleryIndex + 1 });
  });
  lightboxClose?.addEventListener("click", () => lightbox?.classList.remove("active"));
  lightbox?.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.classList.remove("active"); });
  /* BLOCK 5 END: STRUCTURED GALLERY */

  /* BLOCK 6 START: VIDEO CONTROLS */
  const videoShell = $("#estateVideoShell");
  const estateVideo = $("#estateVideo");
  const pauseButton = $("#videoPause");
  const closeButton = $("#videoClose");
  const backButton = $("#videoBack");
  const forwardButton = $("#videoForward");
  const musicButton = $("#videoMusic");
  const videoControls = videoShell?.querySelector(".video-controls");
  let videoStarted = false;
  let controlsTimer = null;

  const makeVideoButton = (id, text) => {
    const button = document.createElement("button");
    button.id = id;
    button.className = "video-control";
    button.type = "button";
    button.dataset.dynamicVideoControl = "true";
    button.textContent = text;
    return button;
  };
  const detachButton = makeVideoButton("videoDetach", "Detach");
  const largeButton = makeVideoButton("videoLarge", "Large");
  if (videoControls) {
    videoControls.insertBefore(detachButton, videoControls.firstChild);
    videoControls.insertBefore(largeButton, detachButton.nextSibling);
  }
  if (closeButton) closeButton.textContent = "Hide";

  const showVideoControls = () => {
    if (!videoShell) return;
    videoShell.classList.remove("controls-hidden");
    clearTimeout(controlsTimer);
    controlsTimer = setTimeout(() => videoShell.classList.add("controls-hidden"), 3000);
  };
  const playVideo = () => {
    if (!estateVideo) return;
    if (!videoStarted) {
      estateVideo.currentTime = 0;
      videoStarted = true;
      trackEvent("video_start", { video_name: "Casablanca Las Vegas Estate Tour" });
    }
    estateVideo.play().catch(() => {});
    if (pauseButton) pauseButton.textContent = "Pause";
  };

  videoShell?.classList.remove("is-sticky");
  videoShell?.addEventListener("mousemove", showVideoControls);
  videoShell?.addEventListener("click", showVideoControls);
  videoShell?.addEventListener("touchstart", showVideoControls, { passive: true });
  pauseButton?.addEventListener("click", () => {
    showVideoControls();
    if (estateVideo.paused) {
      playVideo();
      trackEvent("video_play", { video_name: "Casablanca Las Vegas Estate Tour" });
    } else {
      estateVideo.pause();
      pauseButton.textContent = "Play";
      trackEvent("video_pause", { video_name: "Casablanca Las Vegas Estate Tour" });
    }
  });
  backButton?.addEventListener("click", () => {
    showVideoControls();
    estateVideo.currentTime = Math.max(0, estateVideo.currentTime - 10);
    trackEvent("video_back_10", { video_name: "Casablanca Las Vegas Estate Tour" });
  });
  forwardButton?.addEventListener("click", () => {
    showVideoControls();
    const safeDuration = Number.isFinite(estateVideo.duration) ? estateVideo.duration : estateVideo.currentTime + 10;
    estateVideo.currentTime = Math.min(safeDuration, estateVideo.currentTime + 10);
    trackEvent("video_forward_10", { video_name: "Casablanca Las Vegas Estate Tour" });
  });
  musicButton?.addEventListener("click", () => {
    showVideoControls();
    estateVideo.muted = !estateVideo.muted;
    musicButton.textContent = estateVideo.muted ? "Music Off" : "Music On";
    trackEvent("video_mute_toggle", { muted: estateVideo.muted });
  });
  detachButton.addEventListener("click", () => {
    showVideoControls();
    videoShell.classList.toggle("is-manual-detached");
    videoShell.classList.remove("is-hidden");
    detachButton.textContent = videoShell.classList.contains("is-manual-detached") ? "Dock" : "Detach";
    trackEvent("video_detach_toggle", { detached: videoShell.classList.contains("is-manual-detached") });
  });
  largeButton.addEventListener("click", () => {
    showVideoControls();
    videoShell.classList.toggle("is-large");
    videoShell.classList.remove("is-hidden");
    largeButton.textContent = videoShell.classList.contains("is-large") ? "Normal" : "Large";
    trackEvent("video_large_toggle", { large: videoShell.classList.contains("is-large") });
  });
  closeButton?.addEventListener("click", () => {
    clearTimeout(controlsTimer);
    videoShell.classList.remove("is-manual-detached", "is-large", "controls-hidden");
    videoShell.classList.add("is-hidden");
    estateVideo.pause();
    if (pauseButton) pauseButton.textContent = "Play";
    trackEvent("video_hide", { video_name: "Casablanca Las Vegas Estate Tour" });
  });
  /* BLOCK 6 END: VIDEO CONTROLS */

  /* BLOCK 7 START: BOOKING CALENDAR + PENDING INQUIRIES */
  const pad = (num) => String(num).padStart(2, "0");
  const toISODate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const addDays = (date, days) => { const copy = new Date(date); copy.setDate(copy.getDate() + days); return copy; };
  const setStatus = (elementId, message, tone = "") => {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.classList.remove("status-ok", "status-warn", "status-error");
    if (tone) el.classList.add(`status-${tone}`);
  };
  const formatRangePayload = (selectedDates) => {
    if (!selectedDates || selectedDates.length < 2) return null;
    const checkIn = toISODate(selectedDates[0]);
    const checkOut = toISODate(selectedDates[1]);
    if (checkIn === checkOut) return null;
    return { checkIn, checkOut };
  };
  let flatpickrInstance = null;
  let formStarted = false;

  async function loadUnavailableDates() {
    const today = new Date();
    const start = toISODate(today);
    const end = toISODate(addDays(today, 365));
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings?start=${start}&end=${end}`, { method: "GET", headers: { "Accept": "application/json" } });
      if (!response.ok) throw new Error(`Calendar endpoint returned ${response.status}`);
      const data = await response.json();
      const disabled = Array.isArray(data.unavailable) ? data.unavailable.map((range) => ({ from: range.start, to: range.end })) : [];
      setStatus("calendarStatus", disabled.length ? `${disabled.length} approved unavailable date block(s) loaded.` : "Availability calendar loaded. No approved blocked dates found.", "ok");
      return disabled;
    } catch (error) {
      console.error("Calendar load failed:", error);
      setStatus("calendarStatus", "Calendar API is not available right now. Please submit an inquiry and we will verify dates manually.", "warn");
      return [];
    }
  }

  async function initBookingCalendar() {
    const disabledRanges = await loadUnavailableDates();
    if (flatpickrInstance) flatpickrInstance.destroy();
    flatpickrInstance = flatpickr("#stayRange", {
      mode: "range",
      minDate: "today",
      dateFormat: "Y-m-d",
      disable: disabledRanges,
      showMonths: window.innerWidth >= 768 ? 2 : 1,
      onChange: (selectedDates) => {
        const payload = formatRangePayload(selectedDates);
        document.getElementById("checkIn").value = payload ? payload.checkIn : "";
        document.getElementById("checkOut").value = payload ? payload.checkOut : "";
        if (payload) trackEvent("date_select", payload);
      }
    });
  }
  if (window.flatpickr) initBookingCalendar();

  const bookingForm = $("#bookingForm");
  const submitButton = $("#submitBooking");
  bookingForm?.addEventListener("input", () => {
    if (!formStarted) {
      formStarted = true;
      trackEvent("form_start", { form_name: "vip_booking_inquiry" });
    }
  });
  bookingForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(bookingForm).entries());
    if (!payload.checkIn || !payload.checkOut) return setStatus("formStatus", "Please select a valid check-in and check-out range.", "error");
    if (!payload.name || !payload.email || !payload.guestCount || !payload.eventType) return setStatus("formStatus", "Please complete the required fields before submitting.", "error");
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";
    setStatus("formStatus", "Sending your private inquiry for concierge review...", "warn");
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Booking endpoint returned ${response.status}`);
      setStatus("formStatus", "Success. Your request was submitted as pending. Our private booking team will verify availability and follow up within 24–48 hours.", "ok");
      trackEvent("form_submit", { form_name: "vip_booking_inquiry", status: "pending", event_type: payload.eventType });
      bookingForm.reset();
      flatpickrInstance?.clear();
      await initBookingCalendar();
    } catch (error) {
      console.error("Booking submit failed:", error);
      setStatus("formStatus", error.message || "Something went wrong. Please try again.", "error");
      trackEvent("form_submit_error", { form_name: "vip_booking_inquiry", error: error.message || "unknown" });
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit Private Inquiry";
    }
  });
  $$("a[href^='tel:']").forEach((link) => link.addEventListener("click", () => trackEvent("phone_click", { phone_href: link.getAttribute("href") })));
  /* BLOCK 7 END: BOOKING CALENDAR + PENDING INQUIRIES */
});
/* =========================================================
   BLOCK 1 END: CASABLANCA LAS VEGAS FRONTEND APPLICATION
   ========================================================= */