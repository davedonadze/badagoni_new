import type { Metadata } from "next";
import { Fragment } from "react";
import { WineCollection } from "../wine-collection";
import { BreakableText } from "../breakable-text";
import { listWines } from "@/lib/wines/service";
import { listCategories } from "@/lib/categories/service";
import { getPageContent } from "@/lib/pages/service";
import { CATALOGUE_SLUG, CATALOGUE_DEFAULT, type CatalogueContent } from "@/lib/pages/catalogue";
import { getLocale, localize } from "@/lib/i18n";
import { getUiStrings } from "@/lib/ui-strings/service";

export const metadata: Metadata = { title: "Wine catalogue", description: "Find your expression of Georgia. Explore Badagoni red, white, rosé, qvevri and sparkling wines." };

// The title's lines after the first are indented (see .catalogue-heading
// h1>span in globals.css) - only the first line renders plain.
function CatalogueTitle({ text }: { text: string }) {
  const lines = text.split("\n");
  return lines.map((line, i) => <Fragment key={i}>{i === 0 ? line : <><br /><span>{line}</span></>}</Fragment>);
}

export default async function Catalogue() {
  const [wines, categories, content, locale, t] = await Promise.all([
    listWines(),
    listCategories(),
    getPageContent<CatalogueContent>(CATALOGUE_SLUG),
    getLocale(),
    getUiStrings(),
  ]);
  const { eyebrow, tagline, title, body } = content ?? CATALOGUE_DEFAULT;

  return <main className="catalogue-page">
    <div className="catalogue-heading">
      <div className="heading-meta"><span>{localize(eyebrow, locale)}</span><span>{localize(tagline, locale)}</span></div>
      <h1><CatalogueTitle text={localize(title, locale)} /></h1>
      <p><BreakableText text={localize(body, locale)} /></p>
    </div>
    <section className="catalog-section" aria-label="Wine catalogue"><WineCollection wines={wines} categories={categories} locale={locale} t={t} /></section>
  </main>;
}
