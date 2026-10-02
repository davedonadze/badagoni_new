import type { Metadata } from "next";
import { Suspense } from "react";
import { getPageContent } from "@/lib/pages/service";
import { GEORGIAN_WINE_SLUG, GEORGIAN_WINE_DEFAULT, type GeorgianWineContent } from "@/lib/pages/georgian-wine";
import { getLocale, localize } from "@/lib/i18n";
import { getUiStrings } from "@/lib/ui-strings/service";
import { titleStyleCss } from "@/lib/title-style";
import { TitleStyleMobileRule } from "../title-style-mobile-rule";
import { HeritageTabs } from "./heritage-tabs";

export const metadata: Metadata = {
  title: "Georgian wine",
  description: "Discover the bronze Badagoni figure found in Melaani and the Georgian qvevri winemaking tradition.",
};

export default async function GeorgianWine() {
  const [content, locale, t] = await Promise.all([
    getPageContent<GeorgianWineContent>(GEORGIAN_WINE_SLUG),
    getLocale(),
    getUiStrings(),
  ]);
  const { heading, figure, qvevri } = content ?? GEORGIAN_WINE_DEFAULT;

  return <main className="heritage-page">
    <div className="editorial-heading enologists-heading heritage-heading">
      <p className="eyebrow">{localize(heading.eyebrow, locale)}</p>
      <h1 id="georgian-wine-heading-title" style={titleStyleCss(heading.titleStyle)}>{localize(heading.title, locale)}</h1>
      <TitleStyleMobileRule id="georgian-wine-heading-title" style={heading.titleStyle} defaultMobilePx={50} />
      <p>{localize(heading.subtitle, locale)}</p>
    </div>
    <Suspense fallback={<p className="legal-loading" role="status">{localize(t["georgianWine.loading"], locale)}</p>}>
      <HeritageTabs figure={figure} qvevri={qvevri} locale={locale} t={t} />
    </Suspense>
  </main>;
}
