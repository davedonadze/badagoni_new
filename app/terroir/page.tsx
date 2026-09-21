import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { VineyardList } from "./vineyard-list";
import { ParallaxMedia } from "../parallax-media";
import { BreakableText } from "../breakable-text";
import { BannerMedia } from "../banner-media";
import { getPageContent } from "@/lib/pages/service";
import { TERROIR_SLUG, TERROIR_DEFAULT, type TerroirContent } from "@/lib/pages/terroir";

// Fixed metadata for the four vineyard places that stays in code - only
// name/grape/text/image are DB-driven.
const PLACE_META = [
  { id: "alaverdi", imageAlt: "Alaverdi Monastery beyond Badagoni’s vineyard rows" },
  { id: "mukuzani", imageAlt: "An aerial view of Badagoni’s Mukuzani vineyards" },
  { id: "maghraani", imageAlt: "An aerial view of Badagoni’s Maghraani vineyards" },
  { id: "tsinandali", imageAlt: "An aerial view of Badagoni’s Akura vineyards in the Tsinandali microzone" },
];

export const metadata: Metadata = { title: "Our vineyards", description: "The vineyards and varied terroirs of Kakheti that shape every Badagoni wine." };

export default async function Terroir() {
  const content = (await getPageContent<TerroirContent>(TERROIR_SLUG)) ?? TERROIR_DEFAULT;
  const { heading, cover, intro, listHeading, places, closing } = content;

  const vineyardPlaces = places.map((place, i) => ({
    id: PLACE_META[i].id,
    name: place.name.en,
    grape: place.grape.en,
    text: place.text.en,
    image: place.image,
    imageAlt: PLACE_META[i].imageAlt,
  }));

  return <main>
    <div className="editorial-heading">
      <p className="eyebrow">{heading.eyebrow.en}</p>
      <h1><BreakableText text={heading.title.en} /></h1>
      <p><BreakableText text={heading.subtitle.en} /></p>
    </div>

    <ParallaxMedia className="terroir-cover" scale={1.5} ariaLabel={cover.caption.en} media={<BannerMedia src={cover.image} alt="Alaverdi Monastery and the vineyards of Kakheti beneath the Caucasus Mountains" fetchPriority="high" />} overlay={<span>{cover.caption.en}</span>} />

    <section className="terroir-intro">
      <p className="eyebrow">{intro.eyebrow.en}</p>
      <h2><BreakableText text={intro.heading.en} /></h2>
      <p>{intro.body.en}</p>
    </section>

    <section id="selected-locations" className="vineyard-list" aria-labelledby="selected-locations-title">
      <div className="list-heading">
        <h2 id="selected-locations-title" className="eyebrow">{listHeading.label.en}</h2>
        <span>{listHeading.subtitle.en}</span>
      </div>
      <VineyardList places={vineyardPlaces} />
    </section>

    <section className="terroir-closing">
      <ParallaxMedia className="terroir-closing-media" scale={1.5} media={<BannerMedia src={closing.image} alt="Vineyards stretching toward the Caucasus Mountains" loading="lazy" />} />
      <div>
        <p className="eyebrow">{closing.eyebrow.en}</p>
        <h2><BreakableText text={closing.heading.en} /></h2>
        <Link href="/catalogue" className="underlined-link">Discover the collection <ArrowUpRight size={16} /></Link>
      </div>
    </section>
  </main>;
}
