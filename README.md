# Dobgima Joshua Foncham — Consultation Booking System

A professional site where clients book a free consultation for a web project — tracking platforms, refund portals, e-commerce stores, spare parts catalogues, pet and business websites. Built with **React 19**, **Vite**, **Tailwind CSS v4** and **Framer Motion**.

One provider (you), one calendar, one dashboard.

## Run it

```bash
npm install
npm run dev      # http://localhost:5175
npm run build    # production bundle in dist/
npm run preview  # serve the production build
```

## Pages

| Route | What it does |
| --- | --- |
| `/` | Landing page — hero, your contact card, services, process, terms, FAQ |
| `/services` | Full service list with search, category tabs and sorting |
| `/book` | Three-step consultation booking + confirmation |
| `/bookings` | Client area — upcoming / past / cancelled, reschedule and cancel |
| `/dashboard` | Your private view — enquiries, pipeline value, day schedule with client contacts |

## The booking flow

1. **Project** — the client picks the closest service to what they need.
2. **Date & time** — live slots from your consultation hours (Mon–Sat, 08:00–18:00, closed Sunday).
3. **Your details** — validated name, email and phone, plus business name, budget range and project notes.

Confirming issues a reference (`DJ-XXXXXX`) shown on screen, in *My Bookings* and on your dashboard.

### How availability works

`src/lib/schedule.js` generates slots from `OPENING` in `src/data/services.js`. A slot is hidden when it:

- would run past closing for that consultation length,
- is less than an hour away,
- overlaps a call you already have, or
- falls on a blocked stretch of the day — a deterministic hash of date + slot, so availability stays stable across reloads instead of reshuffling on every render.

Replace `buildSlots` with a real calendar API and the rest of the UI keeps working.

## Editing your content

Everything client-facing lives in [`src/data/services.js`](src/data/services.js):

- `owner` — your name, role, phone, email, location and bio
- `services` — each project type, its price floor, delivery timeline and consultation length
- `process`, `guarantees`, `faqs` — the landing-page copy
- `OPENING` — consultation hours and slot spacing

Nothing else needs touching to change what the site says or sells.

## Project structure

```
src/
  components/
    ui.jsx              Backdrop, Reveal, Button, Badge, Card, ServiceIcon
    Navbar.jsx          Sticky nav with your phone number
    Footer.jsx
    Toasts.jsx
    ServiceCard.jsx     Also the selectable card in the wizard
    StepIndicator.jsx
    DateTimePicker.jsx  Day strip + slot grid (booking and reschedule)
  pages/                Home, Services, Book, MyBookings, Dashboard
  context/              BookingContext — add / cancel / reschedule + toasts
  lib/schedule.js       Slot generation, date helpers, pricing
  data/services.js      All site content
```

## Design

White, light and deliberately plain: one accent blue (`#1d4ed8`), hairline borders, soft shadows, no background patterns or gradients behind content. Motion is limited to page transitions, scroll reveals, a sliding tab underline and small hover lifts — all disabled under `prefers-reduced-motion`.

## Notes

Front-end only. Bookings persist to `localStorage` (`djf.bookings.v1`), so the dashboard shows real data as clients book on that device, but there is no server, no real email and no payment capture yet.
