import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Building2,
  CalendarClock,
  Globe,
  GraduationCap,
  Landmark,
  Layers,
  Lightbulb,
  MapPin,
  Megaphone,
  PackageSearch,
  PawPrint,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  TrendingUp,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";

export const cn = (...parts) => parts.filter(Boolean).join(" ");

/**
 * Icons referenced by name in the service data. Listed explicitly rather than
 * imported as a namespace, so the bundle only carries the ones actually used.
 */
const serviceIcons = {
  Building2,
  CalendarClock,
  Globe,
  GraduationCap,
  Landmark,
  Lightbulb,
  MapPin,
  Megaphone,
  PackageSearch,
  PawPrint,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  TrendingUp,
  UtensilsCrossed,
  Wrench,
};

export function ServiceIcon({ name, ...props }) {
  const Cmp = serviceIcons[name] ?? Layers;
  return <Cmp {...props} />;
}

/**
 * Page backdrop: a soft blue wash at the top of the page that fades to white.
 * No pattern, no grid — just light.
 */
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
      <div className="absolute -left-[20%] -top-[30%] h-[46rem] w-[46rem] rounded-full bg-brand-50 blur-3xl" />
      <div className="absolute -right-[15%] -top-[18%] h-[34rem] w-[34rem] rounded-full bg-sky-50 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-[38rem] bg-gradient-to-b from-brand-50/70 via-white/60 to-white" />
    </div>
  );
}

/** Fades + lifts children into view once they are scrolled to. */
export function Reveal({ children, delay = 0, y = 22, className = "", once = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, align = "center" }) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.06}>
        <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-ink-900 sm:text-4xl">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.12}>
          <p className="mt-4 text-base leading-relaxed text-ink-600">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}

const buttonStyles = {
  primary: "bg-brand-600 text-white shadow-sm hover:bg-brand-700 hover:shadow-md",
  secondary: "bg-ink-900 text-white shadow-sm hover:bg-ink-800 hover:shadow-md",
  outline: "border border-line bg-white text-ink-900 hover:border-brand-300 hover:bg-brand-50",
  subtle: "bg-brand-50 text-brand-700 hover:bg-brand-100",
  danger: "border border-rose-200 bg-white text-rose-600 hover:bg-rose-50",
  // For use on the dark panels — never override colours via className, or the
  // variant's own text colour can win the cascade and the label disappears.
  light: "bg-white text-ink-900 shadow-sm hover:bg-brand-50 hover:text-brand-700",
  onDark: "border border-white/30 bg-transparent text-white hover:border-white hover:bg-white/10",
};

export function Button({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <Tag
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200",
        "hover:-translate-y-px active:translate-y-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none disabled:hover:translate-y-0",
        size === "sm" && "px-3.5 py-2 text-sm",
        size === "md" && "px-5 py-2.5 text-sm",
        size === "lg" && "px-6 py-3.5 text-[15px]",
        buttonStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Badge({ children, tone = "brand", className = "" }) {
  const tones = {
    brand: "border-brand-100 bg-brand-50 text-brand-700",
    neutral: "border-line bg-canvas text-ink-600",
    success: "border-emerald-100 bg-emerald-50 text-emerald-700",
    warn: "border-amber-100 bg-amber-50 text-amber-700",
    danger: "border-rose-100 bg-rose-50 text-rose-600",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** White card with a hairline border that lifts gently on hover. */
export function Card({ className = "", hover = true, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04)]",
        hover &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_12px_32px_-12px_rgb(29_78_216/0.18)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
