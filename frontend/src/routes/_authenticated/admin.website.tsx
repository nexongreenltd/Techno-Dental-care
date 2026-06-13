import { createFileRoute } from "@tanstack/react-router";
import { DashCard, EmptyState } from "@/components/dashboard/DashboardLayout";
import { Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/website")({
  component: () => (
    <div className="space-y-6">
      {["Services","Gallery","Blog","Testimonials"].map((s) => (
        <DashCard key={s} title={s}>
          <EmptyState icon={ImageIcon} title={`${s} management coming soon`} description="The CMS scaffolding is in place. Editors will be built in the next phase." />
        </DashCard>
      ))}
    </div>
  ),
});