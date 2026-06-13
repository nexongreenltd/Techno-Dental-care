import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DashCard, EmptyState } from "@/components/dashboard/DashboardLayout";
import { CalendarDays } from "lucide-react";

export const Route = createFileRoute("/_authenticated/doctor/appointments")({
  component: DoctorAppointments,
});

type Appointment = {
  id: string;
  appointment_date: string;
  time_slot: string;
  status: string;
  patient_name: string;
  patient_phone: string;
  service: string | null;
  chamber_name: string;
  doctor_user_id: string | null;
  doctor_name: string | null;
  booking_code: string;
};

const STATUSES = ["pending", "confirmed", "completed", "cancelled", "no_show", "follow_up"] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-accent text-brand",
  completed: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-600",
  follow_up: "bg-purple-50 text-purple-700",
  no_show: "bg-gray-100 text-gray-500",
};

type FilterType = "all" | "pending" | "confirmed" | "completed" | "cancelled";

function DoctorAppointments() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<FilterType>("all");

  const { data: appts, isLoading } = useQuery({
    queryKey: ["all-appts"],
    queryFn: () => api.get<Appointment[]>("/api/appointments"),
  });

  const update = useMutation({
    mutationFn: (patch: { id: string; status?: string }) => {
      const { id, ...rest } = patch;
      return api.patch(`/api/appointments/${id}`, rest);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["all-appts"] }),
  });

  const filtered = (appts ?? []).filter(
    (a) => filter === "all" || a.status === filter,
  );

  return (
    <DashCard
      title="All Appointments"
      action={
        <div className="flex gap-1 rounded-xl bg-accent p-1 text-xs font-semibold">
          {(["all", "pending", "confirmed", "completed", "cancelled"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-2.5 py-1 capitalize ${filter === f ? "bg-white text-brand shadow-soft" : "text-ink-soft"}`}
            >
              {f}
            </button>
          ))}
        </div>
      }
    >
      {isLoading ? (
        <p className="text-sm text-ink-soft">Loading…</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No appointments"
          description="No appointments match this filter."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                <th className="py-2">Date</th>
                <th>Patient</th>
                <th>Service</th>
                <th>Status</th>
                <th>Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-accent/30 transition-colors">
                  <td className="py-2.5">
                    <div className="font-medium text-ink">{a.appointment_date}</div>
                    <div className="text-xs text-ink-soft">{a.time_slot}</div>
                  </td>
                  <td>
                    <div className="font-medium text-ink">{a.patient_name}</div>
                    <div className="text-xs text-ink-soft">{a.patient_phone}</div>
                  </td>
                  <td className="text-ink-soft">{a.service ?? "—"}</td>
                  <td>
                    <select
                      className={`rounded-lg border border-border px-2 py-1 text-xs font-semibold ${STATUS_COLORS[a.status] ?? ""}`}
                      value={a.status}
                      onChange={(e) => update.mutate({ id: a.id, status: e.target.value })}
                      disabled={update.isPending}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="text-xs font-mono text-ink-soft">{a.booking_code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashCard>
  );
}
