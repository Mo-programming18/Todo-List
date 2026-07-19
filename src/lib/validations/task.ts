import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title is too long"),
  description: z
    .string()
    .trim()
    .max(2000, "Description is too long")
    .optional()
    .or(z.literal("")),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  dueDate: z.string().optional().or(z.literal("")),
  categoryId: z.string().optional().or(z.literal("")),
  tags: z.array(z.string().trim().min(1).max(24)).max(20),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

const hexColor = z
  .string()
  .regex(/^#([0-9a-fA-F]{6})$/, "Enter a valid hex color");

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(40, "Name is too long"),
  color: hexColor.default("#6366f1"),
});

export const tagSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(24, "Name is too long"),
  color: hexColor.default("#64748b"),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type TagInput = z.infer<typeof tagSchema>;
