import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  CalendarDays,
  CalendarPlus,
  Clock,
  FileText,
  LogOut,
  MessageSquare,
  Search,
  Timer,
  Trash2,
  X,
} from "lucide-react";
import { useBookings } from "../context/BookingContext";
import { bookingDateTime, dayKey, formatDayLong, isUpcoming } from "../lib/schedule";
import { services } from "../data/services";
import DateTimePicker from "../components/DateTimePicker";
import { Badge, Button, SectionHeading, ServiceIcon, cn } from "../components/ui";

const TABS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "cancelled", label: "Cancelled" },
];

export default function MyBookings() {
  const { myBookings, identity, signInWith, signOut, cancelBooking, rescheduleBooking, toast } =
    useBookings();
  const [tab, setTab] = useState("upcoming");
  const [rescheduling, setRescheduling] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);

  const grouped = useMemo(() => {
    const sorted = [...myBookings].sort(
      (a, b) => bookingDateTime(a).getTime() - bookingDateTime(b).getTime(),
    );
    return {
      upcoming: sorted.filter(isUpcoming),
      past: sorted.filter((b) => b.status !== "cancelled" && !isUpcoming(b)).reverse(),
      cancelled: sorted.filter((b) => b.status === "cancelled").reverse(),
    };
  }, [myBookings]);

  const list = grouped[tab];

  // Nobody is signed in on this device yet.
  if (!identity) return <Lookup onLookup={signInWith} toast={toast} />;

  return (
    <div className="px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Your consultations"
          title="Manage your bookings"
          subtitle="Move or cancel a call any time — just let me know at least a day ahead where you can."
        />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-canvas px-4 py-3">
          <p className="min-w-0 text-sm text-ink-600">
            Showing bookings for{" "}
            <span className="font-semibold text-ink-900">{identity}</span>
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
              <BookingRow
                key={b.id}
                booking={b}
                tab={tab}
                onReschedule={() => setRescheduling(b)}
                onCancel={() => setConfirmCancel(b)}
              />
            ))}
          </AnimatePresence>

          {list.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-dashed border-line px-6 py-20 text-center"
            >
              <CalendarDays size={28} className="mx-auto text-ink-400" />
              <p className="mt-4 font-display text-lg font-bold text-ink-900">
                {tab === "upcoming"
                  ? "No consultations coming up"
                  : tab === "past"
                    ? "Nothing in your history yet"
                    : "No cancellations"}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-ink-600">
                {tab === "upcoming"
                  ? "Pick the project you have in mind and grab a time — the call is free."
                  : "Once a call has happened it shows up here."}
              </p>
              {tab === "upcoming" && (
                <Button as={Link} to="/book" className="mt-6">
                  <CalendarPlus size={16} />
                  Book a consultation
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {rescheduling && (
          <RescheduleModal
            booking={rescheduling}
            onClose={() => setRescheduling(null)}
            onSave={(payload) => {
              rescheduleBooking(rescheduling.id, payload);
              setRescheduling(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmCancel && (
          <Modal onClose={() => setConfirmCancel(null)} maxWidth="max-w-md">
            <div className="p-6 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <Trash2 size={22} />
              </span>
              <h2 className="mt-5 font-display text-xl font-bold text-ink-900">
                Cancel this consultation?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {confirmCancel.serviceName} on {formatDayLong(bookingDateTime(confirmCancel))} at{" "}
                {confirmCancel.startLabel}. The time goes back on the calendar right away.
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
                  Cancel booking
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

function BookingRow({ booking, tab, onReschedule, onCancel }) {
  const when = bookingDateTime(booking);
  const cancelled = booking.status === "cancelled";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-2xl border bg-white p-5 transition-colors",
        cancelled ? "border-line opacity-70" : "border-line hover:border-brand-200",
      )}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            cancelled ? "bg-canvas text-ink-400" : "bg-brand-50 text-brand-600",
          )}
        >
          <ServiceIcon name={booking.icon} size={22} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={cn(
                "font-display text-base font-bold",
                cancelled ? "text-ink-400 line-through" : "text-ink-900",
              )}
            >
              {booking.serviceName}
            </h3>
            {cancelled ? (
              <Badge tone="danger">Cancelled</Badge>
            ) : tab === "past" ? (
              <Badge tone="neutral">Completed</Badge>
            ) : (
              <Badge tone="success">Confirmed</Badge>
            )}
            <Badge tone="neutral">{booking.reference}</Badge>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-600">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} className="text-brand-600" />
              {formatDayLong(when)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} className="text-brand-600" />
              {booking.startLabel} – {booking.endLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Timer size={14} className="text-brand-600" />
              {booking.duration} min
            </span>
            {booking.budget && (
              <span className="inline-flex items-center gap-1.5">
                <Briefcase size={14} className="text-brand-600" />
                {booking.budget}
              </span>
            )}
          </div>

          {booking.notes && (
            <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-ink-400">
              <MessageSquare size={13} className="mt-0.5 shrink-0" />
              {booking.notes}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col">
          <Button as={Link} to={`/invoice/${booking.id || booking.reference}`} size="sm" variant="outline">
            <FileText size={14} />
            Invoice
          </Button>
          {tab === "upcoming" && (
            <>
              <Button size="sm" variant="outline" onClick={onReschedule}>
                Reschedule
              </Button>
              <Button size="sm" variant="danger" onClick={onCancel}>
                Cancel
              </Button>
            </>
          )}
          {tab === "past" && !cancelled && (
            <Button as={Link} to={`/book?service=${booking.serviceId}`} size="sm" variant="outline">
              Book again
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function RescheduleModal({ booking, onClose, onSave }) {
  // A booking made before a service was renamed or retired still has to be
  // movable, so fall back to what the booking itself recorded.
  const service = services.find((s) => s.id === booking.serviceId) ?? {
    id: booking.serviceId,
    name: booking.serviceName,
    consultMinutes: booking.duration,
  };
  const [date, setDate] = useState(() => bookingDateTime(booking));
  const [slot, setSlot] = useState(null);

  return (
    <Modal onClose={onClose} maxWidth="max-w-3xl">
      <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
        <div>
          <h2 className="font-display text-lg font-bold text-ink-900">Move your consultation</h2>
          <p className="mt-1 text-sm text-ink-600">
            {booking.serviceName} · currently {formatDayLong(bookingDateTime(booking))} at{" "}
            {booking.startLabel}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-canvas hover:text-ink-900"
        >
          <X size={18} />
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto px-6 py-6">
        <DateTimePicker
          service={service}
          date={date}
          onDateChange={setDate}
          slot={slot}
          onSlotChange={setSlot}
          excludeBookingId={booking.id}
        />
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-line px-6 py-4">
        <Button variant="outline" onClick={onClose}>
          Keep current time
        </Button>
        <Button
          disabled={!slot}
          onClick={() => onSave({ date: dayKey(date), startMinutes: slot.minutes })}
        >
          Move to {slot ? slot.label : "…"}
        </Button>
      </div>
    </Modal>
  );
}

/** Shown when this browser has no client signed in yet. */
function Lookup({ onLookup, toast }) {
  const [value, setValue] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!onLookup(value)) {
      toast("No booking found for that email or reference on this device.", "warn");
    }
  };

  return (
    <div className="px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-lg">
        <SectionHeading
          eyebrow="Your consultations"
          title="Find your booking"
          subtitle="Enter the email you booked with, or your booking reference, to see your appointments on this device."
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
            Show my bookings
          </Button>
        </form>

        <div className="mt-6 rounded-2xl border border-dashed border-line px-6 py-10 text-center">
          <CalendarDays size={26} className="mx-auto text-ink-400" />
          <p className="mt-3 font-display text-base font-bold text-ink-900">
            Not booked anything yet?
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-600">
            The consultation is free and takes five minutes.
          </p>
          <Button as={Link} to="/book" className="mt-5">
            <CalendarPlus size={16} />
            Book a consultation
          </Button>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-ink-400">
          Bookings are stored privately on the device they were made on, so only you can see yours.
        </p>
      </div>
    </div>
  );
}

export function Modal({ children, onClose, maxWidth = "max-w-lg" }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-end justify-center bg-ink-900/25 p-4 backdrop-blur-[2px] sm:items-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        className={cn(
          "w-full overflow-hidden rounded-2xl border border-line bg-white shadow-[0_32px_80px_-24px_rgb(15_23_42/0.35)]",
          maxWidth,
        )}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
