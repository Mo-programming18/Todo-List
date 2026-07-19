"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { DueDate } from "@/components/tasks/due-date";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  deleteTask,
  setTaskStatus,
  toggleTaskComplete,
} from "@/server/actions/tasks";
import { STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type {
  CategoryWithCount,
  Tag,
  TaskStatus,
  TaskWithRelations,
} from "@/lib/types";

export function TaskCard({
  task,
  categories,
  tags,
}: {
  task: TaskWithRelations;
  categories: CategoryWithCount[];
  tags: Tag[];
}) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const done = task.status === "DONE";

  function handleToggle(checked: boolean | "indeterminate") {
    startTransition(async () => {
      const result = await toggleTaskComplete(task.id, checked === true);
      if (!result.ok) toast.error(result.error);
    });
  }

  function handleStatus(status: string) {
    startTransition(async () => {
      const result = await setTaskStatus(task.id, status as TaskStatus);
      if (!result.ok) toast.error(result.error);
    });
  }

  async function handleDelete() {
    setDeletePending(true);
    const result = await deleteTask(task.id);
    setDeletePending(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setConfirming(false);
    toast.success("Task deleted.");
  }

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-lg border bg-card p-3.5 transition-colors hover:border-foreground/20",
        isPending && "opacity-60",
      )}
    >
      <Checkbox
        checked={done}
        onCheckedChange={handleToggle}
        disabled={isPending}
        className="mt-0.5"
        aria-label={done ? "Mark as not done" : "Mark as done"}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="min-w-0 text-left"
          >
            <p
              className={cn(
                "text-sm leading-snug font-medium break-words",
                done && "text-muted-foreground line-through",
              )}
            >
              {task.title}
            </p>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
                aria-label="Task actions"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onSelect={() => setEditing(true)}>
                <Pencil />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Status
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={task.status}
                onValueChange={handleStatus}
              >
                {STATUSES.map((s) => (
                  <DropdownMenuRadioItem key={s.value} value={s.value}>
                    {s.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  setConfirming(true);
                }}
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && (
          <p
            className={cn(
              "mt-1 line-clamp-2 text-xs text-muted-foreground",
              done && "line-through",
            )}
          >
            {task.description}
          </p>
        )}

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <PriorityBadge priority={task.priority} />
          <DueDate date={task.dueDate} />
          {task.category && (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: task.category.color }}
                aria-hidden
              />
              {task.category.name}
            </span>
          )}
          {task.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-[11px]">
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      {editing && (
        <TaskDialog
          open={editing}
          onOpenChange={setEditing}
          task={task}
          categories={categories}
          tags={tags}
        />
      )}
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Delete this task?"
        description={`"${task.title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete task"
        onConfirm={handleDelete}
        pending={deletePending}
      />
    </div>
  );
}
