import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { DashCard, EmptyState } from "@/components/dashboard/DashboardLayout";
import { FileText, ChevronDown, ChevronUp, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { printPrescription } from "@/lib/printPrescription";

export const Route = createFileRoute("/_authenticated/patient/prescriptions")({
  component: PatientPrescriptions,
});

type Medicine = {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
};

type Prescription = {
  id: string;
  created_at: string;
  patient_name: string;
  patient_age: number | null;
  patient_phone?: string | null;
  diagnosis: string;
  chief_complaint: string | null;
  medicines: Medicine[];
  instructions: string | null;
  follow_up_date: string | null;
  doctor_name: string | null;
  doctor_specialization: string | null;
};

function PatientPrescriptions() {
  const { user } = useAuth();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data } = useQuery({
    enabled: !!user,
    queryKey: ["patient-prescriptions", user?.id],
    queryFn: () => api.get<Prescription[]>("/api/prescriptions"),
  });

  return (
    <DashCard title="My prescriptions">
      {!data || data.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No prescriptions yet"
          description="Your prescriptions will appear here after your doctor issues them."
        />
      ) : (
        <ul className="divide-y divide-border">
          {data.map((rx) => (
            <li key={rx.id} className="py-4">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 text-left"
                onClick={() => setExpandedId(expandedId === rx.id ? null : rx.id)}
              >
                <div>
                  <div className="font-semibold text-ink">
                    {new Date(rx.created_at).toLocaleDateString()} — {rx.diagnosis}
                  </div>
                  <div className="text-xs text-ink-soft">
                    Prof. Dr. Golam Mohammad Pavel ·{" "}
                    {rx.medicines.length} medicine{rx.medicines.length !== 1 ? "s" : ""}
                  </div>
                  {rx.follow_up_date && (
                    <div className="text-xs text-brand">Follow-up: {rx.follow_up_date}</div>
                  )}
                </div>
                <div className="shrink-0">
                  {expandedId === rx.id ? (
                    <ChevronUp className="h-4 w-4 text-ink-soft" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-ink-soft" />
                  )}
                </div>
              </button>

              {expandedId === rx.id && (
                <div className="mt-4 space-y-4 rounded-xl border border-border bg-accent/20 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {rx.chief_complaint && (
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                          Chief complaint
                        </div>
                        <div className="mt-0.5 text-sm text-ink">{rx.chief_complaint}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                        Diagnosis
                      </div>
                      <div className="mt-0.5 text-sm text-ink">{rx.diagnosis}</div>
                    </div>
                  </div>

                  {rx.medicines.length > 0 && (
                    <div>
                      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                        Medicines
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-border bg-white">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-accent/50 text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                              <th className="px-3 py-2 text-left">Medicine</th>
                              <th className="px-3 py-2 text-left">Dosage</th>
                              <th className="px-3 py-2 text-left">Frequency</th>
                              <th className="px-3 py-2 text-left">Duration</th>
                              <th className="px-3 py-2 text-left">Notes</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {rx.medicines.map((m, i) => (
                              <tr key={i}>
                                <td className="px-3 py-2 font-medium text-ink">{m.name}</td>
                                <td className="px-3 py-2 text-ink-soft">{m.dosage || "—"}</td>
                                <td className="px-3 py-2 text-ink-soft">{m.frequency || "—"}</td>
                                <td className="px-3 py-2 text-ink-soft">{m.duration || "—"}</td>
                                <td className="px-3 py-2 text-ink-soft">{m.notes || "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {rx.instructions && (
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                        Instructions
                      </div>
                      <div className="mt-0.5 text-sm text-ink">{rx.instructions}</div>
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    <Button variant="brand" size="sm" onClick={() => printPrescription(rx, "en")}>
                      <Printer className="h-3.5 w-3.5" /> Print (English)
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => printPrescription(rx, "bn")}>
                      <Printer className="h-3.5 w-3.5" /> প্রিন্ট (বাংলা)
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </DashCard>
  );
}
