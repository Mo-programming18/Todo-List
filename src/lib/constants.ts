import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Circle,
  CircleCheck,
  CircleDot,
  Equal,
  type LucideIcon,
} from "lucide-react";

import { Priority, TaskStatus } from "@/generated/prisma/enums";

export { Priority, TaskStatus };

type PriorityMeta = {
  value: Priority;
  label: string;
  icon: LucideIcon;
  order: number;
  dotClass: string;
  textClass: string;
  badgeClass: string;
};

export const PRIORITY_META: Record<Priority, PriorityMeta> = {
  URGENT: {
    value: "URGENT",
    label: "Urgent",
    icon: AlertTriangle,
    order: 0,
    dotClass: "bg-priority-urgent",
    textClass: "text-priority-urgent",
    badgeClass: "border-priority-urgent/25 bg-priority-urgent/10 text-priority-urgent",
  },
  HIGH: {
    value: "HIGH",
    label: "High",
    icon: ArrowUp,
    order: 1,
    dotClass: "bg-priority-high",
    textClass: "text-priority-high",
    badgeClass: "border-priority-high/25 bg-priority-high/10 text-priority-high",
  },
  MEDIUM: {
    value: "MEDIUM",
    label: "Medium",
    icon: Equal,
    order: 2,
    dotClass: "bg-priority-medium",
    textClass: "text-priority-medium",
    badgeClass: "border-priority-medium/25 bg-priority-medium/10 text-priority-medium",
  },
  LOW: {
    value: "LOW",
    label: "Low",
    icon: ArrowDown,
    order: 3,
    dotClass: "bg-priority-low",
    textClass: "text-priority-low",
    badgeClass: "border-priority-low/25 bg-priority-low/10 text-priority-low",
  },
};

export const PRIORITIES = Object.values(PRIORITY_META).sort(
  (a, b) => a.order - b.order,
);

type StatusMeta = {
  value: TaskStatus;
  label: string;
  icon: LucideIcon;
  badgeClass: string;
};

export const STATUS_META: Record<TaskStatus, StatusMeta> = {
  TODO: {
    value: "TODO",
    label: "To do",
    icon: Circle,
    badgeClass: "border-border bg-muted text-muted-foreground",
  },
  IN_PROGRESS: {
    value: "IN_PROGRESS",
    label: "In progress",
    icon: CircleDot,
    badgeClass: "border-priority-medium/25 bg-priority-medium/10 text-priority-medium",
  },
  DONE: {
    value: "DONE",
    label: "Done",
    icon: CircleCheck,
    badgeClass: "border-success/25 bg-success/10 text-success",
  },
};

export const STATUSES = Object.values(STATUS_META);

/** Preset colors offered when creating a category. */
export const CATEGORY_COLORS = [
  "#6366f1",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
  "#64748b",
];
