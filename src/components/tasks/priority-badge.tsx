import { Badge } from "@/components/ui/badge";
import { PRIORITY_META } from "@/lib/constants";
import type { Priority } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PriorityBadge({
  priority,
  className,
}: {
  priority: Priority;
  className?: string;
}) {
  const meta = PRIORITY_META[priority];
  const Icon = meta.icon;
  return (
    <Badge variant="outline" className={cn(meta.badgeClass, className)}>
      <Icon className="size-3" />
      {meta.label}
    </Badge>
  );
}
