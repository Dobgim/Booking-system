import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X, AlertTriangle } from "lucide-react";
import { useBookings } from "../context/BookingContext";

const icons = {
  success: { Icon: CheckCircle2, className: "text-emerald-600" },
  info: { Icon: Info, className: "text-brand-600" },
  warn: { Icon: AlertTriangle, className: "text-amber-600" },
};

export default function Toasts() {
  const { toasts, dismissToast } = useBookings();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 px-4 pb-6"
      style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const { Icon, className } = icons[t.tone] ?? icons.success;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 28, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-white px-4 py-3 shadow-[0_16px_40px_-12px_rgb(15_23_42/0.25)]"
            >
              <Icon size={18} className={`mt-0.5 shrink-0 ${className}`} />
              <p className="flex-1 text-sm leading-snug text-ink-700">{t.message}</p>
              <button
                onClick={() => dismissToast(t.id)}
                aria-label="Dismiss notification"
                className="rounded-md p-1 text-ink-400 transition-colors hover:bg-canvas hover:text-ink-900"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
