import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { VineyardList } from "./vineyard-list";
import { ParallaxMedia } from "../parallax-media";

export const metadata: Metadata = { title: "Our vineyards", description: "The vineyards and varied terroirs of Kakheti that shape every Badagoni wine." };
const places = [
  { id: "alaverdi", name: "Alaverdi", grape: "Saperavi", text: "Alluvial soils and yellow clay in a landscape shaped by the Alazani Valley.", image: "/images/vineyards/alaverdi.webp", imageAlt: "Alaverdi Monastery beyond Badagoni's vineyard rows" },
  { id: "mukuzani", name: "Mukuzani", grape: "Saperavi", text: "Gravel and red clay bring their character to deeply expressive dry red wines.", image: "/images/vineyards/mukuzani.webp", imageAlt: "An aerial view of Badagoni's Mukuzani vineyards" },
  { id: "maghraani", name: "Maghraani", grape: "Kisi · Saperavi", text: "Forest-derived soils and rich biodiversity give this place a distinctive voice.", image: "/images/vineyards/maghraani.webp", imageAlt: "An aerial view of Badagoni's Maghraani vineyards" },
  { id: "tsinandali", name: "Tsinandali", grape: "Rkatsiteli", text: "The limestone and clay soils of Akura are home to vineyards for dry white wines.", image: "/images/vineyards/tsinandali.webp", imageAlt: "An aerial view of Badagoni's Akura vineyards in the Tsinandali microzone" },
];
export default function Terroir() {
  return <main><div className="editorial-heading"><p className="eyebrow">Our vineyards / Kakheti, Georgia</p><h1>A place<br />like no other.</h1><p>Every soil, every slope, every season.<br />A different voice in the glass.</p></div><ParallaxMedia className="terroir-cover" ariaLabel="Alazani Valley / Kakheti" media={<img src="/images/vineyard.webp" alt="Alaverdi Monastery and the vineyards of Kakheti beneath the Caucasus Mountains" fetchPriority="high" />} overlay={<span>Alazani Valley / Kakheti</span>} /><section className="terroir-intro"><p className="eyebrow">The character of Kakheti</p><h2>One region.<br />Many expressions.</h2><p>Our vineyards extend across Kakheti, with holdings of up to 500 hectares. Changing altitudes, soils and microclimates create a rich range of expressions from Georgia’s native grapes.</p></section><section id="selected-locations" className="vineyard-list" aria-labelledby="selected-locations-title"><div className="list-heading"><h2 id="selected-locations-title" className="eyebrow">Selected locations</h2><span>The soil. The grape. The character.</span></div><VineyardList places={places} /></section><section className="terroir-closing"><ParallaxMedia className="terroir-closing-media" media={<img src="/images/vineyard.webp" alt="Vineyards stretching toward the Caucasus Mountains" loading="lazy" />} /><div><p className="eyebrow">From the land to the glass</p><h2>Take a little<br />Georgia with you.</h2><Link href="/catalogue" className="underlined-link">Discover the collection <ArrowUpRight size={16} /></Link></div></section></main>;
}
