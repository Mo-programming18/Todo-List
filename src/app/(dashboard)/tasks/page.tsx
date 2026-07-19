import type { Metadata } from "next";
import { ClipboardList, SearchX } from "lucide-react";

import { requireUser } from "@/lib/dal";
import { getCategories, getTags, getTasks } from "@/server/queries/tasks";
import { PageHeader } from "@/components/dashboard/page-header";
import { TaskList } from "@/components/tasks/task-list";
import { TaskFilterBar } from "@/components/tasks/task-filter-bar";
import { CreateTaskButton } from "@/components/tasks/create-task-button";
import { EmptyState } from "@/components/shared/empty-state";
import type { Priority, TaskFilters, TaskSort, TaskStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Tasks" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function pick(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await requireUser();
  const sp = await searchParams;

  const filters: TaskFilters = {
    status: (pick(sp.status) as TaskStatus | "all") ?? "all",
    priority: (pick(sp.priority) as Priority | "all") ?? "all",
    categoryId: pick(sp.category) ?? "all",
    search: pick(sp.search),
    sort: (pick(sp.sort) as TaskSort) ?? "dueDate",
  };

  const [tasks, categories, tags] = await Promise.all([
    getTasks(user.id, filters),
    getCategories(user.id),
    getTags(user.id),
  ]);

  const hasFilters =
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.categoryId !== "all" ||
    !!filters.search;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tasks"
        description={`${tasks.length} task${tasks.length === 1 ? "" : "s"} ${
          hasFilters ? "match your filters" : "in your workspace"
        }`}
      >
        <CreateTaskButton categories={categories} tags={tags} />
      </PageHeader>

      <TaskFilterBar categories={categories} />

      {tasks.length === 0 ? (
        hasFilters ? (
          <EmptyState
            icon={SearchX}
            title="No tasks match your filters"
            description="Try adjusting or clearing the filters to see more tasks."
          />
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="No tasks yet"
            description="Create your first task to start organizing your work."
          />
        )
      ) : (
        <TaskList tasks={tasks} categories={categories} tags={tags} />
      )}
    </div>
  );
}
