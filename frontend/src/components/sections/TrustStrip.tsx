import { ShieldCheck, Atom, Brush, Baby, GraduationCap, Globe2, Sparkles, Award } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "BM&DC Registered" },
  { icon: Atom, label: "Certified Implantologist · AIC Korea" },
  { icon: Brush, label: "Aesthetic Dentistry · Dubai" },
  { icon: GraduationCap, label: "Specialist in Orthodontics" },
  { icon: Baby, label: "Head of Pediatric Dentistry · Marks Medical College" },
  { icon: Globe2, label: "Member of ADA" },
  { icon: Sparkles, label: "Digital Diagnostics & 3D Scans" },
  { icon: Award, label: "FICD (USA) · MPH (DU)" },
];

export function TrustStrip() {
  return (
    <section className="relative border-y border-border bg-white/70 py-5 backdrop-blur">
      <div className="mask-fade-edges relative overflow-hidden">
        <div className="animate-marquee flex w-max gap-12 px-6 text-xs font-medium text-ink-soft md:text-sm">
          {[...items, ...items].map(({ icon: Icon, label }, i) => (
            <span key={i} className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap">
              <Icon className="h-4 w-4 text-brand-bright" />
              {label}
              <span className="ml-12 inline-block h-1 w-1 rounded-full bg-border" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}