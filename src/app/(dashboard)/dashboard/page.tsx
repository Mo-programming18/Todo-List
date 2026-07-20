import type { Metadata } from "next";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock,
  ListTodo,
  TrendingUp,
} from "lucide-react";

import { requireUser } from "@/lib/dal";
import { getTaskStats, getUpcomingTasks } from "@/server/queries/tasks";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { DueDate } from "@/components/tasks/due-date";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Overview" };

function greetingFor(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const user = await requireUser();
  const [stats, upcoming] = await Promise.all([
    getTaskStats(user.id),
    getUpcomingTasks(user.id, 6),
  ]);

  const now = new Date();
  const firstName = user.name?.split(" ")[0] ?? "there";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`${greetingFor(now)}, ${firstName}`}
        description={formatDate(now, "EEEE, MMMM d")}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total tasks"
          value={stats.total}
          icon={ListTodo}
          tone="primary"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={Clock}
          tone="warning"
          hint={`${stats.inProgress} in progress`}
        />
        <StatCard
          label="Overdue"
          value={stats.overdue}
          icon={AlertTriangle}
          tone="danger"
          hint={`${stats.dueToday} due today`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              Productivity
            </CardTitle>
            <CardDescription>Your overall completion rate</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <span className="text-4xl font-semibold tabular-nums">
                {stats.completionRate}%
              </span>
              <span className="text-sm text-muted-foreground">
                {stats.completed} of {stats.total} done
              </span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={stats.completionRate}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.pending > 0
                ? `${stats.pending} task${stats.pending === 1 ? "" : "s"} still on your plate.`
                : "You are all caught up. Nice work."}
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="size-4 text-primary" />
              Upcoming deadlines
            </CardTitle>
            <CardDescription>The next tasks coming due</CardDescription>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <EmptyState
                icon={CalendarClock}
                title="No upcoming deadlines"
                description="Tasks with a due date will show up here so nothing slips."
              />
            ) : (
              <ul className="flex flex-col divide-y">
                {upcoming.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{
                          backgroundColor: task.category?.color ?? "#94a3b8",
                        }}
                        aria-hidden
                      />
                      <span className="truncate text-sm font-medium">
                        {task.title}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <DueDate date={task.dueDate} />
                      <PriorityBadge
                        priority={task.priority}
                        className="hidden sm:inline-flex"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-muted-foreground">
        Head to{" "}
        <a href="/tasks" className="font-medium text-primary hover:underline">
          Tasks
        </a>{" "}
        to manage everything on your list.
      </p>
    </div>
  );
}
