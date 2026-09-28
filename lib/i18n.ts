import { headers } from "next/headers";
import type { Localized } from "@/db/schema";

export type Locale = "en" | "ka";

// Set by proxy.ts on every request (stripped from the actual path, which
// stays the plain route - /ka/catalogue serves the same page.tsx as
// /catalogue, just with this header set to "ka").
export const LOCALE_HEADER = "x-badagoni-locale";

export async function getLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  return requestHeaders.get(LOCALE_HEADER) === "ka" ? "ka" : "en";
}

// Georgian content is being filled in gradually (see docs/admin-panel.md) -
// most fields are still empty, so falling back to English keeps the
// Georgian site from looking broken while that's in progress.
export function localize(value: Localized, locale: Locale): string {
  if (locale === "ka" && value.ka.trim()) return value.ka;
  return value.en;
}

// Prefixes an internal path with /ka when the locale is Georgian - used for
// every <Link href> so navigation stays in the same language.
export function localizeHref(path: string, locale: Locale): string {
  if (locale !== "ka") return path;
  return path === "/" ? "/ka" : `/ka${path}`;
}
