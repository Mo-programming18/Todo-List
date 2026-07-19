import NextAuth from "next-auth";
import type { NextFetchEvent, NextRequest } from "next/server";

import { authConfig } from "@/auth.config";

// Next.js 16 renamed `middleware` to `proxy`. This instance has NO adapter and
// NO Credentials provider, so nothing Node-only (Prisma/bcrypt) is pulled in.
// Route protection lives in authConfig.callbacks.authorized.
const { auth } = NextAuth(authConfig);

// Next 16 requires a statically-detectable function export named `proxy`;
// a destructured `export const { auth: proxy }` is not recognized. `auth` is
// NextAuth's middleware handler, so we forward the request/event to it.
export function proxy(request: NextRequest, event: NextFetchEvent) {
  return (
    auth as unknown as (
      req: NextRequest,
      ev: NextFetchEvent,
    ) => ReturnType<typeof auth>
  )(request, event);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
