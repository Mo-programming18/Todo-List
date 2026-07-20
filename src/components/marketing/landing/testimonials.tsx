import { Star } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/marketing/landing/motion-primitives";

const TESTIMONIALS = [
  {
    quote:
      "TaskFlow replaced three different apps for our team. Planning the week now takes minutes, and nothing slips through the cracks.",
    name: "Priya Nair",
    role: "Head of Operations",
    company: "Northwind Labs",
    initials: "PN",
    gradient: "linear-gradient(135deg, var(--primary), var(--chart-2))",
  },
  {
    quote:
      "The priority levels and calendar view finally gave my week a shape. I ship more and stress less.",
    name: "Marcus Delgado",
    role: "Engineering Manager",
    company: "Fathom Studio",
    initials: "MD",
    gradient: "linear-gradient(135deg, var(--chart-2), var(--chart-3))",
  },
  {
    quote:
      "It looks and feels premium without getting in the way. My whole team was onboarded in an afternoon.",
    name: "Elise Whitaker",
    role: "Founder",
    company: "Cadence & Co.",
    initials: "EW",
    gradient: "linear-gradient(135deg, var(--chart-3), var(--primary))",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Loved by focused teams
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Thousands of people plan their day with TaskFlow. Here is what a few
            of them have to say.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <StaggerItem key={t.name} index={i} className="h-full">
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex gap-0.5" aria-label="Rated 5 out of 5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-[var(--warning)] text-[var(--warning)]"
                    />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-foreground/90 text-pretty">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <span
                    aria-hidden
                    style={{ backgroundImage: t.gradient }}
                    className="grid size-11 shrink-0 place-items-center rounded-full text-sm font-semibold text-white ring-2 ring-border"
                  >
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
