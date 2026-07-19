import {
  differenceInCalendarDays,
  format,
  isThisYear,
  isToday,
  isTomorrow,
  isYesterday,
} from "date-fns";

export type DueTone = "overdue" | "today" | "tomorrow" | "soon" | "normal";

/** Human-friendly due-date label plus a tone used for color coding. */
export function formatDueDate(
  date: Date | string | null | undefined,
): { label: string; tone: DueTone } | null {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  const days = differenceInCalendarDays(d, new Date());

  if (days < 0) {
    if (isYesterday(d)) return { label: "Yesterday", tone: "overdue" };
    return {
      label: format(d, isThisYear(d) ? "MMM d" : "MMM d, yyyy"),
      tone: "overdue",
    };
  }
  if (isToday(d)) return { label: "Today", tone: "today" };
  if (isTomorrow(d)) return { label: "Tomorrow", tone: "tomorrow" };
  if (days <= 6) return { label: format(d, "EEEE"), tone: "soon" };
  return {
    label: format(d, isThisYear(d) ? "MMM d" : "MMM d, yyyy"),
    tone: "normal",
  };
}

export function formatDate(date: Date | string, pattern = "MMM d, yyyy") {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, pattern);
}

/** yyyy-MM-dd for <input type="date"> and query params. */
export function toDateInputValue(date: Date | string | null | undefined) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "yyyy-MM-dd");
}

export function initialsFromUser(
  name?: string | null,
  email?: string | null,
): string {
  if (name) {
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
  }
  return email?.[0]?.toUpperCase() ?? "?";
}
