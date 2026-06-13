import { Link } from "@tanstack/react-router";
import { ArrowRight, Stethoscope, Sparkles, Drill, Scissors, Smile, Atom } from "lucide-react";
import { Reveal } from "@/components/decor/Reveal";
import { useLanguage } from "@/contexts/LanguageContext";

export function ServicesOverview() {
  const { t } = useLanguage();

  const overviewServices = [
    { key: "svc_general" as const, icon: Stethoscope },
    { key: "svc_preventive" as const, icon: Sparkles },
    { key: "svc_restorative" as const, icon: Drill },
    { key: "svc_surgery" as const, icon: Scissors },
    { key: "svc_ortho" as const, icon: Smile },
    { key: "svc_implant" as const, icon: Atom },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-surface/60 to-white py-24">
      <div className="pointer-events-none absolute -left-40 top-40 -z-10 h-[360px] w-[360px] rounded-full bg-brand-soft/25 blur-3xl" />
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-brand">
            <span className="h-px w-8 bg-brand/40" /> {t("svc_eyebrow")}
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
            {t("svc_title")} <span className="text-gradient-brand">{t("svc_title_brand")}</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {overviewServices.map(({ key, icon: Icon }, i) => (
            <Reveal key={key} delay={i * 0.04}>
              <Link
                to="/services"
                className="group flex items-center gap-4 rounded-2xl border border-border bg-white px-5 py-5 shadow-soft transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-card"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl bg-gradient-brand opacity-0 blur-md transition group-hover:opacity-60" />
                  <div className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="font-display text-base font-semibold tracking-tight text-ink">
                  {t(key)}
                </h3>
                <ArrowRight className="ml-auto h-4 w-4 text-ink-soft opacity-0 transition group-hover:translate-x-0.5 group-hover:text-brand group-hover:opacity-100" />
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/services"
            className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
          >
            {t("svc_view_all")}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
