/* =========================================================
   BLOCK 1 START: CASABLANCA LAS VEGAS FRONTEND APPLICATION
   Purpose: Core page interactions, booking form, gallery, video controls,
   and final mobile hero/title polish.
   ========================================================= */
window.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = "";
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const analyticsLayer = window.dataLayer || (window.dataLayer = []);
  const trackEvent = (eventName, params = {}) => {
    analyticsLayer.push({ event: eventName, ...params });
    if (typeof window.gtag === "function") window.gtag("event", eventName, params);
  };

  /* =========================================================
     BLOCK 2 START: HEADER + DRAWER
     ========================================================= */
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
  let headerTicking = false;
  const updateHeader = () => {
    const y = Math.max(window.scrollY || 0, 0);
    const delta = y - lastScrollY;
    if (y <= 24) setShrunkHeader(false);
    else if (delta > 4) setShrunkHeader(true);
    else if (delta < -4) setShrunkHeader(false);
    lastScrollY = y;
    headerTicking = false;
  };

  window.addEventListener("scroll", () => {
    if (headerTicking) return;
    headerTicking = true;
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
  /* =========================================================
     BLOCK 2 END: HEADER + DRAWER
     ========================================================= */

  /* =========================================================
     BLOCK 3 START: CONTENT CLEANUP + REVEALS
     ========================================================= */
  const availabilityIntro = $("#availability .lead.light");
  if (availabilityIntro) {
    availabilityIntro.textContent = "Our team reviews your date window, event type, guest count, and concierge needs personally. We typically respond within 24–48 hours. If you have immediate questions or need to book ASAP, please call and speak with a sales agent.";
  }

  const privateEstateProofGrid = $$(".proof-grid").find((grid) => {
    const text = grid.textContent || "";
    return text.includes("Matterport 3D Tour") && text.includes("Calendar-Connected") && text.includes("VIP Concierge Layer");
  });
  privateEstateProofGrid?.remove();

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach((element) => revealObserver.observe(element));
  /* =========================================================
     BLOCK 3 END: CONTENT CLEANUP + REVEALS
     ========================================================= */

  /* =========================================================
     BLOCK 4 START: STRUCTURED GALLERY
     ========================================================= */
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
  /* =========================================================
     BLOCK 4 END: STRUCTURED GALLERY
     ========================================================= */

  /* =========================================================
     BLOCK 5 START: VIDEO CONTROLS
     ========================================================= */
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
  /* =========================================================
     BLOCK 5 END: VIDEO CONTROLS
     ========================================================= */

  /* =========================================================
     BLOCK 6 START: BOOKING CALENDAR + PENDING INQUIRIES
     ========================================================= */
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
  /* =========================================================
     BLOCK 6 END: BOOKING CALENDAR + PENDING INQUIRIES
     ========================================================= */

  /* =========================================================
     BLOCK 7 START: FINAL MOBILE HERO STACKING + COPY POLISH
     ========================================================= */
  const WAVE_KEY = "casablancaHeroAdventureWaveV6";
  const FINAL_POLISH_STYLE_ID = "casablancaFinalPolishPatch";
  const MOBILE_QUERY = window.matchMedia("(max-width: 768px)");

  const injectFinalPolishStyles = () => {
    let style = document.getElementById(FINAL_POLISH_STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = FINAL_POLISH_STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = `
      #welcome .intro-lead,
      .estate-summary-card .lead,
      .floorplan-section .lead,
      #policies .lead,
      .footer-brand-block .lead,
      .footer-cta-card p:not(.eyebrow) {
        text-align: left !important;
        max-width: min(92vw, 760px) !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      .footer-brand-block .lead,
      .footer-cta-card p:not(.eyebrow) {
        max-width: min(92vw, 30rem) !important;
      }

      .floorplan-caption {
        margin: clamp(.65rem, 1.6vw, 1rem) auto 0 !important;
        text-align: center !important;
        color: rgba(21, 20, 19, .72) !important;
        font-family: var(--font-body, Inter, sans-serif) !important;
        font-size: clamp(.82rem, 1.4vw, .98rem) !important;
        font-style: italic !important;
        letter-spacing: .02em !important;
      }

      @media (max-width: 768px) {
        .casa-webgl-hero #dynamic-title {
          width: 100vw !important;
          max-width: 100vw !important;
          margin: 0 auto !important;
          text-align: center !important;
          transform-origin: center center !important;
          display: block !important;
        }

        .casa-webgl-hero .mobile-title-line {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          flex-wrap: nowrap !important;
          gap: .11em !important;
          width: 100% !important;
          max-width: 100vw !important;
          margin-left: auto !important;
          margin-right: auto !important;
          text-align: center !important;
        }

        .casa-webgl-hero .mobile-title-line .word-container {
          margin-left: 0 !important;
          margin-right: 0 !important;
        }

        .casa-webgl-hero .mobile-title-line-top + .mobile-title-line-top,
        .casa-webgl-hero .mobile-title-line-bottom + .mobile-title-line-bottom {
          margin-top: clamp(.08rem, .45vh, .24rem) !important;
        }

        .casa-webgl-hero .mobile-title-line-top + .mobile-title-line-middle,
        .casa-webgl-hero .mobile-title-line-middle + .mobile-title-line-bottom,
        .casa-webgl-hero .mobile-title-line-top + .mobile-title-line-bottom {
          margin-top: clamp(.34rem, 1.45vh, .82rem) !important;
        }

        #welcome .intro-lead,
        .estate-summary-card .lead,
        .floorplan-section .lead,
        #policies .lead,
        .footer-brand-block .lead,
        .footer-cta-card p:not(.eyebrow) {
          max-width: min(91vw, 34rem) !important;
        }
      }
    `;
  };

  const addFloorplanCaption = () => {
    const floorplanCard = document.querySelector(".framed-floorplan");
    if (!floorplanCard || document.querySelector(".floorplan-caption")) return;
    const caption = document.createElement("p");
    caption.className = "floorplan-caption";
    caption.textContent = "(Actual floorplan)";
    floorplanCard.insertAdjacentElement("afterend", caption);
  };

  const mobileLinePlan = (text) => {
    const normalized = text.trim().replace(/\s+/g, " ");
    const plans = {
      "Your New Vegas Night": [
        ["Your", "mobile-title-line-top"],
        ["New", "mobile-title-line-top"],
        ["Vegas", "mobile-title-line-bottom"],
        ["Night", "mobile-title-line-bottom"]
      ],
      "Your Personal Oasis": [
        ["Your", "mobile-title-line-top"],
        ["Personal", "mobile-title-line-middle"],
        ["Oasis", "mobile-title-line-bottom"]
      ],
      "Something For Everyone": [
        ["Something", "mobile-title-line-top"],
        ["For", "mobile-title-line-middle"],
        ["Everyone", "mobile-title-line-bottom"]
      ],
      "Put Your Feet In the Sand": [
        ["Put Your", "mobile-title-line-top"],
        ["Feet In", "mobile-title-line-middle"],
        ["The Sand", "mobile-title-line-bottom"]
      ]
    };
    return plans[normalized] || null;
  };

  const getUnstackedTitleText = (title) => {
    if (!title) return "";
    if (title.dataset.forceStackedTitle && title.querySelector(".mobile-title-line")) return "";
    return (title.textContent || "").trim().replace(/\s+/g, " ");
  };

  const makeCharWordLine = (lineText, className) => {
    const line = document.createElement("span");
    line.className = `mobile-title-line ${className}`;

    lineText.split(" ").filter(Boolean).forEach((word, wordIndex, words) => {
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

    return line;
  };

  const animateForcedStack = (title) => {
    const gsapRef = window.gsap;
    if (!gsapRef || !MOBILE_QUERY.matches) return;

    const topChars = title.querySelectorAll(".mobile-title-line-top .char");
    const middleChars = title.querySelectorAll(".mobile-title-line-middle .char");
    const bottomChars = title.querySelectorAll(".mobile-title-line-bottom .char");

    gsapRef.killTweensOf(title.querySelectorAll(".char"));
    gsapRef.set(topChars, { y: "-145%", opacity: 0, rotateZ: -4 });
    gsapRef.set(middleChars, { y: "0%", opacity: 0, scale: 0.92, rotateZ: 0 });
    gsapRef.set(bottomChars, { y: "145%", opacity: 0, rotateZ: 4 });

    gsapRef.to(topChars, { y: "0%", opacity: 1, rotateZ: 0, duration: .68, ease: "expo.out", stagger: { each: .02, from: "start" } });
    gsapRef.to(middleChars, { opacity: 1, scale: 1, duration: .62, delay: .07, ease: "expo.out", stagger: { each: .016, from: "start" } });
    gsapRef.to(bottomChars, { y: "0%", opacity: 1, rotateZ: 0, duration: .68, ease: "expo.out", stagger: { each: .02, from: "start" } });
  };

  const forceMobileTitleStacking = () => {
    if (!MOBILE_QUERY.matches) return;
    const title = document.getElementById("dynamic-title");
    if (!title) return;

    const text = getUnstackedTitleText(title);
    const plan = mobileLinePlan(text);
    if (!plan) return;

    title.dataset.forceStackedTitle = text;
    title.textContent = "";
    plan.forEach(([lineText, lineClass]) => title.appendChild(makeCharWordLine(lineText, lineClass)));
    animateForcedStack(title);
  };

  const hasWaveRun = () => {
    try {
      return window.localStorage.getItem(WAVE_KEY) === "true";
    } catch (error) {
      return false;
    }
  };

  const markWaveRun = () => {
    try {
      window.localStorage.setItem(WAVE_KEY, "true");
    } catch (error) {
      // localStorage can be blocked in private contexts.
    }
  };

  const waveScrollToWelcome = () => {
    const hero = document.querySelector(".casa-webgl-hero");
    const target = document.getElementById("welcome");
    if (!hero || !target || hasWaveRun()) return;
    if (window.scrollY > (hero.offsetHeight || window.innerHeight) * 0.46) return;

    markWaveRun();

    const startY = window.scrollY || 0;
    const endY = Math.max(0, target.getBoundingClientRect().top + window.scrollY);
    const distance = endY - startY;
    const duration = 1550;
    const startTime = performance.now();
    const easeInOutCubic = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

    const step = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, startY + distance * eased);
      if (progress < 1) window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
  };

  const forceFirstVisitHeroStart = () => {
    try {
      if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    } catch (error) {
      // Some browsers can reject scroll restoration updates.
    }

    if (window.location.hash || hasWaveRun()) return;
    window.setTimeout(() => window.scrollTo(0, 0), 40);
    window.setTimeout(() => {
      if (window.scrollY < window.innerHeight * 1.2) window.scrollTo(0, 0);
    }, 420);
  };

  const initHeroWaveObserver = () => {
    const startedAt = Date.now();
    let finalBlankTimer = null;
    let titleObserver = null;

    const attach = () => {
      const title = document.getElementById("dynamic-title");
      if (!title || titleObserver) return Boolean(title);

      titleObserver = new MutationObserver(() => {
        window.requestAnimationFrame(forceMobileTitleStacking);
        const text = (title.textContent || "").trim().replace(/\s+/g, " ");
        const oldEnough = Date.now() - startedAt > 9000;

        if (oldEnough && text === "" && !hasWaveRun()) {
          window.clearTimeout(finalBlankTimer);
          finalBlankTimer = window.setTimeout(waveScrollToWelcome, 2300);
          return;
        }

        if (text !== "") window.clearTimeout(finalBlankTimer);
      });

      titleObserver.observe(title, { childList: true, subtree: true, characterData: true });
      forceMobileTitleStacking();
      return true;
    };

    if (attach()) return;
    const waitForTitle = window.setInterval(() => {
      if (attach()) window.clearInterval(waitForTitle);
    }, 120);
    window.setTimeout(() => window.clearInterval(waitForTitle), 60000);
  };

  injectFinalPolishStyles();
  forceFirstVisitHeroStart();
  addFloorplanCaption();
  initHeroWaveObserver();

  const persistentTitleStacker = window.setInterval(forceMobileTitleStacking, 120);
  window.setTimeout(() => window.clearInterval(persistentTitleStacker), 240000);

  window.setTimeout(() => {
    injectFinalPolishStyles();
    addFloorplanCaption();
    forceMobileTitleStacking();
  }, 900);

  window.addEventListener("resize", forceMobileTitleStacking, { passive: true });
  document.addEventListener("visibilitychange", forceMobileTitleStacking);
  /* =========================================================
     BLOCK 7 END: FINAL MOBILE HERO STACKING + COPY POLISH
     ========================================================= */
});
/* =========================================================
   BLOCK 1 END: CASABLANCA LAS VEGAS FRONTEND APPLICATION
   ========================================================= */
