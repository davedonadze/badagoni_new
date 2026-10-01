import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getWineBySlug } from "@/lib/wines/service";
import { getLocale, localize, localizeHref } from "@/lib/i18n";
import { getUiStrings } from "@/lib/ui-strings/service";
import { WineAwards } from "../../wine-awards";

export const metadata: Metadata = {
  title: "Saperavi Reserve — 2010",
  description: "Discover Badagoni Saperavi Reserve 2010: a limited dry red wine from vineyards near Alaverdi Monastery. 100% Saperavi, 14% alcohol.",
};

export default async function SaperaviReserve() {
  const [wine, locale, t] = await Promise.all([getWineBySlug("saperavi-reserve"), getLocale(), getUiStrings()]);
  if (!wine) notFound();
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

    <section className="reserve-product" aria-labelledby="reserve-title">
      <div className="reserve-heading"><p className="eyebrow">Badagoni / Limited release</p><h1 id="reserve-title">{name}</h1></div>
      <figure className="reserve-visual">
        <span className="reserve-vintage">2010 vintage</span>
        <img src={wine.image} alt={name + " bottle"} width="300" height="1105" fetchPriority="high" />
        <figcaption>{wine.grapes ? localize(wine.grapes, locale) : "Saperavi"} / {kakhetiGeorgia}</figcaption>
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

    {tastingRows.length > 0 && <section className="reserve-notes" aria-labelledby="reserve-notes-title">
      <div><p className="eyebrow">{localize(t["wine.aboutThisWine"], locale)}</p><h2 id="reserve-notes-title">{localize(t["wine.inTheGlass"], locale)}</h2></div>
      <dl className="reserve-tasting">{tastingRows.map(row => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
    </section>}
  </main>;
}
