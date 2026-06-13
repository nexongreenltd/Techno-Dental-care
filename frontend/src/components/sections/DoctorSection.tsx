import doctor from "@/assets/doctor.asset.json";
import { Award, GraduationCap, Globe2, BadgeCheck, Quote, MapPin, Calendar } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { OrbitField } from "@/components/decor/OrbitField";
import { Reveal } from "@/components/decor/Reveal";
import { useLanguage } from "@/contexts/LanguageContext";

const credentials = ["BDS (Dhaka)", "MPH (Dhaka)", "FICID (USA)", "PGT (BSMMU)", "ADA Member"];

export function DoctorSection({ hideEyebrow = false }: { hideEyebrow?: boolean } = {}) {
  const { lang, t } = useLanguage();

  const training = [
    { icon: GraduationCap, title: t("doc_training_ortho"), note: t("doc_training_ortho_note") },
    { icon: Globe2, title: t("doc_training_cosmetic"), note: t("doc_training_cosmetic_note") },
    { icon: Award, title: t("doc_training_prof"), note: t("doc_training_prof_note") },
    { icon: BadgeCheck, title: t("doc_training_ada"), note: t("doc_training_ada_note") },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface via-white to-surface py-28">
      <OrbitField className="-z-10 opacity-30" />
      <div className="pointer-events-none absolute -right-32 top-20 -z-10 h-[420px] w-[420px] rounded-full bg-brand-soft/40 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-14 md:grid-cols-[1fr_1.05fr] md:items-center">
          {/* Portrait column */}
          <Reveal className="relative">
            <div className="relative mx-auto w-full max-w-md">
              <div className="pointer-events-none absolute -inset-10 -z-10">
                <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-brand/25" />
                <div className="absolute inset-6 animate-spin-rev rounded-full border border-brand-bright/20" />
              </div>
              <div className="absolute -inset-3 -z-10 rounded-[2.5rem] bg-gradient-brand opacity-30 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2.25rem] border border-white/60 bg-white shadow-card">
                <img
                  src={doctor.url}
                  alt="Prof. Dr. Golam Mohammad Pavel"
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-4 glass rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow">
                      <BadgeCheck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-soft">Registration</div>
                      <div className="truncate text-sm font-semibold text-ink">{t("doc_reg")}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -left-6 top-10 hidden rounded-2xl border border-border bg-white p-3 shadow-card md:block">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-soft">{t("doc_experience")}</div>
                <div className="font-display text-2xl font-bold text-ink">{t("doc_experience_val")}</div>
              </div>
              <div className="absolute -right-4 bottom-24 hidden rounded-2xl border border-border bg-white p-3 shadow-card md:block">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-soft">{t("doc_patients")}</div>
                <div className="font-display text-2xl font-bold text-ink">{t("doc_patients_val")}</div>
              </div>
            </div>
          </Reveal>

          {/* Content column */}
          <div>
            <Reveal>
              {!hideEyebrow && (
                <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-brand">
                  <span className="h-px w-8 bg-brand/40" /> {t("doc_eyebrow")}
                </p>
              )}
              <h2 className={`${hideEyebrow ? "" : "mt-3"} text-balance font-display text-4xl font-bold tracking-tight text-ink md:text-5xl ${lang === "bn" ? "leading-[1.45]" : "leading-[1.05]"}`}>
                Prof. Dr. Golam Mohammad <span className="text-gradient-brand">(Pavel)</span>
              </h2>
              <p className="mt-2 text-sm font-medium text-brand">
                BDS · MPH · FICID · PGT · Member of ADA
              </p>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
                {t("doc_bio")}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative mt-7 overflow-hidden rounded-2xl border border-brand/15 bg-gradient-to-br from-white to-accent/40 p-5 shadow-soft">
                <Quote className="absolute right-4 top-4 h-8 w-8 text-brand/15" />
                <p className="relative max-w-lg text-[15px] italic leading-relaxed text-ink">
                  &ldquo;{t("doc_quote")}&rdquo;
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-7 flex flex-wrap gap-2">
                {credentials.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-brand/15 bg-white px-3 py-1.5 text-xs font-semibold text-brand shadow-soft"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </Reveal>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {training.map(({ icon: Icon, title, note }, i) => (
                <Reveal key={title} delay={0.15 + i * 0.05}>
                  <div className="group flex h-full items-start gap-3 rounded-2xl border border-border bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-card">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-xl bg-gradient-brand opacity-0 blur-md transition group-hover:opacity-60" />
                      <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-white">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">{title}</div>
                      <div className="text-xs text-ink-soft">{note}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.35}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Button asChild variant="brand" size="lg">
                  <Link to="/appointment">
                    <Calendar className="mr-1 h-4 w-4" /> {t("doc_cta_book")}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/about">{t("doc_cta_profile")}</Link>
                </Button>
                <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft">
                  <MapPin className="h-3.5 w-3.5 text-brand-bright" /> Shewrapara, Mirpur
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
