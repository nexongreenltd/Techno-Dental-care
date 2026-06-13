import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { DashCard, EmptyState } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/doctor/patients")({
  component: DoctorPatients,
});

type PatientRow = {
  patient_user_id: string | null;
  patient_name: string;
  patient_phone: string;
  appointment_date: string;
};

function DoctorPatients() {
  const { user } = useAuth();
  const [q, setQ] = useState("");

  const { data } = useQuery({
    enabled: !!user,
    queryKey: ["doc-patients", user?.id],
    queryFn: () => api.get<PatientRow[]>("/api/appointments/patients"),
  });

  const filtered = useMemo(
    () =>
      (data ?? []).filter(
        (p) =>
          !q ||
          p.patient_name.toLowerCase().includes(q.toLowerCase()) ||
          p.patient_phone.includes(q),
      ),
    [data, q],
  );

  return (
    <DashCard
      title="My patients"
      action={
        <Input
          className="max-w-xs"
          placeholder="Search name or phone…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      }
    >
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No patients yet"
          description="Patients you've seen will appear here."
        />
      ) : (
        <ul className="divide-y divide-border">
          {filtered.map((p, i) => (
            <li
              key={(p.patient_user_id ?? p.patient_phone) + i}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div>
                <div className="font-semibold text-ink">{p.patient_name}</div>
                <div className="text-xs text-ink-soft">
                  {p.patient_phone} · last visit {p.appointment_date}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashCard>
  );
}
