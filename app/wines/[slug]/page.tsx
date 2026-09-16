import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import wineData from "../../wine-data.json";
import type { Wine } from "../../wine-collection";

const wines = wineData as Wine[];
const labels: Record<string, string> = { red: "Red wine", white: "White wine", qvevri: "Qvevri wine", rose: "Rosé wine", sparkling: "Sparkling wine", chacha: "Chacha" };

type WinePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return wines.filter(wine => wine.slug !== "saperavi-reserve").map(wine => ({ slug: wine.slug }));
}

export async function generateMetadata({ params }: WinePageProps): Promise<Metadata> {
  const { slug } = await params;
  const wine = wines.find(item => item.slug === slug);
  if (!wine) return { title: "Wine not found" };
  return { title: wine.name, description: wine.description || `Discover ${wine.name} from the Badagoni collection. Native Georgian grapes, ${labels[wine.category].toLowerCase()}.` };
}

export default async function WinePage({ params }: WinePageProps) {
  const { slug } = await params;
  if (slug === "saperavi-reserve") notFound();
  const wine = wines.find(item => item.slug === slug);
  if (!wine) notFound();

  const facts = [
    wine.grapes && { label: "Grape variety", value: wine.grapes.join(" & ") },
    wine.style && { label: "Style", value: wine.style },
    { label: "Origin", value: "Kakheti, Georgia" },
    wine.alcohol && { label: "Alcohol", value: wine.alcohol },
  ].filter((fact): fact is { label: string; value: string } => !!fact);

  return <main className="reserve-page">
    <nav className="reserve-breadcrumb" aria-label="Breadcrumb"><Link href="/catalogue">Wine catalogue</Link><span aria-hidden="true">/</span><span aria-current="page">{wine.name}</span></nav>

    <section className="reserve-product" aria-labelledby="wine-title">
      <div className="reserve-heading"><p className="eyebrow">Badagoni / {labels[wine.category]}</p><h1 id="wine-title">{wine.name}</h1></div>
      <figure className="reserve-visual">
        <img src={wine.image} alt={wine.name + " bottle"} width="300" height="1105" fetchPriority="high" />
        <figcaption>{wine.grapes?.join(" · ") || labels[wine.category]} / Kakheti, Georgia</figcaption>
      </figure>
      <div className="reserve-information">
        <p className="reserve-introduction">{wine.description || "Discover this expression from the Badagoni collection. Contact our team for current vintages and further information."}</p>
        <dl className="reserve-facts">{facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
        <div className="reserve-actions">
          <a className="underlined-link" href={`mailto:office@badagoni.ge?subject=${encodeURIComponent(`Enquiry: ${wine.name}`)}`}>Enquire about this wine <ArrowUpRight size={18} /></a>
        </div>
      </div>
    </section>

    <section className="reserve-notes" aria-labelledby="wine-collection-title">
      <div><p className="eyebrow">The Badagoni collection</p><h2 id="wine-collection-title">Explore more.</h2></div>
      <div><Link href="/catalogue" className="underlined-link">Back to the full wine catalogue <ArrowUpRight size={18} /></Link></div>
    </section>
  </main>;
}
