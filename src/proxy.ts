import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

import { authConfig } from "@/auth.config";

// Next.js 16 renamed `middleware` to `proxy`. This instance has NO adapter and
// NO Credentials provider, so nothing Node-only (Prisma/bcrypt) is pulled in.
// Route protection lives in authConfig.callbacks.authorized.
const { auth } = NextAuth(authConfig);

// Next 16 requires a statically-detectable function export named `proxy`;
// a destructured `export const { auth: proxy }` is not recognized. `auth` is
// NextAuth's middleware handler, so we forward the request/event to it and then
// stamp cache headers on the result.
export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const handle = auth as unknown as (
    req: NextRequest,
    ev: NextFetchEvent,
  ) => Promise<Response | undefined>;

  const response = (await handle(request, event)) ?? NextResponse.next();

  // Prevent authenticated pages from being restored from the browser's
  // back/forward cache after sign-out. `no-store` forces a fresh request on
  // back-navigation, which the auth check above then redirects to /login — so
  // once a user logs out they cannot reach protected pages via the Back button.
  try {
    response.headers.set(
      "Cache-Control",
      "no-store, max-age=0, must-revalidate",
    );
  } catch {
    // Some auth responses are immutable redirects (e.g. a signed-in user
    // hitting /login is bounced to /dashboard); those carry no protected
    // content to cache, so it's safe to leave their headers untouched.
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|sitemap.xml|robots.txt).*)",
  ],
};
