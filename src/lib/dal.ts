import { cache } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

/**
 * Data-access layer helpers. `getSession` is request-memoized so multiple
 * server components in one render share a single lookup.
 */
export const getSession = cache(async () => auth());

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/login");
  return user;
}
