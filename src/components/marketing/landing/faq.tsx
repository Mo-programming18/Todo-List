"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";

import { Reveal } from "@/components/marketing/landing/motion-primitives";

const FAQS = [
  {
    q: "Is there really a free plan?",
    a: "Yes. The Free plan is free forever and includes projects, priorities, due dates, and the calendar view. No credit card required to start.",
  },
  {
    q: "Can I use TaskFlow on my phone?",
    a: "Absolutely. TaskFlow works beautifully on desktop, tablet, and mobile, and everything stays in sync in real time across your devices.",
  },
  {
    q: "Do you support recurring tasks?",
    a: "Yes. Set a task to repeat daily, weekly, or monthly and TaskFlow recreates it for you automatically on the Pro and Team plans.",
  },
  {
    q: "Can I collaborate with my team?",
    a: "The Team plan adds shared projects, task assignments, roles, and admin controls so your whole team can move together.",
  },
  {
    q: "Is my data secure?",
    a: "Your data is encrypted in transit and at rest, and you stay in control of it. You can export or delete your data at any time.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Of course. Upgrade, downgrade, or cancel whenever you like. There are no long-term contracts and no cancellation fees.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Everything you need to know. Still have a question?{" "}
            <a
              href="#contact"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Get in touch
            </a>
            .
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="divide-y divide-border rounded-2xl border border-border bg-card">
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.q}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left"
                    >
                      <span className="text-[0.95rem] font-medium">{item.q}</span>
                      <Plus
                        className={`size-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                          isOpen ? "rotate-45 text-primary" : ""
                        }`}
                      />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
