import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6 text-center">
      <Brand />
      <div className="flex flex-col gap-2">
        <p className="text-3xl font-semibold tracking-tight">Page not found</p>
        <p className="max-w-sm text-muted-foreground">
          The page you are looking for does not exist or may have moved.
        </p>
      </div>
      <Button asChild>
        <a href="/">Back to home</a>
      </Button>
    </div>
  );
}
