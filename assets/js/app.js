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
  const isMobileViewport = window.matchMedia("(max-width: 1023px)").matches;

  if (!document.getElementById("casablancaMobileNavFinalScript")) {
    const mobileHeroStabilizer = document.createElement("script");
    mobileHeroStabilizer.defer = true;
    mobileHeroStabilizer.src = "/assets/js/hero-mobile-stabilizer.js";
    document.head.appendChild(mobileHeroStabilizer);
  }

  /* BLOCK 2 START: HEADER + DRAWER */
  const header = $("#site-header");
  const drawer = $("#drawer");
  const overlay = $("#drawerOverlay");
  const hamburger = $("#hamburger-btn");
  const closeDrawer = $("#close-drawer");

  const setShrunkHeader = (shouldShrink) => {
    if (!header || isMobileViewport) return;
    header.classList.toggle("is-scrolled", shouldShrink);
    header.style.backgroundColor = shouldShrink ? "#050505" : "";
    header.style.backgroundImage = shouldShrink ? "linear-gradient(180deg, rgba(5,5,5,.99), rgba(10,10,10,.96))" : "";
  };

  if (!isMobileViewport) {
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
  }

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

  /* BLOCK 7 START: BOOKING FORM */
  const bookingForm = $("#bookingForm");
  const stayRange = $("#stayRange");
  const calendarStatus = $("#calendarStatus");
  const formStatus = $("#formStatus");
  const submitBooking = $("#submitBooking");
  const checkIn = $("#checkIn");
  const checkOut = $("#checkOut");

  const setCalendarStatus = (message, type = "warn") => {
    if (!calendarStatus) return;
    calendarStatus.textContent = message;
    calendarStatus.className = `status-note status-${type}`;
  };

  const initFlatpickr = (blockedDates = []) => {
    if (!stayRange || typeof flatpickr !== "function") return;
    flatpickr(stayRange, {
      mode: "range",
      minDate: "today",
      dateFormat: "Y-m-d",
      disable: blockedDates,
      onChange: (selectedDates) => {
        if (selectedDates[0]) checkIn.value = selectedDates[0].toISOString().slice(0, 10);
        if (selectedDates[1]) checkOut.value = selectedDates[1].toISOString().slice(0, 10);
        trackEvent("date_range_selected");
      }
    });
  };

  fetch(`${API_BASE_URL}/api/bookings`)
    .then((response) => response.ok ? response.json() : Promise.reject(new Error("Calendar unavailable")))
    .then((data) => {
      const unavailable = Array.isArray(data.unavailableDates) ? data.unavailableDates : [];
      initFlatpickr(unavailable);
      setCalendarStatus("Live calendar connected. Approved holds are blocked automatically.", "ok");
    })
    .catch(() => {
      initFlatpickr([]);
      setCalendarStatus("Calendar connection unavailable. Submit your dates and our team will verify manually.", "warn");
    });

  bookingForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      return;
    }
    if (formStatus) {
      formStatus.textContent = "Submitting private inquiry...";
      formStatus.className = "status-note status-warn";
    }
    submitBooking?.setAttribute("disabled", "disabled");
    const payload = Object.fromEntries(new FormData(bookingForm).entries());
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.error || "Submission failed");
      if (formStatus) {
        formStatus.textContent = "Inquiry received. Our team will review availability and follow up shortly.";
        formStatus.className = "status-note status-ok";
      }
      bookingForm.reset();
      trackEvent("booking_inquiry_submitted", { inquiry_type: payload.eventType || "unknown" });
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = "We could not submit this automatically. Please call the sales agent or try again.";
        formStatus.className = "status-note status-error";
      }
      console.error(error);
    } finally {
      submitBooking?.removeAttribute("disabled");
    }
  });
  /* BLOCK 7 END: BOOKING FORM */
});