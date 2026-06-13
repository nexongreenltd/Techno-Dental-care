import { Link } from "@tanstack/react-router";
import { services } from "@/lib/services";
import type { ServiceCategory } from "@/lib/services";
import { ArrowRight, Check, AlertCircle } from "lucide-react";
import { Reveal } from "@/components/decor/Reveal";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Lang } from "@/contexts/LanguageContext";

export function ServicesSection({ compact = false, hideHeader = false }: { compact?: boolean; hideHeader?: boolean }) {
  const { lang, t } = useLanguage();
  const list = compact ? services.slice(0, 6) : services;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-surface to-white py-16 md:py-28">
      <div className="pointer-events-none absolute -left-40 top-40 -z-10 h-[400px] w-[400px] rounded-full bg-brand-soft/30 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-40 -z-10 h-[400px] w-[400px] rounded-full bg-brand-soft/20 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6">
        {!hideHeader && (
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <Reveal className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-brand">
                <span className="h-px w-8 bg-brand/40" /> {t("svc_section_eyebrow")}
              </p>
              <h2 className="mt-3 text-balance font-display text-4xl font-bold tracking-tight text-ink md:text-6xl">
                {t("svc_section_title")} <span className="text-gradient-brand">{t("svc_section_brand")}</span>
              </h2>
              <p className="mt-5 text-lg text-ink-soft">{t("svc_section_desc")}</p>
            </Reveal>
            {compact && (
              <Link
                to="/services"
                className="group inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-white px-4 py-2 text-sm font-semibold text-brand shadow-soft transition hover:border-brand/50 hover:shadow-card"
              >
                {t("svc_view_all_link")}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        )}

        <div className={`${hideHeader ? "" : "mt-14"} grid gap-6 sm:grid-cols-2 lg:grid-cols-3`}>
          {list.map((svc, i) => (
            <Reveal key={svc.slug} delay={i * 0.05}>
              <ServiceCard svc={svc} compact={compact} lang={lang} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  svc,
  compact,
  lang,
}: {
  svc: ServiceCategory;
  compact: boolean;
  lang: Lang;
}) {
  const { t } = useLanguage();
  const title = lang === "bn" ? svc.title_bn : svc.title;
  const description = lang === "bn" ? svc.description_bn : svc.description;
  const benefits = lang === "bn" ? svc.benefits_bn : svc.benefits;
  const symptoms = lang === "bn" ? svc.symptoms_bn : svc.symptoms;
  const cta = lang === "bn" ? svc.cta_bn : svc.cta;
  const firstItem = lang === "bn" ? svc.items_bn[0] : svc.items[0];
  const { icon: Icon } = svc;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-[1px] shadow-soft transition hover:-translate-y-1 hover:shadow-card">
      <span className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-brand/25 via-border to-brand-bright/30 opacity-60 transition group-hover:opacity-100" />
      <div className="relative flex h-full flex-col rounded-[calc(1.5rem-1px)] bg-white p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand-soft/0 blur-3xl transition duration-500 group-hover:bg-brand-soft/70" />

        <div className="relative flex items-start justify-between">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-brand opacity-25 blur-lg transition group-hover:opacity-70" />
            <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <span className="rounded-full border border-brand/15 bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand">
            {firstItem}
          </span>
        </div>

        <h3 className="relative mt-6 font-display text-[22px] font-semibold tracking-tight text-ink">
          {title}
        </h3>
        <p className="relative mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>

        {!compact && (
          <div className="relative mt-5 rounded-2xl border border-brand/10 bg-surface/70 p-4">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-brand">
              <AlertCircle className="h-3.5 w-3.5" /> {t("svc_common_reasons")}
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {symptoms.map((s) => (
                <li key={s} className="rounded-full border border-border bg-white px-2.5 py-1 text-xs text-ink-soft">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        <ul className="relative mt-5 space-y-1.5">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-ink">
              <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-soft/60 text-brand">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              {b}
            </li>
          ))}
        </ul>

        <div className="relative mt-auto flex items-center justify-between pt-6">
          <Link
            to="/appointment"
            className="group/cta inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-4 py-2 text-xs font-semibold text-white shadow-glow transition hover:brightness-110"
          >
            {cta}
            <ArrowRight className="h-3.5 w-3.5 transition group-hover/cta:translate-x-0.5" />
          </Link>
          {compact && (
            <Link to="/services" className="text-xs font-semibold text-ink-soft hover:text-brand">
              {t("svc_learn_more")}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
