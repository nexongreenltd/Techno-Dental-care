import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  listChambers,
  listBookedSlots,
  createBooking,
  type Chamber,
  type BookingPayload,
} from "@/lib/booking.functions";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Check, CalendarDays, MapPin, Clock3, Loader2, PartyPopper,
  ShieldCheck, Phone, Copy, Sparkles, Lock,
} from "lucide-react";
import { useAuth, type DentalUser } from "@/hooks/use-auth";
import { useLanguage, type Lang, type TKey } from "@/contexts/LanguageContext";

function formatSlot(slot: string, lang: Lang): string {
  const [h, m] = slot.split(":").map(Number);
  const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  const min = String(m).padStart(2, "0");
  if (lang === "bn") {
    const period = h < 12 ? "সকাল" : h < 14 ? "দুপুর" : h < 17 ? "বিকাল" : h < 20 ? "সন্ধ্যা" : "রাত";
    return `${period} ${hour12}:${min}`;
  }
  return `${hour12}:${min} ${h < 12 ? "AM" : "PM"}`;
}

function formatHour(hour: number, lang: Lang): string {
  const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  if (lang === "bn") {
    const period = hour < 12 ? "সকাল" : hour < 14 ? "দুপুর" : hour < 17 ? "বিকাল" : hour < 20 ? "সন্ধ্যা" : "রাত";
    return `${period} ${h12}:০০`;
  }
  return `${h12}:00 ${hour < 12 ? "AM" : "PM"}`;
}

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function generateSlots(startHour: number, endHour: number) {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

function nextAvailableDates(days: number[], count = 14) {
  const out: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; out.length < count && i < 60; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (days.includes(d.getDay())) out.push(d);
  }
  return out;
}

export function BookingFlow() {
  const [step, setStep] = useState(0);
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const [chamber, setChamber] = useState<Chamber | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [form, setForm] = useState({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    patientAge: "",
    service: "",
    notes: "",
  });
  const [success, setSuccess] = useState<{
    booking_code: string;
    appointment_date: string;
    time_slot: string;
  } | null>(null);

  const STEPS = [
    t("book_step_chamber"),
    t("book_step_date"),
    t("book_step_time"),
    t("book_step_details"),
    t("book_step_account"),
    t("book_step_confirm"),
  ];

  const chambersQ = useQuery({ queryKey: ["chambers"], queryFn: listChambers });
  const bookedQ = useQuery({
    enabled: !!(chamber && date),
    queryKey: ["booked", chamber?.id, date],
    queryFn: () => listBookedSlots({ chamberId: chamber!.id, date: date! }),
  });
  const mutation = useMutation({
    mutationFn: (payload: BookingPayload) => createBooking(payload),
    onSuccess: (row) => setSuccess(row),
  });

  function buildPayload(): BookingPayload {
    return {
      chamberId: chamber!.id,
      date: date!,
      timeSlot: slot!,
      patientName: form.patientName,
      patientPhone: form.patientPhone,
      patientEmail: form.patientEmail || undefined,
      patientAge: form.patientAge ? Number(form.patientAge) : undefined,
      service: form.service || undefined,
      notes: form.notes || undefined,
    };
  }

  const todayISO = toISODate(new Date());
  const availableDates = useMemo(() => {
    if (!chamber) return [];
    return nextAvailableDates(chamber.available_days, 14).filter((d) => {
      const iso = toISODate(d);
      if (iso !== todayISO) return true;
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      return nowMinutes < (chamber.end_hour - 1) * 60 + 30;
    });
  }, [chamber, todayISO]);

  const allSlots = useMemo(
    () => (chamber ? generateSlots(chamber.start_hour, chamber.end_hour) : []),
    [chamber],
  );

  useEffect(() => { setDate(null); setSlot(null); }, [chamber?.id]);
  useEffect(() => { setSlot(null); }, [date]);

  if (success) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-border bg-white p-8 text-center shadow-card md:p-10">
        <div className="pointer-events-none absolute -top-20 left-1/2 -z-0 h-48 w-[600px] -translate-x-1/2 rounded-full bg-brand-soft/50 blur-3xl" />
        <div className="relative">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
            <PartyPopper className="h-7 w-7" />
          </div>
          <h3 className="mt-5 font-display text-2xl font-bold text-ink md:text-3xl">{t("book_success_title")}</h3>
          <p className="mt-2 text-ink-soft">{t("book_success_sub")}</p>
          <div className="mx-auto mt-6 max-w-md overflow-hidden rounded-2xl border border-brand/15 bg-gradient-to-br from-white to-accent/40 text-left shadow-soft">
            <div className="flex items-center justify-between border-b border-brand/10 bg-white/60 px-5 py-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-soft">{t("book_code_label")}</div>
                <div className="font-display text-2xl font-bold text-gradient-brand">{success.booking_code}</div>
              </div>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(success.booking_code)}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-brand transition hover:border-brand/40"
              >
                <Copy className="h-3.5 w-3.5" /> {t("book_copy")}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 p-5 text-sm">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-soft">{t("book_date_label")}</div>
                <div className="mt-0.5 font-medium text-ink">{success.appointment_date}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-soft">{t("book_time_label")}</div>
                <div className="mt-0.5 font-medium text-ink">{formatSlot(success.time_slot, lang)}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-soft">{t("book_chamber_label_booking")}</div>
                <div className="mt-0.5 font-medium text-ink">{chamber?.name}</div>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-6 grid max-w-md gap-2 sm:grid-cols-2">
            <a
              href={`tel:${chamber?.phone}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-brand transition hover:border-brand/40"
            >
              <Phone className="h-4 w-4" /> {t("book_call_clinic")}
            </a>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-glow hover:brightness-110"
            >
              <Sparkles className="h-4 w-4" /> {t("book_book_another")}
            </button>
          </div>
          <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 text-xs text-ink-soft">
            <ShieldCheck className="h-4 w-4 text-brand-bright" />
            {t("book_encrypted")}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-white p-5 shadow-card md:p-10">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-widest text-brand">
            {lang === "bn"
              ? `ধাপ ${step + 1} ${t("book_step_of")} ${STEPS.length} · ${STEPS[step]}`
              : `Step ${step + 1} ${t("book_step_of")} ${STEPS.length} · ${STEPS[step]}`}
          </span>
          <span className="text-ink-soft">
            {Math.round(((step + 1) / STEPS.length) * 100)}% {t("book_step_complete")}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-accent">
          <div
            className="h-full rounded-full bg-gradient-brand transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        {/* Step pills — 2-col grid on mobile, flex row on md+ */}
        <ol className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] font-semibold uppercase tracking-wider sm:flex sm:flex-wrap sm:items-center sm:gap-2">
          {STEPS.map((s, i) => (
            <li key={s} className="flex items-center gap-1.5 sm:gap-2">
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full transition ${
                  i < step
                    ? "bg-gradient-brand text-white shadow-glow"
                    : i === step
                      ? "bg-white text-brand ring-2 ring-brand/40"
                      : "bg-accent text-ink-soft"
                }`}
              >
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className={i === step ? "text-brand" : "text-ink-soft"}>{s}</span>
              {i < STEPS.length - 1 && <span className="hidden sm:block mx-1 h-px w-5 bg-border" />}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8">
        {/* Step 0 — Chamber */}
        {step === 0 && (
          <div>
            <h3 className="text-xl font-bold text-ink md:text-2xl">{t("book_chamber_title")}</h3>
            <p className="mt-1 text-sm text-ink-soft">{t("book_chamber_sub")}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {chambersQ.isLoading && (
                <div className="flex items-center gap-2 text-sm text-ink-soft col-span-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> {t("book_chamber_loading")}
                </div>
              )}
              {chambersQ.data?.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setChamber(c); setStep(1); }}
                  className={`group rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-card ${
                    chamber?.id === c.id ? "border-brand ring-2 ring-brand/30" : "border-border"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="text-base font-semibold text-ink md:text-lg">{c.name}</h4>
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold uppercase text-brand whitespace-nowrap">
                      {formatHour(c.start_hour, lang)} – {formatHour(c.end_hour, lang)}
                    </span>
                  </div>
                  <p className="mt-2 flex items-start gap-2 text-sm text-ink-soft">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-bright" />
                    {c.address}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1 — Date */}
        {step === 1 && chamber && (
          <div>
            <h3 className="text-xl font-bold text-ink md:text-2xl">{t("book_date_title")}</h3>
            <p className="mt-1 text-sm text-ink-soft">{t("book_date_sub")} {chamber.name}</p>
            <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {availableDates.map((d) => {
                const iso = toISODate(d);
                const selected = date === iso;
                const locale = lang === "bn" ? "bn-BD" : undefined;
                return (
                  <button
                    key={iso}
                    onClick={() => { setDate(iso); setStep(2); }}
                    className={`rounded-xl border p-2.5 text-center transition hover:border-brand md:p-3 ${
                      selected ? "border-brand bg-accent" : "border-border bg-white"
                    }`}
                  >
                    <div className="text-[10px] uppercase text-ink-soft">
                      {d.toLocaleDateString(locale, { weekday: "short" })}
                    </div>
                    <div className="mt-1 text-lg font-bold text-ink md:text-xl">{d.getDate()}</div>
                    <div className="text-[10px] text-ink-soft">
                      {d.toLocaleDateString(locale, { month: "short" })}
                    </div>
                  </button>
                );
              })}
            </div>
            <BackButton label={t("book_back")} onClick={() => setStep(0)} />
          </div>
        )}

        {/* Step 2 — Time slot */}
        {step === 2 && chamber && date && (
          <div>
            <h3 className="text-xl font-bold text-ink md:text-2xl">{t("book_time_title")}</h3>
            <p className="mt-1 text-sm text-ink-soft">
              {t("book_time_sub")} · {formatHour(chamber.start_hour, lang)} – {formatHour(chamber.end_hour, lang)}
            </p>
            {bookedQ.isLoading ? (
              <div className="mt-6 flex items-center gap-2 text-sm text-ink-soft">
                <Loader2 className="h-4 w-4 animate-spin" /> {t("book_time_checking")}
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {allSlots.map((s) => {
                  const taken = (bookedQ.data ?? []).includes(s);
                  const isPast = (() => {
                    if (date !== todayISO) return false;
                    const [h, m] = s.split(":").map(Number);
                    const now = new Date();
                    return h * 60 + m <= now.getHours() * 60 + now.getMinutes();
                  })();
                  const disabled = taken || isPast;
                  const selected = slot === s;
                  return (
                    <button
                      key={s}
                      disabled={disabled}
                      onClick={() => { setSlot(s); setStep(3); }}
                      className={`rounded-xl border px-2 py-3 text-sm font-medium transition ${
                        disabled
                          ? "cursor-not-allowed border-border bg-surface text-ink-soft/60 line-through"
                          : selected
                            ? "border-brand bg-accent text-brand"
                            : "border-border bg-white text-ink hover:border-brand"
                      }`}
                    >
                      {formatSlot(s, lang)}
                    </button>
                  );
                })}
              </div>
            )}
            <BackButton label={t("book_back")} onClick={() => setStep(1)} />
          </div>
        )}

        {/* Step 3 — Details */}
        {step === 3 && chamber && date && slot && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(4); }}>
            <h3 className="text-xl font-bold text-ink md:text-2xl">{t("book_details_title")}</h3>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-brand">
                <MapPin className="h-3.5 w-3.5" /> {chamber.name}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-brand">
                <CalendarDays className="h-3.5 w-3.5" /> {date}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-brand">
                <Clock3 className="h-3.5 w-3.5" /> {formatSlot(slot, lang)}
              </span>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label={t("book_field_name")} required>
                <Input required value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} placeholder="e.g. Rahim Uddin" />
              </Field>
              <Field label={t("book_field_phone")} required>
                <Input required value={form.patientPhone} onChange={(e) => setForm({ ...form, patientPhone: e.target.value })} placeholder="01XXXXXXXXX" />
              </Field>
              <Field label={t("book_field_age")}>
                <Input type="number" value={form.patientAge} onChange={(e) => setForm({ ...form, patientAge: e.target.value })} placeholder="e.g. 28" />
              </Field>
              <Field label={t("book_field_email_opt")}>
                <Input type="email" value={form.patientEmail} onChange={(e) => setForm({ ...form, patientEmail: e.target.value })} />
              </Field>
              <Field label={t("book_field_service")} className="md:col-span-2">
                <Input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} placeholder="e.g. Consultation, Scaling, Implant" />
              </Field>
              <Field label={t("book_field_notes")} className="md:col-span-2">
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
              </Field>
            </div>
            {mutation.error && <p className="mt-3 text-sm text-destructive">{(mutation.error as Error).message}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button type="submit" variant="brand" size="lg">{t("book_continue")}</Button>
              <Button type="button" variant="ghost" onClick={() => setStep(2)}>{t("book_back")}</Button>
            </div>
          </form>
        )}

        {/* Step 4 — Account */}
        {step === 4 && chamber && date && slot && (
          <AccountStep
            user={user}
            lang={lang}
            t={t}
            onContinue={() => { mutation.mutate(buildPayload()); setStep(5); }}
            mutationPending={mutation.isPending}
            mutationError={mutation.error as Error | null}
            onBack={() => setStep(3)}
          />
        )}

        {/* Step 5 — Confirming */}
        {step === 5 && (
          <div className="flex flex-col items-center justify-center py-10">
            {mutation.isPending && (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-brand" />
                <p className="mt-3 text-sm text-ink-soft">{t("book_confirming")}</p>
              </>
            )}
            {mutation.error && (
              <>
                <p className="text-sm text-destructive">{(mutation.error as Error).message}</p>
                <Button className="mt-3" variant="outline" onClick={() => setStep(4)}>{t("book_back")}</Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AccountStep({
  user, lang, t, onContinue, mutationPending, mutationError, onBack,
}: {
  user: DentalUser | null;
  lang: Lang;
  t: (k: TKey) => string;
  onContinue: () => void;
  mutationPending: boolean;
  mutationError: Error | null;
  onBack: () => void;
}) {
  const { signIn } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { if (user) onContinue(); }, [user]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const result =
        tab === "login"
          ? await api.post<{ token: string; user: DentalUser }>("/api/auth/login", { identifier, password })
          : await api.post<{ token: string; user: DentalUser }>("/api/auth/register", {
              email, password, full_name: fullName, phone: phone || undefined,
            });
      signIn(result.token, result.user);
    } catch (error: unknown) {
      setErr(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  if (user) {
    return (
      <div className="flex items-center gap-2 text-sm text-ink-soft">
        <Loader2 className="h-4 w-4 animate-spin" /> {t("book_confirming_as")} {user.email}…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-brand">
        <Lock className="h-3.5 w-3.5" /> {t("book_account_badge")}
      </div>
      <h3 className="text-xl font-bold text-ink md:text-2xl">{t("book_account_title")}</h3>
      <p className="mt-1 text-sm text-ink-soft">{t("book_account_sub")}</p>

      <div className="mt-5 grid grid-cols-2 rounded-xl bg-accent p-1 text-sm font-semibold">
        <button
          onClick={() => setTab("login")}
          className={`rounded-lg py-2 ${tab === "login" ? "bg-white text-brand shadow-soft" : "text-ink-soft"}`}
        >
          {t("book_tab_signin")}
        </button>
        <button
          onClick={() => setTab("register")}
          className={`rounded-lg py-2 ${tab === "register" ? "bg-white text-brand shadow-soft" : "text-ink-soft"}`}
        >
          {t("book_tab_register")}
        </button>
      </div>

      <form onSubmit={submit} className="mt-5 space-y-3">
        {tab === "register" && (
          <>
            <div>
              <Label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-soft">{t("book_field_fullname")}</Label>
              <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-soft">{t("book_field_phone_reg")}</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" />
            </div>
          </>
        )}
        <div>
          <Label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-soft">
            {tab === "login" ? t("book_field_identifier") : t("book_field_email_reg")}
          </Label>
          {tab === "login" ? (
            <Input required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="you@example.com or 01XXXXXXXXX" autoComplete="username" />
          ) : (
            <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          )}
        </div>
        <div>
          <Label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-soft">{t("book_field_password")}</Label>
          <Input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {err && <p className="text-sm text-destructive">{err}</p>}
        {mutationError && <p className="text-sm text-destructive">{mutationError.message}</p>}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" variant="brand" size="lg" disabled={busy || mutationPending}>
            {(busy || mutationPending) && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            {tab === "login" ? t("book_btn_signin") : t("book_btn_register")}
          </Button>
          <Button type="button" variant="ghost" onClick={onBack}>{t("book_back")}</Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, children, className = "" }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-soft">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="mt-6 text-sm font-medium text-ink-soft hover:text-brand">
      {label}
    </button>
  );
}
