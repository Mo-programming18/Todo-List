import { endOfToday, startOfToday } from "date-fns";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type {
  CategoryWithCount,
  TaskFilters,
  TaskStats,
  TaskWithRelations,
} from "@/lib/types";

const taskInclude = {
  category: true,
  tags: { orderBy: { name: "asc" } },
} satisfies Prisma.TaskInclude;

function buildWhere(userId: string, filters: TaskFilters): Prisma.TaskWhereInput {
  const where: Prisma.TaskWhereInput = { userId };

  if (filters.view === "active") where.status = { not: "DONE" };
  else if (filters.view === "completed") where.status = "DONE";

  if (filters.status && filters.status !== "all") where.status = filters.status;
  if (filters.priority && filters.priority !== "all")
    where.priority = filters.priority;
  if (filters.categoryId && filters.categoryId !== "all")
    where.categoryId = filters.categoryId;
  if (filters.tagId && filters.tagId !== "all")
    where.tags = { some: { id: filters.tagId } };
  if (filters.search?.trim()) {
    const q = filters.search.trim();
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
    ];
  }

  return where;
}

function buildOrderBy(
  sort: TaskFilters["sort"],
): Prisma.TaskOrderByWithRelationInput[] {
  switch (sort) {
    case "priority":
      // Prisma sorts enums by declaration order (LOW..URGENT); we want the most
      // urgent first, so completed items sink and priority is the tiebreaker.
      return [{ priority: "desc" }, { dueDate: "asc" }];
    case "createdAt":
      return [{ createdAt: "desc" }];
    case "title":
      return [{ title: "asc" }];
    case "dueDate":
    default:
      return [{ dueDate: { sort: "asc", nulls: "last" } }, { priority: "desc" }];
  }
}

export async function getTasks(
  userId: string,
  filters: TaskFilters = {},
): Promise<TaskWithRelations[]> {
  return prisma.task.findMany({
    where: buildWhere(userId, filters),
    include: taskInclude,
    orderBy: buildOrderBy(filters.sort),
  });
}

export async function getTaskById(
  userId: string,
  id: string,
): Promise<TaskWithRelations | null> {
  return prisma.task.findFirst({
    where: { id, userId },
    include: taskInclude,
  });
}

export async function getTaskStats(userId: string): Promise<TaskStats> {
  const start = startOfToday();
  const end = endOfToday();

  const [total, completed, inProgress, todo, overdue, dueToday] =
    await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, status: "DONE" } }),
      prisma.task.count({ where: { userId, status: "IN_PROGRESS" } }),
      prisma.task.count({ where: { userId, status: "TODO" } }),
      prisma.task.count({
        where: { userId, status: { not: "DONE" }, dueDate: { lt: start } },
      }),
      prisma.task.count({
        where: {
          userId,
          status: { not: "DONE" },
          dueDate: { gte: start, lte: end },
        },
      }),
    ]);

  const pending = total - completed;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    pending,
    inProgress,
    todo,
    overdue,
    dueToday,
    completionRate,
  };
}

export async function getUpcomingTasks(
  userId: string,
  limit = 5,
): Promise<TaskWithRelations[]> {
  return prisma.task.findMany({
    where: {
      userId,
      status: { not: "DONE" },
      dueDate: { gte: startOfToday() },
    },
    include: taskInclude,
    orderBy: [{ dueDate: "asc" }],
    take: limit,
  });
}

export async function getCategories(
  userId: string,
): Promise<CategoryWithCount[]> {
  return prisma.category.findMany({
    where: { userId },
    include: { _count: { select: { tasks: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getTags(userId: string) {
  return prisma.tag.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}
