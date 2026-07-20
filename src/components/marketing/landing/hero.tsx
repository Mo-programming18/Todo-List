"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowRight, CheckCircle2, Play, Sparkles } from "lucide-react";

import { DashboardPreview } from "@/components/marketing/landing/dashboard-preview";
import { HeroBackground } from "@/components/marketing/landing/hero-background";
import {
  PrimaryCta,
  SecondaryCta,
} from "@/components/marketing/landing/cta-button";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ authed = false }: { authed?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);

  const fx = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: 0.05 + i * 0.09, ease: EASE },
  });

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-dvh items-center overflow-hidden px-4 pt-28 pb-16 sm:px-6 lg:px-8"
    >
      <HeroBackground />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:gap-10">
        <div>
          <motion.span
            {...fx(0)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm"
          >
            <Sparkles className="size-3.5 text-primary" />
            Your calmest, most productive workspace
          </motion.span>

          <motion.h1
            {...fx(1)}
            className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Organize your work.{" "}
            <span className="bg-[linear-gradient(120deg,var(--primary),var(--chart-2)_55%,var(--chart-3))] bg-clip-text text-transparent">
              Focus on what matters.
            </span>
          </motion.h1>

          <motion.p
            {...fx(2)}
            className="mt-5 max-w-xl text-lg text-muted-foreground text-pretty"
          >
            TaskFlow helps you organize tasks, manage projects, set priorities,
            and stay productive every day.
          </motion.p>

          <motion.div
            {...fx(3)}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <PrimaryCta href={authed ? "/dashboard" : "/register"} size="lg">
              {authed ? "Open dashboard" : "Start for Free"}
              <ArrowRight className="size-4" />
            </PrimaryCta>
            <SecondaryCta href="#showcase" size="lg">
              <Play className="size-4 text-primary" />
              Watch Demo
            </SecondaryCta>
          </motion.div>

          <motion.p
            {...fx(4)}
            className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <CheckCircle2 className="size-4 text-[var(--chart-3)]" />
            Free forever plan. No credit card required.
          </motion.p>
        </div>

        {/* Product visual with parallax + floating accents */}
        <motion.div
          style={{ y }}
          initial={reduce ? false : { opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_16%,transparent),color-mix(in_oklab,var(--chart-2)_16%,transparent))] blur-2xl" />
          <DashboardPreview />

          <FloatCard
            className="absolute -left-4 -top-4 hidden sm:flex"
            delay={0}
          >
            <span className="grid size-7 place-items-center rounded-lg bg-[var(--chart-3)]/15 text-[var(--chart-3)]">
              <CheckCircle2 className="size-4" />
            </span>
            <div className="leading-tight">
              <p className="text-xs font-semibold">Task completed</p>
              <p className="text-[0.65rem] text-muted-foreground">Design review</p>
            </div>
          </FloatCard>

          <FloatCard
            className="absolute -bottom-5 -right-3 hidden sm:flex"
            delay={1.2}
          >
            <span className="grid size-7 place-items-center rounded-lg bg-primary/12 text-primary">
              <Sparkles className="size-4" />
            </span>
            <div className="leading-tight">
              <p className="text-xs font-semibold">On a 6-day streak</p>
              <p className="text-[0.65rem] text-muted-foreground">Keep it going</p>
            </div>
          </FloatCard>
        </motion.div>
      </div>
    </section>
  );
}

function FloatCard({
  children,
  className,
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  delay: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      animate={reduce ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 5, delay, repeat: Infinity, ease: "easeInOut" }}
      className={`items-center gap-2.5 rounded-xl border border-border bg-card/90 px-3 py-2 shadow-lg backdrop-blur-md ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}
