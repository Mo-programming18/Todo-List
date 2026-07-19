"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { signOut } from "@/auth";
import { registerSchema } from "@/lib/validations/auth";

export type RegisterResult = { ok: true } | { ok: false; error: string };

export async function registerUser(input: unknown): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Please check your details.",
    };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { name, email: email.toLowerCase(), passwordHash },
  });

  return { ok: true };
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}
