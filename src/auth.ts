import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";
import { loginSchema } from "@/lib/validations/auth";

// Full Node-runtime config: Prisma adapter (OAuth account linking + user
// table) + Credentials provider with bcrypt. JWT sessions are mandatory with
// the Credentials provider.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // Netlify isn't in Auth.js's host auto-trust list (only Vercel/CF Pages), so
  // without this the host check fails in production and /api/auth/* returns 500.
  trustHost: true,
  // The adapter's PrismaClient type is nominally different from our custom
  // generated client but structurally compatible.
  adapter: PrismaAdapter(prisma as never),
  session: { strategy: "jwt" },
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = loginSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        // email is already trimmed + lowercased by loginSchema.
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordsMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
});
