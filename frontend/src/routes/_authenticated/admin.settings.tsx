import { createFileRoute } from "@tanstack/react-router";
import { DashCard, EmptyState } from "@/components/dashboard/DashboardLayout";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: () => (
    <DashCard title="Settings">
      <EmptyState icon={Settings} title="Settings coming soon" description="Clinic-wide settings (notifications, branding, languages) will live here." />
    </DashCard>
  ),
});