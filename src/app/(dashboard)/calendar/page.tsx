import type { Metadata } from "next";
import {
  endOfMonth,
  endOfWeek,
  isValid,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { requireUser } from "@/lib/dal";
import {
  getCategories,
  getTags,
  getTasksInRange,
} from "@/server/queries/tasks";
import { PageHeader } from "@/components/dashboard/page-header";
import { CalendarView } from "@/components/calendar/calendar-view";

export const metadata: Metadata = { title: "Calendar" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const monthParam = Array.isArray(sp.month) ? sp.month[0] : sp.month;

  let monthDate = monthParam
    ? parse(monthParam, "yyyy-MM", new Date())
    : new Date();
  if (!isValid(monthDate)) monthDate = new Date();

  const gridStart = startOfWeek(startOfMonth(monthDate));
  const gridEnd = endOfWeek(endOfMonth(monthDate));

  const [tasks, categories, tags] = await Promise.all([
    getTasksInRange(user.id, gridStart, gridEnd),
    getCategories(user.id),
    getTags(user.id),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Calendar"
        description="Your tasks laid out by due date"
      />
      <CalendarView
        year={monthDate.getFullYear()}
        month={monthDate.getMonth()}
        tasks={tasks}
        categories={categories}
        tags={tags}
      />
    </div>
  );
}
