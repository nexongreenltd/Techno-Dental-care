import doctor from "@/assets/doctor.asset.json";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/decor/Reveal";
import { Calendar, ArrowRight, ShieldCheck, Award, Users, Stethoscope } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function DoctorIntro() {
  const { t } = useLanguage();
  const highlights = [
    { icon: Award, label: t("doc_experience_val") + " " + t("doc_experience") },
    { icon: Users, label: t("doc_patients_val") + " " + t("doc_patients") },
    { icon: Stethoscope, label: t("doc_training_ortho") },
    { icon: ShieldCheck, label: t("doc_reg").split("·")[0].trim() },
  ];
  return (
    <section className="relative overflow-hidden bg-white py-14 md:py-20">
      <div className="pointer-events-none absolute -right-32 top-10 -z-10 h-[360px] w-[360px] rounded-full bg-brand-soft/30 blur-3xl" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <Reveal className="relative">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-brand opacity-25 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-card">
                <img
                  src={doctor.url}
                  alt="Dr. Golam Mohammad (Pavel)"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-brand">
                <span className="h-px w-8 bg-brand/40" /> {t("doc_eyebrow")}
              </p>
              <h2 className="mt-3 text-balance font-display text-3xl font-bold leading-[1.05] tracking-tight text-ink md:text-5xl">
                Prof. Dr. Golam Mohammad <span className="text-gradient-brand">(Pavel)</span>
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
                {t("doc_intro_bio")}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
                {highlights.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 rounded-xl border border-border bg-white px-3.5 py-2.5 shadow-soft"
                  >
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-brand text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-ink">{label}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button asChild variant="brand" size="lg">
                  <Link to="/about">
                    {t("doc_cta_profile")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/appointment">
                    <Calendar className="mr-1 h-4 w-4" /> {t("doc_cta_book")}
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}