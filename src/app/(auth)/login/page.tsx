import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { getEnabledOAuthProviders } from "@/lib/auth-providers";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your TaskFlow account.",
};

export default function LoginPage() {
  const providers = getEnabledOAuthProviders();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center lg:text-left">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to continue to TaskFlow.
        </p>
      </div>

      <LoginForm oauthProviders={providers} />

      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
