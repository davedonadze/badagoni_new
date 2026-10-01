import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getWineBySlug } from "@/lib/wines/service";
import { getCategory } from "@/lib/categories/service";
import { getLocale, localize, localizeHref } from "@/lib/i18n";
import { getUiStrings } from "@/lib/ui-strings/service";
import { WineAwards } from "../../wine-awards";

type WinePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: WinePageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "saperavi-reserve") return {};
  const [wine, locale] = await Promise.all([getWineBySlug(slug), getLocale()]);
  if (!wine) return { title: "Wine not found" };
  const category = await getCategory(wine.category);
  const name = localize(wine.name, locale);
  const categoryLabel = category ? localize(category.label, locale) : wine.category;
  return { title: name, description: wine.description ? localize(wine.description, locale) : `Discover ${name} from the Badagoni collection. Native Georgian grapes, ${categoryLabel.toLowerCase()}.` };
}

export default async function WinePage({ params }: WinePageProps) {
  const { slug } = await params;
  if (slug === "saperavi-reserve") notFound();
  const [wine, locale, t] = await Promise.all([getWineBySlug(slug), getLocale(), getUiStrings()]);
  if (!wine) notFound();
  const category = await getCategory(wine.category);
  const categoryLabel = category ? localize(category.label, locale) : wine.category;
  const name = localize(wine.name, locale);
  const kakhetiGeorgia = localize(t["wine.kakhetiGeorgia"], locale);

  const facts = [
    wine.grapes && { label: localize(t["wine.grapeVariety"], locale), value: localize(wine.grapes, locale) },
    wine.style && { label: localize(t["wine.style"], locale), value: localize(wine.style, locale) },
    { label: localize(t["wine.origin"], locale), value: kakhetiGeorgia },
    wine.alcohol && { label: localize(t["wine.alcohol"], locale), value: wine.alcohol },
    ...(wine.specs ?? []).map(spec => ({ label: localize(spec.label, locale), value: localize(spec.value, locale) })),
  ].filter((fact): fact is { label: string; value: string } => !!fact);

  const tastingNotes = wine.tastingNotes;
  const tastingRows = tastingNotes ? [
    tastingNotes.colour && { label: localize(t["wine.colour"], locale), value: localize(tastingNotes.colour, locale) },
    tastingNotes.aromas && { label: localize(t["wine.aromas"], locale), value: localize(tastingNotes.aromas, locale) },
    tastingNotes.palate && { label: localize(t["wine.palate"], locale), value: localize(tastingNotes.palate, locale) },
  ].filter((row): row is { label: string; value: string } => !!row && !!row.value) : [];

  return <main className="reserve-page">
    <nav className="reserve-breadcrumb" aria-label="Breadcrumb"><Link href={localizeHref("/catalogue", locale)}>{localize(t["wine.catalogueBreadcrumb"], locale)}</Link><span aria-hidden="true">/</span><span aria-current="page">{name}</span></nav>

    <section className="reserve-product" aria-labelledby="wine-title">
      <div className="reserve-heading"><p className="eyebrow">Badagoni / {categoryLabel}</p><h1 id="wine-title">{name}</h1></div>
      <figure className="reserve-visual">
        <img src={wine.image} alt={name + " bottle"} width="300" height="1105" fetchPriority="high" />
        <figcaption>{wine.grapes ? localize(wine.grapes, locale) : categoryLabel} / {kakhetiGeorgia}</figcaption>
      </figure>
      <div className="reserve-information">
        <p className="reserve-introduction">{wine.description ? localize(wine.description, locale) : localize(t["wine.fallbackDescription"], locale)}</p>
        <dl className="reserve-facts">{facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
        <div className="reserve-actions">
          <a className="underlined-link" href={`mailto:office@badagoni.ge?subject=${encodeURIComponent(`Enquiry: ${name}`)}`}>{localize(t["wine.enquireAboutThisWine"], locale)} <ArrowUpRight size={18} /></a>
          {wine.awards && wine.awards.length > 0 && <WineAwards awards={wine.awards} wineName={name} locale={locale} t={t} />}
        </div>
      </div>
    </section>

    {tastingRows.length > 0 && <section className="reserve-notes" aria-labelledby="wine-tasting-title">
      <div><p className="eyebrow">{localize(t["wine.aboutThisWine"], locale)}</p><h2 id="wine-tasting-title">{localize(t["wine.inTheGlass"], locale)}</h2></div>
      <dl className="reserve-tasting">{tastingRows.map(row => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
    </section>}

    <section className="reserve-notes" aria-labelledby="wine-collection-title">
      <div><p className="eyebrow">{localize(t["wine.theBadagoniCollection"], locale)}</p><h2 id="wine-collection-title">{localize(t["wine.exploreMore"], locale)}</h2></div>
      <div><Link href={localizeHref("/catalogue", locale)} className="underlined-link">{localize(t["wine.backToFullCatalogue"], locale)} <ArrowUpRight size={18} /></Link></div>
    </section>
  </main>;
}
