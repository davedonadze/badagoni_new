import type { Localized } from "@/db/schema";

// Fixed template used by every admin-created page (see app/[slug]/page.tsx
// for the public renderer and app/admin/(dashboard)/pages/[slug]/ for the
// editor) - not a block builder. "home" and "story" are NOT generic pages:
// they're registered separately in app/admin/(dashboard)/pages/page.tsx
// with their own dedicated content types and editors.
export type GenericPageContent = {
  title: Localized;
  eyebrow: Localized;
  subtitle: Localized;
  cover: { image: string; caption: Localized } | null;
  body: Localized;
};

export const EMPTY_GENERIC_PAGE: GenericPageContent = {
  title: { en: "", ka: "" },
  eyebrow: { en: "", ka: "" },
  subtitle: { en: "", ka: "" },
  cover: null,
  body: { en: "", ka: "" },
};

// "home"/"story"/"contact"/"terroir"/"alaverdi-monastery-cellar"/"enologists"
// have their own dedicated editors; "new" is the admin route for creating a
// page and would otherwise collide with a page literally named "new".
export const RESERVED_SLUGS = new Set(["home", "story", "contact", "terroir", "alaverdi-monastery-cellar", "enologists", "new"]);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validatePageSlug(slug: string): string | null {
  if (!slug || !SLUG_PATTERN.test(slug)) {
    return "Slug is required and must be lowercase letters, numbers, and hyphens only.";
  }
  if (RESERVED_SLUGS.has(slug)) {
    return `"${slug}" is a reserved slug.`;
  }
  return null;
}
