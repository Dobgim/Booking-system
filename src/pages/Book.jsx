import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CalendarCheck,
  CalendarDays,
  Check,
  Clock,
  Mail,
  FileText,
  MessageCircle,
  MessageSquare,
  Phone,
  ShieldCheck,
  Timer,
  User,
  Wallet,
} from "lucide-react";
import { customService, owner, services } from "../data/services";
import {
  consultLength,
  dayKey,
  formatDayLong,
  startOfToday,
} from "../lib/schedule";
import {
  NO_BUDGET,
  budgetOptions,
  effectivePrice,
  formatUSD,
  formatXAFAmount,
  hasHostingPrice,
  usdFromXAF,
} from "../lib/pricing";
import { useBookings } from "../context/BookingContext";
import StepIndicator from "../components/StepIndicator";
import DateTimePicker from "../components/DateTimePicker";
import ServiceCard from "../components/ServiceCard";
import { Badge, Button, ServiceIcon, cn } from "../components/ui";

const STEPS = [
  { label: "Project", hint: "What you need built" },
  { label: "Date & time", hint: "When we talk" },
  { label: "Your details", hint: "How I reach you" },
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  budget: NO_BUDGET,
  notes: "",
  whatsapp: true,
  hasHosting: false,
};

const validate = (form, isCustom) => {
  const errors = {};
  if (isCustom && form.notes.trim().length < 15)
    errors.notes = "Since this is a custom project, tell me a little about what you need.";
  if (form.name.trim().length < 2) errors.name = "Please give me your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
    errors.email = "I need a valid email to send the confirmation.";
  if (form.phone.replace(/\D/g, "").length < 7)
    errors.phone = "Add a phone number so I can reach you for the call.";
  return errors;
};

export default function Book() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { addBooking, toast } = useBookings();

  const [step, setStep] = useState(0);
  const [service, setService] = useState(
    () => [...services, customService].find((s) => s.id === params.get("service")) ?? null,
  );
  const [date, setDate] = useState(startOfToday);
  const [slot, setSlot] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  // A service passed in the URL skips the first step.
  useEffect(() => {
    if (service && params.get("service")) setStep(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, confirmed]);

  const canContinue = (step === 0 && !!service) || (step === 1 && !!slot) || step === 2;

  const goNext = () => {
    if (step < 2) return setStep((s) => s + 1);

    const found = validate(form, Boolean(service.custom));
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast("Check the highlighted fields before confirming.", "warn");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const booking = addBooking({
        serviceId: service.id,
        serviceName: service.name,
        category: service.category,
        icon: service.icon,
        custom: Boolean(service.custom),
        duration: consultLength(service),
        startingAt: service.startingAt,
        priceSuffix: service.priceSuffix ?? "",
        timeline: service.timeline,
        date: dayKey(date),
        startMinutes: slot.minutes,
        startLabel: slot.label,
        endLabel: slot.endLabel,
        customer: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company.trim(),
        },
        hasHosting: form.hasHosting,
        withHostingXAF: service.withHostingXAF ?? null,
        budget: form.budget,
        notes: form.notes.trim(),
        whatsapp: form.whatsapp,
      });
      setSubmitting(false);
      setConfirmed(booking);
      toast(`Consultation booked. Your reference is ${booking.reference}.`);
    }, 800);
  };

  const goBack = () => (step === 0 ? navigate(-1) : setStep((s) => s - 1));

  const reset = () => {
    setConfirmed(null);
    setStep(0);
    setService(null);
    setSlot(null);
    setDate(startOfToday());
    setForm(emptyForm);
    setErrors({});
  };

  if (confirmed) return <Confirmation booking={confirmed} onRebook={reset} />;

  return (
    <div className="px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
            Free consultation
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Book a time with me
          </h1>
          <p className="mt-3 text-ink-600">
            Three quick steps. The call costs nothing and you are under no obligation afterwards.
          </p>
        </div>

        <div className="mt-9">
          <StepIndicator steps={STEPS} current={step} onJump={setStep} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
          <div className="min-w-0 rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)] sm:p-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 22 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -22 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 0 && <StepService selected={service} onSelect={setService} />}
                {step === 1 && (
                  <>
                    <StepHeader
                      title="When suits you?"
                      text={`A ${consultLength(service)} minute call, Monday to Saturday between 08:00 and 18:00.`}
                    />
                    <DateTimePicker
                      service={service}
                      date={date}
                      onDateChange={setDate}
                      slot={slot}
                      onSlotChange={setSlot}
                    />
                  </>
                )}
                {step === 2 && (
                  <StepDetails
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    setErrors={setErrors}
                    isCustom={Boolean(service?.custom)}
                    service={service}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
              <Button variant="outline" onClick={goBack} disabled={submitting}>
                <ArrowLeft size={16} />
                {step === 0 ? "Back" : "Previous"}
              </Button>
              <Button onClick={goNext} disabled={!canContinue || submitting} size="lg">
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Booking…
                  </>
                ) : step === 2 ? (
                  <>
                    <CalendarCheck size={18} />
                    Confirm consultation
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </div>
          </div>

          <Summary
            service={service}
            date={date}
            slot={slot}
            step={step}
            hasHosting={form.hasHosting}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function StepHeader({ title, text }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-xl font-bold tracking-tight text-ink-900">{title}</h2>
      {text && <p className="mt-1.5 text-sm text-ink-600">{text}</p>}
    </div>
  );
}

function StepService({ selected, onSelect }) {
  return (
    <>
      <StepHeader
        title="What do you need built?"
        text="Pick the closest match — we refine the details on the call."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {services.map((s, i) => (
          <ServiceCard
            key={s.id}
            service={s}
            index={i}
            onSelect={onSelect}
            selected={selected?.id === s.id}
          />
        ))}
      </div>

      <CustomOption
        selected={selected?.id === customService.id}
        onSelect={() => onSelect(customService)}
      />
    </>
  );
}

/** The escape hatch, shown under the priced services. */
function CustomOption({ selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "mt-5 flex w-full items-center gap-4 rounded-2xl border-2 border-dashed p-5 text-left transition-all",
        selected
          ? "border-brand-600 bg-brand-50"
          : "border-line bg-white hover:border-brand-300 hover:bg-brand-50/50",
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
          selected ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-600",
        )}
      >
        <ServiceIcon name={customService.icon} size={21} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-base font-bold text-ink-900">
          Do not see what you need?
        </span>
        <span className="block text-sm text-ink-600">
          {customService.tagline}. Describe it on the next steps and I will quote it.
        </span>
      </span>
      {selected ? (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
          <Check size={14} />
        </span>
      ) : (
        <ArrowRight size={18} className="shrink-0 text-ink-400" />
      )}
    </button>
  );
}

function Field({ label, error, children, hint, optional }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-ink-900">
        {label}
        {optional && <span className="text-xs font-normal text-ink-400">optional</span>}
      </span>
      {children}
      {error ? (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 block text-xs font-medium text-rose-600"
        >
          {error}
        </motion.span>
      ) : (
        hint && <span className="mt-1.5 block text-xs text-ink-400">{hint}</span>
      )}
    </label>
  );
}

const inputClass = (error) =>
  cn(
    "w-full rounded-lg border bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 transition-shadow focus:outline-none focus:ring-2",
    error
      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
      : "border-line focus:border-brand-500 focus:ring-brand-100",
  );

function StepDetails({ form, setForm, errors, setErrors, isCustom, service }) {
  const pricing = effectivePrice(service, form.hasHosting);
  const budgets = budgetOptions(service, pricing.ceiling);

  // Switching service can leave a band that no longer exists selected.
  useEffect(() => {
    if (!budgets.includes(form.budget)) setForm((f) => ({ ...f, budget: NO_BUDGET }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service?.id, form.hasHosting]);

  const update = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <>
      <StepHeader
        title="How do I reach you?"
        text="I confirm by email and call you on the number below at the agreed time."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" error={errors.name}>
          <input
            value={form.name}
            onChange={update("name")}
            placeholder="Your full name"
            autoComplete="name"
            className={inputClass(errors.name)}
          />
        </Field>
        <Field label="Business name" optional>
          <input
            value={form.company}
            onChange={update("company")}
            placeholder="Company or project name"
            autoComplete="organization"
            className={inputClass(false)}
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder="you@example.com"
            autoComplete="email"
            className={inputClass(errors.email)}
          />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            placeholder="670-00-00-00"
            autoComplete="tel"
            className={inputClass(errors.phone)}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field
            label="Rough budget"
            hint={
              service?.startingAt != null
                ? `${service.name} ${pricing.reduced ? "costs" : "starts at"} ${pricing.usd}${pricing.suffix} (${pricing.xaf}${pricing.suffix}) — a range is enough.`
                : "A range is enough — it helps me scope realistically."
            }
          >
            <div className="flex flex-wrap gap-2">
              {budgets.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, budget: b }))}
                  className={cn(
                    "rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors",
                    form.budget === b
                      ? "border-brand-600 bg-brand-50 text-brand-700"
                      : "border-line bg-white text-ink-600 hover:border-brand-300 hover:text-ink-900",
                  )}
                >
                  {b}
                </button>
              ))}
            </div>
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field
            label={isCustom ? "Describe what you need built" : "Tell me about the project"}
            optional={!isCustom}
            error={errors.notes}
            hint="What it must do, who uses it, any deadline or existing site."
          >
            <textarea
              value={form.notes}
              onChange={update("notes")}
              rows={isCustom ? 6 : 4}
              placeholder={
                isCustom
                  ? "Describe it in your own words — what should it do, and who uses it?"
                  : "We sell spare parts and customers keep calling to ask what is in stock…"
              }
              className={cn(inputClass(errors.notes), "resize-none")}
            />
          </Field>
        </div>
      </div>

      {hasHostingPrice(service) && (
        <label
          className={cn(
            "mt-5 flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
            form.hasHosting
              ? "border-brand-500 bg-brand-50"
              : "border-line bg-canvas hover:border-brand-300",
          )}
        >
          <input
            type="checkbox"
            checked={form.hasHosting}
            onChange={update("hasHosting")}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#1d4ed8]"
          />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-ink-900">
              I already have hosting and a domain
            </span>
            <span className="block text-xs text-ink-600">
              Then you only pay for the build. Your price becomes{" "}
              <span className="font-semibold text-brand-700">
                {formatXAFAmount(service.withHostingXAF)}
              </span>{" "}
              ({usdFromXAF(service.withHostingXAF)}) instead of {formatUSD(service)}.
            </span>
          </span>
        </label>
      )}

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-canvas p-4 transition-colors hover:border-brand-300">
        <input
          type="checkbox"
          checked={form.whatsapp}
          onChange={update("whatsapp")}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#1d4ed8]"
        />
        <span>
          <span className="block text-sm font-semibold text-ink-900">
            This number is on WhatsApp
          </span>
          <span className="block text-xs text-ink-600">
            Easier for sharing screenshots and files before the call.
          </span>
        </span>
      </label>

      <div className="mt-5 flex items-start gap-3 rounded-lg border border-line bg-canvas p-4">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand-600" />
        <p className="text-xs leading-relaxed text-ink-600">
          Your details are used only to run this consultation. Nothing is charged now, and the call
          itself is free.
        </p>
      </div>
    </>
  );
}

function Summary({ service, date, slot, step, hasHosting }) {
  const pricing = effectivePrice(service, hasHosting);
  const rows = [
    {
      Icon: Briefcase,
      label: "Project",
      value: service?.name,
      sub: service ? `Delivery ${service.timeline}` : null,
    },
    {
      Icon: CalendarDays,
      label: "Consultation",
      value: date ? formatDayLong(date) : null,
      sub: slot ? `${slot.label} – ${slot.endLabel}` : "Pick a time",
    },
    { Icon: User, label: "With", value: owner.name, sub: owner.role },
  ];

  return (
    <aside className="lg:sticky lg:top-28">
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-sm font-bold text-ink-900">Your consultation</h2>
          <Badge tone="neutral">Step {step + 1} of 3</Badge>
        </div>

        <div className="space-y-4 p-5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <row.Icon size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                  {row.label}
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={row.value ?? "empty"}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "truncate text-sm font-semibold",
                      row.value ? "text-ink-900" : "text-ink-400",
                    )}
                  >
                    {row.value ?? "Not chosen yet"}
                  </motion.p>
                </AnimatePresence>
                {row.sub && <p className="truncate text-xs text-ink-600">{row.sub}</p>}
              </div>
            </div>
          ))}

          <div className="space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink-600">Consultation</span>
              <span className="font-semibold text-emerald-600">Free</span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-ink-600">{pricing.reduced ? "Project" : "Project from"}</span>
              <span className="text-right">
                <span className="block font-display text-lg font-bold text-ink-900">
                  {pricing.usd}
                  {pricing.suffix}
                </span>
                {pricing.xaf && (
                  <span className="block text-xs font-medium text-ink-600">
                    {pricing.xaf}
                    {pricing.suffix}
                  </span>
                )}
              </span>
            </div>
            {pricing.reduced && (
              <p className="rounded-lg bg-brand-50 px-3 py-2 text-xs font-medium text-brand-700">
                Build-only price — you are providing the hosting and domain.
              </p>
            )}
          </div>

          <p className="text-xs leading-relaxed text-ink-400">
            The project price is an estimate for this type of build. You get a fixed written quote
            after the call, before any work starts.
          </p>
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */

function Confirmation({ booking, onRebook }) {
  const [y, m, d] = booking.date.split("-").map(Number);
  const when = new Date(y, m - 1, d);
  const quoted = effectivePrice(
    {
      startingAt: booking.startingAt,
      priceMax: booking.priceMax,
      priceSuffix: booking.priceSuffix,
      withHostingXAF: booking.withHostingXAF,
    },
    booking.hasHosting,
  );

  const lines = [
    `Hello ${owner.shortName}, I just booked a consultation.`,
    "",
    `Reference: ${booking.reference}`,
    `Service: ${booking.serviceName}`,
    `When: ${formatDayLong(when)} at ${booking.startLabel}`,
    `Price: ${quoted.usd}${quoted.suffix} (${quoted.xaf}${quoted.suffix})`,
    ...(booking.hasHosting ? [`I already have hosting and a domain.`] : []),
    `Name: ${booking.customer.name}`,
    `Phone: ${booking.customer.phone}`,
    ...(booking.notes ? ["", `Details: ${booking.notes}`] : []),
  ];
  const whatsappHref = `https://wa.me/${owner.phoneHref.replace(/\D/g, "")}?text=${encodeURIComponent(
    lines.join("\n"),
  )}`;

  return (
    <div className="px-5 pb-24 pt-36 sm:px-8 sm:pt-44">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
        >
          <Check size={32} strokeWidth={2.5} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-7 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl"
        >
          Your consultation is booked
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="mx-auto mt-3 max-w-md text-ink-600"
        >
          A confirmation is on its way to{" "}
          <span className="font-medium text-ink-900">{booking.customer.email}</span>. I will call
          you on {booking.customer.phone} at the agreed time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-9 overflow-hidden rounded-2xl border border-line bg-white text-left shadow-[0_1px_2px_rgb(15_23_42/0.04)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-canvas px-6 py-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
                Reference
              </p>
              <p className="font-display text-2xl font-bold tracking-wide text-ink-900">
                {booking.reference}
              </p>
            </div>
            <Badge tone="success">
              <Check size={13} />
              Confirmed
            </Badge>
          </div>

          <dl className="grid gap-5 p-6 sm:grid-cols-2">
            {[
              {
        Icon: Briefcase,
        k: "Project",
        v: booking.serviceName,
        s: `Delivery ${booking.timeline}`,
      },
      {
        Icon: Wallet,
        k: booking.hasHosting ? "Your price" : "Estimate from",
        v: `${quoted.usd}${quoted.suffix}`,
        s: quoted.xaf ? `${quoted.xaf}${quoted.suffix}` : null,
      },
              { Icon: CalendarDays, k: "Date", v: formatDayLong(when) },
              { Icon: Clock, k: "Time", v: `${booking.startLabel} – ${booking.endLabel}` },
              { Icon: Timer, k: "Call length", v: `${booking.duration} minutes` },
              { Icon: User, k: "Your name", v: booking.customer.name, s: booking.customer.company || null },
              { Icon: Phone, k: "I will call", v: booking.customer.phone },
            ].map((row) => (
              <div key={row.k} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <row.Icon size={15} />
                </span>
                <div className="min-w-0">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                    {row.k}
                  </dt>
                  <dd className="truncate text-sm font-semibold text-ink-900">{row.v}</dd>
                  {row.s && <dd className="truncate text-xs text-ink-600">{row.s}</dd>}
                </div>
              </div>
            ))}
          </dl>

          {booking.notes && (
            <div className="flex items-start gap-3 border-t border-line px-6 py-5">
              <MessageSquare size={15} className="mt-0.5 shrink-0 text-brand-600" />
              <p className="text-sm leading-relaxed text-ink-600">{booking.notes}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 border-t border-line bg-canvas px-6 py-4 text-sm">
            <span className="flex items-center gap-2 text-ink-600">
              <ServiceIcon name={booking.icon} size={15} className="text-brand-600" />
              Need me sooner?
            </span>
            <a
              href={owner.phoneHref}
              className="flex items-center gap-1.5 font-semibold text-brand-700 hover:underline"
            >
              <Phone size={14} />
              {owner.phone}
            </a>
            <a
              href={`mailto:${owner.email}`}
              className="flex items-center gap-1.5 break-all font-semibold text-brand-700 hover:underline"
            >
              <Mail size={14} />
              {owner.email}
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Button as={Link} to={`/invoice/${booking.id || booking.reference}`} size="lg">
            <FileText size={18} />
            View & download invoice
          </Button>
          <Button
            as="a"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            className="bg-[#25D366] hover:bg-[#1da851]"
          >
            <MessageCircle size={18} />
            Send to WhatsApp
          </Button>
          <Button as={Link} to="/bookings" size="lg" variant="outline">
            <CalendarCheck size={18} />
            My bookings
          </Button>
          <Button variant="outline" size="lg" onClick={onRebook}>
            Book another project
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
