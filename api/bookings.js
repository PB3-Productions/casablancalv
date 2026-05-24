/*
  =========================================================
  VERCEL SERVERLESS FUNCTION: /api/bookings
  =========================================================

  WHAT THIS FILE DOES:
  1. GET /api/bookings?start=YYYY-MM-DD&end=YYYY-MM-DD
     - Reads your Google Calendar.
     - Returns unavailable date ranges.
     - The frontend uses these ranges to gray out dates.

  2. POST /api/bookings
     - Receives the booking/inquiry form.
     - Checks for calendar conflicts.
     - Creates an all-day Google Calendar event to block the requested dates.

  IMPORTANT GOOGLE CALENDAR RULE:
  All-day events use an EXCLUSIVE end date.
  Example:
  start.date = 2026-07-01
  end.date   = 2026-07-04
  This blocks the nights of July 1, July 2, and July 3.
  July 4 is the checkout day.

  REQUIRED ENVIRONMENT VARIABLES:
  - GOOGLE_CALENDAR_ID
  - GOOGLE_SERVICE_ACCOUNT_JSON
    OR
  - GOOGLE_CLIENT_EMAIL
  - GOOGLE_PRIVATE_KEY

  OPTIONAL ENVIRONMENT VARIABLES:
  - ALLOWED_ORIGINS
  - GOOGLE_CALENDAR_TIMEZONE
*/

const { google } = require("googleapis");

/* =========================================================
   BLOCK 1 START: CORS HELPER
   ========================================================= */
function setCorsHeaders(req, res) {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const requestOrigin = req.headers.origin;

  /*
    If ALLOWED_ORIGINS is empty, we allow all origins for simple testing.
    For production, set ALLOWED_ORIGINS to your real frontend URL(s).

    Example:
    ALLOWED_ORIGINS=https://yourdomain.com,https://pb3-productions.github.io
  */
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
/* =========================================================
   BLOCK 1 END: CORS HELPER
   ========================================================= */


/* =========================================================
   BLOCK 2 START: DATE HELPERS
   ========================================================= */
function isValidISODate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function addDaysToISODate(isoDate, days) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function normalizeGoogleEventDate(eventDate) {
  /*
    Google events may return:
    - event.start.date      for all-day events
    - event.start.dateTime  for timed events

    We only need the YYYY-MM-DD part for the frontend calendar.
  */
  if (!eventDate) return null;
  if (eventDate.date) return eventDate.date;
  if (eventDate.dateTime) return eventDate.dateTime.slice(0, 10);
  return null;
}
/* =========================================================
   BLOCK 2 END: DATE HELPERS
   ========================================================= */


/* =========================================================
   BLOCK 3 START: GOOGLE AUTH
   ========================================================= */
function getGoogleAuth() {
  /*
    OPTION A - EASIEST:
    Use ONE env variable:
    GOOGLE_SERVICE_ACCOUNT_JSON

    Paste the ENTIRE service account JSON into Vercel as one line.
    It looks like:
    {"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...","client_email":"...","client_id":"..."}

    OPTION B:
    Use two env variables:
    GOOGLE_CLIENT_EMAIL
    GOOGLE_PRIVATE_KEY

    For GOOGLE_PRIVATE_KEY, paste the private key and keep the \n line breaks.
    This code fixes escaped newlines automatically.
  */

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
/* =========================================================
   BLOCK 3 END: GOOGLE AUTH
   ========================================================= */


/* =========================================================
   BLOCK 4 START: GOOGLE CALENDAR CLIENT
   ========================================================= */
function getCalendarClient() {
  const auth = getGoogleAuth();
  return google.calendar({ version: "v3", auth });
}
/* =========================================================
   BLOCK 4 END: GOOGLE CALENDAR CLIENT
   ========================================================= */


/* =========================================================
   BLOCK 5 START: READ UNAVAILABLE DATES
   ========================================================= */
async function getUnavailableDates(req, res) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const timezone = process.env.GOOGLE_CALENDAR_TIMEZONE || "America/Los_Angeles";

  if (!calendarId) {
    return res.status(500).json({ error: "Missing GOOGLE_CALENDAR_ID." });
  }

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

  const events = result.data.items || [];

  const unavailable = events
    .filter((event) => event.status !== "cancelled")
    .map((event) => {
      const eventStart = normalizeGoogleEventDate(event.start);
      const rawEnd = normalizeGoogleEventDate(event.end);

      /*
        Google all-day event end dates are exclusive.
        To gray out occupied nights in Flatpickr, we show the end as one day earlier.
        Example:
        start 2026-07-01, end 2026-07-04 means blocked visible dates:
        2026-07-01 through 2026-07-03.
      */
      const eventEnd = rawEnd ? addDaysToISODate(rawEnd, -1) : eventStart;

      return {
        id: event.id,
        summary: event.summary || "Unavailable",
        start: eventStart,
        end: eventEnd
      };
    })
    .filter((range) => range.start && range.end);

  return res.status(200).json({ unavailable });
}
/* =========================================================
   BLOCK 5 END: READ UNAVAILABLE DATES
   ========================================================= */


/* =========================================================
   BLOCK 6 START: CREATE BOOKING HOLD
   ========================================================= */
async function createBookingHold(req, res) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const timezone = process.env.GOOGLE_CALENDAR_TIMEZONE || "America/Los_Angeles";

  if (!calendarId) {
    return res.status(500).json({ error: "Missing GOOGLE_CALENDAR_ID." });
  }

  const {
    checkIn,
    checkOut,
    name,
    email,
    phone,
    guestCount,
    eventType,
    budget,
    message
  } = req.body || {};

  if (!isValidISODate(checkIn) || !isValidISODate(checkOut)) {
    return res.status(400).json({ error: "Check-in and check-out must be valid YYYY-MM-DD dates." });
  }

  if (checkOut <= checkIn) {
    return res.status(400).json({ error: "Check-out must be after check-in." });
  }

  if (!name || !email || !guestCount || !eventType) {
    return res.status(400).json({ error: "Missing required booking fields." });
  }

  const calendar = getCalendarClient();

  /*
    Conflict check:
    Before creating the hold, look for any existing events that overlap.
  */
  const conflictResult = await calendar.events.list({
    calendarId,
    timeMin: `${checkIn}T00:00:00-08:00`,
    timeMax: `${checkOut}T23:59:59-08:00`,
    singleEvents: true,
    orderBy: "startTime",
    timeZone: timezone
  });

  const conflicts = (conflictResult.data.items || []).filter((event) => event.status !== "cancelled");

  if (conflicts.length > 0) {
    return res.status(409).json({
      error: "Those dates appear to conflict with an existing calendar hold. Please choose different dates or contact us directly."
    });
  }

  const description = [
    "VIP booking inquiry created from the Grand Hacienda Estate website.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Guest Count: ${guestCount}`,
    `Inquiry Type: ${eventType}`,
    `Budget Range: ${budget || "Not provided"}`,
    "",
    "Message:",
    message || "No message provided.",
    "",
    "Important:",
    "This event blocks the requested dates on Google Calendar. Modify this function if you want inquiries to stay pending instead of automatically holding dates."
  ].join("\n");

  const event = {
    summary: `HOLD: ${name} - ${eventType}`,
    description,
    start: {
      date: checkIn,
      timeZone: timezone
    },
    end: {
      date: checkOut,
      timeZone: timezone
    },
    extendedProperties: {
      private: {
        source: "grand-hacienda-estate-website",
        guestCount: String(guestCount),
        inquiryType: String(eventType)
      }
    }
  };

  const created = await calendar.events.insert({
    calendarId,
    requestBody: event
  });

  return res.status(201).json({
    ok: true,
    eventId: created.data.id,
    htmlLink: created.data.htmlLink || null
  });
}
/* =========================================================
   BLOCK 6 END: CREATE BOOKING HOLD
   ========================================================= */


/* =========================================================
   BLOCK 7 START: MAIN HANDLER
   ========================================================= */
module.exports = async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    if (req.method === "GET") {
      return await getUnavailableDates(req, res);
    }

    if (req.method === "POST") {
      return await createBookingHold(req, res);
    }

    res.setHeader("Allow", "GET,POST,OPTIONS");
    return res.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    console.error("Bookings API error:", error);
    return res.status(500).json({
      error: error.message || "Unexpected server error."
    });
  }
};
/* =========================================================
   BLOCK 7 END: MAIN HANDLER
   ========================================================= */
