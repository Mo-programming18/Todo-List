import { requireUser } from "@/lib/dal";
import { getCategories, getTags } from "@/server/queries/tasks";
import { Navbar } from "@/components/dashboard/navbar";
import { SidebarContent } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const [categories, tags] = await Promise.all([
    getCategories(user.id),
    getTags(user.id),
  ]);

  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-sidebar lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      <div className="flex min-h-dvh flex-col lg:pl-64">
        <Navbar user={user} categories={categories} tags={tags} />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
