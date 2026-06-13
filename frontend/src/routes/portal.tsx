import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { FileText, CalendarDays, Receipt, User } from "lucide-react";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Patient Portal — Techno Dental" },
      { name: "description", content: "Access your appointments, prescriptions, invoices and treatment history at Techno Dental." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">Patient Portal</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight text-ink md:text-6xl">
          Your dental records, <span className="text-gradient-brand">in one place</span>.
        </h1>
        <p className="mt-4 max-w-2xl text-ink-soft">
          Secure patient login is launching soon. You'll be able to view appointments, download digital prescriptions and invoices, and manage your profile.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: CalendarDays, title: "Appointments" },
            { icon: FileText, title: "Prescriptions" },
            { icon: Receipt, title: "Invoices" },
            { icon: User, title: "Profile" },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-white p-5 shadow-soft">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-sm font-semibold text-ink">{f.title}</div>
              <div className="text-xs text-ink-soft">Available soon</div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Button asChild variant="brand">
            <Link to="/appointment">Book an appointment instead</Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  ),
});