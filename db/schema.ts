import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Bilingual text: every editable string on the site has an English and a
// Georgian value, stored together as JSON so the shape lives next to the
// field that uses it. {en, ka}
export type Localized = { en: string; ka: string };

// Wines shown in the catalogue and on /wines/[slug]. Managed through the
// admin panel at /admin/wines (see app/admin/ and app/api/admin/wines/).
export const wines = sqliteTable("wines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name", { mode: "json" }).$type<Localized>().notNull(),
  category: text("category").notNull(),
  categories: text("categories", { mode: "json" }).$type<string[]>().notNull(),
  image: text("image").notNull(),
  style: text("style", { mode: "json" }).$type<Localized | null>(),
  grapes: text("grapes", { mode: "json" }).$type<Localized | null>(),
  alcohol: text("alcohol"),
  description: text("description", { mode: "json" }).$type<Localized | null>(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Wine categories (red, white, qvevri, …), managed at /admin/categories. `id`
// is the slug stored in wines.category/categories — kept immutable after
// creation in the admin UI so existing wines don't go stale.
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  label: text("label", { mode: "json" }).$type<Localized>().notNull(),
  order: integer("order").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Editable content for individual pages whose layout/animations stay
// hardcoded in code, but whose text and images are admin-editable. `slug`
// identifies the page (e.g. "story"); `content` is that page's own JSON
// shape, defined and typed alongside its page component (see lib/pages/).
// Not a generic block builder — each page's fields are fixed, matching its
// actual sections, not reorderable/addable from the admin UI.
export const pages = sqliteTable("pages", {
  slug: text("slug").primaryKey(),
  content: text("content", { mode: "json" }).notNull(),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Admin login sessions. Each login creates a random token here (not
// derived from the password), so a session can actually be revoked - by
// deleting its row on logout, or once it expires - instead of every past
// login staying valid forever until the shared password itself changes.
export const adminSessions = sqliteTable("admin_sessions", {
  token: text("token").primaryKey(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  expiresAt: text("expires_at").notNull(),
});

// News & stories shown at /newsroom, managed at /admin/news. Sorted by
// `date` descending everywhere — the newest article is the "Featured
// story" at the top of /newsroom, no separate ordering field needed.
export const newsArticles = sqliteTable("news_articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title", { mode: "json" }).$type<Localized>().notNull(),
  category: text("category", { mode: "json" }).$type<Localized>().notNull(),
  date: text("date").notNull(),
  excerpt: text("excerpt", { mode: "json" }).$type<Localized>().notNull(),
  body: text("body", { mode: "json" }).$type<Localized>().notNull(),
  image: text("image").notNull(),
  imageFit: text("image_fit", { enum: ["cover", "contain"] }).notNull().default("cover"),
  sourceUrl: text("source_url"),
  relatedHref: text("related_href"),
  relatedLabel: text("related_label", { mode: "json" }).$type<Localized | null>(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Site navigation, managed at /admin/menu. `location` places an item in the
// header's primary row, its secondary row, or the footer; the mobile sheet
// menu combines header_primary + header_secondary by `order`.
export const menuItems = sqliteTable("menu_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  label: text("label", { mode: "json" }).$type<Localized>().notNull(),
  href: text("href").notNull(),
  location: text("location", { enum: ["header_primary", "header_secondary", "footer"] }).notNull(),
  order: integer("order").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
