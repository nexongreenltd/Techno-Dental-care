import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout, RoleGuard } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/_authenticated/patient")({
  component: () => (
    <RoleGuard allow={["patient", "admin"]}>
      <DashboardLayout role="patient"><Outlet /></DashboardLayout>
    </RoleGuard>
  ),
});