import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout, RoleGuard } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/_authenticated/admin")({
  component: () => (
    <RoleGuard allow={["admin", "doctor"]}>
      <DashboardLayout role="doctor"><Outlet /></DashboardLayout>
    </RoleGuard>
  ),
});