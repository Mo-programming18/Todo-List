"use server";

import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/dal";
import {
  ACCEPTED_AVATAR_TYPES,
  MAX_AVATAR_BYTES,
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

const AVATAR_DIR = path.join(process.cwd(), "public", "uploads", "avatars");
const AVATAR_PUBLIC_PREFIX = "/uploads/avatars/";
const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export type AvatarResult =
  | { ok: true; image: string }
  | { ok: false; error: string };

export async function updateAvatar(formData: FormData): Promise<AvatarResult> {
  const user = await requireUser();

  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Please choose an image to upload." };
  }
  if (!ACCEPTED_AVATAR_TYPES.includes(file.type as never)) {
    return { ok: false, error: "Use a JPG, PNG, WebP, or GIF image." };
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return { ok: false, error: "Image must be 4 MB or smaller." };
  }

  const extension = EXTENSION_BY_TYPE[file.type];
  const bytes = Buffer.from(await file.arrayBuffer());
  const filename = `${user.id}-${Date.now()}.${extension}`;

  await mkdir(AVATAR_DIR, { recursive: true });
  await writeFile(path.join(AVATAR_DIR, filename), bytes);
  const publicPath = `${AVATAR_PUBLIC_PREFIX}${filename}`;

  const previous = await prisma.user.findUnique({
    where: { id: user.id },
    select: { image: true },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { image: publicPath },
  });

  // Best-effort cleanup of the previously stored avatar file.
  if (previous?.image?.startsWith(AVATAR_PUBLIC_PREFIX)) {
    const previousName = previous.image.slice(AVATAR_PUBLIC_PREFIX.length);
    await unlink(path.join(AVATAR_DIR, previousName)).catch(() => {});
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { ok: true, image: publicPath };
}

export async function removeAvatar(): Promise<ActionResult> {
  const user = await requireUser();

  const record = await prisma.user.findUnique({
    where: { id: user.id },
    select: { image: true },
  });

  if (!record?.image) {
    return { ok: true };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { image: null },
  });

  // Best-effort removal of the stored avatar file.
  if (record.image.startsWith(AVATAR_PUBLIC_PREFIX)) {
    const name = record.image.slice(AVATAR_PUBLIC_PREFIX.length);
    await unlink(path.join(AVATAR_DIR, name)).catch(() => {});
  }

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
