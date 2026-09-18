import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FeaturedWines } from "./wine-collection";
import { EditorialCards } from "./editorial-cards";
import { ParallaxMedia } from "./parallax-media";
import { SmoothScroll } from "./smooth-scroll";
import { ScrollReveal } from "./scroll-reveal";
import { listWines } from "@/lib/wines/service";
import { listCategories } from "@/lib/categories/service";

const worlds = [
  { number: "01", title: "Our place", subtitle: "Rooted in Kakheti", text: "Between the Caucasus Mountains and the Alazani Valley, our vineyards give every wine a sense of belonging.", href: "/terroir", link: "Explore our vineyards" },
  { number: "02", title: "Our craft", subtitle: "A living tradition", text: "Clay vessels, native grapes, and knowledge passed from one generation to the next. Qvevri is part of who we are.", href: "/alaverdi-monastery-cellar", link: "Discover the craft" },
  { number: "03", title: "Our perspective", subtitle: "Always looking forward", text: "Georgian heritage meets contemporary winemaking. An ongoing conversation between the vineyard, the cellar, and the world.", href: "/story", link: "Meet Badagoni" },
];

export default async function Home() {
  const [wines, categories] = await Promise.all([listWines(), listCategories()]);
  return <SmoothScroll><main>
    <ParallaxMedia
      className="campaign-hero"
      ariaLabel="Badagoni wine"
      media={<img className="campaign-image" src="/images/ritual-editorial.webp" alt="An editorial scene of two people sharing Badagoni wine at a table" fetchPriority="high" />}
      overlay={<>
        <div className="campaign-shade" />
        <Link href="/catalogue" className="campaign-link">Explore the collection <ArrowUpRight size={19} /></Link>
        <p className="campaign-caption">Native grapes.<br />Independent character.</p>
      </>}
    />

    <ScrollReveal><section className="opening-note" aria-label="About Badagoni">
      <h1 className="opening-signature">From Georgia, with character.</h1>
      <p className="opening-copy">Born in the heart of Kakheti, we bring a contemporary spirit to Georgian wine. From the soil to the table, it’s a story of character, connection, and a place like nowhere else.</p>
    </section></ScrollReveal>

    <section className="selected-collection" aria-labelledby="collection-title">
      <div className="collection-label"><h2 id="collection-title">The collection</h2><span>Selected expressions / 01—03</span></div>
      <FeaturedWines wines={wines} categories={categories} />
      <div className="collection-more"><Link href="/catalogue" className="underlined-link">View all wines <ArrowUpRight size={16} /></Link></div>
    </section>

    <ScrollReveal><EditorialCards /></ScrollReveal>

    <ScrollReveal><div className="origin-interlude"><p>Badagoni<br />Kakheti, Georgia</p><span>Local roots. A world of possibilities.</span></div></ScrollReveal>

    <section className="manifesto" aria-labelledby="manifesto-title">
      <ParallaxMedia
        className="manifesto-image"
        media={<img src="/images/ritual-editorial.webp" alt="A shared glass of wine around the table" width={1672} height={941} loading="lazy" />}
        overlay={<span>Wine is a way of bringing people together.</span>}
      />
      <div className="manifesto-content"><h2 id="manifesto-title">More than<br />just wine.</h2><div className="manifesto-copy"><p className="eyebrow">A way of looking at the world</p><p>A bottle can hold a place, a memory, a conversation. Ours begin in Georgia, with the varieties and traditions that make this corner of the world our own.</p><Link href="/story" className="underlined-link">Our story <ArrowUpRight size={16} /></Link></div></div>

      <section className="world-section" aria-labelledby="world-title">
        <h2 id="world-title" className="world-label">Our world, in three parts</h2>
        {worlds.map(world => <ScrollReveal key={world.number}><article className="world-row">
          <div className="world-number"><span>{world.title}</span><span>/{world.number}</span></div>
          <div className="world-copy"><h3>{world.subtitle}</h3><p>{world.text}</p><Link href={world.href} className="underlined-link">{world.link} <ArrowUpRight size={16} /></Link></div>
        </article></ScrollReveal>)}
      </section>
    </section>
  </main></SmoothScroll>;
}
