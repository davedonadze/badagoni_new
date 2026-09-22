import type { Localized } from "@/db/schema";

export const CATALOGUE_SLUG = "catalogue";

export type CatalogueContent = {
  eyebrow: Localized;
  tagline: Localized;
  title: Localized;
  body: Localized;
};

function en(value: string): Localized {
  return { en: value, ka: "" };
}

// The catalogue page's original hardcoded heading copy. The wine grid
// itself is already DB-driven (see lib/wines/service.ts, lib/categories/
// service.ts) - only this heading block needed migrating.
export const CATALOGUE_DEFAULT: CatalogueContent = {
  eyebrow: en("Badagoni / The collection"),
  tagline: en("Native grapes. Distinctive characters."),
  title: en("Find your\ncharacter."),
  body: en("From the depth of Saperavi to the brightness of Mtsvane.\nA Georgian expression for every kind of gathering."),
};
