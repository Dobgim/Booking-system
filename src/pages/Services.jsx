import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Phone, Search, X } from "lucide-react";
import { categories, customService, owner, services } from "../data/services";
import ServiceCard from "../components/ServiceCard";
import { Badge, Button, Reveal, SectionHeading, ServiceIcon, cn } from "../components/ui";

const sorters = {
  popular: (a, b) => Number(b.popular ?? 0) - Number(a.popular ?? 0),
  "price-asc": (a, b) => a.startingAt - b.startingAt,
  "price-desc": (a, b) => b.startingAt - a.startingAt,
  name: (a, b) => a.name.localeCompare(b.name),
};

const sortLabels = {
  popular: "Most requested",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  name: "Name A – Z",
};

export default function Services() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services
      .filter((s) => category === "All" || s.category === category)
      .filter(
        (s) =>
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.tagline.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.features.some((f) => f.toLowerCase().includes(q)),
      )
      .sort(sorters[sort]);
  }, [category, query, sort]);

  return (
    <div className="px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Services"
          title="What I can build for you"
          subtitle="Prices are starting points for a project of that size and are confirmed in writing after a free consultation."
        />

        {/* Controls */}
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search — tracking, banking, store, school, app…"
              aria-label="Search services"
              className="w-full rounded-lg border border-line bg-white py-3 pl-11 pr-10 text-sm text-ink-900 placeholder:text-ink-400 transition-shadow focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-ink-400 hover:bg-canvas hover:text-ink-900"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort services"
            className="rounded-lg border border-line bg-white px-3.5 py-3 text-sm font-medium text-ink-900 transition-shadow focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 sm:w-52"
          >
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Category tabs */}
        <div className="mt-5 flex flex-wrap items-center gap-1 border-b border-line">
          {categories.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "relative px-4 py-3 text-sm font-semibold transition-colors",
                  active ? "text-brand-700" : "text-ink-600 hover:text-ink-900",
                )}
              >
                {c}
                {active && (
                  <motion.span
                    layoutId="cat-underline"
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-600"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
              </button>
            );
          })}
          <Badge tone="neutral" className="ml-auto mb-2">
            {results.length} {results.length === 1 ? "service" : "services"}
          </Badge>
        </div>

        {/* Grid */}
        <motion.div layout className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {results.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 rounded-2xl border border-dashed border-line py-20 text-center"
          >
            <p className="font-display text-lg font-bold text-ink-900">Nothing matches that</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink-600">
              I take on custom work too — tell me what you need and I will quote it.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
              className="mt-6 rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-ink-900 transition-colors hover:border-brand-300 hover:bg-brand-50"
            >
              Reset filters
            </button>
          </motion.div>
        )}

        {/* Nothing fits? */}
        <Reveal>
          <div className="mt-16 flex flex-col items-center gap-6 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/60 px-6 py-12 text-center sm:px-12">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm">
              <ServiceIcon name={customService.icon} size={26} />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
                Do not see what you need?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-ink-600">
                This list is what I build most, not everything I can build. Send me what you have in
                mind and I will tell you honestly whether I can do it, how long it would take and
                what it would cost.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button as={Link} to={`/book?service=${customService.id}`} size="lg">
                <MessageSquare size={18} />
                Tell me what you need
              </Button>
              <Button as="a" href={owner.phoneHref} size="lg" variant="outline">
                <Phone size={17} />
                Call {owner.phone}
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
