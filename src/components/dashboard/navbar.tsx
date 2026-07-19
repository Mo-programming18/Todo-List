"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/dashboard/user-menu";
import { SidebarContent } from "@/components/dashboard/sidebar";
import { CreateTaskButton } from "@/components/tasks/create-task-button";
import type { CategoryWithCount, Tag } from "@/lib/types";

type NavbarUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export function Navbar({
  user,
  categories,
  tags,
}: {
  user: NavbarUser;
  categories: CategoryWithCount[];
  tags: Tag[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  function onSearch(event: React.FormEvent) {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/tasks?search=${encodeURIComponent(q)}` : "/tasks");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm sm:gap-3 sm:px-6 lg:px-8">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <form onSubmit={onSearch} className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tasks..."
          aria-label="Search tasks"
          className="pl-9"
        />
      </form>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <CreateTaskButton categories={categories} tags={tags} />
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
