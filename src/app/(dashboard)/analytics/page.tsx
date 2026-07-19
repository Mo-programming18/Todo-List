import type { Metadata } from "next";
import { BarChart3, CalendarCheck, Flame, Target, TrendingUp } from "lucide-react";

import { requireUser } from "@/lib/dal";
import { getAnalytics } from "@/server/queries/analytics";
import { getTaskStats } from "@/server/queries/tasks";
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
import {
  CompletionTrendChart,
  PriorityPieChart,
} from "@/components/analytics/analytics-charts";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const user = await requireUser();
  const [analytics, stats] = await Promise.all([
    getAnalytics(user.id),
    getTaskStats(user.id),
  ]);

  if (stats.total === 0) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Analytics"
          description="Track your productivity over time"
        />
        <EmptyState
          icon={BarChart3}
          title="No data to chart yet"
          description="Create and complete a few tasks and your productivity trends will appear here."
        />
      </div>
    );
  }

  const maxCategory = analytics.byCategory[0]?.count ?? 1;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Analytics"
        description="Your productivity over the last two weeks"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Completed this week"
          value={analytics.weeklyCompleted}
          icon={CalendarCheck}
          tone="success"
        />
        <StatCard
          label="Added this week"
          value={analytics.weeklyCreated}
          icon={TrendingUp}
          tone="primary"
        />
        <StatCard
          label="Completion rate"
          value={`${stats.completionRate}%`}
          icon={Target}
          tone="warning"
        />
        <StatCard
          label="Best day"
          value={analytics.bestDay ? analytics.bestDay.completed : 0}
          icon={Flame}
          tone="danger"
          hint={analytics.bestDay ? analytics.bestDay.date : "No completions yet"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Completion trend</CardTitle>
            <CardDescription>
              Tasks completed and created over the last 14 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompletionTrendChart data={analytics.daily} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority breakdown</CardTitle>
            <CardDescription>How your tasks are distributed</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.byPriority.length > 0 ? (
              <PriorityPieChart data={analytics.byPriority} />
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No tasks to break down yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks by project</CardTitle>
          <CardDescription>Where your work is concentrated</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.byCategory.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Assign projects to your tasks to see this breakdown.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {analytics.byCategory.map((category) => (
                <li key={category.name} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 truncate text-sm font-medium">
                    {category.name}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(category.count / maxCategory) * 100}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
                    {category.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
