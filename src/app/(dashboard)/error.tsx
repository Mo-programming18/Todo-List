"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
}) {
  const retry = unstable_retry ?? reset;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="size-6" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="font-medium">Something went wrong</p>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          We could not load this page. Please try again in a moment.
        </p>
      </div>
      {retry && <Button onClick={() => retry()}>Try again</Button>}
    </div>
  );
}
