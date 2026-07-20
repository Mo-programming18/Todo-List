"use client";

import {
  BarChart3,
  CalendarClock,
  CalendarDays,
  Flag,
  ListChecks,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/marketing/landing/motion-primitives";
import { cn } from "@/lib/utils";

type Feature = {
  icon: LucideIcon;
  title: string;
  body: string;
  featured?: "indigo" | "emerald";
};

const FEATURES: Feature[] = [
  {
    icon: ListChecks,
    title: "Smart task management",
    body: "Capture, group, and reorder tasks in seconds. Sub-tasks, tags, and notes keep every detail where it belongs.",
    featured: "indigo",
  },
  { icon: Flag, title: "Priority levels", body: "Four color-coded levels so the urgent work never hides behind the trivial." },
  { icon: CalendarClock, title: "Due dates", body: "Set deadlines and see what's overdue, due today, or coming up next." },
  { icon: CalendarDays, title: "Calendar view", body: "See your whole month at a glance and drag tasks onto the right day." },
  { icon: RefreshCw, title: "Real-time sync", body: "Changes appear instantly across every open tab and device." },
  {
    icon: BarChart3,
    title: "Analytics dashboard",
    body: "Completion trends and weekly insights that show your momentum over time.",
    featured: "emerald",
  },
];

export function Features() {
  return (
    <section id="features" className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Everything you need to stay on top
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Powerful where it counts, quiet everywhere else. TaskFlow keeps the
            essentials close and the clutter out of the way.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <StaggerItem key={f.title} index={i}>
              <FeatureCard feature={f} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const { icon: Icon, title, body, featured } = feature;
  return (
    <div
      className={cn(
        "group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/15 hover:shadow-[0_18px_40px_-20px_rgba(15,23,42,0.28)] dark:hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.6)]",
        featured === "indigo" &&
          "bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_10%,var(--card)),var(--card))]",
        featured === "emerald" &&
          "bg-[linear-gradient(135deg,color-mix(in_oklab,var(--chart-3)_12%,var(--card)),var(--card))]",
        !featured && "bg-card",
      )}
    >
      {featured && (
        <div
          aria-hidden
          className={cn(
            "absolute -right-8 -top-8 size-28 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-90",
            featured === "indigo" ? "bg-primary/20" : "bg-[var(--chart-3)]/20",
          )}
        />
      )}
      <span
        className={cn(
          "grid size-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105",
          featured === "emerald"
            ? "bg-[var(--chart-3)]/12 text-[var(--chart-3)]"
            : "bg-primary/10 text-primary",
        )}
      >
        <Icon className="size-5" strokeWidth={2} />
      </span>
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground text-pretty">{body}</p>
    </div>
  );
}
