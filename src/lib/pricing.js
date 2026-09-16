/**
 * Prices are authored in USD and shown alongside CFA francs (XAF).
 * Update this one rate when the exchange rate moves.
 */
export const USD_TO_XAF = 600;

const usd = (n) => `$${n.toLocaleString("en-US")}`;

/** 250 -> "150,000 FCFA" (rounded to the nearest 500 so it reads like a real price) */
const xaf = (n) => {
  const converted = Math.round((n * USD_TO_XAF) / 500) * 500;
  return `${converted.toLocaleString("en-US").replace(/,/g, " ")} FCFA`;
};

/** "$250" or "$2,750 – $10,000" */
export const formatUSD = (service) => {
  if (!service) return "—";
  if (service.startingAt == null) return "On quote";
  const base = usd(service.startingAt);
  return service.priceMax ? `${base} – ${usd(service.priceMax)}` : base;
};

/** "150 000 FCFA" or "1 650 000 – 6 000 000 FCFA" */
export const formatXAF = (service) => {
  if (!service || service.startingAt == null) return "";
  if (!service.priceMax) return xaf(service.startingAt);
  const low = Math.round((service.startingAt * USD_TO_XAF) / 500) * 500;
  const high = Math.round((service.priceMax * USD_TO_XAF) / 500) * 500;
  const fmt = (n) => n.toLocaleString("en-US").replace(/,/g, " ");
  return `${fmt(low)} – ${fmt(high)} FCFA`;
};

/** True when the price is a range rather than a single figure. */
export const isRange = (service) => Boolean(service?.priceMax);

/** 80000 -> "80 000 FCFA" (already in CFA, so no conversion) */
export const formatXAFAmount = (n) => `${n.toLocaleString("en-US").replace(/,/g, " ")} FCFA`;

/** 80000 CFA -> "$133" */
export const usdFromXAF = (n) => usd(Math.round(n / USD_TO_XAF));

/** Does this service have a reduced price for clients who bring their own hosting? */
export const hasHostingPrice = (service) => service?.withHostingXAF != null;

/**
 * What the client actually pays. Clients who already own hosting and a domain
 * pay the flat `withHostingXAF` price where the service defines one, because
 * setup and first-year hosting are no longer part of the job.
 */
export const effectivePrice = (service, clientHasHosting = false) => {
  if (clientHasHosting && hasHostingPrice(service)) {
    const amount = service.withHostingXAF;
    return {
      usd: usdFromXAF(amount),
      xaf: formatXAFAmount(amount),
      suffix: "",
      reduced: true,
      ceiling: Math.round(amount / USD_TO_XAF),
    };
  }
  return {
    usd: formatUSD(service),
    xaf: formatXAF(service),
    suffix: service?.priceSuffix ?? "",
    reduced: false,
    ceiling: service?.priceMax ?? service?.startingAt ?? null,
  };
};

export const NO_BUDGET = "Not sure yet";

/**
 * Budget bands for a service, capped at what that service actually costs —
 * there is no point offering a $1,000 band on a $250 build.
 */
export const budgetOptions = (service, ceilingOverride = null) => {
  const ceiling = ceilingOverride ?? service?.priceMax ?? service?.startingAt;
  if (!ceiling) return [NO_BUDGET, "Under $250", "$250 – $1,000", "Over $1,000"];

  // Round the midpoint to something that reads like a real figure.
  const step = ceiling >= 1000 ? 250 : ceiling >= 100 ? 25 : 1;
  const mid = Math.max(step, Math.round(ceiling / 2 / step) * step);
  if (mid >= ceiling) return [NO_BUDGET, `Up to ${usd(ceiling)}`];
  return [NO_BUDGET, `Under ${usd(mid)}`, `${usd(mid)} – ${usd(ceiling)}`];
};
