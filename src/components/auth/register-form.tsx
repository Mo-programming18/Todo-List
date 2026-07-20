"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { registerUser } from "@/server/actions/auth";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export function RegisterForm() {
  const [pending, setPending] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: RegisterInput) {
    setPending(true);
    const result = await registerUser(values);
    if (!result.ok) {
      setPending(false);
      toast.error(result.error);
      return;
    }
    // Account created; sign the user straight in.
    const signInResult = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (signInResult?.error) {
      setPending(false);
      toast.success("Account created. Please sign in.");
      window.location.assign("/login");
      return;
    }
    toast.success("Welcome to TaskFlow.");
    // Full page load so the server re-renders with the new session (MPA).
    window.location.assign("/dashboard");
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Maya Okonkwo"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

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
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Use 8+ characters with upper &amp; lowercase letters, a number, and
              a special character.
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          Create account
        </Button>
      </form>
    </div>
  );
}
