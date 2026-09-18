import { USD_TO_XAF } from "./pricing";

/**
 * A request can hold several services. Each one is copied onto the booking as
 * a snapshot, so the invoice keeps showing what was actually quoted even after
 * a service is renamed or repriced.
 */
export const snapshot = (service) => ({
  serviceId: service.id,
  name: service.name,
  category: service.category,
  icon: service.icon,
  startingAt: service.startingAt ?? null,
  priceMax: service.priceMax ?? null,
  priceSuffix: service.priceSuffix ?? "",
  withHostingXAF: service.withHostingXAF ?? null,
  timeline: service.timeline,
  custom: Boolean(service.custom),
  askMonths: Boolean(service.askMonths),
  months: service.months ?? null,
});

/**
 * The services on a booking. Bookings made before multi-select stored a single
 * service in flat fields; those are lifted into a one-item list here.
 */
export const itemsOf = (booking) => {
  if (Array.isArray(booking?.items) && booking.items.length) return booking.items;
  if (!booking?.serviceId) return [];
  return [
    {
      serviceId: booking.serviceId,
      name: booking.serviceName,
      category: booking.category,
      icon: booking.icon,
      startingAt: booking.startingAt ?? null,
      priceMax: booking.priceMax ?? null,
      priceSuffix: booking.priceSuffix ?? "",
      withHostingXAF: booking.withHostingXAF ?? null,
      timeline: booking.timeline,
      custom: Boolean(booking.custom),
      months: null,
    },
  ];
};

/** "Banking System, SEO and Mobile App" */
export const itemNames = (items) => {
  const names = items.map((i) => i.name);
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
};

const roundXAF = (usd) => Math.round((usd * USD_TO_XAF) / 500) * 500;

/** Does this item drop to its build-only price for this client? */
export const isReduced = (item, hasHosting) => hasHosting && item.withHostingXAF != null;

/** Has the client still to say how many months they want? */
export const needsMonths = (item) => Boolean(item.askMonths) && !item.months;

/**
 * One item's price as { usd: [min, max], xaf: [min, max] }, or null when quoted
 * later. A monthly service with a chosen term is priced for the whole term.
 */
export const itemPrice = (item, hasHosting = false) => {
  if (item.startingAt == null) return null;
  if (isReduced(item, hasHosting)) {
    const xaf = item.withHostingXAF;
    const usd = Math.round(xaf / USD_TO_XAF);
    return { usd: [usd, usd], xaf: [xaf, xaf] };
  }
  const max = item.priceMax ?? item.startingAt;
  const term = item.months ?? 1;
  return {
    usd: [item.startingAt * term, max * term],
    // Round the monthly CFA first, so the total is exactly months × what the card shows.
    xaf: [roundXAF(item.startingAt) * term, roundXAF(max) * term],
  };
};

/**
 * Display text for one item: the amount, plus a breakdown line when it is a
 * monthly service taken for a set number of months. Null when quoted later.
 */
export const priceText = (item, hasHosting = false) => {
  const price = itemPrice(item, hasHosting);
  if (!price) return null;
  if (item.months) {
    const perMonth = itemPrice({ ...item, months: null }, hasHosting);
    return {
      usd: rangeUSD(price.usd),
      xaf: rangeXAF(price.xaf),
      detail: `${rangeUSD(perMonth.usd)}/month × ${item.months} month${item.months === 1 ? "" : "s"}`,
    };
  }
  return {
    usd: `${rangeUSD(price.usd)}${item.priceSuffix}`,
    xaf: `${rangeXAF(price.xaf)}${item.priceSuffix}`,
    detail: null,
  };
};

const empty = () => ({ usd: [0, 0], xaf: [0, 0], count: 0 });

/**
 * Totals for a request, kept apart by how they are billed — adding a monthly
 * retainer to a one-off build would produce a number nobody actually pays.
 */
export const orderTotals = (items, hasHosting = false) => {
  const oneOff = empty();
  const monthly = empty();
  let quoted = 0;

  for (const item of items) {
    const price = itemPrice(item, hasHosting);
    if (!price) {
      quoted += 1;
      continue;
    }
    const bucket = item.priceSuffix === "/month" && !item.months ? monthly : oneOff;
    bucket.usd[0] += price.usd[0];
    bucket.usd[1] += price.usd[1];
    bucket.xaf[0] += price.xaf[0];
    bucket.xaf[1] += price.xaf[1];
    bucket.count += 1;
  }

  return {
    oneOff,
    monthly,
    quoted,
    // What a sensible budget can go up to: the build plus the first month.
    ceiling: oneOff.usd[1] + monthly.usd[1] || null,
    anyReduced: items.some((i) => isReduced(i, hasHosting)),
    anyHostingEligible: items.some((i) => i.withHostingXAF != null),
  };
};

const usdText = (n) => `$${n.toLocaleString("en-US")}`;
const xafText = (n) => n.toLocaleString("en-US").replace(/,/g, " ");

/** [250, 250] -> "$250"; [2750, 10000] -> "$2,750 – $10,000" */
export const rangeUSD = ([min, max]) =>
  min === max ? usdText(min) : `${usdText(min)} – ${usdText(max)}`;

/** [150000, 150000] -> "150 000 FCFA" */
export const rangeXAF = ([min, max]) =>
  min === max ? `${xafText(min)} FCFA` : `${xafText(min)} – ${xafText(max)} FCFA`;
