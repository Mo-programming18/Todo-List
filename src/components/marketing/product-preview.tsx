import { Check } from "lucide-react";

import { PriorityBadge } from "@/components/tasks/priority-badge";
import type { Priority } from "@/lib/types";
import { cn } from "@/lib/utils";

const ROWS: {
  title: string;
  priority: Priority;
  due: string;
  done: boolean;
}[] = [
  { title: "Finalize Q3 roadmap deck", priority: "URGENT", due: "Today", done: false },
  { title: "Review the new design proposal", priority: "HIGH", due: "Tomorrow", done: false },
  { title: "Send the investor update", priority: "MEDIUM", due: "Thursday", done: false },
  { title: "Book flights for the offsite", priority: "LOW", due: "", done: true },
];

export function ProductPreview() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-sm font-semibold">Today</p>
        <span className="text-xs text-muted-foreground">4 tasks</span>
      </div>
      <div className="flex flex-col gap-2">
        {ROWS.map((row) => (
          <div
            key={row.title}
            className="flex items-center gap-3 rounded-lg border bg-background p-3"
          >
            <span
              className={cn(
                "grid size-4 shrink-0 place-items-center rounded-[4px] border",
                row.done
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input",
              )}
            >
              {row.done && <Check className="size-3" />}
            </span>
            <span
              className={cn(
                "flex-1 truncate text-sm",
                row.done && "text-muted-foreground line-through",
              )}
            >
              {row.title}
            </span>
            {row.due && (
              <span className="hidden text-xs text-muted-foreground sm:inline">
                {row.due}
              </span>
            )}
            <PriorityBadge priority={row.priority} />
          </div>
        ))}
      </div>
    </div>
  );
}
