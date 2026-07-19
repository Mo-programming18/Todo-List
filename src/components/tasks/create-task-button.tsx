"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TaskDialog } from "@/components/tasks/task-dialog";
import type { CategoryWithCount, Tag } from "@/lib/types";

export function CreateTaskButton({
  categories,
  tags,
  className,
}: {
  categories: CategoryWithCount[];
  tags: Tag[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)} className={className}>
        <Plus />
        <span className="hidden sm:inline">New task</span>
      </Button>
      <TaskDialog
        open={open}
        onOpenChange={setOpen}
        categories={categories}
        tags={tags}
      />
    </>
  );
}
