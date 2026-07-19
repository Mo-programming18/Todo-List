"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export function TagInput({
  value,
  onChange,
  suggestions = [],
}: {
  value: string[];
  onChange: (value: string[]) => void;
  suggestions?: { name: string }[];
}) {
  const [input, setInput] = useState("");

  function add(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (value.some((v) => v.toLowerCase() === trimmed.toLowerCase())) {
      setInput("");
      return;
    }
    if (value.length >= 20) return;
    onChange([...value, trimmed]);
    setInput("");
  }

  function remove(name: string) {
    onChange(value.filter((v) => v !== name));
  }

  const filtered = suggestions
    .filter(
      (s) =>
        !value.some((v) => v.toLowerCase() === s.name.toLowerCase()) &&
        s.name.toLowerCase().includes(input.toLowerCase()),
    )
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1">
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => remove(tag)}
                className="rounded-sm opacity-70 hover:opacity-100"
                aria-label={`Remove ${tag}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add(input);
          } else if (e.key === "Backspace" && !input && value.length > 0) {
            remove(value[value.length - 1]);
          }
        }}
        placeholder="Add a tag, then press Enter"
      />

      {input.trim() && filtered.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {filtered.map((s) => (
            <button key={s.name} type="button" onClick={() => add(s.name)}>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-accent"
              >
                {s.name}
              </Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
