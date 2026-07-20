"use client";

import { motion, useReducedMotion } from "motion/react";

// Deterministic particle field (no Math.random → no hydration mismatch).
const PARTICLES = [
  { left: "8%", top: "22%", size: 5, dur: 9, delay: 0 },
  { left: "18%", top: "68%", size: 3, dur: 11, delay: 1.4 },
  { left: "31%", top: "40%", size: 4, dur: 8, delay: 0.6 },
  { left: "44%", top: "78%", size: 3, dur: 12, delay: 2.1 },
  { left: "57%", top: "18%", size: 5, dur: 10, delay: 0.9 },
  { left: "69%", top: "60%", size: 3, dur: 9.5, delay: 1.8 },
  { left: "78%", top: "33%", size: 4, dur: 11.5, delay: 0.3 },
  { left: "88%", top: "72%", size: 3, dur: 8.5, delay: 2.6 },
  { left: "92%", top: "24%", size: 4, dur: 10.5, delay: 1.1 },
];

const BLOBS = [
  {
    className:
      "absolute -top-24 left-[8%] size-[34rem] rounded-full bg-[var(--primary)] opacity-20 blur-[120px] dark:opacity-25",
    animate: { x: [0, 40, 0], y: [0, 30, 0] },
  },
  {
    className:
      "absolute -top-10 right-[6%] size-[30rem] rounded-full bg-[var(--chart-2)] opacity-20 blur-[120px] dark:opacity-25",
    animate: { x: [0, -34, 0], y: [0, 40, 0] },
  },
  {
    className:
      "absolute top-[40%] left-1/2 size-[26rem] -translate-x-1/2 rounded-full bg-[var(--chart-3)] opacity-[0.14] blur-[130px] dark:opacity-20",
    animate: { x: [0, 26, 0], y: [0, -28, 0] },
  },
];

export function HeroBackground() {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Soft base wash */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_60%)]" />

      {/* Subtle grid, faded toward the edges */}
      <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--foreground)_8%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--foreground)_8%,transparent)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(100%_80%_at_50%_0%,black,transparent_75%)]" />

      {/* Blurred gradient blobs */}
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className={b.className}
          animate={reduce ? undefined : b.animate}
          transition={
            reduce
              ? undefined
              : {
                  duration: 18,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
          }
        />
      ))}

      {/* Floating particles */}
      {!reduce &&
        PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-[var(--primary)]/40 dark:bg-[var(--primary)]/50"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
            animate={{ y: [0, -14, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{
              duration: p.dur,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
    </div>
  );
}
