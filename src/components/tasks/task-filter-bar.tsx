"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITIES, STATUSES } from "@/lib/constants";
import type { CategoryWithCount } from "@/lib/types";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "dueDate", label: "Due date" },
  { value: "priority", label: "Priority" },
  { value: "createdAt", label: "Recently added" },
  { value: "title", label: "Title" },
];

export function TaskFilterBar({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const status = params.get("status") ?? "all";
  const priority = params.get("priority") ?? "all";
  const category = params.get("category") ?? "all";
  const sort = params.get("sort") ?? "dueDate";
  const searchParam = params.get("search") ?? "";

  const [search, setSearch] = useState(searchParam);

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (!value || value === "all") next.delete(key);
      else next.set(key, value);
      const query = next.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  // Keep the search box in sync when the URL changes elsewhere (e.g. navbar).
  useEffect(() => setSearch(searchParam), [searchParam]);

  // Debounce search updates into the URL.
  useEffect(() => {
    if (search === searchParam) return;
    const timeout = setTimeout(() => setParam("search", search), 300);
    return () => clearTimeout(timeout);
  }, [search, searchParam, setParam]);

  const hasFilters =
    status !== "all" ||
    priority !== "all" ||
    category !== "all" ||
    sort !== "dueDate" ||
    !!searchParam;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks by title or description"
          className="pl-9"
          aria-label="Search tasks"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:inline-flex">
          <SlidersHorizontal className="size-3.5" />
          Filter
        </span>

        <Select value={status} onValueChange={(v) => setParam("status", v)}>
          <SelectTrigger size="sm" className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={(v) => setParam("priority", v)}>
          <SelectTrigger size="sm" className="w-[130px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any priority</SelectItem>
            {PRIORITIES.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                <span className={cn("size-2 rounded-full", p.dotClass)} aria-hidden />
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={category} onValueChange={(v) => setParam("category", v)}>
          <SelectTrigger size="sm" className="w-[150px]">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any project</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: c.color }}
                  aria-hidden
                />
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2">
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(pathname, { scroll: false })}
            >
              <X />
              Reset
            </Button>
          )}
          <Select value={sort} onValueChange={(v) => setParam("sort", v)}>
            <SelectTrigger size="sm" className="w-[150px]">
              <span className="text-muted-foreground">Sort:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
