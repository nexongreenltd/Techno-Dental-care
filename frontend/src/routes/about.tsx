import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DoctorSection } from "@/components/sections/DoctorSection";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { useLanguage } from "@/contexts/LanguageContext";

function AboutPage() {
  const { t } = useLanguage();
  return (
    <SiteLayout>
      <PageHero
        eyebrow={t("page_about_eyebrow")}
        title={<>{t("page_about_title")} <span className="text-gradient-brand">{t("page_about_brand")}</span></>}
        description={t("page_about_desc")}
      />
      <DoctorSection hideEyebrow />
      <CTASection />
    </SiteLayout>
  );
}

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Dr. Golam Mohammad (Pavel) — Techno Dental" },
      { name: "description", content: "Internationally trained dental surgeon, certified implantologist (AIC Korea), aesthetic dentistry trained (Dubai). Head of Pediatric Dentistry, Marks Medical College." },
      { property: "og:title", content: "Meet Dr. Golam Mohammad (Pavel) — Techno Dental" },
      { property: "og:description", content: "An internationally trained dental surgeon combining clinical excellence with a technology-forward patient experience." },
    ],
  }),
  component: AboutPage,
});
