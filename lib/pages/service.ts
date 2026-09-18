import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { pages } from "@/db/schema";

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
