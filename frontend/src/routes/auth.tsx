import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useAuth, type DentalUser } from "@/hooks/use-auth";
import { Loader2, Lock, UserRound, Mail, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    mode: (s.mode as string) ?? "login",
    redirect: (s.redirect as string) ?? "/dashboard",
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Techno Dental" },
      { name: "description", content: "Sign in or create your Techno Dental account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode, redirect } = Route.useSearch();
  const nav = useNavigate();
  const { user, loading, signIn } = useAuth();
  const [tab, setTab] = useState<"login" | "register" | "forgot">(
    mode === "register" ? "register" : "login",
  );
  const [identifier, setIdentifier] = useState(""); // email or phone for login
  const [email, setEmail] = useState("");            // email only for registration
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!loading && user) nav({ to: redirect as "/dashboard" });
  }, [user, loading, nav, redirect]);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const result = await api.post<{ token: string; user: DentalUser }>(
        "/api/auth/login",
        { identifier, password },
      );
      signIn(result.token, result.user);
      nav({ to: redirect as "/dashboard" });
    } catch (error: unknown) {
      setErr(error instanceof Error ? error.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const result = await api.post<{ token: string; user: DentalUser }>(
        "/api/auth/register",
        { email, password, full_name: fullName, phone: phone || undefined },
      );
      signIn(result.token, result.user);
      setInfo("Account created! Redirecting to your dashboard…");
      setTimeout(() => nav({ to: "/dashboard" }), 800);
    } catch (error: unknown) {
      setErr(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  async function onForgot(e: React.FormEvent) {
    e.preventDefault();
    setInfo("Password reset is handled by the clinic admin. Please contact us directly.");
  }

  return (
    <SiteLayout>
      <div className="relative overflow-hidden bg-gradient-to-b from-white via-surface to-white">
        <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-brand-soft/40 blur-3xl" />
        <div className="mx-auto max-w-md px-6 py-20">
          <div className="rounded-3xl border border-border bg-white p-8 shadow-card">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="mt-5 font-display text-3xl font-bold text-ink">
              {tab === "login" && (
                <>
                  Welcome <span className="text-gradient-brand">back</span>
                </>
              )}
              {tab === "register" && (
                <>
                  Create your <span className="text-gradient-brand">account</span>
                </>
              )}
              {tab === "forgot" && (
                <>
                  Reset <span className="text-gradient-brand">password</span>
                </>
              )}
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              {tab === "login" && "Sign in to manage appointments and records."}
              {tab === "register" &&
                "Patients can register here. Doctor & admin accounts are issued by the clinic."}
              {tab === "forgot" && "Contact the clinic to reset your password."}
            </p>

            {tab !== "forgot" && (
              <div className="mt-5 grid grid-cols-2 rounded-xl bg-accent p-1 text-sm font-semibold">
                <button
                  onClick={() => {
                    setTab("login");
                    setErr(null);
                    setInfo(null);
                  }}
                  className={`rounded-lg py-2 ${tab === "login" ? "bg-white text-brand shadow-soft" : "text-ink-soft"}`}
                >
                  Sign in
                </button>
                <button
                  onClick={() => {
                    setTab("register");
                    setErr(null);
                    setInfo(null);
                  }}
                  className={`rounded-lg py-2 ${tab === "register" ? "bg-white text-brand shadow-soft" : "text-ink-soft"}`}
                >
                  Create account
                </button>
              </div>
            )}

            <form
              className="mt-5 space-y-3"
              onSubmit={tab === "login" ? onLogin : tab === "register" ? onRegister : onForgot}
            >
              {tab === "login" && (
                <Field icon={<Mail className="h-4 w-4" />} label="Email or phone number">
                  <Input
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="you@example.com or 01XXXXXXXXX"
                    autoComplete="username"
                  />
                </Field>
              )}

              {tab === "register" && (
                <>
                  <Field icon={<UserRound className="h-4 w-4" />} label="Full name">
                    <Input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                    />
                  </Field>
                  <Field label="Phone (recommended — lets you log in by phone)">
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                    />
                  </Field>
                  <Field icon={<Mail className="h-4 w-4" />} label="Email">
                    <Input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </Field>
                </>
              )}
              {tab !== "forgot" && (
                <Field label="Password">
                  <div className="relative">
                    <Input
                      required
                      type={showPassword ? "text" : "password"}
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>
              )}
              {err && <p className="text-sm text-destructive">{err}</p>}
              {info && <p className="text-sm text-brand">{info}</p>}
              <Button
                type="submit"
                variant="brand"
                size="lg"
                disabled={busy}
                className="w-full"
              >
                {busy && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                {tab === "login" && "Sign in"}
                {tab === "register" && "Create account"}
                {tab === "forgot" && "Contact clinic"}
              </Button>
              <div className="flex items-center justify-between pt-1 text-xs">
                {tab !== "forgot" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setTab("forgot");
                      setErr(null);
                      setInfo(null);
                    }}
                    className="font-semibold text-brand hover:underline"
                  >
                    Forgot password?
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setTab("login");
                      setErr(null);
                      setInfo(null);
                    }}
                    className="font-semibold text-brand hover:underline"
                  >
                    Back to sign in
                  </button>
                )}
                <Link to="/" className="text-ink-soft hover:text-brand">
                  ← Home
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-soft">
        {icon}
        {label}
      </Label>
      {children}
    </div>
  );
}
