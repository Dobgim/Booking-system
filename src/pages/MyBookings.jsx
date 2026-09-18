import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  CalendarPlus,
  Clock,
  FileText,
  Inbox,
  LogOut,
  MessageCircle,
  MessageSquare,
  Search,
  Trash2,
} from "lucide-react";
import { useBookings } from "../context/BookingContext";
import { formatStamp, isActive, submittedAt } from "../lib/schedule";
import { itemNames, itemsOf, orderTotals, rangeUSD, rangeXAF } from "../lib/order";
import { whatsappLink } from "../lib/message";
import { Badge, Button, Modal, SectionHeading, ServiceIcon, cn } from "../components/ui";

const TABS = [
  { id: "active", label: "Active" },
  { id: "cancelled", label: "Cancelled" },
];

export default function MyBookings() {
  const { myBookings, identity, signInWith, signOut, cancelBooking, toast } = useBookings();
  const [tab, setTab] = useState("active");
  const [confirmCancel, setConfirmCancel] = useState(null);

  const grouped = useMemo(() => {
    const newestFirst = [...myBookings].sort(
      (a, b) => submittedAt(b).getTime() - submittedAt(a).getTime(),
    );
    return {
      active: newestFirst.filter(isActive),
      cancelled: newestFirst.filter((b) => !isActive(b)),
    };
  }, [myBookings]);

  // Nobody is signed in on this device yet.
  if (!identity) return <Lookup onLookup={signInWith} toast={toast} />;

  const list = grouped[tab];

  return (
    <div className="px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Your requests"
          title="Everything you have asked for"
          subtitle="Download an invoice, resend a request on WhatsApp, or cancel one you no longer need."
        />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-canvas px-4 py-3">
          <p className="min-w-0 text-sm text-ink-600">
            Showing requests for <span className="font-semibold text-ink-900">{identity}</span>
          </p>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-600 transition-colors hover:text-brand-700"
          >
            <LogOut size={13} />
            Not you?
          </button>
        </div>

        <div className="mt-6 flex items-center gap-1 border-b border-line">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative px-4 py-3 text-sm font-semibold transition-colors",
                  active ? "text-brand-700" : "text-ink-600 hover:text-ink-900",
                )}
              >
                {t.label}
                {grouped[t.id].length > 0 && (
                  <span
                    className={cn(
                      "ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                      active ? "bg-brand-50 text-brand-700" : "bg-canvas text-ink-600",
                    )}
                  >
                    {grouped[t.id].length}
                  </span>
                )}
                {active && (
                  <motion.span
                    layoutId="booking-tab"
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-600"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {list.map((b) => (
              <RequestRow key={b.id} booking={b} onCancel={() => setConfirmCancel(b)} />
            ))}
          </AnimatePresence>

          {list.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-dashed border-line px-6 py-20 text-center"
            >
              <Inbox size={28} className="mx-auto text-ink-400" />
              <p className="mt-4 font-display text-lg font-bold text-ink-900">
                {tab === "active" ? "No active requests" : "No cancellations"}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-ink-600">
                {tab === "active"
                  ? "Pick the services you need and send me a request — it takes a minute."
                  : "Requests you cancel will show up here."}
              </p>
              {tab === "active" && (
                <Button as={Link} to="/book" className="mt-6">
                  <CalendarPlus size={16} />
                  Start a request
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {confirmCancel && (
          <Modal onClose={() => setConfirmCancel(null)} maxWidth="max-w-md">
            <div className="p-6 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <Trash2 size={22} />
              </span>
              <h2 className="mt-5 font-display text-xl font-bold text-ink-900">
                Cancel this request?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {itemNames(itemsOf(confirmCancel))} · {confirmCancel.reference}. You can always
                send a new one.
              </p>
              <div className="mt-7 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setConfirmCancel(null)}>
                  Keep it
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={() => {
                    cancelBooking(confirmCancel.id);
                    setConfirmCancel(null);
                  }}
                >
                  Cancel request
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function RequestRow({ booking, onCancel }) {
  const items = itemsOf(booking);
  const totals = orderTotals(items, booking.hasHosting);
  const cancelled = !isActive(booking);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-2xl border border-line bg-white p-5 transition-colors",
        cancelled ? "opacity-70" : "hover:border-brand-200",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="neutral">{booking.reference}</Badge>
        {cancelled ? <Badge tone="danger">Cancelled</Badge> : <Badge tone="success">Received</Badge>}
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-ink-400">
          <Clock size={12} />
          {formatStamp(submittedAt(booking))}
        </span>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item.serviceId}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium",
              cancelled
                ? "border-line bg-canvas text-ink-400 line-through"
                : "border-brand-100 bg-brand-50 text-brand-700",
            )}
          >
            <ServiceIcon name={item.icon} size={14} />
            {item.name}
            {item.months ? ` · ${item.months} mo` : ""}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-600">
        {totals.oneOff.count > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <Briefcase size={14} className="text-brand-600" />
            From <span className="font-semibold text-ink-900">{rangeUSD(totals.oneOff.usd)}</span>
            <span className="text-ink-400">· {rangeXAF(totals.oneOff.xaf)}</span>
          </span>
        )}
        {totals.monthly.count > 0 && (
          <span className="font-medium">+ {rangeUSD(totals.monthly.usd)}/month</span>
        )}
        {booking.hasHosting && <Badge tone="brand">Own hosting</Badge>}
      </div>

      {booking.notes && (
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-ink-400">
          <MessageSquare size={13} className="mt-0.5 shrink-0" />
          {booking.notes}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
        <Button as={Link} to={`/invoice/${booking.id || booking.reference}`} size="sm" variant="outline">
          <FileText size={14} />
          Invoice
        </Button>
        {!cancelled && (
          <>
            <Button
              as="a"
              href={whatsappLink(booking)}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              className="bg-[#25D366] hover:bg-[#1da851]"
            >
              <MessageCircle size={14} />
              WhatsApp
            </Button>
            <Button size="sm" variant="danger" onClick={onCancel} className="ml-auto">
              Cancel
            </Button>
          </>
        )}
      </div>
    </motion.article>
  );
}

/** Shown when this browser has no client signed in yet. */
function Lookup({ onLookup, toast }) {
  const [value, setValue] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!onLookup(value)) {
      toast("No request found for that email or reference on this device.", "warn");
    }
  };

  return (
    <div className="px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-lg">
        <SectionHeading
          eyebrow="Your requests"
          title="Find your requests"
          subtitle="Enter the email you used, or your reference, to see your requests on this device."
        />

        <form onSubmit={submit} className="mt-10 rounded-2xl border border-line bg-white p-6">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink-900">
              Email or reference
            </span>
            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="you@example.com or DJ-XXXXXX"
                className="w-full rounded-lg border border-line bg-white py-3 pl-11 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </label>
          <Button type="submit" className="mt-4 w-full" size="lg">
            Show my requests
          </Button>
        </form>

        <div className="mt-6 rounded-2xl border border-dashed border-line px-6 py-10 text-center">
          <Inbox size={26} className="mx-auto text-ink-400" />
          <p className="mt-3 font-display text-base font-bold text-ink-900">
            Not sent a request yet?
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-600">
            Pick the services you need — it takes about a minute.
          </p>
          <Button as={Link} to="/book" className="mt-5">
            <CalendarPlus size={16} />
            Start a request
          </Button>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-ink-400">
          Requests are stored privately on the device they were made on, so only you can see yours.
        </p>
      </div>
    </div>
  );
}
