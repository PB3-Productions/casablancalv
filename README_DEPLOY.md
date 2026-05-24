# Casablanca Las Vegas Website + Google Calendar Booking API

This project contains:

1. A high-end single-page luxury estate website.
2. A wrought-iron GSAP ScrollTrigger parallax effect.
3. A Flatpickr VIP booking calendar.
4. A Vercel serverless API endpoint that reads and writes to Google Calendar.
5. A copy-paste-friendly deployment flow.

---

## File Map

```txt
casablancalv/
├── index.html
├── api/
│   └── bookings.js
├── package.json
├── .env.example
└── README_DEPLOY.md
```

---

## Step 1: Deploy to Vercel

In Vercel:

1. Click **Add New**.
2. Click **Project**.
3. Import this GitHub repo:

```txt
PB3-Productions/casablancalv
```

4. Use these settings:

```txt
Framework Preset: Other
Install Command: npm install
Build Command: leave blank
Output Directory: leave blank
```

5. Click **Deploy**.

The frontend will load from:

```txt
https://your-vercel-project.vercel.app
```

The booking API will load from:

```txt
https://your-vercel-project.vercel.app/api/bookings
```

---

## Step 2: Google Cloud Setup

### 1. Enable Google Calendar API

In Google Cloud Console:

```txt
APIs & Services > Library > Google Calendar API > Enable
```

### 2. Create a Service Account

Go to:

```txt
IAM & Admin > Service Accounts > Create Service Account
```

Suggested name:

```txt
hacienda-calendar-bot
```

### 3. Create a JSON Key

Inside the service account:

```txt
Keys > Add Key > Create New Key > JSON
```

Download the JSON file.

Do **not** upload this JSON file to GitHub.

---

## Step 3: Share Google Calendar With the Service Account

Open the downloaded JSON file and copy the `client_email` value.

It will look like:

```txt
hacienda-calendar-bot@your-project.iam.gserviceaccount.com
```

Then open Google Calendar:

```txt
Calendar Settings > Share with specific people or groups
```

Add the service account email and grant:

```txt
Make changes to events
```

This is required. Without it, the API can authenticate but cannot read/write the booking calendar.

---

## Step 4: Get Calendar ID

In Google Calendar:

```txt
Settings and sharing > Integrate calendar > Calendar ID
```

Copy the Calendar ID.

It may look like:

```txt
yourname@gmail.com
```

or:

```txt
abc123@group.calendar.google.com
```

---

## Step 5: Add Vercel Environment Variables

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

For `ALLOWED_ORIGINS`, start with your Vercel URL:

```txt
https://your-vercel-project.vercel.app
```

For `GOOGLE_SERVICE_ACCOUNT_JSON`, paste the entire downloaded service account JSON as one value.

---

## Step 6: Redeploy After Adding Env Vars

In Vercel:

```txt
Project > Deployments > Latest Deployment > Three dots > Redeploy
```

Environment variables are applied during deployments, so redeploy after adding them.

---

## Step 7: Test the API

Open:

```txt
https://your-vercel-project.vercel.app/api/bookings
```

Healthy response:

```json
{
  "unavailable": []
}
```

or actual unavailable ranges.

---

## Step 8: Test the Booking Form

1. Open the live Vercel site.
2. Scroll to the VIP Booking section.
3. Select check-in/check-out dates.
4. Fill out the form.
5. Submit.
6. Confirm that a Google Calendar event was created.

The current backend creates a calendar event immediately with a title like:

```txt
HOLD: Name - Inquiry Type
```

---

## Production Recommendation

Right now, every submitted inquiry creates a real calendar hold immediately.

For production, consider changing the event title to:

```txt
PENDING REQUEST: Name - Inquiry Type
```

and manually approving qualified bookings.
