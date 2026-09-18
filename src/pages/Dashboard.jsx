import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  CircleDollarSign,
  Clock,
  Inbox,
  Mail,
  MessageCircle,
  Phone,
  Send,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { owner } from "../data/services";
import { useBookings } from "../context/BookingContext";
import {
  addDays,
  dayKey,
  formatDayLong,
  formatDayShort,
  formatStamp,
  isActive,
  isSameDay,
  startOfToday,
  submittedAt,
} from "../lib/schedule";
import { itemsOf, orderTotals, rangeUSD, rangeXAF } from "../lib/order";
import { Badge, Button, Card, CountUp, Reveal, ServiceIcon, cn } from "../components/ui";

const WINDOW_DAYS = 7;

export default function Dashboard() {
  const { bookings } = useBookings();
  const [day, setDay] = useState(null);

  const active = useMemo(() => bookings.filter(isActive), [bookings]);

  const stats = useMemo(() => {
    const pipeline = active.reduce(
      (sum, b) => sum + orderTotals(itemsOf(b), b.hasHosting).oneOff.usd[0],
      0,
    );
    const cancelled = bookings.length - active.length;
    return [
      { label: "Requests received", value: bookings.length, Icon: Inbox },
      { label: "Active requests", value: active.length, Icon: Clock },
      { label: "Pipeline value", value: pipeline, prefix: "$", Icon: CircleDollarSign },
      {
        label: "Cancellation rate",
        value: bookings.length ? Math.round((cancelled / bookings.length) * 100) : 0,
        suffix: "%",
        Icon: XCircle,
      },
    ];
  }, [bookings, active]);

  // Requests received per day over the last week, oldest on the left.
  const week = useMemo(() => {
    const days = Array.from({ length: WINDOW_DAYS }, (_, i) =>
      addDays(startOfToday(), i - (WINDOW_DAYS - 1)),
    );
    const counts = days.map((d) => ({
      date: d,
      count: bookings.filter((b) => dayKey(submittedAt(b)) === dayKey(d)).length,
    }));
    return { counts, max: Math.max(1, ...counts.map((c) => c.count)) };
  }, [bookings]);

  const byService = useMemo(() => {
    const map = new Map();
    active.forEach((b) =>
      itemsOf(b).forEach((item) =>
        map.set(item.name, { count: (map.get(item.name)?.count ?? 0) + 1, icon: item.icon }),
      ),
    );
    const rows = [...map.entries()].sort((a, b) => b[1].count - a[1].count).slice(0, 6);
    return { rows, max: Math.max(1, ...rows.map(([, v]) => v.count)) };
  }, [active]);

  const byBudget = useMemo(() => {
    const map = new Map();
    active.forEach((b) => {
      const key = b.budget ?? "Not sure yet";
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [active]);

  const inbox = useMemo(
    () =>
      [...bookings]
        .filter((b) => !day || isSameDay(submittedAt(b), day))
        .sort((a, b) => submittedAt(b).getTime() - submittedAt(a).getTime()),
    [bookings, day],
  );

  return (
    <div className="px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              Private view
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Your request inbox
            </h1>
            <p className="mt-3 text-ink-600">
              Every request sent through the site, {owner.shortName} — newest first, with the
              client&apos;s contact details one tap away.
            </p>
          </div>
          <Button as={Link} to="/book" variant="outline">
            <Send size={16} />
            Add a request
          </Button>
        </div>

        {/* Stat cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07}>
              <Card className="p-5">
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <s.Icon size={19} />
                  </span>
                  <TrendingUp size={15} className="text-ink-400" />
                </div>
                <p className="mt-4 font-display text-3xl font-bold text-ink-900">
                  <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-xs text-ink-600">{s.label}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Week chart */}
          <Reveal>
            <Card hover={false} className="h-full p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-ink-900">Last seven days</h2>
                <Badge tone="neutral">
                  {week.counts.reduce((n, c) => n + c.count, 0)} requests
                </Badge>
              </div>

              <div className="mt-8 flex h-48 items-end gap-3">
                {week.counts.map((c, i) => {
                  const on = day && isSameDay(c.date, day);
                  return (
                    <button
                      key={dayKey(c.date)}
                      onClick={() => setDay(on ? null : c.date)}
                      className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >
                      <span className="text-xs font-bold text-ink-900">{c.count || ""}</span>
                      <motion.span
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(3, (c.count / week.max) * 100)}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          "w-full rounded-t-md transition-colors",
                          on ? "bg-brand-600" : "bg-brand-100 group-hover:bg-brand-300",
                        )}
                      />
                      <span
                        className={cn(
                          "text-[11px] font-semibold",
                          on ? "text-ink-900" : "text-ink-400",
                        )}
                      >
                        {formatDayShort(c.date)}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-ink-400">
                Tap a day to filter the inbox below. Tap it again to show everything.
              </p>
            </Card>
          </Reveal>

          {/* Breakdown */}
          <Reveal delay={0.1}>
            <Card hover={false} className="h-full p-6">
              <h2 className="font-display text-base font-bold text-ink-900">Most requested</h2>
              {byService.rows.length === 0 ? (
                <p className="mt-5 text-sm text-ink-400">
                  No requests yet. Anything sent through the site lands here instantly.
                </p>
              ) : (
                <ul className="mt-5 space-y-4">
                  {byService.rows.map(([name, v], i) => (
                    <li key={name}>
                      <div className="mb-1.5 flex items-center gap-2.5 text-sm">
                        <ServiceIcon name={v.icon} size={15} className="shrink-0 text-brand-600" />
                        <span className="min-w-0 flex-1 truncate text-ink-700">{name}</span>
                        <span className="shrink-0 font-display font-bold text-ink-900">
                          {v.count}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-canvas">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(v.count / byService.max) * 100}%` }}
                          transition={{ duration: 0.7, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full bg-brand-600"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-7 border-t border-line pt-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Budget mix
                </h3>
                {byBudget.length === 0 ? (
                  <p className="mt-3 text-sm text-ink-400">Nothing to show yet.</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {byBudget.map(([label, count]) => (
                      <li key={label} className="flex items-center justify-between gap-3 text-sm">
                        <span className="min-w-0 truncate text-ink-700">{label}</span>
                        <Badge tone="brand">{count}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          </Reveal>
        </div>

        {/* Inbox */}
        <Reveal>
          <Card hover={false} className="mt-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-base font-bold text-ink-900">
                {day ? (
                  <>
                    Requests on <span className="text-brand-700">{formatDayLong(day)}</span>
                  </>
                ) : (
                  "All requests"
                )}
              </h2>
              <div className="flex items-center gap-2">
                <Badge tone="neutral">{inbox.length}</Badge>
                {day && (
                  <button
                    onClick={() => setDay(null)}
                    className="text-xs font-semibold text-brand-700 hover:underline"
                  >
                    Show all
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <AnimatePresence initial={false}>
                {inbox.map((b) => (
                  <InboxRow key={b.id} booking={b} />
                ))}
              </AnimatePresence>
            </div>

            {inbox.length === 0 && (
              <p className="mt-2 py-10 text-center text-sm text-ink-400">
                {day ? "No requests that day." : "No requests yet."}
              </p>
            )}
          </Card>
        </Reveal>
      </div>
    </div>
  );
}

function InboxRow({ booking }) {
  const items = itemsOf(booking);
  const totals = orderTotals(items, booking.hasHosting);
  const cancelled = !isActive(booking);
  const phoneDigits = booking.customer.phone.replace(/\D/g, "");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={cn(
        "rounded-xl border-l-[3px] bg-canvas p-4",
        cancelled ? "border-l-ink-400 opacity-60" : "border-l-brand-600",
      )}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-display text-sm font-bold text-ink-900">
          {booking.customer.name}
        </span>
        {booking.customer.company && (
          <span className="text-xs text-ink-600">{booking.customer.company}</span>
        )}
        <Badge tone="neutral">{booking.reference}</Badge>
        {cancelled && <Badge tone="danger">Cancelled</Badge>}
        {booking.hasHosting && <Badge tone="brand">Own hosting</Badge>}
        <span className="ml-auto text-xs text-ink-400">{formatStamp(submittedAt(booking))}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item.serviceId}
            className="inline-flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-xs font-medium text-ink-700"
          >
            <ServiceIcon name={item.icon} size={12} className="text-brand-600" />
            {item.name}
            {item.months ? ` · ${item.months} mo` : ""}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        {totals.oneOff.count > 0 && (
          <span className="font-semibold text-ink-900">
            {rangeUSD(totals.oneOff.usd)}{" "}
            <span className="font-normal text-ink-400">· {rangeXAF(totals.oneOff.xaf)}</span>
          </span>
        )}
        {totals.monthly.count > 0 && (
          <span className="font-medium text-ink-700">+ {rangeUSD(totals.monthly.usd)}/month</span>
        )}
        <span className="ml-auto flex items-center gap-3">
          <a
            href={`tel:${booking.customer.phone}`}
            className="inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:underline"
          >
            <Phone size={12} />
            {booking.customer.phone}
          </a>
          {phoneDigits && (
            <a
              href={`https://wa.me/${phoneDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${booking.customer.name}`}
              className="text-[#1da851] hover:opacity-80"
            >
              <MessageCircle size={14} />
            </a>
          )}
          <a
            href={`mailto:${booking.customer.email}`}
            aria-label={`Email ${booking.customer.name}`}
            className="text-brand-700 hover:opacity-80"
          >
            <Mail size={14} />
          </a>
        </span>
      </div>

      {booking.notes && (
        <p className="mt-3 border-t border-line pt-3 text-xs leading-relaxed text-ink-600">
          {booking.notes}
        </p>
      )}
    </motion.div>
  );
}
