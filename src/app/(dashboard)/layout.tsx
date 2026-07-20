import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getCategories, getTags } from "@/server/queries/tasks";
import { Navbar } from "@/components/dashboard/navbar";
import { SidebarContent } from "@/components/dashboard/sidebar";
import { BfcacheGuard } from "@/components/dashboard/bfcache-guard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const [record, categories, tags] = await Promise.all([
    // The JWT session only carries the login-time name/image; read the current
    // values from the DB so profile edits (e.g. a new avatar) show right away.
    prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, image: true },
    }),
    getCategories(user.id),
    getTags(user.id),
  ]);

  const navUser = {
    ...user,
    name: record?.name ?? user.name,
    image: record?.image ?? user.image,
  };

  return (
    <div className="min-h-dvh bg-background">
      <BfcacheGuard />
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-sidebar lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      <div className="flex min-h-dvh flex-col lg:pl-64">
        <Navbar user={navUser} categories={categories} tags={tags} />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
