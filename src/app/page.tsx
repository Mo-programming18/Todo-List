import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Flag,
  FolderKanban,
  Search,
} from "lucide-react";

import { getCurrentUser } from "@/lib/dal";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProductPreview } from "@/components/marketing/product-preview";

const FEATURES = [
  {
    icon: Flag,
    title: "Priorities that surface what matters",
    body: "Four priority levels from low to urgent, color-coded so the important work never gets buried.",
    span: "lg:col-span-3",
    tinted: true,
  },
  {
    icon: CalendarDays,
    title: "Deadlines you will not miss",
    body: "Due dates, a monthly calendar, and an at-a-glance view of what is overdue or coming up next.",
    span: "lg:col-span-3",
    tinted: false,
  },
  {
    icon: FolderKanban,
    title: "Projects and tags",
    body: "Group tasks into color-coded projects and add tags to slice your work any way you like.",
    span: "lg:col-span-2",
    tinted: false,
  },
  {
    icon: Search,
    title: "Search and filters",
    body: "Find anything instantly and filter by status, priority, or project.",
    span: "lg:col-span-2",
    tinted: false,
  },
  {
    icon: BarChart3,
    title: "Productivity analytics",
    body: "Completion trends and weekly insights that show your momentum over time.",
    span: "lg:col-span-2",
    tinted: true,
  },
];

export default async function Home() {
  const user = await getCurrentUser();
  const primaryHref = user ? "/dashboard" : "/register";
  const primaryLabel = user ? "Open dashboard" : "Start for free";

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Brand />
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#preview" className="transition-colors hover:text-foreground">
              Preview
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <Button asChild size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">Start for free</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:pt-24">
          <div className="flex flex-col items-start gap-6 duration-700 animate-in fade-in slide-in-from-bottom-3">
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Organize your work, calmly.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground text-pretty">
              Plan projects, set priorities, and track every deadline in one
              focused workspace built for professionals.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href={primaryHref}>
                  {primaryLabel}
                  <ArrowRight />
                </Link>
              </Button>
              {!user && (
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Sign in</Link>
                </Button>
              )}
            </div>
          </div>

          <div
            id="preview"
            className="duration-700 animate-in fade-in slide-in-from-bottom-4"
          >
            <ProductPreview />
          </div>
        </section>

        <section id="features" className="border-t bg-muted/30">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-balance">
                Everything you need to stay on top
              </h2>
              <p className="mt-3 text-muted-foreground text-pretty">
                TaskFlow keeps the essentials close and the clutter out of the
                way, so you can focus on doing the work.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className={`flex flex-col gap-3 rounded-xl border p-6 transition-colors hover:border-foreground/20 ${feature.span} ${
                    feature.tinted ? "bg-primary/5" : "bg-card"
                  }`}
                >
                  <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="size-5" />
                  </span>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    {feature.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
            <div className="flex flex-col items-center gap-6 rounded-2xl border bg-card px-6 py-14 text-center">
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Bring order to your day
              </h2>
              <p className="max-w-lg text-muted-foreground text-pretty">
                Set up your workspace in minutes and see everything that needs
                your attention, all in one place.
              </p>
              <Button asChild size="lg">
                <Link href={primaryHref}>
                  {primaryLabel}
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <Brand />
          <p>Built with Next.js, Prisma, and Auth.js.</p>
        </div>
      </footer>
    </div>
  );
}
