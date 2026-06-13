import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/decor/Reveal";

const galleryPreview = [
  { cat: "Clinic Interior", q: "modern dental clinic interior premium", sig: 1 },
  { cat: "Equipment", q: "advanced dental equipment technology", sig: 2 },
  { cat: "Treatment Rooms", q: "dental treatment room minimalist", sig: 3 },
  { cat: "Patient Care", q: "dentist with patient consultation", sig: 4 },
];

export function GallerySection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface via-white to-surface py-28">
      <div className="pointer-events-none absolute right-0 top-1/3 -z-10 h-[420px] w-[420px] rounded-full bg-brand-soft/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-20 -z-10 h-[360px] w-[360px] rounded-full bg-brand-soft/30 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Reveal className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-brand">
              <span className="h-px w-8 bg-brand/40" /> Gallery
            </p>
            <h2 className="mt-3 text-balance font-display text-4xl font-bold tracking-tight text-ink md:text-6xl">
              A glimpse <span className="text-gradient-brand">inside our clinic</span>.
            </h2>
          </Reveal>
          <Link
            to="/gallery"
            className="group inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-white px-5 py-2.5 text-sm font-semibold text-brand shadow-soft transition hover:border-brand/50 hover:shadow-card"
          >
            View full gallery
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryPreview.map((p, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <figure className="group relative overflow-hidden rounded-2xl border border-border bg-surface">
                <img
                  src={`https://source.unsplash.com/600x600/?${encodeURIComponent(p.q)}&sig=${p.sig}`}
                  alt={p.cat}
                  className="aspect-square w-full object-cover transition group-hover:scale-105"
                  loading="lazy"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-xs font-medium text-white">
                  {p.cat}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
