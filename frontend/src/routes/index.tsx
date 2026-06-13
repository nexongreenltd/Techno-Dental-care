import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/hero/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { DoctorIntro } from "@/components/sections/DoctorIntro";
import { ChambersSection } from "@/components/sections/ChambersSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Techno Dental — Technology Meets Dentistry · Dhaka" },
      { name: "description", content: "Premium dental clinic in Dhaka led by Dr. Golam Mohammad (Pavel). Advanced implants, orthodontics, aesthetic dentistry & online appointment booking." },
      { property: "og:title", content: "Techno Dental — Technology Meets Dentistry" },
      { property: "og:description", content: "Advanced dental care powered by precision, innovation and personalized treatment." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <Hero />
      <TrustStrip />
      <DoctorIntro />
      <ServicesOverview />
      <ChambersSection />
      <GallerySection />
      <FinalCTA />
    </SiteLayout>
  );
}
