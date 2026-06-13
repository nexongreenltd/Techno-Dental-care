import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { DashCard, EmptyState } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { CalendarDays, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/appointments")({
  component: PatientAppointments,
});

type Appointment = {
  id: string;
  appointment_date: string;
  time_slot: string;
  status: string;
  service: string | null;
  booking_code: string;
  notes: string | null;
  chamber_name: string;
  chamber_address: string;
  chamber_phone: string;
};

function PatientAppointments() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: all, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["patient-all", user?.id],
    queryFn: () => api.get<Appointment[]>("/api/appointments"),
  });

  const cancel = useMutation({
    mutationFn: (id: string) => api.patch(`/api/appointments/${id}/cancel`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["patient-all"] }),
  });

  if (isLoading)
    return (
      <div className="flex items-center gap-2 text-sm text-ink-soft">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </div>
    );

  const upcoming = (all ?? []).filter(
    (a) => a.appointment_date >= today && a.status !== "cancelled",
  );
  const past = (all ?? []).filter(
    (a) => a.appointment_date < today || a.status === "cancelled",
  );

  return (
    <div className="space-y-6">
      <DashCard title="Upcoming">
        {upcoming.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No upcoming appointments"
            description="Book a visit when you're ready."
            action={
              <Link
                to="/appointment"
                className="inline-flex rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-glow"
              >
                Book appointment
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-border">
            {upcoming.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <div className="font-semibold text-ink">
                    {a.appointment_date} · {a.time_slot}
                  </div>
                  <div className="text-xs text-ink-soft">
                    {a.chamber_name} · {a.service ?? "Consultation"} · Code {a.booking_code}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase text-brand">
                    {a.status}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={cancel.isPending}
                    onClick={() => cancel.mutate(a.id)}
                  >
                    Cancel
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DashCard>
      <DashCard title="History">
        {past.length === 0 ? (
          <p className="text-sm text-ink-soft">No past appointments yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {past.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <div className="font-semibold text-ink">
                    {a.appointment_date} · {a.time_slot}
                  </div>
                  <div className="text-xs text-ink-soft">
                    {a.chamber_name} · {a.service ?? "Consultation"}
                  </div>
                </div>
                <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase text-ink-soft">
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
