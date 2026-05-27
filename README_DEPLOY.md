# Casablanca Las Vegas Website + Google Calendar Inquiry API

This project contains:

1. A high-end single-page luxury estate website.
2. Production CSS/JS files instead of Tailwind CDN usage.
3. Structured gallery JSON.
4. Flatpickr availability calendar.
5. Matterport 3D tour embed.
6. Vercel serverless API endpoint that reads approved Google Calendar holds and writes pending inquiries.
7. Anti-spam validation and analytics event hooks.

---

## File Map

```txt
casablancalv/
├── index.html
├── api/
│   └── bookings.js
├── assets/
│   ├── css/
│   │   └── app.css
│   ├── js/
│   │   └── app.js
│   └── data/
│       └── gallery.json
├── package.json
├── .env.example
└── README_DEPLOY.md
```

---

## Deployment

In Vercel:

```txt
Framework Preset: Other
Install Command: npm install
Build Command: leave blank
Output Directory: leave blank
```

The frontend production assets are committed directly in:

```txt
/assets/css/app.css
/assets/js/app.js
/assets/data/gallery.json
```

No Tailwind CDN is used on the page. The site links to the compiled/static CSS and JS assets above.

---

## Environment Variables

In Vercel:

```txt
Project > Settings > Environment Variables
```

Add:

```txt
GOOGLE_CALENDAR_ID
GOOGLE_SERVICE_ACCOUNT_JSON
ALLOWED_ORIGINS
GOOGLE_CALENDAR_TIMEZONE
```

Use:

```txt
GOOGLE_CALENDAR_TIMEZONE=America/Los_Angeles
```

For `ALLOWED_ORIGINS`, use:

```txt
https://casablancalv.vercel.app
```

For `GOOGLE_SERVICE_ACCOUNT_JSON`, paste the entire downloaded service account JSON as one value.

Never commit secrets to GitHub.

---

## Calendar Approval Workflow

The API now creates **pending inquiries**, not automatic hard holds.

New submissions create Google Calendar events titled like:

```txt
PENDING: Name - Inquiry Type
```

Pending events are created with:

```txt
transparency: transparent
extendedProperties.private.approvalStatus=pending
```

The availability API only treats events as unavailable when they are approved/blocked. A calendar event blocks dates when either:

1. The private extended property is changed to:

```txt
approvalStatus=approved
```

or

2. The event title starts with:

```txt
HOLD:
CONFIRMED:
BLOCKED:
```

This lets the owner review inquiries before actually blocking inventory.

---

## API Test

Open:

```txt
https://casablancalv.vercel.app/api/bookings
```

Healthy response:

```json
{
  "unavailable": []
}
```

or approved unavailable ranges.

---

## Analytics Events

The frontend pushes events into `window.dataLayer` and calls `gtag()` when available.

Tracked events include:

```txt
gallery_image_view
gallery_lightbox_open
video_start
video_play
video_pause
video_back_10
video_forward_10
video_mute_toggle
video_close
date_select
form_start
form_submit
form_submit_error
phone_click
mobile_menu_open
```

---

## Notes

- The gallery is loaded from `/assets/data/gallery.json`.
- The site uses `/assets/css/app.css` instead of Tailwind CDN.
- Images include dimensions, responsive `sizes`, structured alt text, and WebP where the provided asset supports it.
- The Matterport 3D tour is embedded in the 3D Tour section.
- City VIP Concierge is linked as the concierge service provider.
- Public location language intentionally avoids exposing the exact street address too early.
