import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getWineBySlug } from "@/lib/wines/service";
import { getCategory } from "@/lib/categories/service";
import { getLocale, localize, localizeHref } from "@/lib/i18n";

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
  const [wine, locale] = await Promise.all([getWineBySlug(slug), getLocale()]);
  if (!wine) notFound();
  const category = await getCategory(wine.category);
  const categoryLabel = category ? localize(category.label, locale) : wine.category;
  const name = localize(wine.name, locale);

  const facts = [
    wine.grapes && { label: "Grape variety", value: localize(wine.grapes, locale) },
    wine.style && { label: "Style", value: localize(wine.style, locale) },
    { label: "Origin", value: "Kakheti, Georgia" },
    wine.alcohol && { label: "Alcohol", value: wine.alcohol },
    ...(wine.specs ?? []).map(spec => ({ label: localize(spec.label, locale), value: localize(spec.value, locale) })),
  ].filter((fact): fact is { label: string; value: string } => !!fact);

  return <main className="reserve-page">
    <nav className="reserve-breadcrumb" aria-label="Breadcrumb"><Link href={localizeHref("/catalogue", locale)}>Wine catalogue</Link><span aria-hidden="true">/</span><span aria-current="page">{name}</span></nav>

    <section className="reserve-product" aria-labelledby="wine-title">
      <div className="reserve-heading"><p className="eyebrow">Badagoni / {categoryLabel}</p><h1 id="wine-title">{name}</h1></div>
      <figure className="reserve-visual">
        <img src={wine.image} alt={name + " bottle"} width="300" height="1105" fetchPriority="high" />
        <figcaption>{wine.grapes ? localize(wine.grapes, locale) : categoryLabel} / Kakheti, Georgia</figcaption>
      </figure>
      <div className="reserve-information">
        <p className="reserve-introduction">{wine.description ? localize(wine.description, locale) : "Discover this expression from the Badagoni collection. Contact our team for current vintages and further information."}</p>
        <dl className="reserve-facts">{facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
        <div className="reserve-actions">
          <a className="underlined-link" href={`mailto:office@badagoni.ge?subject=${encodeURIComponent(`Enquiry: ${name}`)}`}>Enquire about this wine <ArrowUpRight size={18} /></a>
        </div>
      </div>
    </section>

    <section className="reserve-notes" aria-labelledby="wine-collection-title">
      <div><p className="eyebrow">The Badagoni collection</p><h2 id="wine-collection-title">Explore more.</h2></div>
      <div><Link href={localizeHref("/catalogue", locale)} className="underlined-link">Back to the full wine catalogue <ArrowUpRight size={18} /></Link></div>
    </section>
  </main>;
}
