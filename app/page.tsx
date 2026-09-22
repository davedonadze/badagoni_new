import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FeaturedWines } from "./wine-collection";
import { EditorialCards } from "./editorial-cards";
import { ParallaxMedia } from "./parallax-media";
import { SmoothScroll } from "./smooth-scroll";
import { ScrollReveal } from "./scroll-reveal";
import { BreakableText } from "./breakable-text";
import { BannerMedia } from "./banner-media";
import { listWines } from "@/lib/wines/service";
import { listCategories } from "@/lib/categories/service";
import { getPageContent } from "@/lib/pages/service";
import { HOME_SLUG, HOME_DEFAULT, type HomeContent } from "@/lib/pages/home";

// Fixed metadata for the world section rows that stays in code (their hrefs,
// link text, and display number) - only title/subtitle/text are DB-driven.
const WORLD_META = [
  { number: "01", href: "/terroir", link: "Explore our vineyards" },
  { number: "02", href: "/alaverdi-monastery-cellar", link: "Discover the craft" },
  { number: "03", href: "/story", link: "Meet Badagoni" },
];

export default async function Home() {
  const [wines, categories, content] = await Promise.all([
    listWines(),
    listCategories(),
    getPageContent<HomeContent>(HOME_SLUG),
  ]);
  const { hero, opening, collection, editorialCards, originInterlude, manifesto, worldSection } = content ?? HOME_DEFAULT;

  return <SmoothScroll><main>
    <ParallaxMedia
      className="campaign-hero"
      ariaLabel="Badagoni wine"
      media={<BannerMedia src={hero.image} alt="An editorial scene of two people sharing Badagoni wine at a table" className="campaign-image" fetchPriority="high" />}
      overlay={<>
        <div className="campaign-shade" />
        <Link href="/catalogue" className="campaign-link">Explore the collection <ArrowUpRight size={19} /></Link>
        <p className="campaign-caption"><BreakableText text={hero.caption.en} /></p>
      </>}
    />

    <ScrollReveal><section className="opening-note" aria-label="About Badagoni">
      <h1 className="opening-signature">{opening.heading.en}</h1>
      <p className="opening-copy">{opening.body.en}</p>
    </section></ScrollReveal>

    <section className="selected-collection" aria-labelledby="collection-title">
      <div className="collection-label"><h2 id="collection-title">{collection.heading.en}</h2></div>
      <FeaturedWines wines={wines} categories={categories} />
      <div className="collection-more"><Link href="/catalogue" className="underlined-link">View all wines <ArrowUpRight size={16} /></Link></div>
    </section>

    <ScrollReveal><EditorialCards cards={editorialCards} /></ScrollReveal>

    <ScrollReveal><div className="origin-interlude"><p><BreakableText text={originInterlude.line.en} /></p><span>{originInterlude.caption.en}</span></div></ScrollReveal>

    <section className="manifesto" aria-labelledby="manifesto-title">
      <ParallaxMedia
        className="manifesto-image"
        media={<BannerMedia src={manifesto.image} alt="A shared glass of wine around the table" loading="lazy" />}
        overlay={<span>{manifesto.overlayCaption.en}</span>}
      />
      <div className="manifesto-content"><h2 id="manifesto-title"><BreakableText text={manifesto.heading.en} /></h2><div className="manifesto-copy"><p className="eyebrow">{manifesto.eyebrow.en}</p><p>{manifesto.body.en}</p><Link href="/story" className="underlined-link">Our story <ArrowUpRight size={16} /></Link></div></div>

      <section className="world-section" aria-labelledby="world-title">
        <h2 id="world-title" className="world-label">{worldSection.heading.en}</h2>
        {worldSection.items.map((world, i) => <ScrollReveal key={WORLD_META[i].number}><article className="world-row">
          <div className="world-number"><span>{world.title.en}</span><span>/{WORLD_META[i].number}</span></div>
          <div className="world-copy"><h3>{world.subtitle.en}</h3><p>{world.text.en}</p><Link href={WORLD_META[i].href} className="underlined-link">{WORLD_META[i].link} <ArrowUpRight size={16} /></Link></div>
        </article></ScrollReveal>)}
      </section>
    </section>
  </main></SmoothScroll>;
}
