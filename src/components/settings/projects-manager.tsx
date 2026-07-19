"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { createCategory, deleteCategory } from "@/server/actions/tasks";
import { CATEGORY_COLORS } from "@/lib/constants";
import type { CategoryWithCount } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProjectsManager({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [color, setColor] = useState(CATEGORY_COLORS[0]);
  const [pending, setPending] = useState(false);
  const [toDelete, setToDelete] = useState<CategoryWithCount | null>(null);
  const [deletePending, setDeletePending] = useState(false);

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setPending(true);
    const result = await createCategory({ name, color });
    setPending(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setName("");
    toast.success("Project created.");
    router.refresh();
  }

  async function handleDelete() {
    if (!toDelete) return;
    setDeletePending(true);
    const result = await deleteCategory(toDelete.id);
    setDeletePending(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setToDelete(null);
    toast.success("Project deleted.");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      {categories.length > 0 && (
        <ul className="flex flex-col divide-y">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                  aria-hidden
                />
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-xs text-muted-foreground">
                  {category._count.tasks} task
                  {category._count.tasks === 1 ? "" : "s"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-destructive"
                onClick={() => setToDelete(category)}
                aria-label={`Delete ${category.name}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5">
          {CATEGORY_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn(
                "size-5 rounded-full ring-offset-2 ring-offset-background transition-shadow",
                color === c && "ring-2 ring-ring",
              )}
              style={{ backgroundColor: c }}
              aria-label={`Use color ${c}`}
            />
          ))}
        </div>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New project name"
          className="w-full max-w-xs flex-1"
          maxLength={40}
        />
        <Button type="submit" disabled={pending || !name.trim()}>
          {pending ? <Loader2 className="animate-spin" /> : <Plus />}
          Add
        </Button>
      </form>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Delete this project?"
        description={
          toDelete
            ? `"${toDelete.name}" will be removed. Its tasks are kept but become unassigned.`
            : ""
        }
        confirmLabel="Delete project"
        onConfirm={handleDelete}
        pending={deletePending}
      />
    </div>
  );
}
