"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/dal";
import {
  passwordChangeSchema,
  profileSchema,
} from "@/lib/validations/settings";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateProfile(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const taken = await prisma.user.findFirst({
    where: { email: normalizedEmail, id: { not: user.id } },
    select: { id: true },
  });
  if (taken) return { ok: false, error: "That email is already in use." };

  await prisma.user.update({
    where: { id: user.id },
    data: { name, email: normalizedEmail },
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function changePassword(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = passwordChangeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const record = await prisma.user.findUnique({ where: { id: user.id } });
  if (!record?.passwordHash) {
    return {
      ok: false,
      error: "Password sign-in is not enabled for this account.",
    };
  }

  const matches = await bcrypt.compare(
    parsed.data.currentPassword,
    record.passwordHash,
  );
  if (!matches) {
    return { ok: false, error: "Your current password is incorrect." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return { ok: true };
}
