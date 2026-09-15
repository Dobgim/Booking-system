import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  CalendarDays,
  CircleDollarSign,
  Clock,
  Mail,
  Phone,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { OPENING, owner } from "../data/services";
import { useBookings } from "../context/BookingContext";
import {
  addDays,
  bookingDateTime,
  dayKey,
  formatDayShort,
  formatMinutes,
  isSameDay,
  isUpcoming,
  startOfToday,
} from "../lib/schedule";
import { Badge, Button, Card, Reveal, ServiceIcon, cn } from "../components/ui";

export default function Dashboard() {
  const { bookings } = useBookings();
  const [day, setDay] = useState(startOfToday);

  const active = useMemo(() => bookings.filter((b) => b.status !== "cancelled"), [bookings]);

  const stats = useMemo(() => {
    const pipeline = active.reduce((sum, b) => sum + (b.startingAt ?? 0), 0);
    const upcoming = active.filter(isUpcoming).length;
    const cancelled = bookings.length - active.length;
    const rate = bookings.length ? Math.round((cancelled / bookings.length) * 100) : 0;
    return [
      { label: "Total enquiries", value: bookings.length, Icon: CalendarCheck },
      { label: "Upcoming calls", value: upcoming, Icon: Clock },
      { label: "Pipeline value", value: `$${pipeline.toLocaleString()}`, Icon: CircleDollarSign },
      { label: "Cancellation rate", value: `${rate}%`, Icon: XCircle },
    ];
  }, [bookings, active]);

  const week = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i));
    const counts = days.map((d) => ({
      date: d,
      count: active.filter((b) => b.date === dayKey(d)).length,
    }));
    return { counts, max: Math.max(1, ...counts.map((c) => c.count)) };
  }, [active]);

  const byService = useMemo(() => {
    const map = new Map();
    active.forEach((b) =>
      map.set(b.serviceName, {
        count: (map.get(b.serviceName)?.count ?? 0) + 1,
        icon: b.icon,
      }),
    );
    const rows = [...map.entries()].sort((a, b) => b[1].count - a[1].count).slice(0, 6);
    return { rows, max: Math.max(1, ...rows.map(([, v]) => v.count)) };
  }, [active]);

  const byBudget = useMemo(() => {
    const map = new Map();
    active.forEach((b) => map.set(b.budget ?? "Not sure yet", (map.get(b.budget ?? "Not sure yet") ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [active]);

  const dayBookings = useMemo(
    () => active.filter((b) => b.date === dayKey(day)).sort((a, b) => a.startMinutes - b.startMinutes),
    [active, day],
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
              Your enquiry dashboard
            </h1>
            <p className="mt-3 text-ink-600">
              Every consultation booked through the site, {owner.shortName} — by day, by project
              type and by budget.
            </p>
          </div>
          <Button as={Link} to="/book" variant="outline">
            <CalendarDays size={16} />
            Add a booking
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
                <p className="mt-4 font-display text-3xl font-bold text-ink-900">{s.value}</p>
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
                <h2 className="font-display text-base font-bold text-ink-900">Next seven days</h2>
                <Badge tone="neutral">{week.counts.reduce((n, c) => n + c.count, 0)} calls</Badge>
              </div>

              <div className="mt-8 flex h-48 items-end gap-3">
                {week.counts.map((c, i) => (
                  <button
                    key={dayKey(c.date)}
                    onClick={() => setDay(c.date)}
                    className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <span className="text-xs font-bold text-ink-900">
                      {c.count > 0 ? c.count : ""}
                    </span>
                    <motion.span
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(3, (c.count / week.max) * 100)}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        "w-full rounded-t-md transition-colors",
                        isSameDay(c.date, day)
                          ? "bg-brand-600"
                          : "bg-brand-100 group-hover:bg-brand-300",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[11px] font-semibold",
                        isSameDay(c.date, day) ? "text-ink-900" : "text-ink-400",
                      )}
                    >
                      {formatDayShort(c.date)}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-ink-400">
                Select a bar to load that day in the schedule below.
              </p>
            </Card>
          </Reveal>

          {/* Breakdown */}
          <Reveal delay={0.1}>
            <Card hover={false} className="h-full p-6">
              <h2 className="font-display text-base font-bold text-ink-900">Most requested</h2>
              {byService.rows.length === 0 ? (
                <p className="mt-5 text-sm text-ink-400">
                  No enquiries yet. Anything booked on the site lands here instantly.
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
                        <Badge tone={count > 0 ? "brand" : "neutral"}>{count}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          </Reveal>
        </div>

        {/* Day schedule */}
        <Reveal>
          <Card hover={false} className="mt-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-base font-bold text-ink-900">
                Schedule ·{" "}
                <span className="text-brand-700">
                  {day.toLocaleDateString(undefined, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </h2>
              <Badge tone="neutral">
                {dayBookings.length} call{dayBookings.length === 1 ? "" : "s"}
              </Badge>
            </div>

            <div className="mt-6 space-y-1">
              {Array.from({ length: OPENING.end - OPENING.start }, (_, i) => {
                const hour = OPENING.start + i;
                const inHour = dayBookings.filter(
                  (b) => b.startMinutes >= hour * 60 && b.startMinutes < (hour + 1) * 60,
                );
                return (
                  <div key={hour} className="flex gap-4">
                    <span className="w-16 shrink-0 pt-2 text-right text-xs font-semibold text-ink-400">
                      {formatMinutes(hour * 60)}
                    </span>
                    <div className="flex-1 border-t border-line pt-2">
                      {inHour.length === 0 ? (
                        <div className="h-8" />
                      ) : (
                        <div className="space-y-2">
                          {inHour.map((b) => (
                            <motion.div
                              key={b.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={cn(
                                "flex flex-wrap items-center gap-3 rounded-lg border-l-[3px] bg-brand-50/60 px-4 py-2.5",
                                bookingDateTime(b) < new Date()
                                  ? "border-l-ink-400 bg-canvas"
                                  : "border-l-brand-600",
                              )}
                            >
                              <span className="font-display text-sm font-bold text-ink-900">
                                {b.startLabel}
                              </span>
                              <span className="text-sm font-medium text-ink-900">
                                {b.serviceName}
                              </span>
                              <span className="text-xs text-ink-600">
                                {b.customer.name}
                                {b.customer.company ? ` · ${b.customer.company}` : ""}
                              </span>
                              <span className="ml-auto flex items-center gap-3">
                                <a
                                  href={`tel:${b.customer.phone}`}
                                  className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:underline"
                                >
                                  <Phone size={12} />
                                  {b.customer.phone}
                                </a>
                                <a
                                  href={`mailto:${b.customer.email}`}
                                  aria-label={`Email ${b.customer.name}`}
                                  className="text-brand-700 hover:text-brand-600"
                                >
                                  <Mail size={13} />
                                </a>
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {dayBookings.length === 0 && (
              <p className="mt-6 text-center text-sm text-ink-400">No calls booked on this day.</p>
            )}
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
