import type { Category, Tag, Task } from "@/generated/prisma/client";
import type { Priority, TaskStatus } from "@/generated/prisma/enums";

export type { Category, Tag, Task, Priority, TaskStatus };
export type { TaskFormValues } from "@/lib/validations/task";

export type TaskWithRelations = Task & {
  category: Category | null;
  tags: Tag[];
};

export type CategoryWithCount = Category & {
  _count: { tasks: number };
};

export type TaskSort =
  | "dueDate"
  | "priority"
  | "createdAt"
  | "title";

export type TaskFilters = {
  status?: TaskStatus | "all";
  priority?: Priority | "all";
  categoryId?: string | "all";
  tagId?: string | "all";
  search?: string;
  sort?: TaskSort;
  view?: "active" | "completed" | "all";
};

export type TaskStats = {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  todo: number;
  overdue: number;
  dueToday: number;
  completionRate: number;
};
