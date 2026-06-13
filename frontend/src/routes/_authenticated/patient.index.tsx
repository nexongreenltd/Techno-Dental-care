import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { DashCard, StatCard, EmptyState } from "@/components/dashboard/DashboardLayout";
import { CalendarDays, Plus, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/")({
  component: PatientHome,
});

type Appointment = {
  id: string;
  appointment_date: string;
  time_slot: string;
  status: string;
  service: string | null;
  booking_code: string;
  chamber_name: string;
};

type Stats = {
  upcoming: number;
  past: number;
};

function PatientHome() {
  const { user } = useAuth();
  const today = new Date().toISOString().slice(0, 10);

  const { data: allAppts } = useQuery({
    enabled: !!user,
    queryKey: ["patient-all", user?.id],
    queryFn: () => api.get<Appointment[]>("/api/appointments"),
  });

  const { data: stats } = useQuery({
    enabled: !!user,
    queryKey: ["patient-stats", user?.id],
    queryFn: () => api.get<Stats>("/api/appointments/stats"),
  });

  const upcoming = (allAppts ?? [])
    .filter((a) => a.appointment_date >= today && a.status !== "cancelled")
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Upcoming" value={stats?.upcoming ?? 0} hint="visits scheduled" />
        <StatCard label="Past visits" value={stats?.past ?? 0} hint="completed appointments" />
        <StatCard label="Prescriptions" value={0} hint="coming soon" />
      </div>
      <DashCard
        title="Upcoming appointments"
        action={
          <Link
            to="/appointment"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-3.5 py-1.5 text-xs font-semibold text-white shadow-glow"
          >
            <Plus className="h-3 w-3" /> Book new
          </Link>
        }
      >
        {!upcoming.length ? (
          <EmptyState
            icon={CalendarDays}
            title="No upcoming appointments"
            description="Book a visit at one of our chambers."
            action={
              <Link
                to="/appointment"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-glow"
              >
                <Sparkles className="h-3.5 w-3.5" /> Book appointment
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-border">
            {upcoming.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <div className="font-semibold text-ink">
                    {a.appointment_date} · {a.time_slot}
                  </div>
                  <div className="text-xs text-ink-soft">
                    {a.chamber_name} · {a.service ?? "Consultation"} · {a.booking_code}
                  </div>
                </div>
                <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase text-brand">
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </DashCard>
    </div>
  );
}
