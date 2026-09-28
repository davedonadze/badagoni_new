import { cache } from "react";
import { getDb } from "@/db";
import { uiStrings, type Localized } from "@/db/schema";
import { UI_STRING_DEFAULTS } from "./defaults";

// Every key that has an admin-saved row, keyed the same way as
// UI_STRING_DEFAULTS. Most keys never get a row at all - they just resolve
// to their default below.
export async function listUiStringOverrides(): Promise<Record<string, Localized>> {
  const db = getDb();
  const rows = await db.select().from(uiStrings);
  const map: Record<string, Localized> = {};
  for (const row of rows) map[row.key] = row.value as Localized;
  return map;
}

export async function saveUiStrings(entries: Record<string, Localized>): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();
  for (const [key, value] of Object.entries(entries)) {
    await db
      .insert(uiStrings)
      .values({ key, value, updatedAt: now })
      .onConflictDoUpdate({ target: uiStrings.key, set: { value, updatedAt: now } });
  }
}

// The full, resolved dictionary (defaults merged with any admin overrides),
// for a single request. Cached with React's cache() so every page/component
// that calls this during the same request shares one DB round trip instead
// of each one re-querying independently.
export const getUiStrings = cache(async (): Promise<Record<string, Localized>> => {
  const overrides = await listUiStringOverrides();
  return { ...UI_STRING_DEFAULTS, ...overrides };
});
