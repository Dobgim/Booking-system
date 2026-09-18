# Dobgima Joshua Foncham — Service Request System

A professional site where clients request one or more services — tracking platforms, banking and school systems, online stores, mobile apps, SEO and Google Ads, and more. Built with **React 19**, **Vite**, **Tailwind CSS v4** and **Framer Motion**.

One provider (you), one inbox.

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
| `/book` | Two-step request: pick any number of services, then leave contact details |
| `/bookings` | Client area — active and cancelled requests, invoice, resend on WhatsApp |
| `/dashboard` | Your private inbox — every request, newest first, with client contacts |

## The request flow

1. **Services** — the client taps as many services as they want (tap again to remove). A sticky bar keeps the running total and Continue button in reach while scrolling.
2. **Your details** — validated name, email and phone, plus business name, budget range, project notes, and whether they already own hosting and a domain.

Sending issues a reference (`DJ-XXXXXX`), an invoice, and a pre-filled WhatsApp message to the owner. There is no appointment slot — the owner replies with a fixed quote.

### How totals work

`src/lib/order.js` prices each selected service and keeps totals **split by billing type**, because adding a monthly retainer to a one-off build produces a number nobody pays:

- **One-off** — website builds, apps, Google Business, eSIM
- **Monthly** — website care, which stays open-ended
- **Fixed term** — SEO and Google Ads ask how many months (1–24) before they can be added; the term total counts towards the main total
- **Quoted** — "Something else", priced after the conversation

Clients who already own hosting pay each eligible website build at its `withHostingXAF` rate; nothing else is discounted.

Each service is **snapshotted onto the request**, so an old invoice still shows what was quoted after you change prices. Requests saved before multi-select (a single service with a time slot) are read as one-item requests.

## Editing your content

Everything client-facing lives in [`src/data/services.js`](src/data/services.js):

- `owner` — your name, role, phone, email, location and bio
- `services` — each project type, its price floor, delivery timeline and consultation length
- `process`, `guarantees`, `faqs` — the landing-page copy

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
  pages/                Home, Services, About, Book, MyBookings, Invoice, Dashboard
  context/              BookingContext — add / cancel requests + toasts
  lib/order.js          Multi-service totals and snapshots
  lib/message.js        WhatsApp message for a request
  lib/pricing.js        USD/CFA formatting and budget bands
  lib/schedule.js       Date helpers and references
  data/services.js      All site content
```

## Design

White, light and deliberately plain: one accent blue (`#1d4ed8`), hairline borders, soft shadows, no background patterns or gradients behind content. Motion comes from animated SVG artwork per service, scroll reveals, count-up figures and hover lifts — all disabled under `prefers-reduced-motion`.

## Notes

Front-end only. Bookings persist to `localStorage` (`djf.bookings.v1`), so the dashboard shows real data as clients book on that device, but there is no server, no real email and no payment capture yet.
