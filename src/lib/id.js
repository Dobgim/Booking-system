/**
 * crypto.randomUUID() only exists in a secure context, so it is missing when
 * the site is opened over plain http on a phone (e.g. http://192.168.1.10:5175).
 * This falls back rather than throwing, which would break booking entirely.
 */
export const makeId = () => {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    }
  } catch {
    /* fall through to the timestamp-based id below */
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};
