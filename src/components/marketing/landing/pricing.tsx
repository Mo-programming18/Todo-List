import { Check, Sparkles } from "lucide-react";

import {
  PrimaryCta,
  SecondaryCta,
} from "@/components/marketing/landing/cta-button";
import { Reveal, Stagger, StaggerItem } from "@/components/marketing/landing/motion-primitives";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    tagline: "For getting started with the essentials.",
    features: [
      "Up to 3 projects",
      "Priority levels & due dates",
      "Calendar view",
      "Dark mode",
    ],
    cta: "Get started",
    href: "/register",
    featured: false,
  },
  {
    name: "Pro",
    price: "$9",
    cadence: "per month",
    tagline: "For individuals who want it all.",
    features: [
      "Unlimited projects & tasks",
      "Recurring tasks & reminders",
      "Analytics dashboard",
      "Real-time sync across devices",
      "Priority support",
    ],
    cta: "Start free trial",
    href: "/register",
    featured: true,
  },
  {
    name: "Team",
    price: "$19",
    cadence: "per user / month",
    tagline: "For teams moving together.",
    features: [
      "Everything in Pro",
      "Shared projects & assignments",
      "Team collaboration",
      "Admin controls & roles",
    ],
    cta: "Contact sales",
    href: "#contact",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Simple pricing that scales with you
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Start free and upgrade when you are ready. No hidden fees, cancel
            anytime.
          </p>
        </Reveal>

        <Stagger className="mx-auto mt-14 grid max-w-5xl items-stretch gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <StaggerItem key={plan.name} index={i} className="h-full">
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-7 transition-all duration-300",
                  plan.featured
                    ? "border-primary/40 bg-card shadow-[0_24px_60px_-24px_color-mix(in_oklab,var(--primary)_45%,transparent)] lg:-translate-y-3 lg:scale-[1.03]"
                    : "border-border bg-card shadow-sm hover:-translate-y-1 hover:shadow-lg",
                )}
              >
                {plan.featured && (
                  <>
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -top-px mx-auto h-px w-2/3 bg-[linear-gradient(90deg,transparent,var(--primary),transparent)]"
                    />
                    <span className="absolute right-6 top-7 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[0.7rem] font-semibold text-primary">
                      <Sparkles className="size-3" />
                      Most popular
                    </span>
                  </>
                )}

                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.tagline}
                </p>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-4xl font-semibold tracking-tight tabular-nums">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {plan.cadence}
                  </span>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span
                        className={cn(
                          "mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full",
                          plan.featured
                            ? "bg-primary/12 text-primary"
                            : "bg-[var(--chart-3)]/12 text-[var(--chart-3)]",
                        )}
                      >
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      <span className="text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {plan.featured ? (
                    <PrimaryCta href={plan.href} className="w-full">
                      {plan.cta}
                    </PrimaryCta>
                  ) : (
                    <SecondaryCta href={plan.href} className="w-full">
                      {plan.cta}
                    </SecondaryCta>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
