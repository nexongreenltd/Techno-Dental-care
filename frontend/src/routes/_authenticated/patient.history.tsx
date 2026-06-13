import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { DashCard, EmptyState } from "@/components/dashboard/DashboardLayout";
import { Activity } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/history")({
  component: PatientHistory,
});

type HistoryRow = {
  id: string;
  title: string;
  description: string | null;
  treated_at: string;
  doctor_name: string | null;
};

function PatientHistory() {
  const { user } = useAuth();
  const { data } = useQuery({
    enabled: !!user,
    queryKey: ["patient-history", user?.id],
    queryFn: () => api.get<HistoryRow[]>("/api/users/my-history"),
  });

  return (
    <DashCard title="Treatment history">
      {!data || data.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No treatment records yet"
          description="Your doctor will add treatments here after each visit."
        />
      ) : (
        <ul className="divide-y divide-border">
          {data.map((t) => (
            <li key={t.id} className="py-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-ink">{t.title}</div>
                <span className="text-xs text-ink-soft">{t.treated_at}</span>
              </div>
              {t.doctor_name && (
                <div className="text-xs text-brand">Dr. {t.doctor_name}</div>
              )}
              {t.description && (
                <div className="mt-1 text-sm text-ink-soft">{t.description}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </DashCard>
  );
}
