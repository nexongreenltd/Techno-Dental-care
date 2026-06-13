import { Link } from "@tanstack/react-router";
import { Wordmark } from "@/components/brand/Logo";
import { Phone, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Wordmark />
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              {t("foot_tagline")}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink">{t("foot_clinic")}</h4>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              <li><Link to="/about" className="hover:text-brand">{t("foot_about")}</Link></li>
              <li><Link to="/services" className="hover:text-brand">{t("foot_services")}</Link></li>
              <li><Link to="/chambers" className="hover:text-brand">{t("foot_chambers")}</Link></li>
              <li><Link to="/gallery" className="hover:text-brand">{t("foot_gallery")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink">{t("foot_patients")}</h4>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              <li><Link to="/appointment" className="hover:text-brand">{t("foot_book")}</Link></li>
              <li><Link to="/portal" className="hover:text-brand">{t("foot_portal")}</Link></li>
              <li><Link to="/blog" className="hover:text-brand">{t("foot_blog")}</Link></li>
              <li><Link to="/contact" className="hover:text-brand">{t("foot_contact")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink">{t("foot_reach")}</h4>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-brand-bright" />
                <a href="tel:01711102368" className="hover:text-brand">01711-102-368</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-brand-bright" />
                767 Rokeya Sarani (2nd Floor), Shewrapara, Mirpur, Dhaka-1216
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 text-brand-bright" />
                {t("foot_hours")}
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-ink-soft md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Techno Dental Care. {t("foot_rights")}</p>
          <p>BMDC Reg. No: 2073 · Dhaka, Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}
