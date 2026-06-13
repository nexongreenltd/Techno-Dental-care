import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ChambersSection } from "@/components/sections/ChambersSection";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { useLanguage } from "@/contexts/LanguageContext";

function ChambersPage() {
  const { t } = useLanguage();
  return (
    <SiteLayout>
      <PageHero
        eyebrow={t("page_chambers_eyebrow")}
        title={<>{t("page_chambers_title")} <span className="text-gradient-brand">{t("page_chambers_brand")}</span></>}
        description={t("page_chambers_desc")}
      />
      <ChambersSection hideHeader />
      <CTASection />
    </SiteLayout>
  );
}

export const Route = createFileRoute("/chambers")({
  head: () => ({
    meta: [
      { title: "Chambers & Locations — Techno Dental" },
      { name: "description", content: "Visit Techno Dental Care at Shewrapara, Mirpur, Dhaka. Find directions, visiting hours and contact numbers." },
      { property: "og:title", content: "Chamber & Location — Techno Dental" },
      { property: "og:description", content: "Techno Dental Care — Shewrapara, Mirpur, Dhaka." },
    ],
  }),
  component: ChambersPage,
});
