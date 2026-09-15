import { OPENING } from "../data/services";

export const dayKey = (date) => {
  const d = new Date(date);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

export const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

export const isSameDay = (a, b) => dayKey(a) === dayKey(b);

/** Closed on Sundays. */
export const isClosed = (date) => new Date(date).getDay() === 0;

/** How long this consultation runs, in minutes. */
export const consultLength = (service) => service?.consultMinutes ?? 30;

/** Minutes past midnight -> "9:30 AM" */
export const formatMinutes = (mins) => {
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${String(m).padStart(2, "0")} ${suffix}`;
};

export const formatDayLong = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const formatDayShort = (date) =>
  new Date(date).toLocaleDateString(undefined, { day: "numeric", month: "short" });

/** Stable hash so held slots stay identical across renders and reloads. */
const hash = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
};

/**
 * Every consultation slot for a given day.
 *
 * There is one person taking these calls, so a slot is unavailable when it is
 * in the past, when it would run past closing, when an existing booking
 * overlaps it, or when the working day is already blocked out.
 */
export function buildSlots({ date, service, bookings = [], excludeBookingId = null }) {
  if (!date || !service) return [];
  if (isClosed(date)) return [];

  const { start, end, slotMinutes } = OPENING;
  const length = consultLength(service);
  const key = dayKey(date);
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const today = isSameDay(date, now);

  const taken = bookings
    .filter((b) => b.status !== "cancelled" && b.date === key && b.id !== excludeBookingId)
    .map((b) => [b.startMinutes, b.startMinutes + b.duration]);

  const slots = [];
  for (let m = start * 60; m + length <= end * 60; m += slotMinutes) {
    const overlaps = taken.some(([s, e]) => m < e && m + length > s);
    const past = today && m <= nowMinutes + 30;
    const free = hash(`${key}|${m}|${service.id}`) > 0.28;
    slots.push({
      minutes: m,
      label: formatMinutes(m),
      endLabel: formatMinutes(m + length),
      available: !overlaps && !past && free,
      reason: overlaps ? "booked" : past ? "past" : !free ? "blocked" : null,
    });
  }
  return slots;
}

export const makeReference = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `DJ-${out}`;
};

export const bookingDateTime = (booking) => {
  const [y, m, d] = booking.date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setMinutes(booking.startMinutes);
  return dt;
};

export const isUpcoming = (booking) =>
  booking.status !== "cancelled" && bookingDateTime(booking).getTime() > Date.now();
