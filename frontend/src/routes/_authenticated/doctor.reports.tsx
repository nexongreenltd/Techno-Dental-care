import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { StatCard, DashCard } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/_authenticated/doctor/reports")({
  component: DoctorReports,
});

type Stats = {
  today: number;
  week: number;
  month: number;
  upcoming: number;
  total: number;
};

function DoctorReports() {
  const { user } = useAuth();

  const { data } = useQuery({
    enabled: !!user,
    queryKey: ["doc-reports", user?.id],
    queryFn: () => api.get<Stats>("/api/appointments/stats"),
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Today" value={data?.today ?? 0} />
        <StatCard label="This week" value={data?.week ?? 0} />
        <StatCard label="This month" value={data?.month ?? 0} />
      </div>
      <DashCard title="More analytics coming soon">
        <p className="text-sm text-ink-soft">
          Charts for service mix, completion rate and patient growth will land in the next phase.
        </p>
      </DashCard>
    </div>
  );
}
