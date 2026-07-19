import { ListChecks } from "lucide-react";

import { cn } from "@/lib/utils";

export function Brand({
  className,
  iconOnly = false,
  invert = false,
}: {
  className?: string;
  iconOnly?: boolean;
  invert?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold", className)}>
      <span
        className={cn(
          "grid size-7 place-items-center rounded-lg shadow-sm",
          invert
            ? "bg-primary-foreground text-primary"
            : "bg-primary text-primary-foreground",
        )}
      >
        <ListChecks className="size-4" strokeWidth={2.25} />
      </span>
      {!iconOnly && (
        <span className="text-lg tracking-tight">TaskFlow</span>
      )}
    </span>
  );
}
