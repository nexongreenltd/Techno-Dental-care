import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Oral Health Blog — Techno Dental" },
      { name: "description", content: "Expert articles on dental care, orthodontics, implants and pediatric dentistry from Techno Dental." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">Blog</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight text-ink md:text-6xl">
          <span className="text-gradient-brand">Coming soon</span>
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          We're writing expert articles on dental care, orthodontics, implants and pediatric dentistry. Check back shortly.
        </p>
      </div>
    </SiteLayout>
  ),
});