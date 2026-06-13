import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function CTASection() {
  const { lang, t } = useLanguage();
  return (
    <section className="relative px-6 py-28">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-brand p-7 shadow-glow sm:rounded-[2.75rem] sm:p-10 md:p-16">
        <svg
          viewBox="0 0 800 400"
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
          aria-hidden
        >
          <g transform="translate(400 200)" className="animate-spin-slow" style={{ transformOrigin: "center" }}>
            <ellipse cx="0" cy="0" rx="360" ry="120" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
          </g>
          <g transform="translate(400 200) rotate(28)" className="animate-spin-rev" style={{ transformOrigin: "center" }}>
            <ellipse cx="0" cy="0" rx="300" ry="95" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
          </g>
          <g transform="translate(400 200) rotate(-18)" className="animate-spin-slow" style={{ transformOrigin: "center" }}>
            <ellipse cx="0" cy="0" rx="230" ry="70" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
            <circle cx="230" cy="0" r="5" fill="#ffffff" />
          </g>
        </svg>
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/15 blur-3xl" />

        <div className="relative grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-ring" />
              {t("cta_badge")}
            </span>
            <h2 className={`mt-4 text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-6xl ${lang === "bn" ? "leading-[1.45]" : "leading-[1.05]"}`}>
              {t("cta_title")}
            </h2>
            <p className="mt-5 max-w-lg text-white/85">{t("cta_sub")}</p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Button asChild size="xl" className="w-full bg-white text-brand shadow-2xl hover:bg-white/95 md:w-auto">
              <Link to="/appointment">
                {t("cta_btn")} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="w-full border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white md:w-auto"
            >
              <a href="tel:01711102368">
                <Phone className="mr-1 h-4 w-4" /> 01711-102-368
              </a>
            </Button>
            <p className="text-xs text-white/70 md:text-right">{t("cta_location")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
