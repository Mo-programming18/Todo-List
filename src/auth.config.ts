import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

// Edge-safe base config: OAuth provider metadata + the route-protection
// callback. NO database, NO bcrypt (those live in auth.ts, Node-only).
// OAuth providers are included only when their credentials are present, so the
// app runs cleanly with email/password alone.
const oauthProviders: NextAuthConfig["providers"] = [];
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  oauthProviders.push(GitHub);
}
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  oauthProviders.push(Google);
}

const PUBLIC_ROUTES = new Set(["/"]);
const AUTH_ROUTES = new Set(["/login", "/register"]);

export const authConfig = {
  providers: oauthProviders,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Runs in the proxy (edge-capable) layer — keep it DB-free.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      if (AUTH_ROUTES.has(pathname)) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      if (PUBLIC_ROUTES.has(pathname)) return true;

      // Everything else requires a session.
      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
