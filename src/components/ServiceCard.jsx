import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Clock, Timer } from "lucide-react";
import { formatUSD, formatXAF, formatXAFAmount, hasHostingPrice } from "../lib/pricing";
import { Badge, Button, ServiceIcon, cn } from "./ui";

export default function ServiceCard({ service, index = 0, onSelect, selected = false }) {
  const selectable = Boolean(onSelect);
  const Wrapper = selectable ? "button" : "div";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Wrapper
        {...(selectable ? { onClick: () => onSelect(service), type: "button" } : {})}
        className={cn(
          "group relative flex h-full w-full flex-col rounded-2xl border bg-white p-6 text-left transition-all duration-300",
          selected
            ? "border-brand-500 shadow-[0_12px_32px_-12px_rgb(29_78_216/0.25)] ring-1 ring-brand-500"
            : "border-line shadow-[0_1px_2px_rgb(15_23_42/0.04)] hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_12px_32px_-12px_rgb(29_78_216/0.18)]",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
              selected
                ? "bg-brand-600 text-white"
                : "bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white",
            )}
          >
            <ServiceIcon name={service.icon} size={21} />
          </span>
          <div className="flex items-center gap-2">
            {service.popular && <Badge tone="warn">Most requested</Badge>}
            {selected && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white">
                <Check size={14} />
              </span>
            )}
          </div>
        </div>

        <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-ink-900">
          {service.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">{service.tagline}</p>

        <ul className="mt-5 space-y-2">
          {service.features.slice(0, 3).map((f) => (
            <li key={f} className="flex gap-2.5 text-sm text-ink-600">
              <Check size={15} className="mt-0.5 shrink-0 text-brand-600" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <div className="border-t border-line pt-4">
            <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
              <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-600">
                <span className="inline-flex items-center gap-1.5">
                  <Timer size={14} className="text-brand-600" />
                  {service.timeline}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} className="text-brand-600" />
                  {service.consultMinutes} min call
                </span>
              </span>
              <span className="text-right">
                <span className="block font-display text-lg font-bold leading-tight text-ink-900">
                  {service.startingAt != null && (
                    <span className="text-xs font-medium text-ink-400">from </span>
                  )}
                  {formatUSD(service)}
                  {service.priceSuffix}
                </span>
                {formatXAF(service) && (
                  <span className="block text-xs font-medium text-ink-600">
                    {formatXAF(service)}
                    {service.priceSuffix}
                  </span>
                )}
              </span>
            </div>

            {hasHostingPrice(service) && (
              <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-xs font-medium text-brand-700">
                {formatXAFAmount(service.withHostingXAF)} if you already have hosting and a domain
              </p>
            )}
          </div>

          {selectable ? (
            <p
              className={cn(
                "mt-4 flex items-center gap-1.5 text-sm font-semibold transition-colors",
                selected ? "text-brand-700" : "text-ink-400 group-hover:text-brand-700",
              )}
            >
              {selected ? "Selected" : "Choose this service"}
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </p>
          ) : (
            <Button as={Link} to={`/book?service=${service.id}`} className="mt-4 w-full">
              Book a free consultation
              <ArrowRight size={15} />
            </Button>
          )}
        </div>
      </Wrapper>
    </motion.div>
  );
}
