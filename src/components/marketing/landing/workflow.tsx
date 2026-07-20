"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FolderKanban, PencilLine, Target, type LucideIcon } from "lucide-react";

import { Reveal } from "@/components/marketing/landing/motion-primitives";

const STEPS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: PencilLine,
    title: "Create tasks",
    body: "Add anything on your mind in a click. Titles, notes, due dates, and tags.",
  },
  {
    icon: FolderKanban,
    title: "Organize projects",
    body: "Group tasks into color-coded projects and sort them by priority.",
  },
  {
    icon: Target,
    title: "Complete goals",
    body: "Check things off, track your momentum, and hit every deadline.",
  },
];

export function Workflow() {
  return (
    <section className="relative bg-muted/40 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            From idea to done, in three steps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            A workflow simple enough to stick with, flexible enough to grow with
            you.
          </p>
        </Reveal>

        <div className="mt-16 flex flex-col items-stretch lg:flex-row">
          {STEPS.map((step, i) => (
            <Fragment key={step.title}>
              <StepCard step={step} index={i} />
              {i < STEPS.length - 1 && <Connector index={i} />}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
}: {
  step: (typeof STEPS)[number];
  index: number;
}) {
  const reduce = useReducedMotion();
  const { icon: Icon, title, body } = step;
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex-1 rounded-2xl border border-border bg-card p-8 text-center shadow-sm"
    >
      <span className="absolute right-5 top-5 text-4xl font-semibold text-foreground/[0.06] tabular-nums">
        0{index + 1}
      </span>
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-6" strokeWidth={1.75} />
      </span>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground text-pretty">
        {body}
      </p>
    </motion.div>
  );
}

function Connector({ index }: { index: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex items-center justify-center py-4 lg:px-4 lg:py-0">
      {/* Vertical on mobile, horizontal on desktop */}
      <motion.span
        className="h-8 w-px origin-top bg-[linear-gradient(to_bottom,var(--primary),transparent)] lg:hidden"
        initial={reduce ? false : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 + index * 0.15, ease: "easeOut" }}
      />
      <motion.span
        className="hidden h-px w-12 origin-left bg-[linear-gradient(to_right,var(--primary),color-mix(in_oklab,var(--primary)_20%,transparent))] lg:block"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 + index * 0.15, ease: "easeOut" }}
      />
    </div>
  );
}
