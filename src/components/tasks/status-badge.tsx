import { Badge } from "@/components/ui/badge";
import { STATUS_META } from "@/lib/constants";
import type { TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusBadge({
  status,
  className,
}: {
  status: TaskStatus;
  className?: string;
}) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <Badge variant="outline" className={cn(meta.badgeClass, className)}>
      <Icon className="size-3" />
      {meta.label}
    </Badge>
  );
}
