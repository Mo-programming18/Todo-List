"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { PRIORITY_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { CategoryWithCount, Tag, TaskWithRelations } from "@/lib/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarView({
  year,
  month,
  tasks,
  categories,
  tags,
}: {
  year: number;
  month: number;
  tasks: TaskWithRelations[];
  categories: CategoryWithCount[];
  tags: Tag[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<TaskWithRelations | null>(null);

  const current = new Date(year, month, 1);
  const gridStart = startOfWeek(startOfMonth(current));
  const gridEnd = endOfWeek(endOfMonth(current));
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const tasksByDay = new Map<string, TaskWithRelations[]>();
  for (const task of tasks) {
    if (!task.dueDate) continue;
    const key = format(new Date(task.dueDate), "yyyy-MM-dd");
    const list = tasksByDay.get(key);
    if (list) list.push(task);
    else tasksByDay.set(key, [task]);
  }

  function goTo(date: Date) {
    router.push(`/calendar?month=${format(date, "yyyy-MM")}`, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{format(current, "MMMM yyyy")}</h2>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goTo(new Date())}
            className="mr-1"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goTo(addMonths(current, -1))}
            aria-label="Previous month"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goTo(addMonths(current, 1))}
            aria-label="Next month"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="grid grid-cols-7 border-b bg-muted/40">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="px-2 py-2 text-center text-xs font-medium text-muted-foreground"
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day[0]}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayTasks = tasksByDay.get(key) ?? [];
            const inMonth = isSameMonth(day, current);
            const today = isToday(day);

            return (
              <div
                key={key}
                className={cn(
                  "min-h-24 border-t border-l p-1.5 [&:nth-child(7n+1)]:border-l-0 sm:min-h-28",
                  !inMonth && "bg-muted/30 text-muted-foreground",
                )}
              >
                <div className="mb-1 flex justify-end">
                  <span
                    className={cn(
                      "grid size-6 place-items-center rounded-full text-xs tabular-nums",
                      today && "bg-primary font-semibold text-primary-foreground",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  {dayTasks.slice(0, 3).map((task) => {
                    const meta = PRIORITY_META[task.priority];
                    return (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => setEditing(task)}
                        className={cn(
                          "flex w-full items-center gap-1.5 rounded px-1.5 py-0.5 text-left text-xs transition-colors hover:bg-accent",
                          task.status === "DONE" &&
                            "text-muted-foreground line-through",
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 shrink-0 rounded-full",
                            meta.dotClass,
                          )}
                          aria-hidden
                        />
                        <span className="truncate">{task.title}</span>
                      </button>
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <span className="px-1.5 text-[11px] text-muted-foreground">
                      +{dayTasks.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editing && (
        <TaskDialog
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          task={editing}
          categories={categories}
          tags={tags}
        />
      )}
    </div>
  );
}
