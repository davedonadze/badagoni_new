import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WinerySection } from "./winery-section";
import { ParallaxMedia } from "../parallax-media";
import { BreakableText } from "../breakable-text";
import { BannerMedia } from "../banner-media";
import { getPageContent } from "@/lib/pages/service";
import { STORY_SLUG, STORY_DEFAULT, type StoryContent } from "@/lib/pages/story";
import { getLocale, localize, localizeHref } from "@/lib/i18n";
import { getUiStrings } from "@/lib/ui-strings/service";
import { titleStyleCss } from "@/lib/title-style";

export const metadata: Metadata = { title: "Our story", description: "Born in Kakheti in 2006. Georgian heritage and a contemporary perspective on wine." };

export default async function Story() {
  const [content, locale, t] = await Promise.all([
    getPageContent<StoryContent>(STORY_SLUG),
    getLocale(),
    getUiStrings(),
  ]);
  const { heading, cover, intro, qvevri, winery, science } = content ?? STORY_DEFAULT;

  return <main>
    <div className="editorial-heading">
      <p className="eyebrow">{localize(heading.eyebrow, locale)}</p>
      <h1 style={titleStyleCss(heading.titleStyle)}><BreakableText text={localize(heading.title, locale)} /></h1>
      <p><BreakableText text={localize(heading.subtitle, locale)} /></p>
    </div>

    <ParallaxMedia className="story-cover" scale={1.5} ariaLabel={localize(cover.caption, locale)} media={<BannerMedia src={cover.image} alt="Alaverdi Monastery in the landscapes of Kakheti" fetchPriority="high" />} overlay={<span>{localize(cover.caption, locale)}</span>} />

    <section className="story-intro">
      <p className="eyebrow">{localize(intro.eyebrow, locale)}</p>
      <div>
        <h2><BreakableText text={localize(intro.heading, locale)} /></h2>
        <div className="story-paragraphs">
          <p>{localize(intro.paragraph1, locale)}</p>
          <p>{localize(intro.paragraph2, locale)}</p>
        </div>
      </div>
    </section>

    <section className="story-qvevri" id="qvevri">
      <ParallaxMedia className="qvevri-photo" scale={1.5} media={<BannerMedia src={qvevri.image} alt="A monk tending qvevri in Alaverdi Monastery’s historic cellar" loading="lazy" />} />
      <div className="story-qvevri-copy">
        <p className="eyebrow">{localize(qvevri.eyebrow, locale)}</p>
        <h2><BreakableText text={localize(qvevri.heading, locale)} /></h2>
        <p>{localize(qvevri.paragraph1, locale)}</p>
        <p>{localize(qvevri.paragraph2, locale)}</p>
        <Link href={localizeHref("/catalogue", locale)} className="underlined-link">{localize(t["cta.exploreTheWines"], locale)} <ArrowUpRight size={16} /></Link>
      </div>
    </section>

    <WinerySection image={winery.image || "/images/winery.jpg"} eyebrow={localize(winery.eyebrow, locale)} heading={localize(winery.heading, locale)} paragraph1={localize(winery.paragraph1, locale)} paragraph2={localize(winery.paragraph2, locale)}>
      <section className="science-section">
        <p className="eyebrow">{localize(science.eyebrow, locale)}</p>
        <h2><BreakableText text={localize(science.heading, locale)} /></h2>
        <div>
          <p>{localize(science.paragraph, locale)}</p>
          <Link href={localizeHref("/terroir", locale)} className="underlined-link">{localize(t["cta.ourVineyards"], locale)} <ArrowUpRight size={16} /></Link>
        </div>
      </section>
    </WinerySection>
  </main>;
}
