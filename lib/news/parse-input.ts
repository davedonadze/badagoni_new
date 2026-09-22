import type { NewsArticleInput } from "./service";
import type { Localized } from "@/db/schema";

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

export function parseNewsArticleInput(body: Record<string, unknown>): NewsArticleInput {
  return {
    slug: typeof body.slug === "string" ? body.slug.trim() : "",
    title: parseLocalized(body.title),
    category: parseLocalized(body.category),
    date: typeof body.date === "string" ? body.date.trim() : "",
    excerpt: parseLocalized(body.excerpt),
    body: parseLocalized(body.body),
    image: typeof body.image === "string" ? body.image.trim() : "",
    imageFit: body.imageFit === "contain" ? "contain" : "cover",
    sourceUrl: nullableString(body.sourceUrl),
    relatedHref: nullableString(body.relatedHref),
    relatedLabel: nullableLocalized(body.relatedLabel),
  };
}
