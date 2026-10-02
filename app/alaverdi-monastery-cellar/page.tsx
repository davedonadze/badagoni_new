import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ParallaxMedia } from "../parallax-media";
import { BreakableText } from "../breakable-text";
import { BannerMedia } from "../banner-media";
import { WineryScrollScene } from "../story/winery-scroll-scene";
import { getPageContent } from "@/lib/pages/service";
import { ALAVERDI_SLUG, ALAVERDI_DEFAULT, type AlaverdiContent } from "@/lib/pages/alaverdi";
import { getLocale, localize, localizeHref } from "@/lib/i18n";
import { getUiStrings } from "@/lib/ui-strings/service";
import { titleStyleCss } from "@/lib/title-style";
import { TitleStyleMobileRule } from "../title-style-mobile-rule";

export const metadata: Metadata = {
  title: "Alaverdi Monastery Cellar",
  description: "Discover Alaverdi Monastery’s historic wine cellar in Kakheti, its restoration with Badagoni, and the living tradition of Georgian qvevri winemaking.",
};

export default async function AlaverdiMonasteryCellar() {
  const [content, locale, t] = await Promise.all([
    getPageContent<AlaverdiContent>(ALAVERDI_SLUG),
    getLocale(),
    getUiStrings(),
  ]);
  const { heading, cover, story, qvevri, closing } = content ?? ALAVERDI_DEFAULT;

  return <main className="cellar-page">
    <div className="editorial-heading cellar-heading">
      <p className="eyebrow">{localize(heading.eyebrow, locale)}</p>
      <h1 id="alaverdi-heading-title" style={titleStyleCss(heading.titleStyle)}><BreakableText text={localize(heading.title, locale)} /></h1>
      <TitleStyleMobileRule id="alaverdi-heading-title" style={heading.titleStyle} defaultMobilePx={50} />
      <p>{localize(heading.subtitle, locale)}</p>
    </div>

    <figure className="cellar-cover">
      <ParallaxMedia className="cellar-cover-media" scale={1.5} media={<BannerMedia src={cover.image} alt="A monk working among buried qvevri in the stone cellar of Alaverdi Monastery" fetchPriority="high" />} />
      <figcaption><span>{localize(cover.captionLine1, locale)}</span><span>{localize(cover.captionLine2, locale)}</span></figcaption>
    </figure>

    <section className="cellar-story" aria-labelledby="cellar-story-title">
      <div><p className="eyebrow">{localize(story.eyebrow, locale)}</p><h2 id="cellar-story-title" style={titleStyleCss(story.headingStyle)}><BreakableText text={localize(story.heading, locale)} /></h2><TitleStyleMobileRule id="cellar-story-title" style={story.headingStyle} defaultMobilePx={64} /></div>
      <div className="cellar-story-copy">
        <p>{localize(story.paragraph1, locale)}</p>
        <p>{localize(story.paragraph2, locale)}</p>
        <h3>{localize(story.subheading, locale)}</h3>
        <p>{localize(story.paragraph3, locale)}</p>
      </div>
    </section>

    <section className="cellar-qvevri" aria-labelledby="cellar-qvevri-title">
      <WineryScrollScene
        intro={null}
        className="cellar-qvevri-scene"
        image={{
          src: qvevri.image,
          alt: "Alaverdi Monastery beside its vineyards, with the Caucasus Mountains in the distance",
          title: "Alaverdi Monastery",
          caption: "Kakheti / Georgia",
        }}
        imageOverlay={<div className="cellar-qvevri-copy">
          <h2 id="cellar-qvevri-title" style={titleStyleCss(qvevri.headingStyle)}>{localize(qvevri.heading, locale)}</h2>
          <TitleStyleMobileRule id="cellar-qvevri-title" style={qvevri.headingStyle} defaultMobilePx={58} />
          <Link href={localizeHref("/georgian-wine?tab=qvevri-tradition#qvevri-tradition", locale)} className="underlined-link">{localize(t["cta.theQvevriTradition"], locale)} <ArrowUpRight size={18} /></Link>
        </div>}
      />
    </section>

    <section className="cellar-closing" aria-labelledby="cellar-wines-title">
      <div><p className="eyebrow">{localize(closing.eyebrow, locale)}</p><h2 id="cellar-wines-title" style={titleStyleCss(closing.headingStyle)}><BreakableText text={localize(closing.heading, locale)} /></h2><TitleStyleMobileRule id="cellar-wines-title" style={closing.headingStyle} defaultMobilePx={58} /></div>
      <div><p>{localize(closing.body, locale)}</p><Link href={localizeHref("/catalogue", locale)} className="underlined-link">{localize(t["cta.exploreCollection"], locale)} <ArrowUpRight size={18} /></Link></div>
    </section>
  </main>;
}
