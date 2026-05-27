/*
  =========================================================
  VERCEL SERVERLESS FUNCTION: /api/bookings
  =========================================================

  GET /api/bookings?start=YYYY-MM-DD&end=YYYY-MM-DD
  - Reads approved Google Calendar holds only.
  - Returns unavailable date ranges.

  POST /api/bookings
  - Receives a VIP inquiry.
  - Validates required fields, email, dates, guest count, and spam signals.
  - Creates a PENDING all-day calendar event that does not block availability.
  - Admin can rename PENDING to HOLD or CONFIRMED to make dates unavailable.
*/

const { google } = require("googleapis");

/* =========================================================
   BLOCK 1 START: CORS + RESPONSE HELPERS
   ========================================================= */
function setCorsHeaders(req, res) {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const requestOrigin = req.headers.origin;
  const allowOrigin =
    allowedOrigins.length === 0
      ? "*"
      : allowedOrigins.includes(requestOrigin)
        ? requestOrigin
        : allowedOrigins[0];

  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
}

function json(res, status, payload) {
  return res.status(status).json(payload);
}
/* =========================================================
   BLOCK 1 END: CORS + RESPONSE HELPERS
   ========================================================= */

/* =========================================================
   BLOCK 2 START: DATE + TEXT HELPERS
   ========================================================= */
function isValidISODate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function addDaysToISODate(isoDate, days) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function daysBetween(start, end) {
  const startDate = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T00:00:00Z`);
  return Math.round((endDate - startDate) / 86400000);
}

function normalizeGoogleEventDate(eventDate) {
  if (!eventDate) return null;
  if (eventDate.date) return eventDate.date;
  if (eventDate.dateTime) return eventDate.dateTime.slice(0, 10);
  return null;
}

function sanitizeText(value, maxLength = 500) {
  if (typeof value !== "string") return "";
  return value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function isValidEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 160;
}

function parseGuestCount(value) {
  const count = Number.parseInt(value, 10);
  return Number.isFinite(count) ? count : null;
}
/* =========================================================
   BLOCK 2 END: DATE + TEXT HELPERS
   ========================================================= */

/* =========================================================
   BLOCK 3 START: GOOGLE AUTH
   ========================================================= */
function getGoogleAuth() {
  let clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      clientEmail = serviceAccount.client_email;
      privateKey = serviceAccount.private_key;
    } catch (error) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON.");
    }
  }

  if (!clientEmail || !privateKey) {
    throw new Error("Missing Google service account credentials. Add GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY.");
  }

  privateKey = privateKey.replace(/\\n/g, "\n");

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"]
  });
}

function getCalendarClient() {
  const auth = getGoogleAuth();
  return google.calendar({ version: "v3", auth });
}
/* =========================================================
   BLOCK 3 END: GOOGLE AUTH
   ========================================================= */

/* =========================================================
   BLOCK 4 START: READ APPROVED UNAVAILABLE DATES
   ========================================================= */
function isApprovedBlockingEvent(event) {
  const summary = String(event.summary || "").toUpperCase();
  const status = event.extendedProperties?.private?.approvalStatus;
  if (event.status === "cancelled") return false;
  if (status === "pending") return false;
  if (status === "approved") return true;
  return summary.startsWith("HOLD:") || summary.startsWith("CONFIRMED:") || summary.startsWith("BLOCKED:");
}

async function getUnavailableDates(req, res) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const timezone = process.env.GOOGLE_CALENDAR_TIMEZONE || "America/Los_Angeles";

  if (!calendarId) return json(res, 500, { error: "Missing GOOGLE_CALENDAR_ID." });

  const start = isValidISODate(req.query.start) ? req.query.start : new Date().toISOString().slice(0, 10);
  const end = isValidISODate(req.query.end) ? req.query.end : addDaysToISODate(start, 365);
  const calendar = getCalendarClient();

  const result = await calendar.events.list({
    calendarId,
    timeMin: `${start}T00:00:00-08:00`,
    timeMax: `${end}T23:59:59-08:00`,
    singleEvents: true,
    orderBy: "startTime",
    timeZone: timezone
  });

  const unavailable = (result.data.items || [])
    .filter(isApprovedBlockingEvent)
    .map((event) => {
      const eventStart = normalizeGoogleEventDate(event.start);
      const rawEnd = normalizeGoogleEventDate(event.end);
      const eventEnd = rawEnd ? addDaysToISODate(rawEnd, -1) : eventStart;
      return {
        id: event.id,
        summary: event.summary || "Unavailable",
        start: eventStart,
        end: eventEnd
      };
    })
    .filter((range) => range.start && range.end);

  return json(res, 200, { unavailable });
}
/* =========================================================
   BLOCK 4 END: READ APPROVED UNAVAILABLE DATES
   ========================================================= */

/* =========================================================
   BLOCK 5 START: VALIDATION + ANTI-SPAM
   ========================================================= */
function validatePayload(req) {
  const body = req.body || {};
  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";

  if (body.website || body.companyUrl || body.faxNumber) {
    return { error: "Spam protection rejected this submission." };
  }

  const checkIn = sanitizeText(body.checkIn, 20);
  const checkOut = sanitizeText(body.checkOut, 20);
  const name = sanitizeText(body.name, 120);
  const email = sanitizeText(body.email, 180).toLowerCase();
  const phone = sanitizeText(body.phone, 80);
  const eventType = sanitizeText(body.eventType, 120);
  const budget = sanitizeText(body.budget, 120);
  const message = sanitizeText(body.message, 1600);
  const sourcePage = sanitizeText(body.sourcePage, 220);
  const guestCount = parseGuestCount(body.guestCount);

  if (!isValidISODate(checkIn) || !isValidISODate(checkOut)) {
    return { error: "Check-in and check-out must be valid YYYY-MM-DD dates." };
  }
  if (checkOut <= checkIn) return { error: "Check-out must be after check-in." };
  if (daysBetween(checkIn, checkOut) > 21) return { error: "Please contact us directly for stays or event windows longer than 21 days." };
  if (!name || name.length < 2) return { error: "Please provide your name." };
  if (!isValidEmail(email)) return { error: "Please provide a valid email address." };
  if (!guestCount || guestCount < 1 || guestCount > 120) return { error: "Guest count must be between 1 and 120." };
  if (!eventType) return { error: "Please select an inquiry type." };
  if (message && /(https?:\/\/|\[url=|<a\s)/i.test(message)) return { error: "Please remove links from the message field." };

  return {
    data: { checkIn, checkOut, name, email, phone, guestCount, eventType, budget, message, sourcePage, ip }
  };
}
/* =========================================================
   BLOCK 5 END: VALIDATION + ANTI-SPAM
   ========================================================= */

/* =========================================================
   BLOCK 6 START: CREATE PENDING INQUIRY
   ========================================================= */
async function createPendingInquiry(req, res) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const timezone = process.env.GOOGLE_CALENDAR_TIMEZONE || "America/Los_Angeles";
  if (!calendarId) return json(res, 500, { error: "Missing GOOGLE_CALENDAR_ID." });

  const validation = validatePayload(req);
  if (validation.error) return json(res, 400, { error: validation.error });
  const { checkIn, checkOut, name, email, phone, guestCount, eventType, budget, message, sourcePage, ip } = validation.data;

  const calendar = getCalendarClient();

  const conflictResult = await calendar.events.list({
    calendarId,
    timeMin: `${checkIn}T00:00:00-08:00`,
    timeMax: `${checkOut}T23:59:59-08:00`,
    singleEvents: true,
    orderBy: "startTime",
    timeZone: timezone
  });

  const conflicts = (conflictResult.data.items || []).filter(isApprovedBlockingEvent);
  if (conflicts.length > 0) {
    return json(res, 409, {
      error: "Those dates conflict with an approved hold. Please choose different dates or contact the private booking team."
    });
  }

  const description = [
    "PENDING VIP inquiry created from the Casablanca Las Vegas website.",
    "This is not an automatic approved hold. Review the request before blocking inventory.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Guest Count: ${guestCount}`,
    `Inquiry Type: ${eventType}`,
    `Budget Range: ${budget || "Not provided"}`,
    `Source Page: ${sourcePage || "Not provided"}`,
    `IP: ${ip}`,
    "",
    "Message:",
    message || "No message provided.",
    "",
    "Admin instructions:",
    "Rename summary from PENDING to HOLD or CONFIRMED and set approvalStatus=approved manually/admin-side when the booking should block dates."
  ].join("\n");

  const event = {
    summary: `PENDING: ${name} - ${eventType}`,
    description,
    transparency: "transparent",
    start: { date: checkIn, timeZone: timezone },
    end: { date: checkOut, timeZone: timezone },
    extendedProperties: {
      private: {
        source: "casablanca-las-vegas-website",
        approvalStatus: "pending",
        guestCount: String(guestCount),
        inquiryType: String(eventType),
        email
      }
    }
  };

  const created = await calendar.events.insert({ calendarId, requestBody: event });

  return json(res, 201, {
    ok: true,
    status: "pending",
    eventId: created.data.id,
    htmlLink: created.data.htmlLink || null
  });
}
/* =========================================================
   BLOCK 6 END: CREATE PENDING INQUIRY
   ========================================================= */

/* =========================================================
   BLOCK 7 START: MAIN HANDLER
   ========================================================= */
module.exports = async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    if (req.method === "GET") return await getUnavailableDates(req, res);
    if (req.method === "POST") return await createPendingInquiry(req, res);
    res.setHeader("Allow", "GET,POST,OPTIONS");
    return json(res, 405, { error: "Method not allowed." });
  } catch (error) {
    console.error("Bookings API error:", error);
    return json(res, 500, { error: error.message || "Unexpected server error." });
  }
};
/* =========================================================
   BLOCK 7 END: MAIN HANDLER
   ========================================================= */
