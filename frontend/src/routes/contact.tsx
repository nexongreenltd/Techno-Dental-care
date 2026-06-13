import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ChambersSection } from "@/components/sections/ChambersSection";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, CalendarDays } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

function ContactPage() {
  const { t } = useLanguage();

  const cards = [
    {
      icon: Phone,
      title: t("contact_call_title"),
      value: "01711-102-368",
      sub: t("contact_clinic"),
      href: "tel:01711102368",
      external: false,
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: t("contact_whatsapp"),
      sub: t("contact_whatsapp_sub"),
      href: "https://wa.me/8801711102368",
      external: true,
    },
    {
      icon: CalendarDays,
      title: t("contact_book_online"),
      value: t("contact_real_time"),
      sub: "Book instantly",
      href: "/appointment",
      external: false,
    },
  ];

  return (
    <SiteLayout>
      <PageHero
        eyebrow={t("page_contact_eyebrow")}
        title={<>{t("page_contact_title")} <span className="text-gradient-brand">{t("page_contact_brand")}</span></>}
        description={t("page_contact_desc")}
        showCta={false}
      />
      <div className="mx-auto max-w-7xl px-6 pb-8">
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((c) => (
            <a
              key={c.href}
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noopener noreferrer" : undefined}
              className="group rounded-3xl border border-border bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-xs uppercase tracking-wide text-ink-soft">{c.title}</div>
              <div className="text-xl font-semibold text-ink">{c.value}</div>
              <div className="text-sm text-ink-soft">{c.sub}</div>
            </a>
          ))}
        </div>
      </div>
      <ChambersSection hideHeader />
      <div className="mx-auto max-w-7xl px-6 pb-16 text-center">
        <Button asChild variant="brand" size="xl">
          <Link to="/appointment">{t("contact_book_btn")}</Link>
        </Button>
      </div>
    </SiteLayout>
  );
}

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Techno Dental" },
      { name: "description", content: "Call, message or visit Techno Dental Care in Shewrapara, Mirpur, Dhaka." },
      { property: "og:title", content: "Contact Techno Dental" },
      { property: "og:description", content: "Talk to our team — by phone, message or in-person." },
    ],
  }),
  component: ContactPage,
});
