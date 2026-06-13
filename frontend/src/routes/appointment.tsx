import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { useLanguage } from "@/contexts/LanguageContext";

function AppointmentPage() {
  const { lang, t } = useLanguage();
  return (
    <SiteLayout>
      <section className="bg-aurora relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 pt-16 pb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">{t("book_eyebrow")}</p>
          <h1 className={`mt-2 font-bold tracking-tight text-ink text-5xl md:text-6xl ${lang === "bn" ? "leading-[1.45]" : "leading-tight"}`}>
            {t("book_title")} <span className="text-gradient-brand">{t("book_title_brand")}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-soft">{t("book_sub")}</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <BookingFlow />
      </section>
    </SiteLayout>
  );
}

export const Route = createFileRoute("/appointment")({
  head: () => ({
    meta: [
      { title: "Book an Appointment — Techno Dental" },
      { name: "description", content: "Book your dental appointment online with Dr. Golam Mohammad (Pavel) at Techno Dental — real-time slots." },
      { property: "og:title", content: "Book an Appointment — Techno Dental" },
      { property: "og:description", content: "Real-time slots. Confirmed instantly. No email required." },
    ],
  }),
  component: AppointmentPage,
});
