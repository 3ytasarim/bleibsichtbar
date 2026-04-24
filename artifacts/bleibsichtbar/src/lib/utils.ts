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
