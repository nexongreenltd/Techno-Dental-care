import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardRedirect,
});

function DashboardRedirect() {
  const { primaryRole, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (primaryRole === "admin" || primaryRole === "doctor") nav({ to: "/doctor", replace: true });
    else nav({ to: "/patient", replace: true });
  }, [primaryRole, loading, nav]);
  return <div className="grid min-h-screen place-items-center bg-surface"><Loader2 className="h-6 w-6 animate-spin text-brand" /></div>;
}