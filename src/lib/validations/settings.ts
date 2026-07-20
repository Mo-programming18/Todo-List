import { z } from "zod";

import { strongPasswordSchema } from "@/lib/validations/auth";

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password"),
  newPassword: strongPasswordSchema,
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;

// Profile avatar upload constraints, shared between the client (pre-validation
// + the file input's `accept`) and the server action.
export const MAX_AVATAR_BYTES = 4 * 1024 * 1024; // 4 MB
export const ACCEPTED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;
