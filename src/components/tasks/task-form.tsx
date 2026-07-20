"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "@/components/tasks/tag-input";
import { PRIORITIES, STATUSES } from "@/lib/constants";
import { taskFormSchema, type TaskFormValues } from "@/lib/validations/task";
import type { CategoryWithCount, Tag } from "@/lib/types";
import { cn } from "@/lib/utils";

export const TASK_FORM_ID = "task-form";

export const emptyTaskValues: TaskFormValues = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  dueDate: "",
  categoryId: "",
  tags: [],
};

export function TaskForm({
  defaultValues,
  categories,
  tags,
  onSubmit,
}: {
  defaultValues: TaskFormValues;
  categories: CategoryWithCount[];
  tags: Tag[];
  onSubmit: (values: TaskFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  });

  return (
    <form
      id={TASK_FORM_ID}
      onSubmit={handleSubmit(onSubmit, (formErrors) => {
        const firstError = Object.values(formErrors)[0];
        toast.error(firstError?.message ?? "Please fix the highlighted fields.");
      })}
      className="flex flex-col gap-4"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="task-title">Title</Label>
        <Input
          id="task-title"
          placeholder="What needs to be done?"
          autoFocus
          aria-invalid={!!errors.title}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="task-description">Description</Label>
        <Textarea
          id="task-description"
          placeholder="Add more detail"
          rows={3}
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>Priority</Label>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      <span
                        className={cn("size-2 rounded-full", p.dotClass)}
                        aria-hidden
                      />
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      <s.icon className="size-3.5 text-muted-foreground" />
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="task-due">Due date</Label>
          <Input
            id="task-due"
            type="date"
            aria-invalid={!!errors.dueDate}
            {...register("dueDate")}
          />
          {errors.dueDate && (
            <p className="text-xs text-destructive">{errors.dueDate.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Project</Label>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select
                value={field.value ? field.value : "none"}
                onValueChange={(v) => field.onChange(v === "none" ? "" : v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No project</SelectItem>
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
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Tags</Label>
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <TagInput
              value={field.value}
              onChange={field.onChange}
              suggestions={tags}
            />
          )}
        />
      </div>
    </form>
  );
}
