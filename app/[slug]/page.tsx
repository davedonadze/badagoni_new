import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/pages/service";
import type { GenericPageContent } from "@/lib/pages/generic";
import { ParallaxMedia } from "../parallax-media";
import { BannerMedia } from "../banner-media";
import { BreakableParagraphs } from "../breakable-paragraphs";
import { PageSections } from "../generic-page-sections";
import { getLocale, localize } from "@/lib/i18n";
import { titleStyleCss } from "@/lib/title-style";
import { TitleStyleMobileRule } from "../title-style-mobile-rule";

type GenericPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: GenericPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [content, locale] = await Promise.all([getPageContent<GenericPageContent>(slug), getLocale()]);
  if (!content) return {};
  const subtitle = localize(content.subtitle, locale);
  return { title: localize(content.title, locale), description: subtitle || undefined };
}

// Renders any admin-created page (see lib/pages/generic.ts) that isn't one
// of the specially-coded routes (/, /story, etc.) - those are static routes
// Next.js resolves before this dynamic one ever runs.
export default async function GenericPage({ params }: GenericPageProps) {
  const { slug } = await params;
  const [content, locale] = await Promise.all([getPageContent<GenericPageContent>(slug), getLocale()]);
  if (!content) notFound();

  const eyebrow = localize(content.eyebrow, locale);
  const title = localize(content.title, locale);
  const subtitle = localize(content.subtitle, locale);
  const body = localize(content.body, locale);
  const coverCaption = content.cover ? localize(content.cover.caption, locale) : "";

  return <main>
    <div className="editorial-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 id="generic-page-title" style={titleStyleCss(content.titleStyle)}>{title}</h1>
      <TitleStyleMobileRule id="generic-page-title" style={content.titleStyle} defaultMobilePx={50} />
      {subtitle && <p>{subtitle}</p>}
    </div>

    {content.cover && (
      <ParallaxMedia className="generic-page-cover" scale={1.5} ariaLabel={coverCaption} media={<BannerMedia src={content.cover.image} alt={title} fetchPriority="high" />} overlay={coverCaption ? <span>{coverCaption}</span> : undefined} />
    )}

    {body && <div className="generic-page-body"><BreakableParagraphs text={body} /></div>}

    <PageSections sections={content.sections ?? []} locale={locale} />
  </main>;
}
