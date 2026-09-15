import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarX2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  buildSlots,
  consultLength,
  dayKey,
  formatDayLong,
  isClosed,
  isSameDay,
  startOfToday,
} from "../lib/schedule";
import { useBookings } from "../context/BookingContext";
import { Button, cn } from "./ui";

/** How far ahead the calendar lets you book. */
const MONTHS_AHEAD = 5;

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const sameMonth = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

/** Monday-first offset for the 1st of the month. */
const leadingBlanks = (monthStart) => (monthStart.getDay() + 6) % 7;

export default function DateTimePicker({
  service,
  date,
  onDateChange,
  slot,
  onSlotChange,
  excludeBookingId = null,
}) {
  const { bookings } = useBookings();
  const today = startOfToday();
  const [month, setMonth] = useState(() => startOfMonth(date ?? today));

  const firstMonth = startOfMonth(today);
  const lastMonth = addMonths(firstMonth, MONTHS_AHEAD);
  const canGoBack = !sameMonth(month, firstMonth);
  const canGoForward = !sameMonth(month, lastMonth);

  const cells = useMemo(() => {
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const blanks = Array.from({ length: leadingBlanks(month) }, () => null);
    const days = Array.from(
      { length: daysInMonth },
      (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1),
    );
    return [...blanks, ...days];
  }, [month]);

  const slots = useMemo(
    () => buildSlots({ date, service, bookings, excludeBookingId }),
    [date, service, bookings, excludeBookingId],
  );

  const open = slots.filter((s) => s.available);
  const groups = [
    { label: "Morning", items: open.filter((s) => s.minutes < 12 * 60) },
    { label: "Afternoon", items: open.filter((s) => s.minutes >= 12 * 60) },
  ].filter((g) => g.items.length > 0);

  const pick = (d) => {
    onDateChange(d);
    onSlotChange(null);
  };

  const jumpToNextOpenDay = () => {
    for (let i = 1; i <= 60; i++) {
      const candidate = new Date(date ?? today);
      candidate.setDate(candidate.getDate() + i);
      if (isClosed(candidate)) continue;
      const found = buildSlots({ date: candidate, service, bookings, excludeBookingId });
      if (found.some((s) => s.available)) {
        setMonth(startOfMonth(candidate));
        pick(candidate);
        return;
      }
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
      {/* ---------------- Month calendar ---------------- */}
      <div className="w-full lg:w-[320px]">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => canGoBack && setMonth(addMonths(month, -1))}
            disabled={!canGoBack}
            aria-label="Previous month"
            className="rounded-lg border border-line bg-white p-2 text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line disabled:hover:text-ink-600"
          >
            <ChevronLeft size={16} />
          </button>

          <AnimatePresence mode="wait">
            <motion.p
              key={dayKey(month).slice(0, 7)}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.18 }}
              className="font-display text-sm font-bold text-ink-900"
            >
              {month.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
            </motion.p>
          </AnimatePresence>

          <button
            type="button"
            onClick={() => canGoForward && setMonth(addMonths(month, 1))}
            disabled={!canGoForward}
            aria-label="Next month"
            className="rounded-lg border border-line bg-white p-2 text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line disabled:hover:text-ink-600"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="rounded-xl border border-line bg-white p-3">
          <div className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((w) => (
              <span
                key={w}
                className="py-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-ink-400"
              >
                {w.slice(0, 1)}
                <span className="sr-only">{w}</span>
              </span>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={dayKey(month).slice(0, 7)}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="mt-1 grid grid-cols-7 gap-1"
            >
              {cells.map((d, i) => {
                if (!d) return <span key={`blank-${i}`} />;

                const past = d < today;
                const closed = isClosed(d);
                const beyond = startOfMonth(d) > lastMonth;
                const disabled = past || closed || beyond;
                const selected = date && isSameDay(d, date);
                const isToday = isSameDay(d, today);

                return (
                  <button
                    key={dayKey(d)}
                    type="button"
                    disabled={disabled}
                    onClick={() => pick(d)}
                    aria-label={formatDayLong(d)}
                    aria-current={selected ? "date" : undefined}
                    className={cn(
                      "relative aspect-square rounded-lg text-sm font-semibold transition-colors",
                      disabled && "cursor-not-allowed text-ink-400/50",
                      !disabled && !selected && "text-ink-700 hover:bg-brand-50 hover:text-brand-700",
                      selected && "bg-brand-600 text-white shadow-sm",
                    )}
                  >
                    {d.getDate()}
                    {isToday && !selected && (
                      <span className="absolute inset-x-0 bottom-1 mx-auto h-1 w-1 rounded-full bg-brand-600" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="mt-3 flex items-center gap-4 text-xs text-ink-400">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            Today
          </span>
          <span>Sundays closed</span>
        </p>
      </div>

      {/* ---------------- Times ---------------- */}
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-bold text-ink-900">
            {date ? formatDayLong(date) : "Pick a day first"}
          </h3>
          {date && !isClosed(date) && (
            <span className="text-xs text-ink-400">
              {open.length} time{open.length === 1 ? "" : "s"} free
            </span>
          )}
        </div>

        <AnimatePresence mode="wait">
          {open.length === 0 ? (
            <motion.div
              key={`empty-${dayKey(date ?? today)}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-dashed border-line px-6 py-12 text-center"
            >
              <CalendarX2 size={24} className="mx-auto text-ink-400" />
              <p className="mt-3 text-sm font-bold text-ink-900">
                {date && isClosed(date) ? "I do not take calls on Sundays" : "No times left that day"}
              </p>
              <p className="mt-1.5 text-xs text-ink-600">
                Pick another date on the calendar, or jump to my next free day.
              </p>
              <Button variant="outline" size="sm" className="mt-5" onClick={jumpToNextOpenDay}>
                Find my next free day
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key={dayKey(date ?? today)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {groups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
                    {group.label}
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {group.items.map((s, i) => {
                      const selected = slot?.minutes === s.minutes;
                      return (
                        <motion.button
                          key={s.minutes}
                          type="button"
                          onClick={() => onSlotChange(s)}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(i, 12) * 0.02 }}
                          className={cn(
                            "rounded-lg border px-2 py-2.5 text-sm font-semibold transition-all",
                            selected
                              ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                              : "border-line bg-white text-ink-700 hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
                          )}
                        >
                          {s.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {slot && (
                <p className="rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-700">
                  <span className="font-semibold">
                    {slot.label} – {slot.endLabel}
                  </span>{" "}
                  · {consultLength(service)} minute call
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
