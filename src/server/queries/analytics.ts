import { eachDayOfInterval, format, startOfDay, subDays } from "date-fns";

import { prisma } from "@/lib/prisma";
import { PRIORITIES, STATUSES } from "@/lib/constants";
import type { Priority, TaskStatus } from "@/lib/types";

const PRIORITY_HEX: Record<Priority, string> = {
  LOW: "#64748b",
  MEDIUM: "#2563eb",
  HIGH: "#d97706",
  URGENT: "#dc2626",
};

export type Analytics = {
  daily: { date: string; completed: number; created: number }[];
  byPriority: { label: string; count: number; color: string }[];
  byStatus: { label: string; count: number }[];
  byCategory: { name: string; count: number; color: string }[];
  weeklyCompleted: number;
  weeklyCreated: number;
  bestDay: { date: string; completed: number } | null;
};

export async function getAnalytics(userId: string): Promise<Analytics> {
  const today = startOfDay(new Date());
  const start = subDays(today, 13);
  const days = eachDayOfInterval({ start, end: today });

  const [completedTasks, createdTasks, byPriorityRaw, byStatusRaw, categories] =
    await Promise.all([
      prisma.task.findMany({
        where: { userId, completedAt: { gte: start } },
        select: { completedAt: true },
      }),
      prisma.task.findMany({
        where: { userId, createdAt: { gte: start } },
        select: { createdAt: true },
      }),
      prisma.task.groupBy({
        by: ["priority"],
        where: { userId },
        _count: { _all: true },
      }),
      prisma.task.groupBy({
        by: ["status"],
        where: { userId },
        _count: { _all: true },
      }),
      prisma.category.findMany({
        where: { userId },
        include: { _count: { select: { tasks: true } } },
        orderBy: { name: "asc" },
      }),
    ]);

  const key = (d: Date) => format(d, "yyyy-MM-dd");
  const completedByDay = new Map<string, number>();
  const createdByDay = new Map<string, number>();
  for (const t of completedTasks) {
    if (!t.completedAt) continue;
    const k = key(t.completedAt);
    completedByDay.set(k, (completedByDay.get(k) ?? 0) + 1);
  }
  for (const t of createdTasks) {
    const k = key(t.createdAt);
    createdByDay.set(k, (createdByDay.get(k) ?? 0) + 1);
  }

  const daily = days.map((d) => ({
    date: format(d, "MMM d"),
    completed: completedByDay.get(key(d)) ?? 0,
    created: createdByDay.get(key(d)) ?? 0,
  }));

  const priorityCounts = new Map<Priority, number>();
  for (const row of byPriorityRaw) {
    priorityCounts.set(row.priority as Priority, row._count._all);
  }
  const byPriority = PRIORITIES.map((p) => ({
    label: p.label,
    count: priorityCounts.get(p.value) ?? 0,
    color: PRIORITY_HEX[p.value],
  })).filter((p) => p.count > 0);

  const statusCounts = new Map<TaskStatus, number>();
  for (const row of byStatusRaw) {
    statusCounts.set(row.status as TaskStatus, row._count._all);
  }
  const byStatus = STATUSES.map((s) => ({
    label: s.label,
    count: statusCounts.get(s.value) ?? 0,
  }));

  const byCategory = categories
    .map((c) => ({ name: c.name, count: c._count.tasks, color: c.color }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  const last7 = daily.slice(-7);
  const weeklyCompleted = last7.reduce((sum, d) => sum + d.completed, 0);
  const weeklyCreated = last7.reduce((sum, d) => sum + d.created, 0);
  const bestDay = daily.reduce<Analytics["bestDay"]>((best, d) => {
    if (d.completed === 0) return best;
    if (!best || d.completed > best.completed) {
      return { date: d.date, completed: d.completed };
    }
    return best;
  }, null);

  return {
    daily,
    byPriority,
    byStatus,
    byCategory,
    weeklyCompleted,
    weeklyCreated,
    bestDay,
  };
}
