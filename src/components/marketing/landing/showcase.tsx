import { Check } from "lucide-react";

import { DashboardPreview } from "@/components/marketing/landing/dashboard-preview";
import { Reveal } from "@/components/marketing/landing/motion-primitives";
import { cn } from "@/lib/utils";

function BrowserFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-2xl",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[var(--priority-urgent)]/50" />
        <span className="size-2.5 rounded-full bg-[var(--priority-high)]/50" />
        <span className="size-2.5 rounded-full bg-[var(--chart-3)]/50" />
        <div className="mx-auto rounded-md bg-muted px-6 py-1 text-[0.7rem] text-muted-foreground">
          app.taskflow.io/dashboard
        </div>
      </div>
      {children}
    </div>
  );
}

const MOBILE_TASKS = [
  { title: "Finalize roadmap", color: "var(--priority-urgent)", done: false },
  { title: "Design review", color: "var(--priority-high)", done: false },
  { title: "Reply to Acme", color: "var(--priority-medium)", done: false },
  { title: "Book flights", color: "var(--priority-low)", done: true },
];

function PhoneFrame({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[2.2rem] border-[6px] border-foreground/85 bg-card p-2 shadow-2xl dark:border-foreground/25",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[1.6rem] bg-background">
        <div className="absolute left-1/2 top-2 z-10 h-1.5 w-14 -translate-x-1/2 rounded-full bg-foreground/15" />
        <div className="space-y-3 p-4 pt-7">
          <div>
            <p className="text-sm font-semibold">Today</p>
            <p className="text-[0.65rem] text-muted-foreground">4 tasks</p>
          </div>
          <div className="space-y-2">
            {MOBILE_TASKS.map((t) => (
              <div
                key={t.title}
                className="flex items-center gap-2 rounded-xl border border-border bg-card p-2.5"
              >
                <span
                  className={cn(
                    "grid size-4 place-items-center rounded-[5px] border",
                    t.done
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input",
                  )}
                >
                  {t.done && <Check className="size-2.5" />}
                </span>
                <span
                  className={cn(
                    "flex-1 truncate text-[0.7rem]",
                    t.done && "text-muted-foreground line-through",
                  )}
                >
                  {t.title}
                </span>
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: t.color }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Showcase() {
  return (
    <section id="showcase" className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Beautiful on every screen
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            The same focused experience on your desktop, tablet, and phone, in
            perfect sync.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="relative mx-auto mt-16 max-w-5xl">
          {/* Tablet, behind-left (large screens only) */}
          <div className="absolute -left-2 bottom-0 hidden w-[300px] -rotate-[4deg] rounded-2xl border-[6px] border-foreground/80 bg-card shadow-xl lg:block dark:border-foreground/20">
            <div className="overflow-hidden rounded-xl">
              <DashboardPreview className="rounded-none border-0 shadow-none" />
            </div>
          </div>

          {/* Desktop, centerpiece */}
          <BrowserFrame className="relative z-10 mx-auto max-w-4xl">
            <DashboardPreview className="rounded-none border-0 shadow-none" />
          </BrowserFrame>

          {/* Phone, front-right */}
          <PhoneFrame className="absolute -bottom-6 right-2 z-20 w-[168px] sm:w-[190px] lg:-right-2" />
        </Reveal>
      </div>
    </section>
  );
}
