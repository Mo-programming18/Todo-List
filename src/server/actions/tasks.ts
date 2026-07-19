"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/dal";
import {
  categorySchema,
  tagSchema,
  taskFormSchema,
} from "@/lib/validations/task";
import type { TaskStatus } from "@/lib/types";

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

const AFFECTED_PATHS = [
  "/dashboard",
  "/tasks",
  "/calendar",
  "/analytics",
];

function revalidateApp() {
  for (const path of AFFECTED_PATHS) revalidatePath(path);
}

/** Restrict the category to one the user owns; upsert tags by name. */
async function resolveRelations(
  userId: string,
  categoryId: string | undefined,
  tagNames: string[],
) {
  const validCategoryId =
    categoryId && categoryId !== ""
      ? (await prisma.category.findFirst({
          where: { id: categoryId, userId },
          select: { id: true },
        }))?.id ?? null
      : null;

  const uniqueNames = [
    ...new Set(tagNames.map((n) => n.trim()).filter(Boolean)),
  ].slice(0, 20);

  const tags = await Promise.all(
    uniqueNames.map((name) =>
      prisma.tag.upsert({
        where: { userId_name: { userId, name } },
        create: { userId, name },
        update: {},
        select: { id: true },
      }),
    ),
  );

  return { validCategoryId, validTagIds: tags.map((t) => t.id) };
}

export async function createTask(input: unknown): Promise<ActionResult<string>> {
  const user = await requireUser();
  const parsed = taskFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid task" };
  }

  const { title, description, status, priority, dueDate, categoryId, tags } =
    parsed.data;
  const { validCategoryId, validTagIds } = await resolveRelations(
    user.id,
    categoryId,
    tags,
  );

  const maxPosition = await prisma.task.aggregate({
    where: { userId: user.id },
    _max: { position: true },
  });

  const task = await prisma.task.create({
    data: {
      title,
      description: description ? description : null,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      completedAt: status === "DONE" ? new Date() : null,
      position: (maxPosition._max.position ?? 0) + 1,
      userId: user.id,
      categoryId: validCategoryId,
      tags: validTagIds.length
        ? { connect: validTagIds.map((id) => ({ id })) }
        : undefined,
    },
    select: { id: true },
  });

  revalidateApp();
  return { ok: true, data: task.id };
}

export async function updateTask(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = taskFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid task" };
  }

  const existing = await prisma.task.findFirst({
    where: { id, userId: user.id },
    select: { id: true, completedAt: true, status: true },
  });
  if (!existing) return { ok: false, error: "Task not found." };

  const { title, description, status, priority, dueDate, categoryId, tags } =
    parsed.data;
  const { validCategoryId, validTagIds } = await resolveRelations(
    user.id,
    categoryId,
    tags,
  );

  const completedAt =
    status === "DONE"
      ? (existing.completedAt ?? new Date())
      : null;

  await prisma.task.update({
    where: { id },
    data: {
      title,
      description: description ? description : null,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      completedAt,
      categoryId: validCategoryId,
      tags: { set: validTagIds.map((tagId) => ({ id: tagId })) },
    },
  });

  revalidateApp();
  return { ok: true };
}

export async function deleteTask(id: string): Promise<ActionResult> {
  const user = await requireUser();
  const result = await prisma.task.deleteMany({
    where: { id, userId: user.id },
  });
  if (result.count === 0) return { ok: false, error: "Task not found." };
  revalidateApp();
  return { ok: true };
}

export async function setTaskStatus(
  id: string,
  status: TaskStatus,
): Promise<ActionResult> {
  const user = await requireUser();
  const result = await prisma.task.updateMany({
    where: { id, userId: user.id },
    data: {
      status,
      completedAt: status === "DONE" ? new Date() : null,
    },
  });
  if (result.count === 0) return { ok: false, error: "Task not found." };
  revalidateApp();
  return { ok: true };
}

export async function toggleTaskComplete(
  id: string,
  completed: boolean,
): Promise<ActionResult> {
  return setTaskStatus(id, completed ? "DONE" : "TODO");
}

export async function createCategory(
  input: unknown,
): Promise<ActionResult<{ id: string; name: string; color: string }>> {
  const user = await requireUser();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid category" };
  }

  const exists = await prisma.category.findFirst({
    where: { userId: user.id, name: parsed.data.name },
    select: { id: true },
  });
  if (exists) return { ok: false, error: "A project with this name already exists." };

  const category = await prisma.category.create({
    data: { ...parsed.data, userId: user.id },
    select: { id: true, name: true, color: true },
  });
  revalidateApp();
  return { ok: true, data: category };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const user = await requireUser();
  const result = await prisma.category.deleteMany({
    where: { id, userId: user.id },
  });
  if (result.count === 0) return { ok: false, error: "Project not found." };
  revalidateApp();
  return { ok: true };
}

export async function createTag(
  input: unknown,
): Promise<ActionResult<{ id: string; name: string; color: string }>> {
  const user = await requireUser();
  const parsed = tagSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid tag" };
  }

  const exists = await prisma.tag.findFirst({
    where: { userId: user.id, name: parsed.data.name },
    select: { id: true, name: true, color: true },
  });
  if (exists) return { ok: true, data: exists };

  const tag = await prisma.tag.create({
    data: { ...parsed.data, userId: user.id },
    select: { id: true, name: true, color: true },
  });
  revalidateApp();
  return { ok: true, data: tag };
}

export async function deleteTag(id: string): Promise<ActionResult> {
  const user = await requireUser();
  const result = await prisma.tag.deleteMany({
    where: { id, userId: user.id },
  });
  if (result.count === 0) return { ok: false, error: "Tag not found." };
  revalidateApp();
  return { ok: true };
}
