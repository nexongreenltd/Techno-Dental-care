import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth, type DentalUser } from "@/hooks/use-auth";
import { DashCard } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/profile")({
  component: PatientProfile,
});

function PatientProfile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    gender: "",
    dob: "",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name ?? "",
        phone: user.phone ?? "",
        gender: user.gender ?? "",
        dob: user.dob ?? "",
      });
    }
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await api.patch<DentalUser>("/api/auth/me", {
        full_name: form.full_name,
        phone: form.phone || undefined,
        gender: form.gender || undefined,
        dob: form.dob || undefined,
      });
      await refreshUser();
      setMsg("Profile saved.");
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <DashCard title="My profile">
      <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
        <Field label="Full name">
          <Input
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
        </Field>
        <Field label="Phone">
          <Input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </Field>
        <Field label="Email">
          <Input value={user?.email ?? ""} disabled className="opacity-60" />
        </Field>
        <Field label="Date of birth">
          <Input
            type="date"
            value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
          />
        </Field>
        <Field label="Gender">
          <Input
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            placeholder="Male / Female / Other"
          />
        </Field>
        <div className="md:col-span-2 flex items-center gap-3">
          <Button type="submit" variant="brand" disabled={busy}>
            {busy && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />} Save changes
          </Button>
          {msg && <span className="text-sm text-ink-soft">{msg}</span>}
        </div>
      </form>
    </DashCard>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-soft">
        {label}
      </Label>
      {children}
    </div>
  );
}
