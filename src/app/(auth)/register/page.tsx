import type { Metadata } from "next";
import Link from "next/link";

import { RegisterForm } from "@/components/auth/register-form";
import { getEnabledOAuthProviders } from "@/lib/auth-providers";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create a TaskFlow account to organize your work.",
};

export default function RegisterPage() {
  const providers = getEnabledOAuthProviders();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center lg:text-left">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Start organizing your tasks in a couple of minutes.
        </p>
      </div>

      <RegisterForm oauthProviders={providers} />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
