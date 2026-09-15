import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { makeReference } from "../lib/schedule";
import { makeId } from "../lib/id";

const STORAGE_KEY = "djf.bookings.v1";
const IDENTITY_KEY = "djf.identity.v1";

const BookingContext = createContext(null);

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    // Older records, or ones written when crypto.randomUUID was unavailable,
    // may have no id — without one the invoice link resolves to nothing.
    return parsed.map((b) => ({
      ...b,
      id: b.id || makeId(),
      reference: b.reference || makeReference(),
    }));
  } catch {
    return [];
  }
};

const loadIdentity = () => {
  try {
    return localStorage.getItem(IDENTITY_KEY) ?? "";
  } catch {
    return "";
  }
};

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(load);
  // Whose bookings this browser is currently showing. Set from the email used
  // on the last booking, so two people sharing a phone do not see each other.
  const [identity, setIdentity] = useState(loadIdentity);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      /* storage may be unavailable in private mode — the app still works in-session */
    }
  }, [bookings]);

  useEffect(() => {
    try {
      if (identity) localStorage.setItem(IDENTITY_KEY, identity);
      else localStorage.removeItem(IDENTITY_KEY);
    } catch {
      /* storage may be unavailable — the session still works in memory */
    }
  }, [identity]);

  const toast = useCallback((message, tone = "success") => {
    const id = makeId();
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const addBooking = useCallback((draft) => {
    const booking = {
      ...draft,
      id: makeId(),
      reference: makeReference(),
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    setBookings((b) => [booking, ...b]);
    if (booking.customer?.email) setIdentity(booking.customer.email.toLowerCase());
    return booking;
  }, []);

  /** Bookings belonging to whoever this browser is signed in as. */
  const myBookings = useMemo(() => {
    if (!identity) return [];
    return bookings.filter((b) => b.customer?.email?.toLowerCase() === identity.toLowerCase());
  }, [bookings, identity]);

  /** Look a client up by email or by a booking reference. */
  const signInWith = useCallback(
    (value) => {
      const needle = value.trim().toLowerCase();
      if (!needle) return false;
      const match = bookings.find(
        (b) =>
          b.customer?.email?.toLowerCase() === needle ||
          b.reference?.toLowerCase() === needle,
      );
      if (!match) return false;
      setIdentity(match.customer.email.toLowerCase());
      return true;
    },
    [bookings],
  );

  const signOut = useCallback(() => setIdentity(""), []);

  const cancelBooking = useCallback(
    (id) => {
      setBookings((b) => b.map((x) => (x.id === id ? { ...x, status: "cancelled" } : x)));
      toast("Appointment cancelled. Your slot has been released.", "info");
    },
    [toast],
  );

  const rescheduleBooking = useCallback(
    (id, { date, startMinutes }) => {
      setBookings((b) =>
        b.map((x) => (x.id === id ? { ...x, date, startMinutes, status: "confirmed" } : x)),
      );
      toast("Appointment moved. We sent an updated confirmation.");
    },
    [toast],
  );

  const value = useMemo(
    () => ({
      bookings,
      myBookings,
      identity,
      signInWith,
      signOut,
      addBooking,
      cancelBooking,
      rescheduleBooking,
      toasts,
      toast,
      dismissToast,
    }),
    [
      bookings,
      myBookings,
      identity,
      signInWith,
      signOut,
      addBooking,
      cancelBooking,
      rescheduleBooking,
      toasts,
      toast,
      dismissToast,
    ],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export const useBookings = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookings must be used inside <BookingProvider>");
  return ctx;
};
