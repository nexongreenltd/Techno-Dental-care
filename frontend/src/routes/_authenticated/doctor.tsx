import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout, RoleGuard } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/_authenticated/doctor")({
  component: () => (
    <RoleGuard allow={["doctor", "admin"]}>
      <DashboardLayout role="doctor"><Outlet /></DashboardLayout>
    </RoleGuard>
  ),
});