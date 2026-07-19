import { CalendarClock } from "lucide-react";

import { formatDueDate, type DueTone } from "@/lib/format";
import { cn } from "@/lib/utils";

const TONE_CLASS: Record<DueTone, string> = {
  overdue: "text-priority-urgent",
  today: "text-priority-high",
  tomorrow: "text-foreground",
  soon: "text-muted-foreground",
  normal: "text-muted-foreground",
};

export function DueDate({
  date,
  className,
}: {
  date: Date | string | null | undefined;
  className?: string;
}) {
  const due = formatDueDate(date);
  if (!due) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        TONE_CLASS[due.tone],
        className,
      )}
    >
      <CalendarClock className="size-3.5" />
      {due.label}
    </span>
  );
}
