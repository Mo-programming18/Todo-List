import type { Metadata } from "next";

import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getCategories } from "@/server/queries/tasks";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AvatarUpload } from "@/components/settings/avatar-upload";
import { ProfileForm } from "@/components/settings/profile-form";
import { PasswordForm } from "@/components/settings/password-form";
import { AppearanceForm } from "@/components/settings/appearance-form";
import { ProjectsManager } from "@/components/settings/projects-manager";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();
  const [record, categories] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, email: true, image: true, passwordHash: true },
    }),
    getCategories(user.id),
  ]);

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
            Update your photo, name, and the email you sign in with.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <AvatarUpload
            name={record?.name}
            email={record?.email}
            image={record?.image}
          />
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
          <CardTitle>Projects</CardTitle>
          <CardDescription>
            Group tasks into projects and assign each one a color.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectsManager categories={categories} />
        </CardContent>
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
