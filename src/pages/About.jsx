import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Sparkles,
} from "lucide-react";
import { about, owner, services } from "../data/services";
import {
  Badge,
  Button,
  Card,
  CountUp,
  Marquee,
  Reveal,
  SectionHeading,
  ServiceIcon,
  Tilt,
} from "../components/ui";

export default function About() {
  return (
    <div className="px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-6xl">
        {/* ---------------- Intro ---------------- */}
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_360px]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge tone="brand">
                <Sparkles size={13} />
                About me
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 font-display text-4xl font-bold leading-[1.12] tracking-tight text-ink-900 sm:text-5xl"
            >
              {about.headline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mt-6 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg"
            >
              {about.intro}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button as={Link} to="/book" size="lg">
                <CalendarCheck size={18} />
                Get a free quote
              </Button>
              <Button as="a" href={owner.phoneHref} size="lg" variant="outline">
                <Phone size={17} />
                {owner.phone}
              </Button>
            </motion.div>
          </div>

          {/* Profile card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-sm"
          >
            <div className="rounded-2xl border border-line bg-white p-7 text-center shadow-[0_24px_60px_-28px_rgb(15_23_42/0.25)]">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-600 font-display text-2xl font-bold text-white">
                {owner.initials}
              </span>
              <h2 className="mt-5 font-display text-lg font-bold text-ink-900">{owner.name}</h2>
              <p className="text-sm text-ink-600">{owner.role}</p>
              <p className="mt-1 text-sm font-medium text-brand-700">Freelancer</p>

              <div className="mt-6 space-y-3 border-t border-line pt-6 text-left text-sm">
                <a
                  href={owner.phoneHref}
                  className="flex items-center gap-3 text-ink-700 transition-colors hover:text-brand-700"
                >
                  <Phone size={16} className="shrink-0 text-brand-600" />
                  {owner.phone}
                </a>
                <a
                  href={`mailto:${owner.email}`}
                  className="flex items-center gap-3 break-all text-ink-700 transition-colors hover:text-brand-700"
                >
                  <Mail size={16} className="shrink-0 text-brand-600" />
                  {owner.email}
                </a>
                <p className="flex items-start gap-3 text-ink-700">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-brand-600" />
                  {owner.location}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ---------------- Facts ---------------- */}
        <div className="mt-16 grid gap-4 rounded-2xl border border-line bg-white p-6 sm:grid-cols-2 lg:grid-cols-4">
          {about.facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.07}>
              <div className="px-2 py-3 text-center sm:text-left">
                <p className="font-display text-3xl font-bold text-brand-600">
                  {/^[\d.]+$/.test(String(f.value).replace(/[+ –-]/g, "")) ? (
                    <CountUp
                      value={parseFloat(String(f.value))}
                      suffix={String(f.value).replace(/^[\d.]+/, "")}
                    />
                  ) : (
                    f.value
                  )}
                </p>
                <p className="mt-1 text-xs text-ink-600">{f.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ---------------- Why work with me ---------------- */}
        <section className="py-20">
          <SectionHeading
            eyebrow="Why work with me"
            title="What a one-person studio gets you"
            subtitle="No agency overhead, no queue, no game of telephone between you and whoever writes the code."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {about.why.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.08}>
                <Tilt className="h-full">
                <Card className="flex h-full gap-4 p-6">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Check size={18} />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-ink-900">{w.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{w.text}</p>
                  </div>
                </Card>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------------- Stack ---------------- */}
        <section className="py-12">
          <SectionHeading
            eyebrow="Tools"
            title="What I build with"
            subtitle="Chosen because they are fast, well supported and easy for someone else to pick up later — never because they are fashionable."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {about.stack.map((group, i) => (
              <Reveal key={group.group} delay={i * 0.07}>
                <Card hover={false} className="h-full p-6">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wide text-brand-600">
                    {group.group}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-xs font-medium text-ink-700"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal>
          <div className="pb-8">
            <Marquee items={about.stack.flatMap((g) => g.items)} speed={46} />
          </div>
        </Reveal>

        {/* ---------------- How I work ---------------- */}
        <section className="py-12">
          <div className="grid gap-10 rounded-2xl border border-line bg-white p-8 lg:grid-cols-2 lg:p-12">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
                How working together actually goes
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">{owner.bio}</p>
              <ul className="mt-6 space-y-3">
                {about.ways.map((w) => (
                  <li key={w} className="flex gap-3 text-sm text-ink-700">
                    <Check size={16} className="mt-0.5 shrink-0 text-brand-600" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                What I build
              </h3>
              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {services.map((s) => (
                  <Link
                    key={s.id}
                    to={`/book?service=${s.id}`}
                    className="flex items-center gap-2.5 rounded-lg border border-line bg-canvas px-3 py-2.5 text-xs font-medium text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  >
                    <ServiceIcon name={s.icon} size={15} className="shrink-0 text-brand-600" />
                    <span className="truncate">{s.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- CTA ---------------- */}
        <Reveal>
          <div className="mt-12 rounded-2xl bg-ink-900 px-6 py-14 text-center sm:px-14">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              Let us talk about your project
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-300">
              Book a free call, or just send me a message. Either way you get a straight answer on
              whether I am the right person for it.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button
                as={Link}
                to="/book"
                size="lg"
                variant="light"
              >
                <CalendarCheck size={18} />
                Start a request
              </Button>
              <Button
                as="a"
                href={`mailto:${owner.email}`}
                size="lg"
                variant="onDark"
              >
                <MessageSquare size={17} />
                Email me
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
