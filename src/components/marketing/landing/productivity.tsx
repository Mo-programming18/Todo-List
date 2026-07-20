import { Check, TrendingUp } from "lucide-react";

import { CountUp, Reveal } from "@/components/marketing/landing/motion-primitives";

const CHECKLIST = [
  "Plan your day in under five minutes",
  "Turn big projects into clear next steps",
  "Never lose track of a deadline again",
  "Watch your progress add up every week",
];

const STATS = [
  { value: 10, suffix: "k+", label: "Active users" },
  { value: 1, suffix: "M+", label: "Tasks completed" },
  { value: 99.9, decimals: 1, suffix: "%", label: "Uptime" },
];

const WEEK = [
  { day: "M", value: 45 },
  { day: "T", value: 68 },
  { day: "W", value: 52 },
  { day: "T", value: 80 },
  { day: "F", value: 63 },
  { day: "S", value: 90 },
  { day: "S", value: 74 },
];

export function Productivity() {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Visual */}
        <Reveal className="order-2 lg:order-1">
          <div className="relative">
            <div className="absolute -inset-3 -z-10 rounded-3xl bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_14%,transparent),color-mix(in_oklab,var(--chart-3)_14%,transparent))] blur-2xl" />
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Weekly overview</p>
                  <p className="text-xs text-muted-foreground">Tasks completed</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--chart-3)]/12 px-2.5 py-1 text-xs font-medium text-[var(--chart-3)]">
                  <TrendingUp className="size-3.5" />
                  +18%
                </span>
              </div>

              <div className="mt-6 flex items-end justify-between gap-2">
                {WEEK.map((d, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-32 w-full items-end justify-center">
                      <div
                        className="w-full max-w-8 rounded-lg bg-[linear-gradient(to_top,var(--primary),color-mix(in_oklab,var(--chart-2)_80%,var(--primary)))]"
                        style={{ height: `${d.value}%` }}
                      />
                    </div>
                    <span className="text-[0.7rem] text-muted-foreground">
                      {d.day}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">This week</p>
                  <p className="mt-0.5 text-xl font-semibold tabular-nums">47</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Focus time</p>
                  <p className="mt-0.5 text-xl font-semibold tabular-nums">
                    22h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Content */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Do more of your best work, with less effort
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Stop juggling scattered lists and half-finished notes. TaskFlow
              gives every task a home and every day a clear plan.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-8 grid gap-3">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--chart-3)]/15 text-[var(--chart-3)]">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-[0.95rem] text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    <CountUp
                      value={s.value}
                      decimals={s.decimals ?? 0}
                      suffix={s.suffix}
                    />
                  </dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
