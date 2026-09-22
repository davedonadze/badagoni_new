import type { Metadata } from "next";
import { Fragment } from "react";
import { WineCollection } from "../wine-collection";
import { BreakableText } from "../breakable-text";
import { listWines } from "@/lib/wines/service";
import { listCategories } from "@/lib/categories/service";
import { getPageContent } from "@/lib/pages/service";
import { CATALOGUE_SLUG, CATALOGUE_DEFAULT, type CatalogueContent } from "@/lib/pages/catalogue";

export const metadata: Metadata = { title: "Wine catalogue", description: "Find your expression of Georgia. Explore Badagoni red, white, rosé, qvevri and sparkling wines." };

// The title's lines after the first are indented (see .catalogue-heading
// h1>span in globals.css) - only the first line renders plain.
function CatalogueTitle({ text }: { text: string }) {
  const lines = text.split("\n");
  return lines.map((line, i) => <Fragment key={i}>{i === 0 ? line : <><br /><span>{line}</span></>}</Fragment>);
}

export default async function Catalogue() {
  const [wines, categories, content] = await Promise.all([
    listWines(),
    listCategories(),
    getPageContent<CatalogueContent>(CATALOGUE_SLUG),
  ]);
  const { eyebrow, tagline, title, body } = content ?? CATALOGUE_DEFAULT;

  return <main className="catalogue-page">
    <div className="catalogue-heading">
      <div className="heading-meta"><span>{eyebrow.en}</span><span>{tagline.en}</span></div>
      <h1><CatalogueTitle text={title.en} /></h1>
      <p><BreakableText text={body.en} /></p>
    </div>
    <section className="catalog-section" aria-label="Wine catalogue"><WineCollection wines={wines} categories={categories} /></section>
  </main>;
}
