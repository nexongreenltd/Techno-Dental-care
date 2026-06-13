import { Reveal } from "@/components/decor/Reveal";
import { Cpu, ShieldCheck, HeartHandshake } from "lucide-react";

const stats = [
  { value: "12+", label: "Years of clinical practice" },
  { value: "1,200+", label: "Smiles transformed" },
  { value: "2", label: "Premium chambers in Dhaka" },
  { value: "4.9★", label: "Patient satisfaction rating" },
];

const pillars = [
  {
    icon: Cpu,
    title: "Digital workflow",
    body: "3D scans, digital impressions and CAD planning replace messy molds — every treatment is mapped before we begin.",
  },
  {
    icon: ShieldCheck,
    title: "Certified expertise",
    body: "Implantology from AIC Korea, aesthetic dentistry from Dubai, and orthodontic specialization — under one roof.",
  },
  {
    icon: HeartHandshake,
    title: "Patient-first comfort",
    body: "Sterile protocols, sedation options and a calm clinic environment designed to make every visit feel effortless.",
  },
];

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-white py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/25 to-transparent" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[500px] w-[1000px] -translate-x-1/2 rounded-full bg-brand-soft/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-faint opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-brand">
            <span className="h-px w-8 bg-brand/40" /> Why Techno Dental
          </p>
          <h2 className="mt-3 text-balance font-display text-4xl font-bold tracking-tight text-ink md:text-6xl">
            A clinic engineered around{" "}
            <span className="text-gradient-brand">precision &amp; trust</span>.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05} className="bg-white p-7 transition hover:bg-surface">
              <div className="font-display text-4xl font-bold md:text-5xl">
                <span className="text-gradient-brand">{s.value}</span>
              </div>
              <div className="mt-2 text-sm text-ink-soft">{s.label}</div>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border bg-white p-7 shadow-soft transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-card">
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-soft/0 blur-3xl transition group-hover:bg-brand-soft/70" />
                <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                  <p.icon className="h-5 w-5" />
                </div>
                <div className="relative mt-5 font-display text-xl font-semibold text-ink">{p.title}</div>
                <p className="relative mt-2 text-sm leading-relaxed text-ink-soft">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}