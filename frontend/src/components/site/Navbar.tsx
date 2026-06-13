import { Link } from "@tanstack/react-router";
import { Wordmark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Menu, X, UserRound, ChevronDown, LayoutDashboard, CalendarDays, FileText, Activity, Users, ClipboardList, BarChart3, Settings, LogOut, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth, type AppRole } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, primaryRole, signOut } = useAuth();
  const { t, lang, toggle } = useLanguage();

  const links = [
    { to: "/", label: t("nav_home") },
    { to: "/about", label: t("nav_about") },
    { to: "/services", label: t("nav_services") },
    { to: "/chambers", label: t("nav_chambers") },
    { to: "/gallery", label: t("nav_gallery") },
    { to: "/contact", label: t("nav_contact") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto mt-3 max-w-7xl px-4">
        <div className="glass flex items-center justify-between rounded-2xl px-4 py-2.5 shadow-soft">
          <Link to="/" className="flex items-center">
            <Wordmark />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition hover:bg-accent hover:text-brand"
                activeProps={{ className: "text-brand bg-accent" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              {/* Language toggle */}
              <button
                onClick={toggle}
                className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-brand/40 hover:text-brand"
                title={lang === "en" ? "Switch to Bengali" : "Switch to English"}
              >
                {lang === "en" ? "বাং" : "EN"}
              </button>
              <AccountMenu user={user} role={primaryRole} signOut={signOut} />
              <Button asChild variant="brand" size="sm">
                <Link to="/appointment">{t("nav_book")}</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:hidden">
            {/* Language toggle mobile */}
            <button
              onClick={toggle}
              className="rounded-full border border-border bg-white px-2.5 py-1 text-xs font-semibold text-ink"
            >
              {lang === "en" ? "বাং" : "EN"}
            </button>
            {/* Profile icon */}
            <Link
              to={user && primaryRole ? `/${primaryRole}` : "/auth"}
              search={!user ? { mode: "login", redirect: "/dashboard" } : undefined}
              className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-white text-ink-soft hover:border-brand/40 hover:text-brand"
              aria-label="Account"
            >
              <UserRound className="h-4 w-4" />
            </Link>
            {/* Book button */}
            <Link
              to="/appointment"
              className="inline-flex items-center gap-1 rounded-lg bg-gradient-brand px-3 py-1.5 text-xs font-semibold text-white shadow-glow"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              {t("nav_book")}
            </Link>
            <button
              className="rounded-lg p-2 text-ink"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="glass mt-2 rounded-2xl p-3 md:hidden">
            <div className="flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-accent"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-2 border-t border-border pt-2">
                <MobileAccountLinks user={user} role={primaryRole} onClose={() => setOpen(false)} signOut={signOut} />
              </div>
              <Button asChild variant="brand" className="mt-2">
                <Link to="/appointment" onClick={() => setOpen(false)}>
                  {t("nav_book")}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

type AcctProps = { user: ReturnType<typeof useAuth>["user"]; role: AppRole | null; signOut: () => void };

function useRoleLinks() {
  const { t } = useLanguage();
  const ROLE_LINKS: Record<AppRole, { to: string; label: string; icon: typeof LogIn }[]> = {
    patient: [
      { to: "/patient", label: t("nav_dashboard"), icon: LayoutDashboard },
      { to: "/patient/appointments", label: t("nav_myAppointments"), icon: CalendarDays },
      { to: "/patient/prescriptions", label: t("nav_myPrescriptions"), icon: FileText },
      { to: "/patient/history", label: t("nav_treatmentHistory"), icon: Activity },
      { to: "/patient/profile", label: t("nav_profile"), icon: UserRound },
    ],
    doctor: [
      { to: "/doctor", label: t("nav_dashboard"), icon: LayoutDashboard },
      { to: "/doctor/appointments", label: t("nav_appointments"), icon: CalendarDays },
      { to: "/doctor/patients", label: t("nav_patients"), icon: Users },
      { to: "/doctor/prescriptions", label: t("nav_prescriptions"), icon: ClipboardList },
      { to: "/doctor/reports", label: t("nav_reports"), icon: BarChart3 },
    ],
    admin: [
      { to: "/admin", label: t("nav_dashboard"), icon: LayoutDashboard },
      { to: "/admin/users", label: "Users", icon: Users },
      { to: "/admin/appointments", label: t("nav_appointments"), icon: CalendarDays },
      { to: "/admin/website", label: "Website Management", icon: FileText },
      { to: "/admin/settings", label: "Settings", icon: Settings },
    ],
  };
  return ROLE_LINKS;
}

function AccountMenu({ user, role, signOut }: AcctProps) {
  const { t } = useLanguage();
  const ROLE_LINKS = useRoleLinks();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <UserRound className="h-3.5 w-3.5" /> {t("nav_account")} <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {!user || !role ? (
          <>
            <DropdownMenuLabel className="text-xs text-ink-soft">{t("nav_notSignedIn")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/auth" search={{ mode: "login", redirect: "/dashboard" }}><LogIn className="h-4 w-4" /> {t("nav_login")}</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/auth" search={{ mode: "register", redirect: "/dashboard" }}><UserPlus className="h-4 w-4" /> {t("nav_register")}</Link></DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel className="text-xs text-ink-soft">{t("nav_signedIn")} · {role}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ROLE_LINKS[role].map((l) => (
              <DropdownMenuItem key={l.to} asChild><Link to={l.to}><l.icon className="h-4 w-4" /> {l.label}</Link></DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void signOut()}><LogOut className="h-4 w-4" /> {t("nav_logout")}</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileAccountLinks({ user, role, onClose, signOut }: AcctProps & { onClose: () => void }) {
  const { t } = useLanguage();
  const ROLE_LINKS = useRoleLinks();
  if (!user || !role) {
    return (
      <div className="flex flex-col gap-1">
        <Link to="/auth" search={{ mode: "login", redirect: "/dashboard" }} onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-accent">{t("nav_login")}</Link>
        <Link to="/auth" search={{ mode: "register", redirect: "/dashboard" }} onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-accent">{t("nav_register")}</Link>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink-soft">{role}</div>
      {ROLE_LINKS[role].map((l) => (
        <Link key={l.to} to={l.to} onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-accent">{l.label}</Link>
      ))}
      <button onClick={() => { void signOut(); onClose(); }} className="rounded-lg px-3 py-2 text-left text-sm font-medium text-ink-soft hover:bg-accent">{t("nav_logout")}</button>
    </div>
  );
}
