import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your TaskFlow account.",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center lg:text-left">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to continue to TaskFlow.
        </p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <a href="/register" className="font-medium text-primary hover:underline">
          Create an account
        </a>
      </p>
    </div>
  );
}
