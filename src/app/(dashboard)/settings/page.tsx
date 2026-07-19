import type { Metadata } from "next";

import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileForm } from "@/components/settings/profile-form";
import { PasswordForm } from "@/components/settings/password-form";
import { AppearanceForm } from "@/components/settings/appearance-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();
  const record = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true, passwordHash: true },
  });

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Manage your profile and preferences"
      />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Update your name and the email you sign in with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            defaultValues={{
              name: record?.name ?? "",
              email: record?.email ?? "",
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            {record?.passwordHash
              ? "Change the password you use to sign in."
              : "Your account uses a social login, so there is no password to change."}
          </CardDescription>
        </CardHeader>
        {record?.passwordHash && (
          <CardContent>
            <PasswordForm />
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Personalize how TaskFlow looks.</CardDescription>
        </CardHeader>
        <CardContent>
          <AppearanceForm />
        </CardContent>
      </Card>
    </div>
  );
}
