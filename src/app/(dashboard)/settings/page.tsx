import type { Metadata } from "next";
import { Settings2 } from "lucide-react";

import { requireUser } from "@/lib/dal";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireUser();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Manage your profile and workspace"
      />
      <EmptyState
        icon={Settings2}
        title="Settings are coming together"
        description="Profile management and workspace preferences will live here."
      />
    </div>
  );
}
