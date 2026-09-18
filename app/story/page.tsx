import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WinerySection } from "./winery-section";
import { ParallaxMedia } from "../parallax-media";
import { BreakableText } from "../breakable-text";
import { getPageContent } from "@/lib/pages/service";
import { STORY_SLUG, STORY_DEFAULT, type StoryContent } from "@/lib/pages/story";

export const metadata: Metadata = { title: "Our story", description: "Born in Kakheti in 2006. Georgian heritage and a contemporary perspective on wine." };

export default async function Story() {
  const content = (await getPageContent<StoryContent>(STORY_SLUG)) ?? STORY_DEFAULT;
  const { heading, cover, intro, qvevri, winery, science } = content;

  return <main>
    <div className="editorial-heading">
      <p className="eyebrow">{heading.eyebrow.en}</p>
      <h1><BreakableText text={heading.title.en} /></h1>
      <p><BreakableText text={heading.subtitle.en} /></p>
    </div>

    <ParallaxMedia className="story-cover" scale={1.5} ariaLabel={cover.caption.en} media={<img src={cover.image} alt="Alaverdi Monastery in the landscapes of Kakheti" fetchPriority="high" />} overlay={<span>{cover.caption.en}</span>} />

    <section className="story-intro">
      <p className="eyebrow">{intro.eyebrow.en}</p>
      <div>
        <h2><BreakableText text={intro.heading.en} /></h2>
        <div className="story-paragraphs">
          <p>{intro.paragraph1.en}</p>
          <p>{intro.paragraph2.en}</p>
        </div>
      </div>
    </section>

    <section className="story-qvevri" id="qvevri">
      <ParallaxMedia className="qvevri-photo" scale={1.5} media={<img src={qvevri.image} alt="A monk tending qvevri in Alaverdi Monastery’s historic cellar" loading="lazy" />} />
      <div className="story-qvevri-copy">
        <p className="eyebrow">{qvevri.eyebrow.en}</p>
        <h2><BreakableText text={qvevri.heading.en} /></h2>
        <p>{qvevri.paragraph1.en}</p>
        <p>{qvevri.paragraph2.en}</p>
        <Link href="/catalogue" className="underlined-link">Explore the wines <ArrowUpRight size={16} /></Link>
      </div>
    </section>

    <WinerySection eyebrow={winery.eyebrow.en} heading={winery.heading.en} paragraph1={winery.paragraph1.en} paragraph2={winery.paragraph2.en}>
      <section className="science-section">
        <p className="eyebrow">{science.eyebrow.en}</p>
        <h2><BreakableText text={science.heading.en} /></h2>
        <div>
          <p>{science.paragraph.en}</p>
          <Link href="/terroir" className="underlined-link">Our vineyards <ArrowUpRight size={16} /></Link>
        </div>
      </section>
    </WinerySection>
  </main>;
}
