import { TaskCard } from "@/components/tasks/task-card";
import type { CategoryWithCount, Tag, TaskWithRelations } from "@/lib/types";

export function TaskList({
  tasks,
  categories,
  tags,
}: {
  tasks: TaskWithRelations[];
  categories: CategoryWithCount[];
  tags: Tag[];
}) {
  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          categories={categories}
          tags={tags}
        />
      ))}
    </div>
  );
}
