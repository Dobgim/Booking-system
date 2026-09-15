import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, FileText, MessageCircle, Printer } from "lucide-react";
import { owner, services } from "../data/services";
import { useBookings } from "../context/BookingContext";
import { bookingDateTime, formatDayLong } from "../lib/schedule";
import { formatUSD, formatXAF } from "../lib/pricing";
import { Badge, Button } from "../components/ui";

/** Digits only, for wa.me links. */
const waNumber = owner.phoneHref.replace(/\D/g, "");

/** "Tabi Sandra" -> "TS", falling back to a single letter for one-word names. */
const initialsOf = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const priceParts = (booking) => {
  const service = services.find((s) => s.id === booking.serviceId);
  const shape = service ?? {
    startingAt: booking.startingAt ?? null,
    priceMax: booking.priceMax,
    priceSuffix: booking.priceSuffix,
  };
  return {
    usd: formatUSD(shape),
    xaf: formatXAF(shape),
    suffix: shape.priceSuffix ?? "",
  };
};

export default function Invoice() {
  const { id } = useParams();
  const { bookings } = useBookings();
  const booking = bookings.find((b) => b.id === id || b.reference === id);

  if (!booking) {
    return (
      <div className="px-5 pb-24 pt-40 text-center sm:px-8">
        <FileText size={30} className="mx-auto text-ink-400" />
        <h1 className="mt-4 font-display text-2xl font-bold text-ink-900">Invoice not found</h1>
        <p className="mx-auto mt-3 max-w-sm text-ink-600">
          This invoice was made on a different device, or the booking was removed.
        </p>
        <Button as={Link} to="/bookings" className="mt-8">
          Back to my bookings
        </Button>
      </div>
    );
  }

  const when = bookingDateTime(booking);
  const { usd, xaf, suffix } = priceParts(booking);
  const issued = new Date(booking.createdAt ?? Date.now());

  const whatsappText = [
    `Hello ${owner.shortName}, here is my booking.`,
    ``,
    `Invoice: ${booking.reference}`,
    `Service: ${booking.serviceName}`,
    `Consultation: ${formatDayLong(when)} at ${booking.startLabel}`,
    `Estimate: ${usd}${suffix}${xaf ? ` (${xaf}${suffix})` : ""}`,
    ``,
    `Name: ${booking.customer.name}`,
    booking.customer.company ? `Business: ${booking.customer.company}` : null,
    `Phone: ${booking.customer.phone}`,
    `Email: ${booking.customer.email}`,
    booking.budget ? `Budget: ${booking.budget}` : null,
    booking.notes ? `` : null,
    booking.notes ? `Project details: ${booking.notes}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const whatsappHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-3xl">
        {/* Actions — hidden when printing */}
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/bookings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-600 transition-colors hover:text-brand-700"
          >
            <ArrowLeft size={16} />
            My bookings
          </Link>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => window.print()} variant="outline">
              <Printer size={16} />
              Print
            </Button>
            <Button onClick={() => window.print()}>
              <Download size={16} />
              Download PDF
            </Button>
            <Button
              as="a"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1da851]"
            >
              <MessageCircle size={16} />
              Send on WhatsApp
            </Button>
          </div>
        </div>

        <p className="no-print mb-6 rounded-lg border border-line bg-canvas px-4 py-3 text-xs leading-relaxed text-ink-600">
          <strong className="font-semibold text-ink-900">Saving as PDF:</strong> choose Download
          PDF, then pick <em>Save as PDF</em> as the destination in the print dialog. The WhatsApp
          button sends the full booking details straight to {owner.shortName}.
        </p>

        {/* ---------------- The invoice ---------------- */}
        <article className="invoice-sheet rounded-2xl border border-line bg-white p-7 shadow-[0_1px_2px_rgb(15_23_42/0.04)] sm:p-10">
          <header className="flex flex-wrap items-start justify-between gap-6 border-b border-line pb-7">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600 font-display text-base font-bold text-white">
                {initialsOf(booking.customer.name)}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                  Invoice for
                </p>
                <p className="font-display text-base font-bold text-ink-900">
                  {booking.customer.name}
                </p>
                <p className="truncate text-xs text-ink-600">
                  {booking.customer.company || booking.customer.email}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-xl font-bold tracking-tight text-ink-900">
                Proforma Invoice
              </p>
              <p className="mt-0.5 font-display text-sm font-bold tracking-wide text-brand-700">
                {booking.reference}
              </p>
              <p className="mt-1 text-xs text-ink-600">
                Issued {issued.toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </header>

          <div className="grid gap-8 border-b border-line py-7 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">From</p>
              <p className="mt-2 text-sm font-semibold text-ink-900">{owner.name}</p>
              <p className="text-sm text-ink-600">{owner.title}</p>
              <p className="mt-2 text-sm text-ink-600">{owner.phone}</p>
              <p className="break-all text-sm text-ink-600">{owner.email}</p>
              <p className="text-sm text-ink-600">{owner.location}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                Billed to
              </p>
              <p className="mt-2 text-sm font-semibold text-ink-900">{booking.customer.name}</p>
              {booking.customer.company && (
                <p className="text-sm text-ink-600">{booking.customer.company}</p>
              )}
              <p className="mt-2 text-sm text-ink-600">{booking.customer.phone}</p>
              <p className="break-all text-sm text-ink-600">{booking.customer.email}</p>
            </div>
          </div>

          {/* Line items */}
          <div className="py-7">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-wide text-ink-400">
                  <th className="pb-3 font-semibold">Description</th>
                  <th className="pb-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-line">
                  <td className="py-4 align-top">
                    <p className="font-semibold text-ink-900">
                      Consultation — {booking.serviceName}
                    </p>
                    <p className="mt-1 text-xs text-ink-600">
                      {formatDayLong(when)} · {booking.startLabel} – {booking.endLabel} ·{" "}
                      {booking.duration} minute call
                    </p>
                  </td>
                  <td className="py-4 text-right align-top">
                    <span className="font-semibold text-emerald-600">Free</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 align-top">
                    <p className="font-semibold text-ink-900">
                      {booking.serviceName}
                      <span className="ml-2 text-xs font-normal text-ink-400">estimate only</span>
                    </p>
                    <p className="mt-1 text-xs text-ink-600">
                      Delivery {booking.timeline}. Confirmed as a fixed quote after the
                      consultation.
                    </p>
                  </td>
                  <td className="py-4 text-right align-top">
                    <span className="block font-display text-base font-bold text-ink-900">
                      {usd}
                      {suffix}
                    </span>
                    {xaf && (
                      <span className="block text-xs font-medium text-ink-600">
                        {xaf}
                        {suffix}
                      </span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-start justify-between gap-6 border-t-2 border-ink-900 pt-5">
            <div>
              <p className="font-display text-base font-bold text-ink-900">Due now</p>
              <p className="mt-1 text-xs text-ink-600">
                Nothing is payable to book. The consultation is free.
              </p>
            </div>
            <p className="font-display text-2xl font-bold text-ink-900">$0.00</p>
          </div>

          {booking.notes && (
            <div className="mt-7 rounded-lg bg-canvas p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                Project notes
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{booking.notes}</p>
            </div>
          )}

          <footer className="mt-8 border-t border-line pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs leading-relaxed text-ink-600">
                Payment terms: 50% to start, 50% on delivery. Mobile Money or bank transfer.
              </p>
              <Badge tone="neutral">Prices in USD, CFA at 600 FCFA / $1</Badge>
            </div>
            <p className="mt-4 text-center text-xs text-ink-400">
              Thank you — {owner.name} · {owner.phone} · {owner.email}
            </p>
          </footer>
        </article>
      </div>
    </div>
  );
}
