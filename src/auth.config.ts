import type { NextAuthConfig } from "next-auth";

// Edge-safe base config: the route-protection callback only. NO database,
// NO bcrypt (those live in auth.ts, Node-only). The app authenticates with
// email/password (Credentials) alone — the provider is registered in auth.ts.

const PUBLIC_ROUTES = new Set(["/"]);
const AUTH_ROUTES = new Set(["/login", "/register"]);

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Runs in the proxy (edge-capable) layer; keep it DB-free.
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
