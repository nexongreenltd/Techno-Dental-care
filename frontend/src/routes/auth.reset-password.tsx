import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — Techno Dental" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(null); setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setErr(error.message);
    setInfo("Password updated. Redirecting…");
    setTimeout(() => nav({ to: "/dashboard" }), 1200);
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-md px-6 py-20">
        <div className="rounded-3xl border border-border bg-white p-8 shadow-card">
          <h1 className="font-display text-3xl font-bold text-ink">Set a new <span className="text-gradient-brand">password</span></h1>
          <p className="mt-2 text-sm text-ink-soft">Choose a strong password you'll remember.</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <div>
              <Label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-soft">New password</Label>
              <Input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            {info && <p className="text-sm text-brand">{info}</p>}
            <Button type="submit" variant="brand" size="lg" disabled={busy} className="w-full">
              {busy && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />} Update password
            </Button>
          </form>
        </div>
      </div>
    </SiteLayout>
  );
}