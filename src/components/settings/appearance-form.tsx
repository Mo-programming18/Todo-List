"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Hydration-safe mount flag: `false` during SSR/first paint, `true` once the
// client has hydrated — without calling setState inside an effect.
const subscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function AppearanceForm() {
  const { theme, setTheme } = useTheme();
  const mounted = useHydrated();

  return (
    <div className="flex max-w-md items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">Theme</p>
        <p className="text-sm text-muted-foreground">
          Choose light, dark, or match your system.
        </p>
      </div>
      <Select
        value={mounted ? (theme ?? "system") : "system"}
        onValueChange={setTheme}
      >
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">
            <Sun className="size-4" />
            Light
          </SelectItem>
          <SelectItem value="dark">
            <Moon className="size-4" />
            Dark
          </SelectItem>
          <SelectItem value="system">
            <Monitor className="size-4" />
            System
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
