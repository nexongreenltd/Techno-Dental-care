import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DashCard, EmptyState } from "@/components/dashboard/DashboardLayout";
import { CalendarDays } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/appointments")({
  component: AdminAppointments,
});

type Appointment = {
  id: string;
  appointment_date: string;
  time_slot: string;
  status: string;
  patient_name: string;
  patient_phone: string;
  service: string | null;
  doctor_user_id: string | null;
  chamber_name: string;
  doctor_name: string | null;
};

type Doctor = {
  id: string;
  full_name: string;
  email: string;
  specialization: string | null;
};

const STATUSES = ["pending", "confirmed", "completed", "cancelled", "no_show", "follow_up"] as const;

function AdminAppointments() {
  const qc = useQueryClient();

  const { data: appts } = useQuery({
    queryKey: ["admin-appts"],
    queryFn: () => api.get<Appointment[]>("/api/appointments"),
  });

  const { data: doctors } = useQuery({
    queryKey: ["doctors-list"],
    queryFn: () => api.get<Doctor[]>("/api/users/doctors"),
  });

  const update = useMutation({
    mutationFn: (patch: { id: string; status?: string; doctor_user_id?: string | null }) => {
      const { id, ...rest } = patch;
      return api.patch(`/api/appointments/${id}`, rest);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-appts"] }),
  });

  return (
    <DashCard title="All appointments">
      {!appts || appts.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No appointments yet"
          description="Bookings will appear here."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                <th className="py-2">Date</th>
                <th>Chamber</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {appts.map((a) => (
                <tr key={a.id}>
                  <td className="py-2.5">
                    {a.appointment_date}
                    <div className="text-xs text-ink-soft">{a.time_slot}</div>
                  </td>
                  <td>{a.chamber_name}</td>
                  <td>
                    <div className="font-medium text-ink">{a.patient_name}</div>
                    <div className="text-xs text-ink-soft">{a.patient_phone}</div>
                  </td>
                  <td>
                    <select
                      className="rounded-lg border border-border bg-white px-2 py-1 text-xs"
                      value={a.doctor_user_id ?? ""}
                      onChange={(e) =>
                        update.mutate({
                          id: a.id,
                          doctor_user_id: e.target.value || null,
                        })
                      }
                    >
                      <option value="">— Unassigned —</option>
                      {(doctors ?? []).map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.full_name || d.email}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      className="rounded-lg border border-border bg-white px-2 py-1 text-xs"
                      value={a.status}
                      onChange={(e) => update.mutate({ id: a.id, status: e.target.value })}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashCard>
  );
}
