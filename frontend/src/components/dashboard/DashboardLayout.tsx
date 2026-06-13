import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth, type AppRole } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Wordmark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import {
  CalendarDays, FileText, Activity, UserRound, LayoutDashboard,
  Users, ClipboardList, BarChart3, Settings,
  Stethoscope, LogOut, Home,
} from "lucide-react";

type NavItem = { to: string; label: string; icon: typeof Home };

const ROLE_ICON = { patient: UserRound, doctor: Stethoscope, admin: Stethoscope } as const;

export function DashboardLayout({ role, children, title }: { role: AppRole; children: ReactNode; title?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const { lang, t, toggle } = useLanguage();
  const RoleIcon = ROLE_ICON[role];

  const NAV: Record<AppRole, NavItem[]> = {
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
      { to: "/doctor/users", label: t("dash_manage_users"), icon: UserRound },
      { to: "/doctor/reports", label: t("nav_reports"), icon: BarChart3 },
      { to: "/doctor/settings", label: t("dash_settings"), icon: Settings },
    ],
    admin: [
      { to: "/doctor", label: t("nav_dashboard"), icon: LayoutDashboard },
      { to: "/doctor/appointments", label: t("nav_appointments"), icon: CalendarDays },
      { to: "/doctor/patients", label: t("nav_patients"), icon: Users },
      { to: "/doctor/prescriptions", label: t("nav_prescriptions"), icon: ClipboardList },
      { to: "/doctor/users", label: t("dash_manage_users"), icon: UserRound },
      { to: "/doctor/reports", label: t("nav_reports"), icon: BarChart3 },
      { to: "/doctor/settings", label: t("dash_settings"), icon: Settings },
    ],
  };

  const roleLabel = role === "patient" ? t("dash_patient_role") : t("dash_doctor_role");
  const items = NAV[role];

  async function handleSignOut() {
    await signOut();
    nav({ to: "/", replace: true });
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-border bg-white p-5 md:flex md:flex-col">
          <Link to="/" className="block"><Wordmark /></Link>
          <div className="mt-6 rounded-2xl border border-brand/10 bg-gradient-to-br from-white to-accent/50 p-3">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow">
                <RoleIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold uppercase tracking-wider text-brand">{roleLabel}</div>
                <div className="truncate text-sm font-medium text-ink">{user?.email}</div>
              </div>
            </div>
          </div>
          <nav className="mt-6 flex flex-1 flex-col gap-1">
            {items.map((i) => {
              const active = pathname === i.to || (i.to !== `/${role}` && pathname.startsWith(i.to));
              return (
                <Link key={i.to} to={i.to} className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-accent text-brand" : "text-ink-soft hover:bg-accent/50 hover:text-brand"}`}>
                  <i.icon className="h-4 w-4" /> {i.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/"><Home className="h-3.5 w-3.5" /> {t("dash_back_site")}</Link>
            </Button>
            <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-ink-soft">
              <LogOut className="h-3.5 w-3.5" /> {t("dash_sign_out")}
            </Button>
            <button
              onClick={toggle}
              className="mt-1 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-ink-soft transition hover:border-brand/40 hover:bg-accent hover:text-brand"
            >
              {lang === "en" ? "বাংলায় দেখুন" : "View in English"}
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-30 border-b border-border bg-white/85 px-5 py-3 backdrop-blur md:px-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-brand">
                  {roleLabel} {t("dash_portal")}
                </div>
                <h1 className="font-display text-xl font-bold text-ink md:text-2xl">{title ?? t("nav_dashboard")}</h1>
              </div>
              <div className="flex items-center gap-2 md:hidden">
                <button
                  onClick={toggle}
                  className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-ink-soft hover:text-brand"
                >
                  {lang === "en" ? "বাং" : "EN"}
                </button>
                <Button asChild variant="outline" size="sm"><Link to="/">{t("dash_mobile_site")}</Link></Button>
                <Button onClick={handleSignOut} variant="ghost" size="sm"><LogOut className="h-4 w-4" /></Button>
              </div>
            </div>
            <nav className="mt-3 flex gap-1 overflow-x-auto md:hidden">
              {items.map((i) => {
                const active = pathname === i.to || (i.to !== `/${role}` && pathname.startsWith(i.to));
                return (
                  <Link key={i.to} to={i.to} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${active ? "bg-brand text-white" : "bg-accent text-ink-soft"}`}>
                    {i.label}
                  </Link>
                );
              })}
            </nav>
          </header>
          <main className="flex-1 px-5 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function DashCard({ title, children, action }: { title?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-white p-5 shadow-soft md:p-6">
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-soft">{label}</div>
      <div className="mt-1 font-display text-3xl font-bold text-gradient-brand">{value}</div>
      {hint && <div className="mt-1 text-xs text-ink-soft">{hint}</div>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: typeof Home; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-accent text-brand">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink-soft">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function RoleGuard({ allow, children }: { allow: AppRole[]; children: ReactNode }) {
  const { loading, primaryRole, roles } = useAuth();
  if (loading) return null;
  const granted = roles.some((r) => allow.includes(r));
  if (!granted) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-4">
        <div className="max-w-md rounded-3xl border border-border bg-white p-8 text-center shadow-card">
          <h2 className="font-display text-2xl font-bold text-ink">Access restricted</h2>
          <p className="mt-2 text-sm text-ink-soft">
            This area is for {allow.join(" / ")} accounts. Your account is <strong>{primaryRole ?? "unassigned"}</strong>.
          </p>
          <Link to="/dashboard" className="mt-5 inline-block rounded-full bg-gradient-brand px-5 py-2 text-sm font-semibold text-white shadow-glow">Go to my dashboard</Link>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
