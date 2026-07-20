"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu } from "lucide-react";

import { Brand } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  PrimaryCta,
  SecondaryCta,
} from "@/components/marketing/landing/cta-button";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Home", href: "#top" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader({ authed = false }: { authed?: boolean }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 8);
    // Hide when scrolling down past the hero; always show near the top.
    setHidden(y > prev && y > 240 && !open);
  });

  return (
    <motion.header
      variants={{ visible: { y: 0 }, hidden: { y: "-110%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "mt-3 flex h-14 items-center justify-between rounded-2xl border px-3 transition-colors duration-300 sm:px-4",
            scrolled
              ? "border-border bg-card/70 shadow-sm backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          <a href="#top" className="shrink-0" aria-label="TaskFlow home">
            <Brand />
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
                <span className="absolute inset-x-3 -bottom-0.5 h-px origin-center scale-x-0 bg-primary transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            {authed ? (
              <PrimaryCta href="/dashboard" className="hidden sm:inline-flex">
                Dashboard
              </PrimaryCta>
            ) : (
              <>
                <a
                  href="/login"
                  className="hidden rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary sm:inline-flex"
                >
                  Login
                </a>
                <PrimaryCta href="/register" className="hidden sm:inline-flex">
                  Get Started
                </PrimaryCta>
              </>
            )}

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  className="grid size-9 place-items-center rounded-xl border border-border bg-card/70 backdrop-blur-sm lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="size-4" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex flex-col gap-1 p-4 pt-10">
                  {LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="mt-4 flex flex-col gap-2">
                    {authed ? (
                      <PrimaryCta href="/dashboard">Open dashboard</PrimaryCta>
                    ) : (
                      <>
                        <SecondaryCta href="/login" className="w-full">
                          Login
                        </SecondaryCta>
                        <PrimaryCta href="/register" className="w-full">
                          Get Started
                        </PrimaryCta>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
