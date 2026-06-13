import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ServicesSection } from "@/components/sections/Services";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { useLanguage } from "@/contexts/LanguageContext";

function ServicesPage() {
  const { t } = useLanguage();
  return (
    <SiteLayout>
      <PageHero
        eyebrow={t("page_svc_eyebrow")}
        title={<>{t("page_svc_title")} <span className="text-gradient-brand">{t("page_svc_brand")}</span></>}
        description={t("page_svc_desc")}
      />
      <ServicesSection hideHeader />
      <CTASection />
    </SiteLayout>
  );
}

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Dental Services — Techno Dental" },
      { name: "description", content: "General, preventive, restorative, orthodontics, implants, cosmetic and pediatric dentistry at Techno Dental, Dhaka." },
      { property: "og:title", content: "Dental Services — Techno Dental" },
      { property: "og:description", content: "From routine checkups to certified implants and smile design — every treatment, engineered around you." },
    ],
  }),
  component: ServicesPage,
});
