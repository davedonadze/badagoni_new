import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { VineyardList } from "./vineyard-list";
import { ParallaxMedia } from "../parallax-media";
import { BreakableText } from "../breakable-text";
import { BannerMedia } from "../banner-media";
import { getPageContent } from "@/lib/pages/service";
import { TERROIR_SLUG, TERROIR_DEFAULT, type TerroirContent } from "@/lib/pages/terroir";
import { getLocale, localize, localizeHref } from "@/lib/i18n";
import { getUiStrings } from "@/lib/ui-strings/service";
import { titleStyleCss } from "@/lib/title-style";
import { TitleStyleMobileRule } from "../title-style-mobile-rule";

export const metadata: Metadata = { title: "Our vineyards", description: "The vineyards and varied terroirs of Kakheti that shape every Badagoni wine." };

export default async function Terroir() {
  const [content, locale, t] = await Promise.all([
    getPageContent<TerroirContent>(TERROIR_SLUG),
    getLocale(),
    getUiStrings(),
  ]);
  const { heading, cover, intro, listHeading, places, closing } = content ?? TERROIR_DEFAULT;

  const vineyardPlaces = places.map((place, i) => {
    const name = localize(place.name, locale);
    return {
      id: `place-${i}`,
      name,
      grape: localize(place.grape, locale),
      text: localize(place.text, locale),
      image: place.image,
      imageAlt: `${name} vineyard, Kakheti`,
    };
  });

  return <main>
    <div className="editorial-heading">
      <p className="eyebrow">{localize(heading.eyebrow, locale)}</p>
      <h1 id="terroir-heading-title" style={titleStyleCss(heading.titleStyle)}><BreakableText text={localize(heading.title, locale)} /></h1>
      <TitleStyleMobileRule id="terroir-heading-title" style={heading.titleStyle} defaultMobilePx={50} />
      <p><BreakableText text={localize(heading.subtitle, locale)} /></p>
    </div>

    <ParallaxMedia className="terroir-cover" scale={1.5} ariaLabel={localize(cover.caption, locale)} media={<BannerMedia src={cover.image} alt="Alaverdi Monastery and the vineyards of Kakheti beneath the Caucasus Mountains" fetchPriority="high" />} overlay={<span>{localize(cover.caption, locale)}</span>} />

    <section className="terroir-intro">
      <p className="eyebrow">{localize(intro.eyebrow, locale)}</p>
      <h2 id="terroir-intro-heading" style={titleStyleCss(intro.headingStyle)}><BreakableText text={localize(intro.heading, locale)} /></h2>
      <TitleStyleMobileRule id="terroir-intro-heading" style={intro.headingStyle} defaultMobilePx={61} />
      <p>{localize(intro.body, locale)}</p>
    </section>

    <section id="selected-locations" className="vineyard-list" aria-labelledby="selected-locations-title">
      <div className="list-heading">
        <h2 id="selected-locations-title" className="eyebrow">{localize(listHeading.label, locale)}</h2>
        <span>{localize(listHeading.subtitle, locale)}</span>
      </div>
      <VineyardList places={vineyardPlaces} locale={locale} t={t} />
    </section>

    <section className="terroir-closing">
      <ParallaxMedia className="terroir-closing-media" scale={1.5} media={<BannerMedia src={closing.image} alt="Vineyards stretching toward the Caucasus Mountains" loading="lazy" />} />
      <div>
        <p className="eyebrow">{localize(closing.eyebrow, locale)}</p>
        <h2 id="terroir-closing-heading" style={titleStyleCss(closing.headingStyle)}><BreakableText text={localize(closing.heading, locale)} /></h2>
        <TitleStyleMobileRule id="terroir-closing-heading" style={closing.headingStyle} defaultMobilePx={55} />
        <Link href={localizeHref("/catalogue", locale)} className="underlined-link">{localize(t["cta.discoverCollection"], locale)} <ArrowUpRight size={16} /></Link>
      </div>
    </section>
  </main>;
}
