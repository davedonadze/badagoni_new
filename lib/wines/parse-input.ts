import type { WineInput } from "./service";
import type { Localized } from "@/db/schema";

function parseCategories(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map(v => v.trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map(v => v.trim()).filter(Boolean);
  return [];
}

function nullableString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function parseLocalized(value: unknown): Localized {
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return {
      en: typeof record.en === "string" ? record.en.trim() : "",
      ka: typeof record.ka === "string" ? record.ka.trim() : "",
    };
  }
  return { en: "", ka: "" };
}

function nullableLocalized(value: unknown): Localized | null {
  const localized = parseLocalized(value);
  return localized.en || localized.ka ? localized : null;
}

export function parseWineInput(body: Record<string, unknown>): WineInput {
  const category = typeof body.category === "string" ? body.category.trim() : "";
  return {
    slug: typeof body.slug === "string" ? body.slug.trim() : "",
    name: parseLocalized(body.name),
    category,
    categories: parseCategories(body.categories ?? category),
    image: typeof body.image === "string" ? body.image.trim() : "",
    style: nullableLocalized(body.style),
    grapes: nullableLocalized(body.grapes),
    alcohol: nullableString(body.alcohol),
    description: nullableLocalized(body.description),
  };
}
