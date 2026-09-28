import type { Metadata } from "next";
import { Suspense } from "react";
import { getPageContent } from "@/lib/pages/service";
import { GEORGIAN_WINE_SLUG, GEORGIAN_WINE_DEFAULT, type GeorgianWineContent } from "@/lib/pages/georgian-wine";
import { getLocale, localize } from "@/lib/i18n";
import { HeritageTabs } from "./heritage-tabs";

export const metadata: Metadata = {
  title: "Georgian wine",
  description: "Discover the bronze Badagoni figure found in Melaani and the Georgian qvevri winemaking tradition.",
};

export default async function GeorgianWine() {
  const [content, locale] = await Promise.all([
    getPageContent<GeorgianWineContent>(GEORGIAN_WINE_SLUG),
    getLocale(),
  ]);
  const { heading, figure, qvevri } = content ?? GEORGIAN_WINE_DEFAULT;

  return <main className="heritage-page">
    <div className="editorial-heading enologists-heading heritage-heading">
      <p className="eyebrow">{localize(heading.eyebrow, locale)}</p>
      <h1>{localize(heading.title, locale)}</h1>
      <p>{localize(heading.subtitle, locale)}</p>
    </div>
    <Suspense fallback={<p className="legal-loading" role="status">Loading…</p>}>
      <HeritageTabs figure={figure} qvevri={qvevri} locale={locale} />
    </Suspense>
  </main>;
}
