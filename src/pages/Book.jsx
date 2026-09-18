import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarRange,
  Check,
  FileText,
  Layers,
  Mail,
  MessageCircle,
  MessageSquare,
  Minus,
  Phone,
  Plus,
  Send,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { customService, owner, services } from "../data/services";
import { formatStamp, submittedAt } from "../lib/schedule";
import { NO_BUDGET, budgetOptions, formatXAFAmount, usdFromXAF } from "../lib/pricing";
import {
  itemsOf,
  needsMonths,
  orderTotals,
  priceText,
  rangeUSD,
  rangeXAF,
  snapshot,
} from "../lib/order";
import { whatsappLink } from "../lib/message";
import { useBookings } from "../context/BookingContext";
import StepIndicator from "../components/StepIndicator";
import ServiceCard from "../components/ServiceCard";
import { Badge, Button, Modal, ServiceIcon, cn } from "../components/ui";

const STEPS = [
  { label: "Services", hint: "Pick one or more" },
  { label: "Your details", hint: "How I reach you" },
];

const catalogue = [...services, customService];

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

const validate = (form, needsNotes) => {
  const errors = {};
  if (needsNotes && form.notes.trim().length < 15)
    errors.notes = "You picked “Something else” — tell me a little about what you need.";
  if (form.name.trim().length < 2) errors.name = "Please give me your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
    errors.email = "I need a valid email to send the confirmation.";
  if (form.phone.replace(/\D/g, "").length < 7)
    errors.phone = "Add a phone number so I can reach you.";
  return errors;
};

export default function Book() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { addBooking, toast } = useBookings();

  const [step, setStep] = useState(0);
  // A service linked from elsewhere on the site starts pre-selected — unless it
  // is billed by the month, in which case we ask for the term first.
  const preset = catalogue.find((s) => s.id === params.get("service"));
  const [selected, setSelected] = useState(() => (preset && !preset.askMonths ? [preset] : []));
  const [months, setMonths] = useState({});
  const [asking, setAsking] = useState(() => (preset?.askMonths ? preset : null));
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, confirmed]);

  const items = useMemo(
    () => selected.map((s) => snapshot({ ...s, months: months[s.id] ?? null })),
    [selected, months],
  );
  const totals = useMemo(() => orderTotals(items, form.hasHosting), [items, form.hasHosting]);
  const needsNotes = selected.some((s) => s.custom);

  const isSelected = (service) => selected.some((s) => s.id === service.id);
  const remove = (id) => {
    setSelected((list) => list.filter((s) => s.id !== id));
    setMonths(({ [id]: _dropped, ...rest }) => rest);
  };

  // Monthly services cannot be added without saying for how long.
  const toggle = (service) => {
    if (isSelected(service)) return remove(service.id);
    if (service.askMonths) return setAsking(service);
    setSelected((list) => [...list, service]);
  };

  const confirmMonths = (service, count) => {
    setMonths((m) => ({ ...m, [service.id]: count }));
    setSelected((list) => (list.some((s) => s.id === service.id) ? list : [...list, service]));
    setAsking(null);
  };

  const missingTerm = items.find(needsMonths);
  const canContinue = step === 0 ? selected.length > 0 && !missingTerm : true;

  const submit = () => {
    const found = validate(form, needsNotes);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast("Check the highlighted fields before sending.", "warn");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const booking = addBooking({
        items,
        customer: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company.trim(),
        },
        budget: form.budget,
        notes: form.notes.trim(),
        whatsapp: form.whatsapp,
        hasHosting: form.hasHosting && totals.anyHostingEligible,
      });
      setSubmitting(false);
      setConfirmed(booking);
      toast(`Request sent. Your reference is ${booking.reference}.`);
    }, 700);
  };

  const goNext = () => (step === 0 ? setStep(1) : submit());
  const goBack = () => (step === 0 ? navigate(-1) : setStep(0));

  const reset = () => {
    setConfirmed(null);
    setStep(0);
    setSelected([]);
    setMonths({});
    setForm(emptyForm);
    setErrors({});
  };

  if (confirmed) return <Confirmation booking={confirmed} onRestart={reset} />;

  return (
    <div className="px-5 pb-32 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
            Start a request
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Tell me what you need
          </h1>
          <p className="mt-3 text-ink-600">
            Pick as many services as you like, then leave your details. I will get back to you
            with a fixed quote.
          </p>
        </div>

        <div className="mt-9">
          <StepIndicator steps={STEPS} current={step} onJump={(i) => i === 0 && setStep(0)} />
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
                {step === 0 ? (
                  <StepServices isSelected={isSelected} onToggle={toggle} count={selected.length} />
                ) : (
                  <StepDetails
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    setErrors={setErrors}
                    needsNotes={needsNotes}
                    totals={totals}
                    items={items}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
              <Button variant="outline" onClick={goBack} disabled={submitting}>
                <ArrowLeft size={16} />
                {step === 0 ? "Back" : "Previous"}
              </Button>
              <ContinueButton
                step={step}
                disabled={!canContinue || submitting}
                submitting={submitting}
                onClick={goNext}
              />
            </div>
          </div>

          <Summary
            items={items}
            totals={totals}
            hasHosting={form.hasHosting}
            step={step}
            onRemove={remove}
            onEditMonths={(id) => setAsking(catalogue.find((s) => s.id === id))}
          />
        </div>
      </div>

      <AnimatePresence>
        {asking && (
          <MonthsPrompt
            key={asking.id}
            service={asking}
            initial={months[asking.id] ?? 3}
            editing={isSelected(asking)}
            onConfirm={(count) => confirmMonths(asking, count)}
            onClose={() => setAsking(null)}
          />
        )}
      </AnimatePresence>

      {/* Always-reachable action bar while picking — the list is long on a phone */}
      <AnimatePresence>
        {step === 0 && selected.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-xl"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          >
            <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3.5 sm:px-8">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink-900">
                  {selected.length} service{selected.length === 1 ? "" : "s"} selected
                </p>
                <p className="truncate text-xs text-ink-600">
                  {totals.oneOff.count
                    ? `From ${rangeUSD(totals.oneOff.usd)} · ${rangeXAF(totals.oneOff.xaf)}`
                    : "Quoted after we talk"}
                  {totals.monthly.count ? ` + ${rangeUSD(totals.monthly.usd)}/month` : ""}
                </p>
              </div>
              <Button onClick={() => setStep(1)} disabled={!canContinue} size="lg" className="shrink-0">
                Continue
                <ArrowRight size={18} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ContinueButton({ step, disabled, submitting, onClick }) {
  return (
    <Button onClick={onClick} disabled={disabled} size="lg">
      {submitting ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Sending…
        </>
      ) : step === 1 ? (
        <>
          <Send size={17} />
          Send request
        </>
      ) : (
        <>
          Continue
          <ArrowRight size={18} />
        </>
      )}
    </Button>
  );
}

function StepHeader({ title, text, aside }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight text-ink-900">{title}</h2>
        {text && <p className="mt-1.5 text-sm text-ink-600">{text}</p>}
      </div>
      {aside}
    </div>
  );
}

function StepServices({ isSelected, onToggle, count }) {
  return (
    <>
      <StepHeader
        title="What do you need?"
        text="Tap every service you want — tap again to remove it."
        aside={
          count > 0 && (
            <Badge tone="brand">
              <Check size={12} />
              {count} selected
            </Badge>
          )
        }
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {services.map((s, i) => (
          <ServiceCard
            key={s.id}
            service={s}
            index={i}
            onSelect={onToggle}
            selected={isSelected(s)}
          />
        ))}
      </div>

      <CustomOption selected={isSelected(customService)} onToggle={() => onToggle(customService)} />
    </>
  );
}

/** The escape hatch, shown under the priced services. */
function CustomOption({ selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
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
          {customService.tagline}. Add it alongside anything else and describe it on the next step.
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

function StepDetails({ form, setForm, errors, setErrors, needsNotes, totals, items }) {
  const budgets = budgetOptions(null, totals.ceiling);
  const eligible = items.filter((i) => i.withHostingXAF != null);

  // A change of services or hosting can leave a band that no longer exists selected.
  useEffect(() => {
    if (!budgets.includes(form.budget)) setForm((f) => ({ ...f, budget: NO_BUDGET }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totals.ceiling]);

  const update = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <>
      <StepHeader
        title="How do I reach you?"
        text="I will call or WhatsApp you on the number below with your quote."
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
              totals.ceiling
                ? `Your selection comes to ${rangeUSD(totals.oneOff.usd)}${
                    totals.monthly.count ? ` + ${rangeUSD(totals.monthly.usd)}/month` : ""
                  } — a range is enough.`
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
            label={needsNotes ? "Describe what you need built" : "Tell me about the project"}
            optional={!needsNotes}
            error={errors.notes}
            hint="What it must do, who uses it, any deadline or existing site."
          >
            <textarea
              value={form.notes}
              onChange={update("notes")}
              rows={needsNotes ? 6 : 4}
              placeholder={
                needsNotes
                  ? "Describe it in your own words — what should it do, and who uses it?"
                  : "We sell spare parts and customers keep calling to ask what is in stock…"
              }
              className={cn(inputClass(errors.notes), "resize-none")}
            />
          </Field>
        </div>
      </div>

      {eligible.length > 0 && (
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
              Then you only pay for the build —{" "}
              {eligible.length === 1 ? eligible[0].name : `each of your ${eligible.length} website builds`}{" "}
              becomes{" "}
              <span className="font-semibold text-brand-700">
                {formatXAFAmount(eligible[0].withHostingXAF)}
              </span>{" "}
              ({usdFromXAF(eligible[0].withHostingXAF)}).
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
            Easier for sharing screenshots and files.
          </span>
        </span>
      </label>

      <div className="mt-5 flex items-start gap-3 rounded-lg border border-line bg-canvas p-4">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand-600" />
        <p className="text-xs leading-relaxed text-ink-600">
          Nothing is charged now. You get a fixed written quote before any work starts.
        </p>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

function Summary({ items, totals, hasHosting, step, onRemove, onEditMonths }) {
  return (
    <aside className="lg:sticky lg:top-28">
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-sm font-bold text-ink-900">Your request</h2>
          <Badge tone="neutral">Step {step + 1} of 2</Badge>
        </div>

        <div className="p-5">
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line px-4 py-8 text-center">
              <Layers size={22} className="mx-auto text-ink-400" />
              <p className="mt-2 text-sm font-semibold text-ink-900">Nothing selected yet</p>
              <p className="mt-1 text-xs text-ink-600">Pick one or more services to begin.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              <AnimatePresence initial={false}>
                {items.map((item) => {
                  const text = priceText(item, hasHosting);
                  return (
                    <motion.li
                      key={item.serviceId}
                      layout
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-3 rounded-lg bg-canvas px-3 py-2.5"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600">
                        <ServiceIcon name={item.icon} size={15} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink-900">{item.name}</p>
                        <p className="truncate text-xs text-ink-600">
                          {text ? `${text.usd} · ${text.xaf}` : "Quoted after we talk"}
                        </p>
                        {item.askMonths && (
                          <button
                            type="button"
                            onClick={() => onEditMonths(item.serviceId)}
                            className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 hover:underline"
                          >
                            <CalendarRange size={11} />
                            {item.months
                              ? `${item.months} month${item.months === 1 ? "" : "s"} · change`
                              : "Choose how many months"}
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(item.serviceId)}
                        aria-label={`Remove ${item.name}`}
                        className="shrink-0 rounded-md p-1.5 text-ink-400 transition-colors hover:bg-white hover:text-rose-600"
                      >
                        <X size={14} />
                      </button>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}

          <Totals totals={totals} />

          <p className="mt-4 text-xs leading-relaxed text-ink-400">
            These are starting prices. You get a fixed written quote before any work starts.
          </p>
        </div>
      </div>
    </aside>
  );
}

/** The money block shared by the summary and the confirmation screen. */
function Totals({ totals }) {
  if (!totals.oneOff.count && !totals.monthly.count && !totals.quoted) return null;
  return (
    <div className="mt-4 space-y-3 border-t border-line pt-4 text-sm">
      {totals.oneOff.count > 0 && (
        <div className="flex items-start justify-between gap-3">
          <span className="text-ink-600">{totals.monthly.count ? "One-off total" : "Total from"}</span>
          <span className="text-right">
            <motion.span
              key={totals.oneOff.usd.join("-")}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="block font-display text-lg font-bold text-ink-900"
            >
              {rangeUSD(totals.oneOff.usd)}
            </motion.span>
            <span className="block text-xs font-medium text-ink-600">
              {rangeXAF(totals.oneOff.xaf)}
            </span>
          </span>
        </div>
      )}
      {totals.monthly.count > 0 && (
        <div className="flex items-start justify-between gap-3">
          <span className="text-ink-600">Monthly</span>
          <span className="text-right">
            <span className="block font-display text-base font-bold text-ink-900">
              {rangeUSD(totals.monthly.usd)}/month
            </span>
            <span className="block text-xs font-medium text-ink-600">
              {rangeXAF(totals.monthly.xaf)}/month
            </span>
          </span>
        </div>
      )}
      {totals.quoted > 0 && (
        <p className="text-xs text-ink-600">
          + {totals.quoted} custom item{totals.quoted === 1 ? "" : "s"}, quoted after we talk
        </p>
      )}
      {totals.anyReduced && (
        <p className="rounded-lg bg-brand-50 px-3 py-2 text-xs font-medium text-brand-700">
          Build-only price applied — you are providing the hosting and domain.
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

const TERM_CHOICES = [1, 3, 6, 12];
const MAX_MONTHS = 24;

/** Asks how many months a monthly service is wanted for, before it is added. */
function MonthsPrompt({ service, initial, editing, onConfirm, onClose }) {
  const [count, setCount] = useState(initial);
  const clamp = (n) => Math.min(MAX_MONTHS, Math.max(1, n));
  const text = priceText(snapshot({ ...service, months: count }));
  const perMonth = priceText(snapshot({ ...service, months: null }));

  return (
    <Modal onClose={onClose} maxWidth="max-w-md">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <ServiceIcon name={service.icon} size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-lg font-bold text-ink-900">
              How many months of {service.name}?
            </h2>
            <p className="mt-1 text-sm text-ink-600">
              Billed monthly at {perMonth.usd} ({perMonth.xaf}).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-2 shrink-0 rounded-lg p-2 text-ink-400 transition-colors hover:bg-canvas hover:text-ink-900"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-2">
          {TERM_CHOICES.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setCount(n)}
              className={cn(
                "rounded-xl border px-2 py-3 text-center transition-all",
                count === n
                  ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                  : "border-line bg-white text-ink-700 hover:border-brand-300 hover:bg-brand-50",
              )}
            >
              <span className="block font-display text-lg font-bold leading-none">{n}</span>
              <span className="mt-1 block text-[11px] font-medium opacity-80">
                month{n === 1 ? "" : "s"}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-canvas px-4 py-3">
          <span className="text-sm font-medium text-ink-700">Or set exactly</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCount((c) => clamp(c - 1))}
              disabled={count <= 1}
              aria-label="One month fewer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-ink-700 transition-colors hover:border-brand-300 disabled:opacity-40"
            >
              <Minus size={14} />
            </button>
            <span className="w-14 text-center font-display text-base font-bold text-ink-900">
              {count} mo
            </span>
            <button
              type="button"
              onClick={() => setCount((c) => clamp(c + 1))}
              disabled={count >= MAX_MONTHS}
              aria-label="One month more"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-ink-700 transition-colors hover:border-brand-300 disabled:opacity-40"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <motion.div
          key={count}
          initial={{ opacity: 0.4, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl bg-brand-50 px-4 py-3"
        >
          <p className="text-xs font-medium text-brand-700">{text.detail}</p>
          <p className="mt-1 font-display text-xl font-bold text-ink-900">{text.usd}</p>
          <p className="text-sm font-medium text-ink-600">{text.xaf}</p>
        </motion.div>

        {service.timeline && (
          <p className="mt-3 text-xs text-ink-400">Typical timeframe: {service.timeline}.</p>
        )}

        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={() => onConfirm(count)}>
            <Check size={16} />
            {editing ? "Update" : "Add"} {count} month{count === 1 ? "" : "s"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */

function Confirmation({ booking, onRestart }) {
  const items = itemsOf(booking);
  const totals = orderTotals(items, booking.hasHosting);

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
          Your request is in
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="mx-auto mt-3 max-w-md text-ink-600"
        >
          Send it to me on WhatsApp so it reaches me straight away — I will reply to{" "}
          <span className="font-medium text-ink-900">{booking.customer.phone}</span> with your
          quote.
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
              Received
            </Badge>
          </div>

          <div className="p-6">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
              {items.length} service{items.length === 1 ? "" : "s"} requested
            </p>
            <ul className="mt-3 space-y-2">
              {items.map((item, i) => {
                const text = priceText(item, booking.hasHosting);
                return (
                  <motion.li
                    key={item.serviceId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    className="flex items-center gap-3 rounded-lg bg-canvas px-3 py-2.5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600">
                      <ServiceIcon name={item.icon} size={15} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink-900">
                        {item.name}
                      </span>
                      {text?.detail && (
                        <span className="block truncate text-[11px] text-ink-400">{text.detail}</span>
                      )}
                    </span>
                    <span className="shrink-0 text-right text-xs text-ink-600">
                      {text ? text.usd : "Quoted"}
                    </span>
                  </motion.li>
                );
              })}
            </ul>

            <Totals totals={totals} />

            <dl className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
              {[
                { Icon: User, k: "Name", v: booking.customer.name, s: booking.customer.company },
                { Icon: Phone, k: "Phone", v: booking.customer.phone },
                { Icon: Mail, k: "Email", v: booking.customer.email },
                { Icon: FileText, k: "Sent", v: formatStamp(submittedAt(booking)) },
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
          </div>

          {booking.notes && (
            <div className="flex items-start gap-3 border-t border-line px-6 py-5">
              <MessageSquare size={15} className="mt-0.5 shrink-0 text-brand-600" />
              <p className="text-sm leading-relaxed text-ink-600">{booking.notes}</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Button
            as="a"
            href={whatsappLink(booking)}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            className="bg-[#25D366] hover:bg-[#1da851]"
          >
            <MessageCircle size={18} />
            Send to WhatsApp
          </Button>
          <Button as={Link} to={`/invoice/${booking.id || booking.reference}`} size="lg">
            <FileText size={18} />
            View & download invoice
          </Button>
          <Button as={Link} to="/bookings" size="lg" variant="outline">
            My requests
          </Button>
          <Button variant="outline" size="lg" onClick={onRestart}>
            New request
          </Button>
        </motion.div>

        <p className="mt-6 text-xs text-ink-400">
          Prefer to call? {owner.phone} · {owner.email}
        </p>
      </div>
    </div>
  );
}
