import { owner } from "../data/services";
import { itemsOf, orderTotals, priceText, rangeUSD, rangeXAF } from "./order";
import { formatStamp, submittedAt } from "./schedule";

/** Digits only, as wa.me expects. */
export const WHATSAPP_NUMBER = owner.phoneHref.replace(/\D/g, "");

/** The full request as a plain-text WhatsApp message to the owner. */
export const requestMessage = (booking) => {
  const items = itemsOf(booking);
  const totals = orderTotals(items, booking.hasHosting);

  const lines = [
    `Hello ${owner.shortName}, I would like to request the following.`,
    "",
    `Reference: ${booking.reference}`,
    `Sent: ${formatStamp(submittedAt(booking))}`,
    "",
    "Services:",
    ...items.map((item) => {
      const text = priceText(item, booking.hasHosting);
      if (!text) return `• ${item.name} — to be quoted`;
      const term = text.detail ? ` [${text.detail}]` : "";
      return `• ${item.name} — ${text.usd} (${text.xaf})${term}`;
    }),
  ];

  if (totals.oneOff.count) {
    lines.push("", `Total: ${rangeUSD(totals.oneOff.usd)} (${rangeXAF(totals.oneOff.xaf)})`);
  }
  if (totals.monthly.count) {
    lines.push(`Monthly: ${rangeUSD(totals.monthly.usd)} (${rangeXAF(totals.monthly.xaf)}) per month`);
  }
  if (booking.hasHosting) lines.push("", "I already have hosting and a domain.");

  lines.push(
    "",
    `Name: ${booking.customer.name}`,
    ...(booking.customer.company ? [`Business: ${booking.customer.company}`] : []),
    `Phone: ${booking.customer.phone}`,
    `Email: ${booking.customer.email}`,
    ...(booking.budget ? [`Budget: ${booking.budget}`] : []),
    ...(booking.notes ? ["", `Details: ${booking.notes}`] : []),
  );

  return lines.join("\n");
};

export const whatsappLink = (booking) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(requestMessage(booking))}`;
