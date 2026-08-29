import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

export type LangOption = "de" | "en" | "nl-be" | "fr" | "nl-nl";

export function getLocalizedField(
  project: Record<string, any>,
  field: "title" | "description",
  lang: LangOption,
): string {
  if (lang === "en") return project[`${field}En`] || project[field] || "";
  if (lang === "nl-be" || lang === "nl-nl") return project[`${field}Nl`] || project[field] || "";
  if (lang === "fr") return project[`${field}Fr`] || project[field] || "";
  return project[field] || "";
}
