import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck, Menu, Phone, X } from "lucide-react";
import { owner } from "../data/services";
import { useBookings } from "../context/BookingContext";
import { isUpcoming } from "../lib/schedule";
import { Button, cn } from "./ui";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/bookings", label: "My Bookings" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { bookings } = useBookings();
  const { pathname } = useLocation();
  const upcoming = bookings.filter(isUpcoming).length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-line bg-white/85 backdrop-blur-xl" : "bg-transparent",
      )}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 font-display text-sm font-bold text-white">
            {owner.initials}
          </span>
          <span className="hidden font-display text-[15px] font-bold tracking-tight text-ink-900 sm:block">
            {owner.shortName}
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === "/"}>
                {({ isActive }) => (
                  <span
                    className={cn(
                      "relative inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                      isActive ? "text-brand-700" : "text-ink-600 hover:text-ink-900",
                    )}
                  >
                    {l.label}
                    {l.to === "/bookings" && upcoming > 0 && (
                      <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {upcoming}
                      </span>
                    )}
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-lg bg-brand-50"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={owner.phoneHref}
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-ink-700 transition-colors hover:text-brand-700 lg:inline-flex"
          >
            <Phone size={15} />
            {owner.phone}
          </a>
          <Button as={Link} to="/book" size="sm" className="hidden sm:inline-flex">
            <CalendarCheck size={16} />
            Book a consultation
          </Button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="rounded-lg border border-line bg-white p-2.5 text-ink-700 md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-white md:hidden"
          >
            <ul className="space-y-1 px-5 py-4">
              {links.map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "block rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-brand-50 text-brand-700"
                          : "text-ink-600 hover:bg-canvas hover:text-ink-900",
                      )
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.li>
              ))}
              <li className="pt-2">
                <Button as={Link} to="/book" className="w-full">
                  <CalendarCheck size={16} />
                  Book a consultation
                </Button>
              </li>
              <li>
                <a
                  href={owner.phoneHref}
                  className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-ink-700"
                >
                  <Phone size={15} />
                  {owner.phone}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
