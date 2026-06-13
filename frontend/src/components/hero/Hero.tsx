import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ToothScene } from "./ToothScene";
import { ShieldCheck, FileText, CalendarDays, Sparkles, Star, Stethoscope, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Hero() {
  const { lang, t } = useLanguage();

  const badges = [
    { icon: FileText,    label: t("hero_badge_prescriptions") },
    { icon: CalendarDays, label: t("hero_badge_booking") },
    { icon: Sparkles,   label: t("hero_badge_implant") },
    { icon: ShieldCheck, label: t("hero_badge_bmdc") },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-surface to-white">
      <div className="bg-aurora pointer-events-none absolute inset-0 -z-10 opacity-90" />
      <div className="bg-grid-faint pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-brand-soft/50 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white" />

      <div className="mx-auto grid max-w-7xl gap-8 px-6 pt-10 pb-16 md:grid-cols-[1.05fr_1fr] md:gap-10 md:pt-20 md:pb-32">
        <div className="animate-fade-up flex flex-col justify-center">
          <Link
            to="/about"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-brand/15 bg-white/80 py-1 pl-1 pr-3 text-xs font-medium text-ink shadow-soft backdrop-blur transition hover:border-brand/40"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse-ring" />
              {t("hero_new")}
            </span>
            <span className="text-ink-soft">{t("hero_badge")}</span>
            <ArrowRight className="h-3.5 w-3.5 text-brand transition group-hover:translate-x-0.5" />
          </Link>

          <h1 className={`mt-6 text-balance font-display text-[32px] font-bold tracking-[-0.03em] text-ink sm:text-[44px] sm:text-6xl lg:text-[80px] ${lang === "bn" ? "leading-[1.45]" : "leading-[1.02]"}`}>
            {t("hero_title_1")}<br/>{t("hero_title_2")} <span className="relative inline-block">
              <span className="text-gradient-brand">{t("hero_title_3")}</span>
              <svg className="absolute -bottom-2 left-0 h-3 w-full" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden>
                <path d="M2 8 Q 75 1, 150 7 T 298 5" stroke="url(#hu)" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <defs><linearGradient id="hu" x1="0" x2="1"><stop offset="0%" stopColor="#0D63D6"/><stop offset="100%" stopColor="#18B8F0"/></linearGradient></defs>
              </svg>
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-ink-soft md:text-xl">
            {t("hero_sub")}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild variant="brand" size="xl">
              <Link to="/appointment">
                {t("hero_cta_book")}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/services">{t("hero_cta_explore")}</Link>
            </Button>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-2 md:max-w-lg">
            {badges.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="group flex items-center gap-2.5 rounded-xl border border-border bg-white/70 px-3 py-2.5 text-sm text-ink backdrop-blur transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-soft"
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-brand text-white shadow-glow transition group-hover:scale-110">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="font-medium">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-4 flex items-center justify-center overflow-hidden rounded-3xl md:mt-0 md:overflow-visible md:rounded-none">
          <div className="relative w-full max-w-[320px] sm:max-w-[480px] lg:max-w-[560px]">
            <ToothScene />

            <FloatingCard
              className="left-[-6%] top-[12%] hidden sm:flex"
              icon={<Star className="h-4 w-4 text-amber-500" />}
              title={t("hero_stat_satisfaction")}
              value={t("hero_stat_satisfaction_val")}
              hint={t("hero_stat_satisfaction_hint")}
              delay={0.2}
            />
            <FloatingCard
              className="right-[-4%] top-[6%] hidden sm:flex"
              icon={<CalendarDays className="h-4 w-4 text-brand" />}
              title={t("hero_stat_booking")}
              value={t("hero_stat_booking_val")}
              hint="Shewrapara"
              delay={0.8}
            />
            <FloatingCard
              className="left-[-8%] bottom-[10%]"
              icon={<FileText className="h-4 w-4 text-brand-bright" />}
              title={t("hero_stat_rx")}
              value={t("hero_stat_rx_val")}
              hint={t("hero_stat_rx_hint")}
              delay={1.2}
            />
            <FloatingCard
              className="right-[-6%] bottom-[6%] hidden sm:flex"
              icon={<Stethoscope className="h-4 w-4 text-brand" />}
              title={t("hero_stat_tech")}
              value={t("hero_stat_tech_val")}
              hint={t("hero_stat_tech_hint")}
              delay={1.6}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingCard({
  className = "",
  icon,
  title,
  value,
  hint,
  delay = 0,
}: {
  className?: string;
  icon: React.ReactNode;
  title: string;
  value: string;
  hint: string;
  delay?: number;
}) {
  return (
    <div
      className={`glass animate-drift-soft absolute flex w-[180px] items-start gap-3 rounded-2xl p-3 shadow-card ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white shadow-soft">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-medium uppercase tracking-wide text-ink-soft">
          {title}
        </div>
        <div className="truncate text-sm font-semibold text-ink">{value}</div>
        <div className="truncate text-[11px] text-ink-soft">{hint}</div>
      </div>
    </div>
  );
}
