"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  TASK_FORM_ID,
  TaskForm,
  emptyTaskValues,
} from "@/components/tasks/task-form";
import { createTask, updateTask } from "@/server/actions/tasks";
import { toDateInputValue } from "@/lib/format";
import type {
  CategoryWithCount,
  Tag,
  TaskFormValues,
  TaskWithRelations,
} from "@/lib/types";

function toFormValues(task?: TaskWithRelations): TaskFormValues {
  if (!task) return emptyTaskValues;
  return {
    title: task.title,
    description: task.description ?? "",
    status: task.status,
    priority: task.priority,
    dueDate: toDateInputValue(task.dueDate),
    categoryId: task.categoryId ?? "",
    tags: task.tags.map((t) => t.name),
  };
}

export function TaskDialog({
  open,
  onOpenChange,
  task,
  categories,
  tags,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: TaskWithRelations;
  categories: CategoryWithCount[];
  tags: Tag[];
}) {
  const [pending, setPending] = useState(false);
  const isEdit = !!task;

  async function handleSubmit(values: TaskFormValues) {
    setPending(true);
    const result = isEdit
      ? await updateTask(task.id, values)
      : await createTask(values);
    setPending(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(isEdit ? "Task updated." : "Task created.");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details of your task."
              : "Add a task to your list. Only a title is required."}
          </DialogDescription>
        </DialogHeader>

        <TaskForm
          defaultValues={toFormValues(task)}
          categories={categories}
          tags={tags}
          onSubmit={handleSubmit}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={pending}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form={TASK_FORM_ID} disabled={pending}>
            {pending && <Loader2 className="animate-spin" />}
            {isEdit ? "Save changes" : "Create task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
