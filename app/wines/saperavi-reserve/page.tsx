import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getWineBySlug } from "@/lib/wines/service";
import { ReserveAwards } from "./awards";

export const metadata: Metadata = {
  title: "Saperavi Reserve — 2010",
  description: "Discover Badagoni Saperavi Reserve 2010: a limited dry red wine from vineyards near Alaverdi Monastery. 100% Saperavi, 14% alcohol.",
};

const awards = [
  { name: "Decanter World Wine Awards — Platinum", year: "2024", image: "/images/awards/decanter-platinum-2024.png" },
  { name: "Mundus Vini — Gold", year: "2024", image: "/images/awards/mundus-vini-gold-2024.png" },
  { name: "VINARIUM International Wine Contest — Gold", year: "2024", image: "/images/awards/vinarium-gold-2024.png" },
  { name: "Decanter World Wine Awards — Platinum", year: "2021", image: "/images/awards/decanter-platinum-2021.png" },
];

export default async function SaperaviReserve() {
  const wine = await getWineBySlug("saperavi-reserve");
  if (!wine) notFound();

  const facts = [
    { label: "Grape variety", value: "100% Saperavi" },
    { label: "Vintage", value: "2010" },
    { label: "Style", value: "Dry red wine" },
    { label: "Origin", value: "Kakheti, Georgia" },
    { label: "Alcohol", value: wine.alcohol },
    { label: "Bottle size", value: "750 ml" },
  ];

  return <main className="reserve-page">
    <nav className="reserve-breadcrumb" aria-label="Breadcrumb"><Link href="/catalogue">Wine catalogue</Link><span aria-hidden="true">/</span><span aria-current="page">{wine.name.en}</span></nav>

    <section className="reserve-product" aria-labelledby="reserve-title">
      <div className="reserve-heading"><p className="eyebrow">Badagoni / Limited release</p><h1 id="reserve-title">Saperavi<br />Reserve</h1></div>
      <figure className="reserve-visual">
        <span className="reserve-vintage">2010 vintage</span>
        <img src={wine.image} alt="Badagoni Saperavi Reserve 2010 bottle with its original black and gold label" width="300" height="1105" fetchPriority="high" />
        <figcaption>Saperavi / Kakheti, Georgia</figcaption>
      </figure>
      <div className="reserve-information">
        <p className="reserve-introduction">Made in limited quantities from Saperavi grapes grown near Alaverdi Monastery. Dark fruit, velvety tannins, and a long finish define this expression of the 2010 vintage.</p>
        <dl className="reserve-facts">{facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
        <div className="reserve-actions">
          <a className="underlined-link" href={`mailto:office@badagoni.ge?subject=${encodeURIComponent(`Enquiry: ${wine.name.en}`)}`}>Enquire about this wine <ArrowUpRight size={18} /></a>
          <ReserveAwards awards={awards} />
        </div>
      </div>
    </section>

    <section className="reserve-notes" aria-labelledby="reserve-notes-title">
      <div><p className="eyebrow">About this wine</p><h2 id="reserve-notes-title">In the glass.</h2></div>
      <dl className="reserve-tasting">
        <div><dt>Colour</dt><dd>Ripe cornel red.</dd></div>
        <div><dt>Aromas</dt><dd>Blackberry and ripe fruit, with oak and a touch of black pepper.</dd></div>
        <div><dt>Palate</dt><dd>Black plum and berries, with hints of vanilla, velvety tannins, and a long finish.</dd></div>
      </dl>
    </section>
  </main>;
}
