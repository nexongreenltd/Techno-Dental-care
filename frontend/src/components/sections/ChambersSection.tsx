import { MapPin, Phone, Clock, ExternalLink, Navigation, Building2, CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/decor/Reveal";
import { useLanguage } from "@/contexts/LanguageContext";

export const chamberData = {
  name: "Techno Dental Care",
  badge: "Chamber",
  area: "Shewrapara, Mirpur",
  address: "767 Rokeya Sarani (2nd Floor), Near Metro Rail Pillar No. 305, Shewrapara, Mirpur, Dhaka-1216",
  phone: "01711-102-368",
  schedule: [
    { day_en: "Sunday",    day_bn: "রবিবার",    time: "6:00 PM – 9:00 PM" },
    { day_en: "Tuesday",   day_bn: "মঙ্গলবার",  time: "6:00 PM – 9:00 PM" },
    { day_en: "Thursday",  day_bn: "বৃহস্পতিবার", time: "6:00 PM – 9:00 PM" },
  ],
  facilities_en: ["Digital X-ray", "Sterile surgery suite", "Metro Rail accessible", "Family waiting lounge"],
  facilities_bn: ["ডিজিটাল X-রে", "জীবাণুমুক্ত অস্ত্রোপচার কক্ষ", "মেট্রো রেল সংলগ্ন", "পরিবারের জন্য অপেক্ষাকক্ষ"],
  map: "https://maps.app.goo.gl/fRUFa1xfumt1EdV99",
  embed: "https://www.google.com/maps?q=767+Rokeya+Sarani+Shewrapara+Mirpur+Dhaka&output=embed",
};

// For backward compat
export const chamberCards = [chamberData];

export function ChambersSection({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const { t, lang } = useLanguage();
  const c = chamberData;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-surface to-white py-16 md:py-28">
      <div className="pointer-events-none absolute right-0 top-1/3 -z-10 h-[420px] w-[420px] rounded-full bg-brand-soft/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-20 -z-10 h-[360px] w-[360px] rounded-full bg-brand-soft/30 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6">
        {!hideHeader && (
          <Reveal className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-brand">
              <span className="h-px w-8 bg-brand/40" /> {t("cham_eyebrow")}
            </p>
            <h2 className="mt-3 text-balance font-display text-4xl font-bold tracking-tight text-ink md:text-6xl">
              {t("cham_title")} <span className="text-gradient-brand">{t("cham_title_brand")}</span>
            </h2>
            <p className="mt-5 text-lg text-ink-soft">{t("cham_sub")}</p>
          </Reveal>
        )}

        <div className={`${hideHeader ? "" : "mt-14"} grid gap-6 md:grid-cols-1 max-w-2xl mx-auto`}>
          <Reveal>
            <article className="group relative h-full overflow-hidden rounded-3xl border border-border bg-white shadow-soft transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-card">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-soft/30 blur-3xl transition group-hover:bg-brand-soft/70" />
              {/* Map embed */}
              <div className="relative h-64 w-full overflow-hidden border-b border-border bg-accent">
                <iframe
                  title={`Map of ${c.name}`}
                  src={c.embed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full grayscale-[20%] saturate-[1.1] transition duration-700 group-hover:grayscale-0"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/0 via-transparent to-white/30" />
                <span className="absolute left-4 top-4 rounded-full bg-gradient-brand px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-glow">
                  {c.badge} · {c.area}
                </span>
                <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-brand shadow-soft backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-ring" /> {t("cham_accepting")}
                </span>
              </div>

              <div className="relative p-7">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">{c.name}</h3>
                      <div className="text-xs text-ink-soft">{c.area}, Dhaka</div>
                    </div>
                  </div>
                </div>
                <ul className="mt-5 space-y-3 text-sm text-ink-soft">
                  <li className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-bright" />
                    <span>{c.address}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-bright" />
                    <a href={`tel:${c.phone}`} className="font-medium text-ink hover:text-brand">{c.phone}</a>
                  </li>
                </ul>

                {/* Hours grid */}
                <div className="mt-5 rounded-2xl border border-brand/10 bg-surface/70 p-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-brand">
                    <Clock className="h-3.5 w-3.5" /> {t("cham_visiting")}
                  </p>
                  <ul className="mt-2 divide-y divide-border">
                    {c.schedule.map((s) => (
                      <li key={s.day_en} className="flex items-center justify-between py-1.5 text-sm">
                        <span className="font-medium text-ink">{lang === "bn" ? s.day_bn : s.day_en}</span>
                        <span className="text-ink-soft">{s.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Facilities */}
                <ul className="mt-4 grid grid-cols-2 gap-1.5">
                  {(lang === "bn" ? c.facilities_bn : c.facilities_en).map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-ink-soft">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand-bright" /> {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <Button asChild variant="brand" size="sm">
                    <Link to="/appointment">{t("cham_book")} {c.badge}</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href={`tel:${c.phone}`}>
                      <Phone className="h-3.5 w-3.5" /> {t("cham_call")}
                    </a>
                  </Button>
                  <a
                    href={c.map}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-3 py-1.5 text-xs font-semibold text-brand transition hover:border-brand/40"
                  >
                    <Navigation className="h-3.5 w-3.5" /> {t("cham_directions")}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
