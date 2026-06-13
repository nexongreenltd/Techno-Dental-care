import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { DashCard, EmptyState } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardList, Plus, Trash2, X, Loader2, Pill, ChevronDown, ChevronUp, Printer } from "lucide-react";
import { printPrescription } from "@/lib/printPrescription";

export const Route = createFileRoute("/_authenticated/doctor/prescriptions")({
  component: DoctorPrescriptions,
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
  patient_phone: string | null;
  diagnosis: string;
  chief_complaint: string | null;
  medicines: Medicine[];
  instructions: string | null;
  follow_up_date: string | null;
  appointment_id: string | null;
};

type Appointment = {
  id: string;
  appointment_date: string;
  time_slot: string;
  patient_name: string;
  patient_phone: string;
  patient_age: number | null;
  status: string;
  patient_user_id: string | null;
};

function emptyMed(): Medicine {
  return { name: "", dosage: "", frequency: "", duration: "", notes: "" };
}

function DoctorPrescriptions() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [form, setForm] = useState({
    patient_name: "",
    patient_age: "",
    patient_phone: "",
    diagnosis: "",
    chief_complaint: "",
    instructions: "",
    follow_up_date: "",
  });
  const [medicines, setMedicines] = useState<Medicine[]>([emptyMed()]);
  const [formErr, setFormErr] = useState<string | null>(null);

  const { data: prescriptions } = useQuery({
    enabled: !!user,
    queryKey: ["doc-prescriptions", user?.id],
    queryFn: () => api.get<Prescription[]>("/api/prescriptions"),
  });

  const { data: appointments } = useQuery({
    enabled: showForm,
    queryKey: ["doc-appts-for-rx"],
    queryFn: () => api.get<Appointment[]>("/api/appointments"),
  });

  const create = useMutation({
    mutationFn: (body: object) => api.post("/api/prescriptions", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doc-prescriptions"] });
      setShowForm(false);
      resetForm();
    },
    onError: (err: Error) => setFormErr(err.message),
  });

  function resetForm() {
    setForm({ patient_name: "", patient_age: "", patient_phone: "", diagnosis: "", chief_complaint: "", instructions: "", follow_up_date: "" });
    setMedicines([emptyMed()]);
    setSelectedAppt(null);
    setFormErr(null);
  }

  function prefillFromAppt(appt: Appointment) {
    setSelectedAppt(appt);
    setForm((f) => ({
      ...f,
      patient_name: appt.patient_name,
      patient_phone: appt.patient_phone,
      patient_age: appt.patient_age?.toString() ?? "",
    }));
  }

  function updateMed(idx: number, field: keyof Medicine, value: string) {
    setMedicines((prev) => prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormErr(null);
    if (!form.patient_name.trim() || !form.diagnosis.trim()) {
      setFormErr("Patient name and diagnosis are required.");
      return;
    }
    const validMeds = medicines.filter((m) => m.name.trim());
    create.mutate({
      appointment_id: selectedAppt?.id,
      patient_id: selectedAppt?.patient_user_id ?? undefined,
      patient_name: form.patient_name,
      patient_age: form.patient_age ? Number(form.patient_age) : undefined,
      patient_phone: form.patient_phone || undefined,
      diagnosis: form.diagnosis,
      chief_complaint: form.chief_complaint || undefined,
      medicines: validMeds,
      instructions: form.instructions || undefined,
      follow_up_date: form.follow_up_date || undefined,
    });
  }

  return (
    <div className="space-y-6">
      <DashCard
        title="Prescriptions"
        action={
          <Button variant="brand" size="sm" onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}>
            {showForm ? <><X className="h-3.5 w-3.5" /> Cancel</> : <><Plus className="h-3.5 w-3.5" /> New prescription</>}
          </Button>
        }
      >
        {/* Create prescription form */}
        {showForm && (
          <form onSubmit={submit} className="mb-6 space-y-5 rounded-2xl border border-brand/20 bg-accent/20 p-5">
            <h3 className="font-display text-lg font-semibold text-ink">New digital prescription</h3>

            <div>
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Link to appointment (optional)
              </Label>
              <select
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
                value={selectedAppt?.id ?? ""}
                onChange={(e) => {
                  const appt = (appointments ?? []).find((a) => a.id === e.target.value);
                  if (appt) prefillFromAppt(appt);
                  else setSelectedAppt(null);
                }}
              >
                <option value="">— No linked appointment —</option>
                {(appointments ?? []).filter((a) => a.status !== "cancelled").map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.appointment_date} {a.time_slot} · {a.patient_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <Field label="Patient name *">
                <Input required value={form.patient_name} onChange={(e) => setForm({ ...form, patient_name: e.target.value })} />
              </Field>
              <Field label="Age">
                <Input type="number" value={form.patient_age} onChange={(e) => setForm({ ...form, patient_age: e.target.value })} placeholder="e.g. 32" />
              </Field>
              <Field label="Phone">
                <Input value={form.patient_phone} onChange={(e) => setForm({ ...form, patient_phone: e.target.value })} placeholder="01XXXXXXXXX" />
              </Field>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Chief complaint">
                <Input value={form.chief_complaint} onChange={(e) => setForm({ ...form, chief_complaint: e.target.value })} placeholder="e.g. Tooth pain upper left" />
              </Field>
              <Field label="Diagnosis *">
                <Input required value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} placeholder="e.g. Dental caries — periapical abscess" />
              </Field>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Medicines</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => setMedicines([...medicines, emptyMed()])}>
                  <Plus className="h-3.5 w-3.5" /> Add medicine
                </Button>
              </div>
              <div className="space-y-3">
                {medicines.map((m, i) => (
                  <div key={i} className="relative grid gap-2 rounded-xl border border-border bg-white p-3 md:grid-cols-5">
                    <div className="flex items-center gap-1">
                      <Pill className="h-3.5 w-3.5 shrink-0 text-brand" />
                      <Input placeholder="Medicine name *" value={m.name} onChange={(e) => updateMed(i, "name", e.target.value)} className="text-sm" />
                    </div>
                    <Input placeholder="Dosage (e.g. 500mg)" value={m.dosage} onChange={(e) => updateMed(i, "dosage", e.target.value)} className="text-sm" />
                    <Input placeholder="Frequency (e.g. 3×/day)" value={m.frequency} onChange={(e) => updateMed(i, "frequency", e.target.value)} className="text-sm" />
                    <Input placeholder="Duration (e.g. 7 days)" value={m.duration} onChange={(e) => updateMed(i, "duration", e.target.value)} className="text-sm" />
                    <div className="flex items-center gap-2">
                      <Input placeholder="Notes" value={m.notes} onChange={(e) => updateMed(i, "notes", e.target.value)} className="text-sm flex-1" />
                      {medicines.length > 1 && (
                        <button type="button" onClick={() => setMedicines(medicines.filter((_, j) => j !== i))}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Instructions">
                <Textarea value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} placeholder="e.g. Avoid cold foods, complete the course…" rows={3} />
              </Field>
              <Field label="Follow-up date">
                <Input type="date" value={form.follow_up_date} onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })} />
              </Field>
            </div>

            {formErr && <p className="text-sm text-destructive">{formErr}</p>}
            <div className="flex gap-3">
              <Button type="submit" variant="brand" disabled={create.isPending}>
                {create.isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                Save prescription
              </Button>
              <Button type="button" variant="ghost" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
            </div>
          </form>
        )}

        {/* List */}
        {!prescriptions || prescriptions.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No prescriptions yet" description="Create a digital prescription for your patients using the button above." />
        ) : (
          <ul className="divide-y divide-border">
            {prescriptions.map((rx) => (
              <li key={rx.id} className="py-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 text-left"
                  onClick={() => setExpandedId(expandedId === rx.id ? null : rx.id)}
                >
                  <div>
                    <div className="font-semibold text-ink">
                      {rx.patient_name}
                      {rx.patient_age && <span className="ml-1.5 text-ink-soft text-sm">· {rx.patient_age} yrs</span>}
                    </div>
                    <div className="text-xs text-ink-soft">
                      {new Date(rx.created_at).toLocaleDateString()} · {rx.diagnosis}
                    </div>
                    {rx.follow_up_date && <div className="text-xs text-brand">Follow-up: {rx.follow_up_date}</div>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase text-brand">
                      {rx.medicines.length} med{rx.medicines.length !== 1 ? "s" : ""}
                    </span>
                    {expandedId === rx.id ? <ChevronUp className="h-4 w-4 text-ink-soft" /> : <ChevronDown className="h-4 w-4 text-ink-soft" />}
                  </div>
                </button>

                {expandedId === rx.id && (
                  <div className="mt-4 space-y-4">
                    {rx.chief_complaint && (
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">Chief complaint</div>
                        <div className="mt-0.5 text-sm text-ink">{rx.chief_complaint}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">Diagnosis</div>
                      <div className="mt-0.5 text-sm text-ink">{rx.diagnosis}</div>
                    </div>
                    {rx.medicines.length > 0 && (
                      <div>
                        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-soft">Medicines</div>
                        <div className="overflow-x-auto rounded-xl border border-border">
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
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">Instructions</div>
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
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-soft">{label}</Label>
      {children}
    </div>
  );
}
