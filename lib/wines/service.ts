import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { wines, type Localized } from "@/db/schema";

export type Wine = {
  slug: string;
  name: Localized;
  category: string;
  categories: string[];
  image: string;
  style: Localized | null;
  grapes: Localized | null;
  alcohol: string | null;
  description: Localized | null;
};

export type WineInput = {
  slug: string;
  name: Localized;
  category: string;
  categories: string[];
  image: string;
  style?: Localized | null;
  grapes?: Localized | null;
  alcohol?: string | null;
  description?: Localized | null;
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateWineInput(input: Partial<WineInput>): string | null {
  if (!input.slug || !SLUG_PATTERN.test(input.slug)) {
    return "Slug is required and must be lowercase letters, numbers, and hyphens only.";
  }
  if (!input.name?.en?.trim()) return "Name (English) is required.";
  if (!input.category?.trim()) return "Category is required.";
  if (!input.categories || !Array.isArray(input.categories) || input.categories.length === 0) {
    return "At least one category is required.";
  }
  if (!input.image?.trim()) return "Image is required.";
  return null;
}

export async function listWines(): Promise<Wine[]> {
  const db = getDb();
  return db.select().from(wines).orderBy(asc(wines.id));
}

export async function getWineBySlug(slug: string): Promise<Wine | undefined> {
  const db = getDb();
  const [wine] = await db.select().from(wines).where(eq(wines.slug, slug)).limit(1);
  return wine;
}

export async function createWine(input: WineInput): Promise<Wine> {
  const db = getDb();
  const [wine] = await db
    .insert(wines)
    .values({
      slug: input.slug,
      name: input.name,
      category: input.category,
      categories: input.categories,
      image: input.image,
      style: input.style ?? null,
      grapes: input.grapes ?? null,
      alcohol: input.alcohol ?? null,
      description: input.description ?? null,
    })
    .returning();
  return wine;
}

export async function updateWine(slug: string, input: WineInput): Promise<Wine | undefined> {
  const db = getDb();
  const [wine] = await db
    .update(wines)
    .set({
      slug: input.slug,
      name: input.name,
      category: input.category,
      categories: input.categories,
      image: input.image,
      style: input.style ?? null,
      grapes: input.grapes ?? null,
      alcohol: input.alcohol ?? null,
      description: input.description ?? null,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(wines.slug, slug))
    .returning();
  return wine;
}

export async function deleteWine(slug: string): Promise<boolean> {
  const db = getDb();
  const deleted = await db.delete(wines).where(eq(wines.slug, slug)).returning({ slug: wines.slug });
  return deleted.length > 0;
}
