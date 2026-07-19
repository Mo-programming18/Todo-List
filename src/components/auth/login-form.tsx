"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import type { OAuthProvider } from "@/lib/auth-providers";

export function LoginForm({
  oauthProviders,
}: {
  oauthProviders: OAuthProvider[];
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    setPending(true);
    const result = await signIn("credentials", { ...values, redirect: false });
    if (result?.error) {
      setPending(false);
      toast.error("Incorrect email or password.");
      return;
    }
    toast.success("Welcome back.");
    router.push("/dashboard");
    router.refresh();
  }

  function useDemoAccount() {
    setValue("email", "demo@taskflow.app");
    setValue("password", "demo1234");
  }

  return (
    <div className="flex flex-col gap-5">
      <OAuthButtons providers={oauthProviders} />
      {oauthProviders.length > 0 && (
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or continue with email
          <span className="h-px flex-1 bg-border" />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          Sign in
        </Button>
      </form>

      <button
        type="button"
        onClick={useDemoAccount}
        className="text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        Fill in the demo account (demo@taskflow.app)
      </button>
    </div>
  );
}
