import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  ChevronDown,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";
import { customService, faqs, guarantees, owner, process, services } from "../data/services";
import ServiceCard from "../components/ServiceCard";
import { formatUSD, formatXAF } from "../lib/pricing";
import { Badge, Button, Card, Reveal, SectionHeading, ServiceIcon } from "../components/ui";

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);
  const featured = services.filter((s) => s.popular);
  const marketing = services.filter((s) => s.marketing);
  const rest = services.filter((s) => !s.popular && !s.marketing);

  return (
    <div>
      {/* ---------------- Hero ---------------- */}
      <section className="px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge tone="success">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Taking on new projects this month
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl lg:text-[3.4rem]"
            >
              Websites that do the work,
              <span className="block text-brand-600">not just sit there</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg"
            >
              I am {owner.name} — I build tracking platforms with live maps, banking systems,
              online stores, restaurant sites and mobile apps, then get them found with SEO, Google
              Ads and Google Business. I also set up foreign numbers and eSIMs. Book a free consultation and leave the call with a clear
              plan and a fixed price.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Button as={Link} to="/book" size="lg">
                <CalendarCheck size={18} />
                Book a free consultation
              </Button>
              <Button as={Link} to="/services" size="lg" variant="outline">
                See what I build
                <ArrowRight size={17} />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-600"
            >
              {["Free consultation", "Fixed price up front", "You own the code"].map((t) => (
                <span key={t} className="inline-flex items-center gap-2">
                  <Check size={16} className="text-brand-600" />
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Consultation card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-md"
          >
            <div className="rounded-2xl border border-line bg-white p-7 shadow-[0_24px_60px_-28px_rgb(15_23_42/0.25)]">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-600 font-display text-lg font-bold text-white">
                  {owner.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-bold text-ink-900">
                    {owner.name}
                  </p>
                  <p className="text-sm text-ink-600">{owner.role}</p>
                </div>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-ink-600">{owner.bio}</p>

              <dl className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="shrink-0 text-brand-600" />
                  <dt className="sr-only">Phone</dt>
                  <dd>
                    <a href={owner.phoneHref} className="font-medium text-ink-900 hover:text-brand-700">
                      {owner.phone}
                    </a>
                  </dd>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="shrink-0 text-brand-600" />
                  <dt className="sr-only">Email</dt>
                  <dd className="min-w-0">
                    <a
                      href={`mailto:${owner.email}`}
                      className="block truncate font-medium text-ink-900 hover:text-brand-700"
                    >
                      {owner.email}
                    </a>
                  </dd>
                </div>
              </dl>

              <Button as={Link} to="/book" className="mt-6 w-full" size="lg">
                Book a time with me
                <ArrowRight size={16} />
              </Button>
              <p className="mt-3 text-center text-xs text-ink-400">
                Free, no obligation, just 5 minutes
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- Services ---------------- */}
      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                What I build
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                Most requested projects
              </h2>
              <p className="mt-3 text-ink-600">
                Every price is an honest starting point for that type of build, confirmed in writing
                after our call.
              </p>
            </div>
            <Button as={Link} to="/services" variant="outline">
              All services
              <ArrowRight size={16} />
            </Button>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Marketing ---------------- */}
      <section className="px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Getting found"
            title="A site nobody visits is just a bill"
            subtitle="Once your site is live I can also get it in front of people — through Google search, paid ads and Google Maps."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {marketing.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.09}>
                <Card className="flex h-full flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <ServiceIcon name={s.icon} size={21} />
                    </span>
                    <Badge tone={s.billing === "monthly" ? "brand" : "neutral"}>
                      {s.billing === "monthly" ? "Monthly" : "One-off"}
                    </Badge>
                  </div>

                  <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-ink-900">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{s.tagline}</p>

                  <p className="mt-5 flex flex-wrap items-baseline gap-x-1.5">
                    <span className="text-sm text-ink-400">from</span>
                    <span className="font-display text-2xl font-bold text-ink-900">
                      {formatUSD(s)}
                    </span>
                    {s.priceSuffix && (
                      <span className="text-sm font-medium text-ink-600">{s.priceSuffix}</span>
                    )}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-ink-600">
                    {formatXAF(s)}
                    {s.priceSuffix}
                  </p>
                  <p className="mt-1.5 text-xs text-ink-400">{s.timeline}</p>

                  <ul className="mt-5 space-y-2 border-t border-line pt-5">
                    {s.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-sm text-ink-600">
                        <Check size={15} className="mt-0.5 shrink-0 text-brand-600" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {s.note && (
                    <p className="mt-4 rounded-lg bg-canvas px-3 py-2.5 text-xs leading-relaxed text-ink-600">
                      {s.note}
                    </p>
                  )}

                  <Button
                    as={Link}
                    to={`/book?service=${s.id}`}
                    variant="outline"
                    className="mt-6 w-full"
                  >
                    Book a consultation
                    <ArrowRight size={15} />
                  </Button>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-ink-600">
              Running more than one of these together works better than any single one — we can
              talk through the right mix on the call.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Process ---------------- */}
      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="How we work"
            title="From first call to live site"
            subtitle="Four stages, each one ending with something you can see and sign off on."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <Reveal key={p.step} delay={i * 0.09}>
                <div className="relative h-full">
                  <span className="font-display text-sm font-bold text-brand-600">
                    0{i + 1}
                  </span>
                  <div className="mt-3 h-px w-full bg-line">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                      className="h-px w-full origin-left bg-brand-600"
                    />
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-ink-900">{p.step}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Guarantees ---------------- */}
      <section className="px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="What you get either way"
            title="The terms, stated before you ask"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {guarantees.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.08}>
                <Card className="flex h-full gap-4 p-6">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Check size={18} />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-ink-900">{g.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{g.text}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Categories strip ---------------- */}
      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Also available"
            title="The rest of the menu"
            subtitle="Not sure which one fits? Book a consultation and describe the problem — the right build is part of what we work out."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((s, i) => (
                <Reveal key={s.id} delay={i * 0.06}>
                  <Link to={`/book?service=${s.id}`} className="block h-full">
                    <Card className="flex h-full items-center gap-4 p-5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                        <ServiceIcon name={s.icon} size={19} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-display text-sm font-bold text-ink-900">
                          {s.name}
                        </h3>
                        <p className="truncate text-xs text-ink-600">{s.tagline}</p>
                      </div>
                      <ArrowRight size={16} className="shrink-0 text-ink-400" />
                    </Card>
                  </Link>
                </Reveal>
              ))}
          </div>
        </div>
      </section>


      {/* ---------------- Nothing fits? ---------------- */}
      <section className="px-5 py-12 sm:px-8">
        <Reveal>
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/60 px-6 py-12 text-center sm:px-12">
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
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="Questions" title="What clients ask first" />
          <div className="mt-12 divide-y divide-line border-y border-line">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q}>
                  <button
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="font-display text-[15px] font-semibold text-ink-900">
                      {f.q}
                    </span>
                    <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown size={18} className="shrink-0 text-brand-600" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 pr-8 text-sm leading-relaxed text-ink-600">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="px-5 pb-8 sm:px-8">
        <Reveal>
          <div className="mx-auto max-w-6xl rounded-2xl bg-ink-900 px-6 py-14 text-center sm:px-14">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              Tell me what you need built
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-300">
              Pick a service, choose a time that suits you, and we will talk it through. The call is
              free and you leave with a plan either way.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button as={Link} to="/book" size="lg" variant="light">
                <CalendarCheck size={18} />
                Book a consultation
              </Button>
              <Button
                as="a"
                href={`mailto:${owner.email}`}
                size="lg"
                variant="onDark"
              >
                <MessageSquare size={17} />
                Email me instead
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
