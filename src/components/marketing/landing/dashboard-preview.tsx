import {
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  ListChecks,
  Search,
  Settings2,
  SlidersHorizontal,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Priority = "urgent" | "high" | "medium" | "low";

const PRIORITY_STYLE: Record<Priority, string> = {
  urgent: "bg-[var(--priority-urgent)]/12 text-[var(--priority-urgent)]",
  high: "bg-[var(--priority-high)]/12 text-[var(--priority-high)]",
  medium: "bg-[var(--priority-medium)]/12 text-[var(--priority-medium)]",
  low: "bg-[var(--priority-low)]/12 text-[var(--priority-low)]",
};

const TODAY: { title: string; priority: Priority; due: string; done?: boolean }[] =
  [
    { title: "Finalize Q3 roadmap deck", priority: "urgent", due: "2:00 PM" },
    { title: "Review design proposal", priority: "high", due: "4:30 PM" },
    { title: "Reply to the Acme thread", priority: "medium", due: "Today" },
    { title: "Book offsite flights", priority: "low", due: "", done: true },
  ];

const NAV = [
  { label: "Overview", icon: BarChart3, active: true },
  { label: "Tasks", icon: ListChecks },
  { label: "Calendar", icon: CalendarDays },
  { label: "Settings", icon: Settings2 },
];

const PROJECTS = [
  { name: "Product", color: "var(--chart-1)" },
  { name: "Marketing", color: "var(--chart-2)" },
  { name: "Personal", color: "var(--chart-3)" },
];

const BARS = [40, 62, 48, 78, 56, 88, 70];

function ProgressRing({ value }: { value: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 64 64" className="size-16 -rotate-90">
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="color-mix(in oklab, var(--foreground) 10%, transparent)"
        strokeWidth="7"
      />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (value / 100) * c}
      />
    </svg>
  );
}

/**
 * A miniature of the real TaskFlow dashboard used as the product visual.
 * Purely presentational — no interactivity, safe as a Server Component.
 */
export function DashboardPreview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] dark:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[var(--priority-urgent)]/60" />
          <span className="size-2.5 rounded-full bg-[var(--priority-high)]/60" />
          <span className="size-2.5 rounded-full bg-[var(--chart-3)]/60" />
        </div>
        <div className="ml-2 flex h-8 flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 text-xs text-muted-foreground">
          <Search className="size-3.5" />
          Search tasks, projects…
        </div>
        <Bell className="size-4 text-muted-foreground" />
        <span className="grid size-7 place-items-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--chart-2))] text-[0.7rem] font-semibold text-white">
          MO
        </span>
      </div>

      <div className="grid grid-cols-[128px_1fr] sm:grid-cols-[150px_1fr]">
        {/* Sidebar */}
        <aside className="hidden flex-col gap-1 border-r border-border bg-sidebar/60 p-3 sm:flex">
          <div className="mb-2 flex items-center gap-2 px-1">
            <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground">
              <ListChecks className="size-3.5" />
            </span>
            <span className="text-sm font-semibold tracking-tight">TaskFlow</span>
          </div>
          {NAV.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium",
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground",
              )}
            >
              <item.icon className="size-3.5" />
              {item.label}
            </div>
          ))}
          <p className="mt-3 px-2 text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Projects
          </p>
          {PROJECTS.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground"
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              {p.name}
            </div>
          ))}
        </aside>

        {/* Main */}
        <div className="min-w-0 space-y-4 p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[0.95rem] font-semibold tracking-tight">
                Good morning, Maya
              </p>
              <p className="text-xs text-muted-foreground">
                You have 4 tasks due today
              </p>
            </div>
            <div className="hidden items-center gap-1 rounded-lg border border-border px-2 py-1 text-[0.7rem] text-muted-foreground sm:flex">
              <SlidersHorizontal className="size-3" />
              This week
            </div>
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-background p-3">
              <p className="text-[0.65rem] text-muted-foreground">Completed</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">128</p>
              <p className="text-[0.6rem] font-medium text-[var(--chart-3)]">
                +12 this week
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3">
              <p className="text-[0.65rem] text-muted-foreground">In progress</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">7</p>
              <div className="mt-2 flex items-end gap-0.5">
                {BARS.map((h, i) => (
                  <span
                    key={i}
                    className="w-1.5 rounded-sm bg-primary/30"
                    style={{ height: `${h * 0.16}rem` }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-3">
              <ProgressRing value={78} />
              <div>
                <p className="text-[0.65rem] text-muted-foreground">Progress</p>
                <p className="text-lg font-semibold tabular-nums">78%</p>
              </div>
            </div>
          </div>

          {/* Today's tasks */}
          <div className="rounded-xl border border-border bg-background">
            <div className="flex items-center justify-between px-3 py-2">
              <p className="text-xs font-semibold">Today</p>
              <span className="text-[0.65rem] text-muted-foreground">
                Upcoming
              </span>
            </div>
            <div className="divide-y divide-border">
              {TODAY.map((t) => (
                <div key={t.title} className="flex items-center gap-2.5 px-3 py-2">
                  <span
                    className={cn(
                      "grid size-4 shrink-0 place-items-center rounded-[5px] border",
                      t.done
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input",
                    )}
                  >
                    {t.done && <Check className="size-3" />}
                  </span>
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-xs",
                      t.done && "text-muted-foreground line-through",
                    )}
                  >
                    {t.title}
                  </span>
                  {t.due && (
                    <span className="hidden text-[0.65rem] text-muted-foreground sm:inline">
                      {t.due}
                    </span>
                  )}
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[0.6rem] font-medium capitalize",
                      PRIORITY_STYLE[t.priority],
                    )}
                  >
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
