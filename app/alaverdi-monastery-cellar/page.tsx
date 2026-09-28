import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ParallaxMedia } from "../parallax-media";
import { BreakableText } from "../breakable-text";
import { BannerMedia } from "../banner-media";
import { getPageContent } from "@/lib/pages/service";
import { ALAVERDI_SLUG, ALAVERDI_DEFAULT, type AlaverdiContent } from "@/lib/pages/alaverdi";
import { getLocale, localize, localizeHref } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Alaverdi Monastery Cellar",
  description: "Discover Alaverdi Monastery’s historic wine cellar in Kakheti, its restoration with Badagoni, and the living tradition of Georgian qvevri winemaking.",
};

export default async function AlaverdiMonasteryCellar() {
  const [content, locale] = await Promise.all([
    getPageContent<AlaverdiContent>(ALAVERDI_SLUG),
    getLocale(),
  ]);
  const { heading, cover, landmarks, story, qvevri, closing } = content ?? ALAVERDI_DEFAULT;

  return <main className="cellar-page">
    <div className="editorial-heading cellar-heading">
      <p className="eyebrow">{localize(heading.eyebrow, locale)}</p>
      <h1><BreakableText text={localize(heading.title, locale)} /></h1>
      <p>{localize(heading.subtitle, locale)}</p>
    </div>

    <figure className="cellar-cover">
      <ParallaxMedia className="cellar-cover-media" scale={1.5} media={<BannerMedia src={cover.image} alt="A monk working among buried qvevri in the stone cellar of Alaverdi Monastery" fetchPriority="high" />} />
      <figcaption><span>{localize(cover.captionLine1, locale)}</span><span>{localize(cover.captionLine2, locale)}</span></figcaption>
    </figure>

    <dl className="cellar-landmarks" aria-label="The cellar through time">
      {landmarks.map((landmark, i) => <div key={i}><dt>{localize(landmark.label, locale)}</dt><dd>{localize(landmark.value, locale)}</dd></div>)}
    </dl>

    <section className="cellar-story" aria-labelledby="cellar-story-title">
      <div><p className="eyebrow">{localize(story.eyebrow, locale)}</p><h2 id="cellar-story-title"><BreakableText text={localize(story.heading, locale)} /></h2></div>
      <div className="cellar-story-copy">
        <p>{localize(story.paragraph1, locale)}</p>
        <p>{localize(story.paragraph2, locale)}</p>
        <h3>{localize(story.subheading, locale)}</h3>
        <p>{localize(story.paragraph3, locale)}</p>
      </div>
    </section>

    <section className="cellar-qvevri" aria-labelledby="cellar-qvevri-title">
      <ParallaxMedia className="cellar-qvevri-photo" scale={1.5} media={<BannerMedia src={qvevri.image} alt="Alaverdi Monastery beside its vineyards, with the Caucasus Mountains in the distance" loading="lazy" />} />
      <div className="cellar-qvevri-copy">
        <p className="eyebrow">{localize(qvevri.eyebrow, locale)}</p>
        <h2 id="cellar-qvevri-title"><BreakableText text={localize(qvevri.heading, locale)} /></h2>
        <p>{localize(qvevri.body, locale)}</p>
      </div>
    </section>

    <section className="cellar-closing" aria-labelledby="cellar-wines-title">
      <div><p className="eyebrow">{localize(closing.eyebrow, locale)}</p><h2 id="cellar-wines-title"><BreakableText text={localize(closing.heading, locale)} /></h2></div>
      <div><p>{localize(closing.body, locale)}</p><Link href={localizeHref("/catalogue", locale)} className="underlined-link">Explore the collection <ArrowUpRight size={18} /></Link></div>
    </section>
  </main>;
}
