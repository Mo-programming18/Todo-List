import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";

import { requireUser } from "@/lib/dal";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = { title: "Calendar" };

export default async function CalendarPage() {
  await requireUser();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Calendar" description="See your tasks by due date" />
      <EmptyState
        icon={CalendarDays}
        title="Calendar view is coming together"
        description="A monthly view of your tasks by due date will live here."
      />
    </div>
  );
}
