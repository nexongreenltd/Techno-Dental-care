import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/sections/PageHero";
import { useLanguage } from "@/contexts/LanguageContext";

const placeholders = [
  { cat: "Clinic Interior", cat_bn: "ক্লিনিক ইন্টেরিয়র", q: "modern dental clinic interior premium" },
  { cat: "Equipment", cat_bn: "যন্ত্রপাতি", q: "advanced dental equipment technology" },
  { cat: "Treatment Rooms", cat_bn: "চিকিৎসা কক্ষ", q: "dental treatment room minimalist" },
  { cat: "Patient Care", cat_bn: "রোগীর সেবা", q: "dentist with patient consultation" },
  { cat: "Clinic Interior", cat_bn: "ক্লিনিক ইন্টেরিয়র", q: "luxury healthcare reception lobby" },
  { cat: "Equipment", cat_bn: "যন্ত্রপাতি", q: "digital dental scanner" },
  { cat: "Treatment Rooms", cat_bn: "চিকিৎসা কক্ষ", q: "dental chair professional lighting" },
  { cat: "Patient Care", cat_bn: "রোগীর সেবা", q: "smiling patient at dentist" },
];

function GalleryPage() {
  const { lang, t } = useLanguage();
  return (
    <SiteLayout>
      <PageHero
        eyebrow={t("page_gallery_eyebrow")}
        title={<>{t("page_gallery_title")} <span className="text-gradient-brand">{t("page_gallery_brand")}</span></>}
        description={t("page_gallery_desc")}
        showCta={false}
      />
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {placeholders.map((p, i) => (
            <figure key={i} className="group relative overflow-hidden rounded-2xl border border-border bg-surface">
              <img
                src={`https://source.unsplash.com/600x600/?${encodeURIComponent(p.q)}&sig=${i}`}
                alt={p.cat}
                className="aspect-square w-full object-cover transition group-hover:scale-105"
                loading="lazy"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-xs font-medium text-white">
                {lang === "bn" ? p.cat_bn : p.cat}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Techno Dental" },
      { name: "description", content: "Inside Techno Dental: interiors, equipment, treatment rooms and patient care moments." },
    ],
  }),
  component: GalleryPage,
});
