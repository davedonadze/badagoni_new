import type { WineInput } from "./service";

function parseCategories(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map(v => v.trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map(v => v.trim()).filter(Boolean);
  return [];
}

function parseGrapes(value: unknown): string[] | null {
  if (Array.isArray(value)) {
    const grapes = value.map(String).map(v => v.trim()).filter(Boolean);
    return grapes.length ? grapes : null;
  }
  if (typeof value === "string") {
    const grapes = value.split(",").map(v => v.trim()).filter(Boolean);
    return grapes.length ? grapes : null;
  }
  return null;
}

function nullableString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function parseWineInput(body: Record<string, unknown>): WineInput {
  const category = typeof body.category === "string" ? body.category.trim() : "";
  return {
    slug: typeof body.slug === "string" ? body.slug.trim() : "",
    name: typeof body.name === "string" ? body.name.trim() : "",
    category,
    categories: parseCategories(body.categories ?? category),
    image: typeof body.image === "string" ? body.image.trim() : "",
    style: nullableString(body.style),
    grapes: parseGrapes(body.grapes),
    alcohol: nullableString(body.alcohol),
    description: nullableString(body.description),
  };
}
