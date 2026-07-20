"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Premium 3D tilt button (Apple / Stripe / Linear feel). On hover the surface
 * lifts out of the page via perspective + translateZ, tilts a few degrees
 * toward the cursor, and a soft specular highlight tracks the pointer. Motion
 * is spring-driven; on press it eases back into the page (translateZ down,
 * scale 0.98). No glow, gradient, neon, or pulse. Collapses to a quiet
 * shadow/color hover under reduced motion.
 */

const SPRING = { stiffness: 250, damping: 20, mass: 0.6 } as const;

const base = cn(
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl text-sm font-semibold whitespace-nowrap select-none",
  "transition-[box-shadow,background-color,border-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:shadow-none",
  "[&_svg]:relative [&_svg]:z-[1] [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-[cubic-bezier(0.22,1,0.36,1)] hover:[&_svg]:translate-x-1",
);

const sizes = { md: "h-11 px-5", lg: "h-12 px-6 text-[0.95rem]" } as const;

const VARIANTS = {
  primary: {
    surface:
      "bg-primary text-primary-foreground shadow-[0_1px_2px_rgba(15,23,42,0.12)] hover:shadow-[0_18px_38px_-14px_color-mix(in_oklab,var(--primary)_60%,transparent)]",
    highlight: "rgba(255,255,255,0.28)",
  },
  secondary: {
    surface:
      "border border-border bg-card text-foreground shadow-[0_1px_2px_rgba(15,23,42,0.05)] hover:border-foreground/20 hover:bg-muted/60 hover:shadow-[0_18px_38px_-16px_rgba(15,23,42,0.45)]",
    highlight: "color-mix(in oklab, var(--primary) 16%, transparent)",
  },
} as const;

type CtaProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  size?: keyof typeof sizes;
  disabled?: boolean;
};

function TiltButton({
  href,
  children,
  className,
  size = "md",
  disabled,
  variant,
}: CtaProps & { variant: keyof typeof VARIANTS }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const enabled = !reduce && !disabled;

  // Normalized pointer position (-0.5..0.5), hover/press flags.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const hover = useMotionValue(0);
  const press = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [3.5, -3.5]), SPRING);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-3.5, 3.5]), SPRING);
  const z = useSpring(
    useTransform([hover, press], ([h, p]: number[]) => (p ? -6 : h * 10)),
    SPRING,
  );
  const scale = useSpring(
    useTransform([hover, press], ([h, p]: number[]) => (p ? 0.98 : 1 + h * 0.015)),
    SPRING,
  );

  const glowOpacity = useSpring(hover, { stiffness: 200, damping: 30 });
  const gx = useTransform(px, [-0.5, 0.5], ["0%", "100%"]);
  const gy = useTransform(py, [-0.5, 0.5], ["0%", "100%"]);
  const highlight = useMotionTemplate`radial-gradient(120px circle at ${gx} ${gy}, ${VARIANTS[variant].highlight}, transparent 55%)`;

  return (
    <motion.a
      ref={ref}
      {...(disabled ? { "aria-disabled": true, tabIndex: -1 } : { href })}
      onMouseMove={(e) => {
        if (!enabled || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseEnter={() => enabled && hover.set(1)}
      onMouseLeave={() => {
        hover.set(0);
        press.set(0);
        px.set(0);
        py.set(0);
      }}
      onPointerDown={() => enabled && press.set(1)}
      onPointerUp={() => press.set(0)}
      style={
        enabled
          ? {
              transformPerspective: 650,
              transformStyle: "preserve-3d",
              rotateX,
              rotateY,
              z,
              scale,
            }
          : undefined
      }
      className={cn(base, sizes[size], VARIANTS[variant].surface, className)}
    >
      <span className="relative z-[1] inline-flex items-center gap-2">
        {children}
      </span>
      {enabled && (
        <motion.span
          aria-hidden
          style={{ backgroundImage: highlight, opacity: glowOpacity }}
          className="pointer-events-none absolute inset-0"
        />
      )}
    </motion.a>
  );
}

export function PrimaryCta(props: CtaProps) {
  return <TiltButton variant="primary" {...props} />;
}

export function SecondaryCta(props: CtaProps) {
  return <TiltButton variant="secondary" {...props} />;
}
