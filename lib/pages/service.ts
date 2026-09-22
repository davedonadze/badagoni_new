import { eq, notInArray } from "drizzle-orm";
import { getDb } from "@/db";
import { pages } from "@/db/schema";
import { RESERVED_SLUGS } from "./generic";

// Generic get/save for the `pages` table. Each page's content shape is
// defined and typed by its own module (see lib/pages/story.ts) — this layer
// just persists whatever JSON it's given.
export async function getPageContent<T>(slug: string): Promise<T | undefined> {
  const db = getDb();
  const [page] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  return page?.content as T | undefined;
}

export async function savePageContent<T>(slug: string, content: T): Promise<void> {
  const db = getDb();
  await db
    .insert(pages)
    .values({ slug, content })
    .onConflictDoUpdate({ target: pages.slug, set: { content, updatedAt: new Date().toISOString() } });
}

// Admin-created pages only (excludes "home"/"story", which are registered
// separately with their own dedicated editors) — used to list them at
// /admin/pages and to check slug availability.
export async function listGenericPages(): Promise<{ slug: string; content: unknown; updatedAt: string }[]> {
  const db = getDb();
  return db
    .select({ slug: pages.slug, content: pages.content, updatedAt: pages.updatedAt })
    .from(pages)
    .where(notInArray(pages.slug, [...RESERVED_SLUGS]));
}

export async function deletePage(slug: string): Promise<boolean> {
  if (RESERVED_SLUGS.has(slug)) return false;
  const db = getDb();
  const deleted = await db.delete(pages).where(eq(pages.slug, slug)).returning({ slug: pages.slug });
  return deleted.length > 0;
}
