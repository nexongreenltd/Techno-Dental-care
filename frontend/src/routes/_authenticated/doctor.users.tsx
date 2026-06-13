import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DashCard, EmptyState } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, X, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/doctor/users")({
  component: ManageUsers,
});

type User = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: "patient" | "doctor";
  is_active: boolean;
  created_at: string;
  specialization: string | null;
};

type NewUserForm = {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  role: "patient" | "doctor";
  specialization: string;
};

type Tab = "patient" | "doctor";

function ManageUsers() {
  const { user: self } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("patient");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<NewUserForm>({
    email: "", password: "", full_name: "", phone: "",
    role: "patient", specialization: "",
  });
  const [createErr, setCreateErr] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ["users", tab],
    queryFn: () => api.get<User[]>(`/api/users?role=${tab}`),
  });

  const toggleActive = useMutation({
    mutationFn: ({ userId, is_active }: { userId: string; is_active: boolean }) =>
      api.patch(`/api/users/${userId}`, { is_active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });

  const createUser = useMutation({
    mutationFn: (body: NewUserForm) =>
      api.post("/api/users", {
        email: body.email,
        password: body.password,
        full_name: body.full_name,
        phone: body.phone || undefined,
        role: body.role,
        specialization: body.specialization || undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      setShowCreate(false);
      setForm({ email: "", password: "", full_name: "", phone: "", role: "patient", specialization: "" });
      setCreateErr(null);
    },
    onError: (err: Error) => setCreateErr(err.message),
  });

  return (
    <div className="space-y-6">
      <DashCard
        title="Manage Users"
        action={
          <Button size="sm" variant="brand" onClick={() => setShowCreate(!showCreate)}>
            <Plus className="h-3.5 w-3.5" /> Add user
          </Button>
        }
      >
        {/* Create user panel */}
        {showCreate && (
          <div className="mb-6 rounded-2xl border border-brand/20 bg-accent/30 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-ink">Create new account</h3>
              <button onClick={() => setShowCreate(false)}>
                <X className="h-4 w-4 text-ink-soft" />
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Full name">
                <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Dr. Ahmed Kabir" />
              </Field>
              <Field label="Email">
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>
              <Field label="Password">
                <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="min 6 characters" />
              </Field>
              <Field label="Phone">
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="01XXXXXXXXX" />
              </Field>
              <Field label="Account type">
                <select
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as Tab })}
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
              </Field>
              {form.role === "doctor" && (
                <Field label="Specialization">
                  <Input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} placeholder="e.g. Orthodontics" />
                </Field>
              )}
            </div>
            {createErr && <p className="mt-2 text-sm text-destructive">{createErr}</p>}
            <div className="mt-4 flex gap-2">
              <Button variant="brand" size="sm" disabled={createUser.isPending} onClick={() => createUser.mutate(form)}>
                {createUser.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                Create account
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-4 grid grid-cols-2 rounded-xl bg-accent p-1 text-sm font-semibold">
          <button
            onClick={() => setTab("patient")}
            className={`rounded-lg py-2 ${tab === "patient" ? "bg-white text-brand shadow-soft" : "text-ink-soft"}`}
          >
            Patients
          </button>
          <button
            onClick={() => setTab("doctor")}
            className={`rounded-lg py-2 ${tab === "doctor" ? "bg-white text-brand shadow-soft" : "text-ink-soft"}`}
          >
            Doctors
          </button>
        </div>

        {!data || data.length === 0 ? (
          <EmptyState icon={Users} title={`No ${tab}s yet`} description={`${tab === "patient" ? "Patients will appear here after they register." : "Add a doctor account using the button above."}`} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                  <th className="py-2">Name</th>
                  <th>Contact</th>
                  {tab === "doctor" && <th>Specialization</th>}
                  <th>Joined</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((u) => (
                  <tr key={u.id} className="hover:bg-accent/30 transition-colors">
                    <td className="py-2.5 font-medium text-ink">{u.full_name}</td>
                    <td>
                      <div className="text-ink">{u.email}</div>
                      <div className="text-xs text-ink-soft">{u.phone ?? "—"}</div>
                    </td>
                    {tab === "doctor" && (
                      <td className="text-ink-soft">{u.specialization ?? "—"}</td>
                    )}
                    <td className="text-xs text-ink-soft">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${u.is_active ? "bg-accent text-brand" : "bg-destructive/10 text-destructive"}`}>
                        {u.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="text-right">
                      {u.id === self?.id ? (
                        <span className="text-xs text-ink-soft italic">You</span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={toggleActive.isPending}
                          onClick={() => toggleActive.mutate({ userId: u.id, is_active: !u.is_active })}
                        >
                          {u.is_active ? "Deactivate" : "Activate"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
