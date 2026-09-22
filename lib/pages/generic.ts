import type { Localized } from "@/db/schema";

const EMPTY_LOCALIZED: Localized = { en: "", ka: "" };

// Repeatable content blocks an admin can add to a generic page, below the
// fixed heading/cover/body. Each has a client-generated `id` used as a
// React key and for locating it during edits/reordering - it isn't
// otherwise meaningful.
export type TextSection = { id: string; type: "text"; heading: Localized; body: Localized };
export type MediaSection = { id: string; type: "media"; media: string; heading: Localized; caption: Localized };
export type CardItem = { id: string; title: Localized; subtitle: Localized; text: Localized };
export type CardsSection = { id: string; type: "cards"; heading: Localized; cards: CardItem[] };
export type ProfileItem = { id: string; image: string; name: Localized; role: Localized; text: Localized };
export type ProfilesSection = { id: string; type: "profiles"; heading: Localized; items: ProfileItem[] };
export type PageSection = TextSection | MediaSection | CardsSection | ProfilesSection;

function newId(): string {
  return crypto.randomUUID();
}

export function createSection(type: PageSection["type"]): PageSection {
  const id = newId();
  switch (type) {
    case "text": return { id, type, heading: EMPTY_LOCALIZED, body: EMPTY_LOCALIZED };
    case "media": return { id, type, media: "", heading: EMPTY_LOCALIZED, caption: EMPTY_LOCALIZED };
    case "cards": return { id, type, heading: EMPTY_LOCALIZED, cards: [] };
    case "profiles": return { id, type, heading: EMPTY_LOCALIZED, items: [] };
  }
}

export function createCardItem(): CardItem {
  return { id: newId(), title: EMPTY_LOCALIZED, subtitle: EMPTY_LOCALIZED, text: EMPTY_LOCALIZED };
}

export function createProfileItem(): ProfileItem {
  return { id: newId(), image: "", name: EMPTY_LOCALIZED, role: EMPTY_LOCALIZED, text: EMPTY_LOCALIZED };
}

// Fixed template used by every admin-created page (see app/[slug]/page.tsx
// for the public renderer and app/admin/(dashboard)/pages/[slug]/ for the
// editor). "home" and "story" are NOT generic pages: they're registered
// separately in app/admin/(dashboard)/pages/page.tsx with their own
// dedicated content types and editors.
export type GenericPageContent = {
  title: Localized;
  eyebrow: Localized;
  subtitle: Localized;
  cover: { image: string; caption: Localized } | null;
  body: Localized;
  sections: PageSection[];
};

export const EMPTY_GENERIC_PAGE: GenericPageContent = {
  title: { en: "", ka: "" },
  eyebrow: { en: "", ka: "" },
  subtitle: { en: "", ka: "" },
  cover: null,
  body: { en: "", ka: "" },
  sections: [],
};

// "home"/"story"/"contact"/"terroir"/"alaverdi-monastery-cellar"/"enologists"/
// "catalogue" have their own dedicated editors; "new" is the admin route for
// creating a page and would otherwise collide with a page literally named
// "new".
export const RESERVED_SLUGS = new Set(["home", "story", "contact", "terroir", "alaverdi-monastery-cellar", "enologists", "catalogue", "new"]);

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
