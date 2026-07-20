import { ArrowRight, CalendarDays } from "lucide-react";

import {
  PrimaryCta,
  SecondaryCta,
} from "@/components/marketing/landing/cta-button";
import { Reveal } from "@/components/marketing/landing/motion-primitives";

export function FinalCta({ authed = false }: { authed?: boolean }) {
  return (
    <section className="relative px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_16%,var(--card)),var(--card)_45%,color-mix(in_oklab,var(--chart-2)_16%,var(--card)))] px-6 py-16 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl"
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Ready to boost your productivity?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground text-pretty">
              Join thousands of people who plan calmer, more focused days with
              TaskFlow. Start free in less than a minute.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <PrimaryCta href={authed ? "/dashboard" : "/register"} size="lg">
                {authed ? "Open dashboard" : "Start for Free"}
                <ArrowRight className="size-4" />
              </PrimaryCta>
              <SecondaryCta href="#contact" size="lg">
                <CalendarDays className="size-4 text-primary" />
                Book Demo
              </SecondaryCta>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
