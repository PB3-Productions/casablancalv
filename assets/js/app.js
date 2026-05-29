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

  const setShrunkHeader = (shouldShrink) => {
    if (!header) return;
    header.classList.toggle("is-scrolled", shouldShrink);
    if (shouldShrink) {
      header.style.backgroundColor = "#050505";
      header.style.backgroundImage = "linear-gradient(180deg, rgba(5,5,5,.99), rgba(10,10,10,.96))";
    } else {
      header.style.backgroundColor = "";
      header.style.backgroundImage = "";
    }
  };

  let lastScrollY = Math.max(window.scrollY || 0, 0);
  let headerScrollTicking = false;
  setShrunkHeader(lastScrollY > 24);

  const updateHeaderScrollState = () => {
    const currentScrollY = Math.max(window.scrollY || 0, 0);
    const scrollDelta = currentScrollY - lastScrollY;

    if (currentScrollY <= 24) {
      setShrunkHeader(false);
    } else if (scrollDelta > 4) {
      setShrunkHeader(true);
    } else if (scrollDelta < -4) {
      setShrunkHeader(false);
    }

    lastScrollY = currentScrollY;
    headerScrollTicking = false;
  };

  const requestHeaderScrollState = () => {
    if (headerScrollTicking) return;
    headerScrollTicking = true;
    window.requestAnimationFrame(updateHeaderScrollState);
  };

  window.addEventListener("scroll", requestHeaderScrollState, { passive: true });

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

  const availabilityIntro = $("#availability .lead.light");
  if (availabilityIntro) {
    availabilityIntro.textContent = "Our team reviews your date window, event type, guest count, and concierge needs personally. We typically respond within 24–48 hours. If you have immediate questions or need to book ASAP, please call and speak with a sales agent.";
  }

  const privateEstateProofGrid = $$(".proof-grid").find((grid) => {
    const text = grid.textContent || "";
    return text.includes("Matterport 3D Tour") && text.includes("Calendar-Connected") && text.includes("VIP Concierge Layer");
  });
  privateEstateProofGrid?.remove();

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
     BLOCK 5 START: VIDEO PLAYER MANUAL DETACH + ENLARGE
     ========================================================= */
  const videoShell = $("#estateVideoShell");
  const estateVideo = $("#estateVideo");
  const pauseButton = $("#videoPause");
  const closeButton = $("#videoClose");
  const backButton = $("#videoBack");
  const forwardButton = $("#videoForward");
  const musicButton = $("#videoMusic");
  let videoStarted = false;
  let controlsTimer = null;

  const detachButton = document.createElement("button");
  detachButton.id = "videoDetach";
  detachButton.className = "video-control";
  detachButton.type = "button";
  detachButton.dataset.dynamicVideoControl = "true";
  detachButton.textContent = "Detach";

  const largeButton = document.createElement("button");
  largeButton.id = "videoLarge";
  largeButton.className = "video-control";
  largeButton.type = "button";
  largeButton.dataset.dynamicVideoControl = "true";
  largeButton.textContent = "Large";

  const videoControls = videoShell?.querySelector(".video-controls");
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
});
/* =========================================================
   BLOCK 1 END: CASABLANCA LAS VEGAS FRONTEND APPLICATION
   ========================================================= */

/* =========================================================
   BLOCK 2 START: PROTECTED SPLIT HERO UPGRADE
   Purpose: 2026-style luxury arrival with CTA/content off the hero image.
   ========================================================= */
window.addEventListener("DOMContentLoaded", () => {
  const existingHero = document.querySelector("main .hero");
  if (!existingHero || existingHero.classList.contains("hero-split")) return;

  const splitHeroStyle = document.createElement("style");
  splitHeroStyle.id = "casa-split-hero-style";
  splitHeroStyle.textContent = `
    .hero-split{position:relative;min-height:100svh;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(390px,.92fr);align-items:stretch;overflow:hidden;background:radial-gradient(circle at 82% 12%,rgba(255,238,169,.16),transparent 27rem),linear-gradient(135deg,#070706 0%,#14110c 48%,#070706 100%);color:var(--bg-ivory);isolation:isolate}.hero-split:before{content:"";position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(90deg,transparent 0%,transparent 50%,rgba(7,7,6,.26) 58%,rgba(7,7,6,.82) 100%)}.hero-split-media{position:relative;min-height:100svh;overflow:hidden;background:#090806}.hero-split-media .hero-picture,.hero-split-media .hero-picture img{display:block;width:100%;height:100%}.hero-split-media .hero-picture img{min-height:100svh;object-fit:cover;object-position:center;filter:saturate(1.04) contrast(1.07) brightness(.9);transform:scale(1.018)}.hero-split-panel{position:relative;z-index:3;min-height:100svh;display:flex;flex-direction:column;justify-content:center;padding:clamp(8.25rem,10vw,11rem) clamp(1.25rem,4.8vw,5.75rem) clamp(3.5rem,6vw,6rem);border-left:1px solid rgba(255,238,169,.18);background:radial-gradient(circle at 20% 16%,rgba(255,238,169,.13),transparent 19rem),linear-gradient(180deg,rgba(19,15,9,.94),rgba(8,8,6,.98));box-shadow:-34px 0 90px rgba(0,0,0,.38)}.hero-kicker{display:inline-flex;align-items:center;gap:.78rem;width:fit-content;margin:0 0 clamp(.85rem,1.4vw,1.25rem);color:#ffe58a;font-family:var(--font-title)!important;font-size:clamp(.66rem,.82vw,.82rem);font-weight:800;letter-spacing:.18em;line-height:1.35;text-transform:uppercase;text-shadow:0 0 .9rem rgba(255,229,138,.28)}.hero-kicker:before{content:"";width:clamp(1.8rem,4vw,3.6rem);height:1px;background:currentColor;opacity:.72}.hero-split-title{max-width:820px;margin:0;color:#fffaf0;font-size:clamp(2.15rem,4.75vw,5.95rem);line-height:.9;font-weight:800;letter-spacing:-.052em;text-wrap:balance;text-shadow:0 18px 58px rgba(0,0,0,.46)}.hero-split-lead{max-width:720px;margin:clamp(1rem,2vw,1.55rem) 0 0;color:rgba(255,253,247,.78);font-size:clamp(.98rem,1.24vw,1.15rem);line-height:1.72;text-align:left!important}.hero-split-actions{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:clamp(1.25rem,2.35vw,2rem)}.hero-split-actions .btn{min-height:clamp(3.05rem,4vw,3.55rem);padding-inline:clamp(1.05rem,2vw,1.55rem)!important;font-size:clamp(.62rem,.72vw,.76rem)!important}.hero-split-actions .btn-outline{color:#ffe58a!important;border-color:rgba(255,238,169,.55)!important}.hero-split-proof{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.68rem;width:min(760px,100%);margin-top:clamp(1.25rem,2.2vw,1.9rem)}.hero-proof-item{min-width:0;padding:clamp(.8rem,1.4vw,1.05rem) .72rem;border:1px solid rgba(255,238,169,.18);border-radius:1rem;background:rgba(255,255,255,.055);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 16px 30px rgba(0,0,0,.22);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}.hero-proof-item b{display:block;color:#ffe58a;font-family:var(--font-title)!important;font-size:clamp(1.2rem,1.9vw,1.85rem);line-height:1}.hero-proof-item span{display:block;margin-top:.35rem;color:rgba(255,253,247,.68);font-family:var(--font-title)!important;font-size:clamp(.56rem,.68vw,.66rem);font-weight:800;letter-spacing:.1em;line-height:1.28;text-transform:uppercase}.hero-split+.intro-panel{margin-top:0!important}@media (prefers-reduced-motion:no-preference){.hero-split-media .hero-picture img{animation:casaProtectedHeroDrift 14s ease-out both}@keyframes casaProtectedHeroDrift{from{transform:scale(1.075)}to{transform:scale(1.018)}}}@media (max-width:1180px){.hero-split{grid-template-columns:minmax(0,1fr) minmax(350px,.92fr)}.hero-split-proof{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (max-width:900px){.hero-split{min-height:auto;grid-template-columns:1fr}.hero-split:before{display:none}.hero-split-media{min-height:clamp(360px,62svh,680px)}.hero-split-media .hero-picture img{min-height:clamp(360px,62svh,680px);object-position:center}.hero-split-panel{min-height:auto;padding:clamp(2rem,8vw,3.4rem) clamp(1rem,5vw,2rem) clamp(2.5rem,8vw,4rem);border-left:0;border-top:1px solid rgba(255,238,169,.18);box-shadow:0 -28px 70px rgba(0,0,0,.4)}.hero-split-title{font-size:clamp(2.15rem,10.8vw,4.4rem)}.hero-split-actions{display:grid;grid-template-columns:1fr}.hero-split-actions .btn{width:100%}}@media (max-width:520px){.hero-split-media{min-height:clamp(320px,56svh,560px)}.hero-split-media .hero-picture img{min-height:clamp(320px,56svh,560px);object-position:54% center}.hero-split-proof{grid-template-columns:repeat(2,minmax(0,1fr))}.hero-proof-item{border-radius:.85rem}}
  `;
  document.head.appendChild(splitHeroStyle);

  existingHero.className = "hero hero-split";
  existingHero.setAttribute("aria-labelledby", "hero-title");
  existingHero.innerHTML = `
    <div class="hero-split-media" aria-label="Casablanca Las Vegas luxury estate hero image">
      <picture class="hero-picture">
        <source srcset="https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1730e5ab0c04a0ea3601a7.webp 1920w" type="image/webp" sizes="(min-width: 1024px) 56vw, 100vw" />
        <img src="https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1730e5ab0c04a0ea3601a7.webp" srcset="https://assets.cdn.filesafe.space/E2BEbKIK8SvsJICq4vXY/media/6a1730e5ab0c04a0ea3601a7.webp 1920w" sizes="(min-width: 1024px) 56vw, 100vw" width="1920" height="1080" alt="Ultra-private Casablanca Las Vegas luxury mansion rental with resort pool near the Las Vegas Strip" fetchpriority="high" decoding="async" />
      </picture>
    </div>
    <div class="hero-split-panel">
      <p class="hero-kicker">Private Estate Rental Near the Las Vegas Strip</p>
      <h1 id="hero-title" class="font-display hero-split-title">Luxury Mansion Rentals in Las Vegas for Private Stays, Events & VIP Experiences</h1>
      <p class="hero-split-lead">Casablanca Las Vegas is an ultra-private 6,991 sq. ft. estate with 10 possible bedrooms, resort-style outdoor space, concierge add-ons, and guided booking support for elevated group stays, retreats, productions, weddings, and private events.</p>
      <div class="hero-split-actions" aria-label="Primary booking actions">
        <a class="btn btn-gold hero-primary-cta" href="#availability">Request Private Availability Review</a>
        <a class="btn btn-outline hero-secondary-cta" href="#video-tour">View the Estate Tour</a>
      </div>
      <div class="hero-split-proof" aria-label="Estate highlights">
        <div class="hero-proof-item"><b>10</b><span>Possible Bedrooms</span></div>
        <div class="hero-proof-item"><b>6</b><span>Full Bathrooms</span></div>
        <div class="hero-proof-item"><b>6,991</b><span>Approx. Sq. Ft.</span></div>
        <div class="hero-proof-item"><b>~5 Mi</b><span>From the Strip</span></div>
      </div>
    </div>
  `;

  const introTitle = document.querySelector("#welcome h1");
  if (introTitle) {
    const newTitle = document.createElement("h2");
    newTitle.className = introTitle.className;
    newTitle.setAttribute("style", introTitle.getAttribute("style") || "");
    newTitle.textContent = "A Private Las Vegas Estate Designed for Groups, Events & VIP Stays";
    introTitle.replaceWith(newTitle);
  }
});
/* =========================================================
   BLOCK 2 END: PROTECTED SPLIT HERO UPGRADE
   ========================================================= */
