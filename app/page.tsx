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
import { getLocale, localize, localizeHref } from "@/lib/i18n";
import { getUiStrings } from "@/lib/ui-strings/service";
import { titleStyleCss } from "@/lib/title-style";
import { TitleStyleMobileRule } from "./title-style-mobile-rule";

// Fixed metadata for the world section rows that stays in code (their hrefs,
// link-text key, and display number) - only title/subtitle/text are DB-driven.
const WORLD_META = [
  { number: "01", href: "/terroir", linkKey: "cta.exploreOurVineyards" },
  { number: "02", href: "/alaverdi-monastery-cellar", linkKey: "cta.discoverTheCraft" },
  { number: "03", href: "/story", linkKey: "cta.meetBadagoni" },
];

export default async function Home() {
  const [wines, categories, content, locale, t] = await Promise.all([
    listWines(),
    listCategories(),
    getPageContent<HomeContent>(HOME_SLUG),
    getLocale(),
    getUiStrings(),
  ]);
  const { hero, opening, collection, editorialCards, originInterlude, manifesto, worldSection } = content ?? HOME_DEFAULT;

  return <SmoothScroll><main>
    <ParallaxMedia
      className="campaign-hero"
      ariaLabel="Badagoni wine"
      media={<BannerMedia src={hero.image} alt="An editorial scene of two people sharing Badagoni wine at a table" className="campaign-image" fetchPriority="high" />}
      overlay={<>
        <div className="campaign-shade" />
        <Link href={localizeHref("/catalogue", locale)} className="campaign-link">{localize(t["cta.exploreCollection"], locale)} <ArrowUpRight size={19} /></Link>
        <p className="campaign-caption"><BreakableText text={localize(hero.caption, locale)} /></p>
      </>}
    />

    <ScrollReveal><section className="opening-note" aria-label="About Badagoni">
      <h1 id="home-opening-title" className="opening-signature" style={titleStyleCss(opening.headingStyle)}>{localize(opening.heading, locale)}</h1>
      <TitleStyleMobileRule id="home-opening-title" style={opening.headingStyle} defaultMobilePx={22} />
      <p className="opening-copy">{localize(opening.body, locale)}</p>
    </section></ScrollReveal>

    <section className="selected-collection" aria-labelledby="collection-title">
      <div className="collection-label"><h2 id="collection-title" style={titleStyleCss(collection.headingStyle)}>{localize(collection.heading, locale)}</h2></div>
      <TitleStyleMobileRule id="collection-title" style={collection.headingStyle} defaultMobilePx={14} />
      <FeaturedWines wines={wines} categories={categories} locale={locale} t={t} />
      <div className="collection-more"><Link href={localizeHref("/catalogue", locale)} className="underlined-link">{localize(t["cta.viewAllWines"], locale)} <ArrowUpRight size={16} /></Link></div>
    </section>

    <ScrollReveal><EditorialCards cards={editorialCards} locale={locale} t={t} /></ScrollReveal>

    <ScrollReveal><div className="origin-interlude"><p><BreakableText text={localize(originInterlude.line, locale)} /></p><span>{localize(originInterlude.caption, locale)}</span></div></ScrollReveal>

    <section className="manifesto" aria-labelledby="manifesto-title">
      <ParallaxMedia
        className="manifesto-image"
        media={<BannerMedia src={manifesto.image} alt="A shared glass of wine around the table" loading="lazy" />}
        overlay={<span>{localize(manifesto.overlayCaption, locale)}</span>}
      />
      <div className="manifesto-content"><h2 id="manifesto-title" style={titleStyleCss(manifesto.headingStyle)}><BreakableText text={localize(manifesto.heading, locale)} /></h2><TitleStyleMobileRule id="manifesto-title" style={manifesto.headingStyle} defaultMobilePx={48} /><div className="manifesto-copy"><p className="eyebrow">{localize(manifesto.eyebrow, locale)}</p><p>{localize(manifesto.body, locale)}</p><Link href={localizeHref("/story", locale)} className="underlined-link">{localize(t["cta.ourStory"], locale)} <ArrowUpRight size={16} /></Link></div></div>

      <section className="world-section" aria-labelledby="world-title">
        <h2 id="world-title" className="world-label" style={titleStyleCss(worldSection.headingStyle)}>{localize(worldSection.heading, locale)}</h2>
        <TitleStyleMobileRule id="world-title" style={worldSection.headingStyle} defaultMobilePx={12} />
        {worldSection.items.map((world, i) => <ScrollReveal key={WORLD_META[i].number}><article className="world-row">
          <div className="world-number"><span>{localize(world.title, locale)}</span><span>/{WORLD_META[i].number}</span></div>
          <div className="world-copy"><h3 id={`home-world-${i}-title`} style={titleStyleCss(world.subtitleStyle)}>{localize(world.subtitle, locale)}</h3><TitleStyleMobileRule id={`home-world-${i}-title`} style={world.subtitleStyle} defaultMobilePx={31} /><p>{localize(world.text, locale)}</p><Link href={localizeHref(WORLD_META[i].href, locale)} className="underlined-link">{localize(t[WORLD_META[i].linkKey], locale)} <ArrowUpRight size={16} /></Link></div>
        </article></ScrollReveal>)}
      </section>
    </section>
  </main></SmoothScroll>;
}
