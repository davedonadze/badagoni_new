import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, type Localized } from "@/db/schema";

export type Category = {
  id: string;
  label: Localized;
  order: number;
};

export type CategoryInput = {
  id: string;
  label: Localized;
  order: number;
};

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateCategoryInput(input: Partial<CategoryInput>): string | null {
  if (!input.id || !ID_PATTERN.test(input.id)) {
    return "ID is required and must be lowercase letters, numbers, and hyphens only.";
  }
  if (!input.label?.en?.trim()) return "Label (English) is required.";
  return null;
}

export async function listCategories(): Promise<Category[]> {
  const db = getDb();
  return db.select().from(categories).orderBy(asc(categories.order), asc(categories.id));
}

export async function getCategory(id: string): Promise<Category | undefined> {
  const db = getDb();
  const [category] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return category;
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const db = getDb();
  const [category] = await db.insert(categories).values(input).returning();
  return category;
}

export async function updateCategory(id: string, input: Pick<CategoryInput, "label" | "order">): Promise<Category | undefined> {
  const db = getDb();
  const [category] = await db
    .update(categories)
    .set({ label: input.label, order: input.order, updatedAt: new Date().toISOString() })
    .where(eq(categories.id, id))
    .returning();
  return category;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const db = getDb();
  const deleted = await db.delete(categories).where(eq(categories.id, id)).returning({ id: categories.id });
  return deleted.length > 0;
}
