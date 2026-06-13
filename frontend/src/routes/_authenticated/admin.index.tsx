import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DashCard, StatCard, EmptyState } from "@/components/dashboard/DashboardLayout";
import { CalendarDays } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

type Stats = {
  patients: number;
  all: number;
  upcoming: number;
  recent: {
    id: string;
    appointment_date: string;
    time_slot: string;
    patient_name: string;
    status: string;
    chamber_name: string;
  }[];
};

function AdminHome() {
  const { data } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => api.get<Stats>("/api/appointments/stats"),
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total patients" value={data?.patients ?? 0} />
        <StatCard label="Total appointments" value={data?.all ?? 0} />
        <StatCard label="Upcoming" value={data?.upcoming ?? 0} />
      </div>
      <DashCard title="Recent activity">
        {!data?.recent.length ? (
          <EmptyState
            icon={CalendarDays}
            title="No activity yet"
            description="New bookings will appear here."
          />
        ) : (
          <ul className="divide-y divide-border">
            {data.recent.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <div className="font-semibold text-ink">{a.patient_name}</div>
                  <div className="text-xs text-ink-soft">
                    {a.appointment_date} · {a.time_slot} · {a.chamber_name}
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
