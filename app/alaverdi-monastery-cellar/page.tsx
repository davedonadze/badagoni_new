import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ParallaxMedia } from "../parallax-media";
import { BreakableText } from "../breakable-text";
import { BannerMedia } from "../banner-media";
import { getPageContent } from "@/lib/pages/service";
import { ALAVERDI_SLUG, ALAVERDI_DEFAULT, type AlaverdiContent } from "@/lib/pages/alaverdi";

export const metadata: Metadata = {
  title: "Alaverdi Monastery Cellar",
  description: "Discover Alaverdi Monastery’s historic wine cellar in Kakheti, its restoration with Badagoni, and the living tradition of Georgian qvevri winemaking.",
};

export default async function AlaverdiMonasteryCellar() {
  const content = (await getPageContent<AlaverdiContent>(ALAVERDI_SLUG)) ?? ALAVERDI_DEFAULT;
  const { heading, cover, landmarks, story, qvevri, closing } = content;

  return <main className="cellar-page">
    <div className="editorial-heading cellar-heading">
      <p className="eyebrow">{heading.eyebrow.en}</p>
      <h1><BreakableText text={heading.title.en} /></h1>
      <p>{heading.subtitle.en}</p>
    </div>

    <figure className="cellar-cover">
      <ParallaxMedia className="cellar-cover-media" scale={1.5} media={<BannerMedia src={cover.image} alt="A monk working among buried qvevri in the stone cellar of Alaverdi Monastery" fetchPriority="high" />} />
      <figcaption><span>{cover.captionLine1.en}</span><span>{cover.captionLine2.en}</span></figcaption>
    </figure>

    <dl className="cellar-landmarks" aria-label="The cellar through time">
      {landmarks.map((landmark, i) => <div key={i}><dt>{landmark.label.en}</dt><dd>{landmark.value.en}</dd></div>)}
    </dl>

    <section className="cellar-story" aria-labelledby="cellar-story-title">
      <div><p className="eyebrow">{story.eyebrow.en}</p><h2 id="cellar-story-title"><BreakableText text={story.heading.en} /></h2></div>
      <div className="cellar-story-copy">
        <p>{story.paragraph1.en}</p>
        <p>{story.paragraph2.en}</p>
        <h3>{story.subheading.en}</h3>
        <p>{story.paragraph3.en}</p>
      </div>
    </section>

    <section className="cellar-qvevri" aria-labelledby="cellar-qvevri-title">
      <ParallaxMedia className="cellar-qvevri-photo" scale={1.5} media={<BannerMedia src={qvevri.image} alt="Alaverdi Monastery beside its vineyards, with the Caucasus Mountains in the distance" loading="lazy" />} />
      <div className="cellar-qvevri-copy">
        <p className="eyebrow">{qvevri.eyebrow.en}</p>
        <h2 id="cellar-qvevri-title"><BreakableText text={qvevri.heading.en} /></h2>
        <p>{qvevri.body.en}</p>
      </div>
    </section>

    <section className="cellar-closing" aria-labelledby="cellar-wines-title">
      <div><p className="eyebrow">{closing.eyebrow.en}</p><h2 id="cellar-wines-title"><BreakableText text={closing.heading.en} /></h2></div>
      <div><p>{closing.body.en}</p><Link href="/catalogue" className="underlined-link">Explore the collection <ArrowUpRight size={18} /></Link></div>
    </section>
  </main>;
}
