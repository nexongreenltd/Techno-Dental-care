import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function PageHero({
  eyebrow,
  title,
  description,
  ctaLabel = "Book Appointment",
  ctaTo = "/appointment",
  showCta = true,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  ctaLabel?: string;
  ctaTo?: string;
  showCta?: boolean;
}) {
  const { lang } = useLanguage();
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-surface to-white pt-20 pb-12">
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[360px] w-[900px] -translate-x-1/2 rounded-full bg-brand-soft/40 blur-3xl" />
      <div className="bg-grid-faint pointer-events-none absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-brand">
          <span className="h-px w-8 bg-brand/40" /> {eyebrow}
        </p>
        <h1
          className={`mt-3 max-w-3xl text-balance font-display text-5xl font-bold tracking-tight text-ink md:text-7xl ${
            lang === "bn" ? "leading-[1.45]" : "leading-tight"
          }`}
        >
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-soft">{description}</p>
        {showCta && (
          <div className="mt-7">
            <Button asChild variant="brand" size="lg">
              <Link to={ctaTo}>
                {ctaLabel}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
