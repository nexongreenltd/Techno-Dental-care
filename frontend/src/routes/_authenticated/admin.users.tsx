import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DashCard, EmptyState } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, X, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: AdminUsers,
});

type User = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: "patient" | "doctor" | "admin";
  is_active: boolean;
  created_at: string;
  specialization: string | null;
};

type NewUserForm = {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  role: "patient" | "doctor" | "admin";
  specialization: string;
};

function AdminUsers() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | "patient" | "doctor" | "admin">("all");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<NewUserForm>({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    role: "patient",
    specialization: "",
  });
  const [createErr, setCreateErr] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ["admin-users", filter],
    queryFn: () =>
      api.get<User[]>(
        filter === "all" ? "/api/users" : `/api/users?role=${filter}`,
      ),
  });

  const setRole = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      api.patch(`/api/users/${userId}`, { role }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const toggleActive = useMutation({
    mutationFn: ({ userId, is_active }: { userId: string; is_active: boolean }) =>
      api.patch(`/api/users/${userId}`, { is_active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
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
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      setShowCreate(false);
      setForm({ email: "", password: "", full_name: "", phone: "", role: "patient", specialization: "" });
      setCreateErr(null);
    },
    onError: (err: Error) => setCreateErr(err.message),
  });

  return (
    <div className="space-y-6">
      <DashCard
        title="Users"
        action={
          <div className="flex items-center gap-2">
            <div className="flex gap-1 rounded-xl bg-accent p-1 text-xs font-semibold">
              {(["all", "patient", "doctor", "admin"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-lg px-2.5 py-1 capitalize ${filter === f ? "bg-white text-brand shadow-soft" : "text-ink-soft"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <Button
              size="sm"
              variant="brand"
              onClick={() => setShowCreate(!showCreate)}
            >
              <Plus className="h-3.5 w-3.5" /> Add user
            </Button>
          </div>
        }
      >
        {/* Create user panel */}
        {showCreate && (
          <div className="mb-6 rounded-2xl border border-brand/20 bg-accent/30 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-ink">Create new account</h3>
              <button onClick={() => setShowCreate(false)}>
                <X className="h-4 w-4 text-ink-soft" />
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Full name">
                <Input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Dr. Ahmed Kabir"
                />
              </Field>
              <Field label="Email">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </Field>
              <Field label="Password">
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="min 6 characters"
                />
              </Field>
              <Field label="Phone">
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                />
              </Field>
              <Field label="Role">
                <select
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as NewUserForm["role"] })
                  }
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </Field>
              {form.role === "doctor" && (
                <Field label="Specialization">
                  <Input
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    placeholder="e.g. Orthodontics"
                  />
                </Field>
              )}
            </div>
            {createErr && <p className="mt-2 text-sm text-destructive">{createErr}</p>}
            <div className="mt-4 flex gap-2">
              <Button
                variant="brand"
                size="sm"
                disabled={createUser.isPending}
                onClick={() => createUser.mutate(form)}
              >
                {createUser.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                Create account
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!data || data.length === 0 ? (
          <EmptyState icon={Users} title="No users" description="No accounts match this filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                  <th className="py-2">User</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((u) => (
                  <tr key={u.id}>
                    <td className="py-2.5">
                      <div className="font-medium text-ink">{u.full_name}</div>
                      {u.specialization && (
                        <div className="text-xs text-ink-soft">{u.specialization}</div>
                      )}
                      <div className="text-xs text-ink-soft">
                        joined {new Date(u.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="text-ink">{u.email}</div>
                      <div className="text-xs text-ink-soft">{u.phone}</div>
                    </td>
                    <td>
                      <select
                        className="rounded-lg border border-border bg-white px-2 py-1 text-xs"
                        value={u.role}
                        onChange={(e) =>
                          setRole.mutate({ userId: u.id, role: e.target.value })
                        }
                      >
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                          u.is_active
                            ? "bg-accent text-brand"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {u.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          toggleActive.mutate({ userId: u.id, is_active: !u.is_active })
                        }
                      >
                        {u.is_active ? "Deactivate" : "Activate"}
                      </Button>
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
      <Label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-soft">
        {label}
      </Label>
      {children}
    </div>
  );
}
