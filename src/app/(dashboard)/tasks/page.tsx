import type { Metadata } from "next";
import { ClipboardList } from "lucide-react";

import { requireUser } from "@/lib/dal";
import { getCategories, getTags, getTasks } from "@/server/queries/tasks";
import { PageHeader } from "@/components/dashboard/page-header";
import { TaskList } from "@/components/tasks/task-list";
import { CreateTaskButton } from "@/components/tasks/create-task-button";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = { title: "Tasks" };

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const user = await requireUser();
  const { search } = await searchParams;

  const [tasks, categories, tags] = await Promise.all([
    getTasks(user.id, { search, sort: "priority", view: "all" }),
    getCategories(user.id),
    getTags(user.id),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tasks"
        description={
          search
            ? `Results for "${search}"`
            : `${tasks.length} task${tasks.length === 1 ? "" : "s"} in your workspace`
        }
      >
        <CreateTaskButton categories={categories} tags={tags} />
      </PageHeader>

      {tasks.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={search ? "No matching tasks" : "No tasks yet"}
          description={
            search
              ? "Try a different search term."
              : "Create your first task to start organizing your work."
          }
        />
      ) : (
        <TaskList tasks={tasks} categories={categories} tags={tags} />
      )}
    </div>
  );
}
