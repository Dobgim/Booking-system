import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone, Smartphone } from "lucide-react";
import { owner } from "../data/services";
import { TrackingArt } from "./art";
import { Button } from "./ui";

const ease = [0.22, 1, 0.36, 1];

/**
 * The hero visual: a browser window showing a live tracking screen, a phone
 * floating beside it, and a contact card tucked underneath. It shows what the
 * work looks like rather than describing it.
 */
export default function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      {/* Soft glow behind everything */}
      <div
        aria-hidden
        className="absolute inset-x-0 -inset-y-8 -z-10 rounded-[3rem] bg-brand-100/50 blur-3xl"
      />

      {/* Browser window */}
      <motion.div
        initial={{ opacity: 0, y: 28, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease }}
        style={{ transformPerspective: 1200 }}
        className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_70px_-30px_rgb(15_23_42/0.35)]"
      >
        <div className="flex items-center gap-2 border-b border-line bg-canvas px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 flex-1 truncate rounded-md bg-white px-3 py-1 text-[11px] text-ink-400">
            yourbusiness.com/track
          </span>
        </div>

        <div className="relative h-52 sm:h-60">
          <TrackingArt />

          {/* Live status chip */}
          <motion.div
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1, ease }}
            className="absolute left-4 top-4 flex items-center gap-2 rounded-lg border border-line bg-white/95 px-3 py-2 shadow-sm backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold text-ink-900">In transit</span>
          </motion.div>
        </div>

        {/* Delivery rows */}
        <div className="space-y-2 border-t border-line p-4">
          {[
            { code: "TRK-4821", place: "Douala → Buea", done: true },
            { code: "TRK-4822", place: "Yaoundé → Bamenda", done: false },
          ].map((row, i) => (
            <motion.div
              key={row.code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 + i * 0.15, ease }}
              className="flex items-center gap-3 rounded-lg bg-canvas px-3 py-2.5"
            >
              <span className="font-display text-xs font-bold text-ink-900">{row.code}</span>
              <span className="min-w-0 flex-1 truncate text-xs text-ink-600">{row.place}</span>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  row.done ? "bg-emerald-50 text-emerald-700" : "bg-brand-50 text-brand-700"
                }`}
              >
                {row.done ? "Delivered" : "Moving"}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating phone */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -10 }}
        animate={{ opacity: 1, y: 0, rotate: -6 }}
        transition={{ duration: 0.9, delay: 0.5, ease }}
        className="absolute -bottom-10 left-0 hidden w-36 lg:block"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="overflow-hidden rounded-[1.4rem] border-[6px] border-ink-900 bg-white shadow-[0_24px_50px_-20px_rgb(15_23_42/0.45)]"
        >
          <div className="bg-brand-600 px-3 py-4 text-white">
            <Smartphone size={14} className="opacity-80" />
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide opacity-80">
              Your app
            </p>
            <p className="font-display text-sm font-bold">Order #4821</p>
          </div>
          <div className="space-y-2 p-3">
            {[100, 72, 48].map((w, i) => (
              <motion.div
                key={w}
                initial={{ width: 0 }}
                animate={{ width: `${w}%` }}
                transition={{ duration: 0.6, delay: 1.2 + i * 0.12, ease }}
                className={`h-2 rounded-full ${i === 0 ? "bg-brand-200" : "bg-line"}`}
              />
            ))}
            <div className="!mt-3 rounded-lg bg-emerald-50 px-2 py-1.5 text-center text-[10px] font-bold text-emerald-700">
              Arriving today
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Contact card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease }}
        className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-[0_16px_40px_-24px_rgb(15_23_42/0.3)] lg:ml-32"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 font-display text-sm font-bold text-white">
            {owner.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-bold text-ink-900">{owner.name}</p>
            <p className="truncate text-xs text-ink-600">{owner.role}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-4 text-xs">
          <a
            href={owner.phoneHref}
            className="inline-flex items-center gap-1.5 font-medium text-ink-700 transition-colors hover:text-brand-700"
          >
            <Phone size={13} className="text-brand-600" />
            {owner.phone}
          </a>
          <a
            href={`mailto:${owner.email}`}
            className="inline-flex min-w-0 items-center gap-1.5 font-medium text-ink-700 transition-colors hover:text-brand-700"
          >
            <Mail size={13} className="shrink-0 text-brand-600" />
            <span className="truncate">{owner.email}</span>
          </a>
        </div>

        <Button as={Link} to="/book" className="mt-4 w-full">
          Start a request
          <ArrowRight size={15} />
        </Button>
        <p className="mt-2.5 text-center text-[11px] text-ink-400">
          Free quote, no obligation
        </p>
      </motion.div>
    </div>
  );
}
