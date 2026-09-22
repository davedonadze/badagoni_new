import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { newsArticles, type Localized } from "@/db/schema";

export type NewsArticle = {
  slug: string;
  title: Localized;
  category: Localized;
  date: string;
  excerpt: Localized;
  body: Localized;
  image: string;
  imageFit: "cover" | "contain";
  sourceUrl: string | null;
  relatedHref: string | null;
  relatedLabel: Localized | null;
};

export type NewsArticleInput = {
  slug: string;
  title: Localized;
  category: Localized;
  date: string;
  excerpt: Localized;
  body: Localized;
  image: string;
  imageFit: "cover" | "contain";
  sourceUrl?: string | null;
  relatedHref?: string | null;
  relatedLabel?: Localized | null;
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function validateNewsArticleInput(input: Partial<NewsArticleInput>): string | null {
  if (!input.slug || !SLUG_PATTERN.test(input.slug)) {
    return "Slug is required and must be lowercase letters, numbers, and hyphens only.";
  }
  if (!input.title?.en?.trim()) return "Title (English) is required.";
  if (!input.category?.en?.trim()) return "Category (English) is required.";
  if (!input.date || !DATE_PATTERN.test(input.date)) return "Date is required (YYYY-MM-DD).";
  if (!input.excerpt?.en?.trim()) return "Excerpt (English) is required.";
  if (!input.body?.en?.trim()) return "Body (English) is required.";
  if (!input.image?.trim()) return "Image is required.";
  return null;
}

export async function listNewsArticles(): Promise<NewsArticle[]> {
  const db = getDb();
  return db.select().from(newsArticles).orderBy(desc(newsArticles.date), desc(newsArticles.id));
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | undefined> {
  const db = getDb();
  const [article] = await db.select().from(newsArticles).where(eq(newsArticles.slug, slug)).limit(1);
  return article;
}

export async function createNewsArticle(input: NewsArticleInput): Promise<NewsArticle> {
  const db = getDb();
  const [article] = await db
    .insert(newsArticles)
    .values({
      slug: input.slug,
      title: input.title,
      category: input.category,
      date: input.date,
      excerpt: input.excerpt,
      body: input.body,
      image: input.image,
      imageFit: input.imageFit,
      sourceUrl: input.sourceUrl ?? null,
      relatedHref: input.relatedHref ?? null,
      relatedLabel: input.relatedLabel ?? null,
    })
    .returning();
  return article;
}

export async function updateNewsArticle(slug: string, input: NewsArticleInput): Promise<NewsArticle | undefined> {
  const db = getDb();
  const [article] = await db
    .update(newsArticles)
    .set({
      slug: input.slug,
      title: input.title,
      category: input.category,
      date: input.date,
      excerpt: input.excerpt,
      body: input.body,
      image: input.image,
      imageFit: input.imageFit,
      sourceUrl: input.sourceUrl ?? null,
      relatedHref: input.relatedHref ?? null,
      relatedLabel: input.relatedLabel ?? null,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(newsArticles.slug, slug))
    .returning();
  return article;
}

export async function deleteNewsArticle(slug: string): Promise<boolean> {
  const db = getDb();
  const deleted = await db.delete(newsArticles).where(eq(newsArticles.slug, slug)).returning({ slug: newsArticles.slug });
  return deleted.length > 0;
}
