import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "./ui";

export default function StepIndicator({ steps, current, onJump }) {
  return (
    <ol className="flex items-center">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const reachable = i <= current;
        return (
          <li key={step.label} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
            <button
              type="button"
              disabled={!reachable || !onJump}
              onClick={() => reachable && onJump?.(i)}
              className={cn(
                "flex items-center gap-3 rounded-lg py-1 pr-2 text-left transition-opacity",
                reachable && onJump ? "cursor-pointer hover:opacity-75" : "cursor-default",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors duration-300",
                  done
                    ? "border-brand-600 bg-brand-600 text-white"
                    : active
                      ? "border-brand-600 bg-white text-brand-700"
                      : "border-line bg-white text-ink-400",
                )}
              >
                {done ? <Check size={16} /> : i + 1}
              </span>
              <span className="hidden min-w-0 sm:block">
                <span
                  className={cn(
                    "block truncate text-sm font-semibold transition-colors",
                    active ? "text-ink-900" : done ? "text-ink-700" : "text-ink-400",
                  )}
                >
                  {step.label}
                </span>
                <span className="block truncate text-xs text-ink-400">{step.hint}</span>
              </span>
            </button>

            {i < steps.length - 1 && (
              <span className="mx-3 h-px flex-1 overflow-hidden rounded bg-line">
                <motion.span
                  initial={false}
                  animate={{ scaleX: done ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="block h-full origin-left bg-brand-600"
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
