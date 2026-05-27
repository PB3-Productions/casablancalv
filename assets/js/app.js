/* =========================================================
   BLOCK 1 START: CASABLANCA LAS VEGAS FRONTEND APPLICATION
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

  /* =========================================================
     BLOCK 2 START: HEADER + MOBILE DRAWER
     ========================================================= */
  const header = $("#site-header");
  const drawer = $("#drawer");
  const overlay = $("#drawerOverlay");
  const hamburger = $("#hamburger-btn");
  const closeDrawer = $("#close-drawer");

  const setHeaderState = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

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
  $$(".drawer-nav a").forEach((link) => link.addEventListener("click", closeDrawerMenu));

  /* =========================================================
     BLOCK 3 START: SCROLL REVEALS
     ========================================================= */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach((element) => revealObserver.observe(element));

  /* =========================================================
     BLOCK 4 START: GALLERY FROM STRUCTURED JSON
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
     BLOCK 5 START: VIDEO PLAYER WITH STICKY BEHAVIOR
     ========================================================= */
  const videoSlot = $("#estateVideoSlot");
  const videoShell = $("#estateVideoShell");
  const estateVideo = $("#estateVideo");
  const pauseButton = $("#videoPause");
  const closeButton = $("#videoClose");
  const backButton = $("#videoBack");
  const forwardButton = $("#videoForward");
  const musicButton = $("#videoMusic");
  const tourSection = $("#video-tour");
  let stickyClosed = false;
  let videoStarted = false;
  let controlsTimer = null;

  const showVideoControls = () => {
    if (!videoShell) return;
    videoShell.classList.remove("controls-hidden");
    clearTimeout(controlsTimer);
    controlsTimer = setTimeout(() => videoShell.classList.add("controls-hidden"), 3000);
  };

  const moveVideoToBody = () => {
    if (!videoSlot || !videoShell || videoShell.parentElement === document.body) return;
    videoSlot.style.minHeight = `${videoShell.offsetHeight}px`;
    document.body.appendChild(videoShell);
  };

  const returnVideoToSlot = () => {
    if (!videoSlot || !videoShell || videoShell.parentElement === videoSlot) return;
    videoSlot.appendChild(videoShell);
    videoSlot.style.minHeight = "";
  };

  const playVideoOnce = (revealControls = false) => {
    if (!estateVideo) return;
    if (!videoStarted) {
      estateVideo.currentTime = 0;
      videoStarted = true;
      estateVideo.play().catch(() => {});
      if (pauseButton) pauseButton.textContent = "Pause";
      trackEvent("video_start", { video_name: "Casablanca Las Vegas Estate Tour" });
    }
    if (revealControls) showVideoControls();
  };

  const updateStickyVideo = () => {
    if (!videoShell || !estateVideo || !tourSection || !videoSlot) return;
    const rect = tourSection.getBoundingClientRect();
    const beforeTour = rect.top > window.innerHeight * 0.58;
    const inTour = rect.top < window.innerHeight * 0.76 && rect.bottom > 160;
    const pastTour = rect.bottom <= 160;
    const nearTop = window.scrollY < 120;

    if (nearTop || beforeTour) {
      returnVideoToSlot();
      stickyClosed = false;
      videoStarted = false;
      clearTimeout(controlsTimer);
      videoShell.classList.remove("is-sticky", "is-hidden", "controls-hidden");
      estateVideo.pause();
      estateVideo.currentTime = 0;
      if (pauseButton) pauseButton.textContent = "Play";
      return;
    }

    if (inTour && !videoShell.classList.contains("is-sticky")) {
      videoShell.classList.remove("is-hidden");
      playVideoOnce(!videoStarted);
      return;
    }

    if (pastTour && !stickyClosed) {
      moveVideoToBody();
      videoShell.classList.add("is-sticky");
      videoShell.classList.remove("is-hidden");
      playVideoOnce(false);
    }
  };

  videoShell?.addEventListener("mousemove", showVideoControls);
  videoShell?.addEventListener("click", showVideoControls);
  videoShell?.addEventListener("touchstart", showVideoControls, { passive: true });
  window.addEventListener("scroll", updateStickyVideo, { passive: true });
  window.addEventListener("resize", updateStickyVideo);
  updateStickyVideo();

  pauseButton?.addEventListener("click", () => {
    showVideoControls();
    if (estateVideo.paused) {
      if (!videoStarted) { estateVideo.currentTime = 0; videoStarted = true; }
      estateVideo.play().catch(() => {});
      pauseButton.textContent = "Pause";
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
  closeButton?.addEventListener("click", () => {
    stickyClosed = true;
    clearTimeout(controlsTimer);
    videoShell.classList.remove("is-sticky", "controls-hidden");
    videoShell.classList.add("is-hidden");
    estateVideo.pause();
    trackEvent("video_close", { video_name: "Casablanca Las Vegas Estate Tour" });
  });

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
      setStatus("formStatus", "Success. Your request was submitted as pending. Our private booking team will verify availability and follow up personally.", "ok");
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
});
/* =========================================================
   BLOCK 1 END: CASABLANCA LAS VEGAS FRONTEND APPLICATION
   ========================================================= */
