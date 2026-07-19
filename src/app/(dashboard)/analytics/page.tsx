import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";

import { requireUser } from "@/lib/dal";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  await requireUser();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Analytics"
        description="Track your productivity over time"
      />
      <EmptyState
        icon={BarChart3}
        title="Analytics are coming together"
        description="Completion trends and a weekly productivity overview will live here."
      />
    </div>
  );
}
