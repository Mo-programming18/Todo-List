import { Check } from "lucide-react";

import { Brand } from "@/components/brand";

const HIGHLIGHTS = [
  "Capture tasks with priorities, due dates, projects, and tags.",
  "See what is due, overdue, and done at a single glance.",
  "Track momentum with weekly productivity insights.",
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <a href="/" className="w-fit">
          <Brand invert className="text-primary-foreground" />
        </a>

        <div className="max-w-md">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">
            Organize your work, calmly.
          </h2>
          <ul className="mt-8 flex flex-col gap-4">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary-foreground/15">
                  <Check className="size-3.5" />
                </span>
                <span className="text-sm text-primary-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-primary-foreground/70">
          Built for personal and professional task management.
        </p>
      </aside>

      <div className="flex flex-col">
        <header className="flex items-center p-6 lg:hidden">
          <a href="/">
            <Brand />
          </a>
        </header>
        <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
