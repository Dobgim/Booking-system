/** Date helpers and booking references. Requests carry no appointment slot. */

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

export const formatDayLong = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const formatDayShort = (date) =>
  new Date(date).toLocaleDateString(undefined, { day: "numeric", month: "short" });

/** "18 Sep 2026, 14:05" */
export const formatStamp = (date) =>
  new Date(date).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const makeReference = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `DJ-${out}`;
};

/** When the request was sent. */
export const submittedAt = (booking) => new Date(booking.createdAt ?? Date.now());

/** Anything not cancelled is still live. */
export const isActive = (booking) => booking.status !== "cancelled";
