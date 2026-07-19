import Link from "next/link";

import { Brand } from "@/components/brand";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link href="/dashboard" onClick={onNavigate} className="px-2 py-1">
        <Brand />
      </Link>

      <div className="px-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        Workspace
      </div>
      <SidebarNav onNavigate={onNavigate} />

      <div className="mt-auto rounded-lg border bg-card p-3">
        <p className="text-sm font-medium">Stay focused</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Review your upcoming deadlines and keep your momentum going.
        </p>
      </div>
    </div>
  );
}
