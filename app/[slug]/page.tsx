import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/pages/service";
import type { GenericPageContent } from "@/lib/pages/generic";
import { ParallaxMedia } from "../parallax-media";
import { BannerMedia } from "../banner-media";
import { BreakableParagraphs } from "../breakable-paragraphs";

type GenericPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: GenericPageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = await getPageContent<GenericPageContent>(slug);
  if (!content) return {};
  return { title: content.title.en, description: content.subtitle.en || undefined };
}

// Renders any admin-created page (see lib/pages/generic.ts) that isn't one
// of the specially-coded routes (/, /story, etc.) - those are static routes
// Next.js resolves before this dynamic one ever runs.
export default async function GenericPage({ params }: GenericPageProps) {
  const { slug } = await params;
  const content = await getPageContent<GenericPageContent>(slug);
  if (!content) notFound();

  return <main>
    <div className="editorial-heading">
      {content.eyebrow.en && <p className="eyebrow">{content.eyebrow.en}</p>}
      <h1>{content.title.en}</h1>
      {content.subtitle.en && <p>{content.subtitle.en}</p>}
    </div>

    {content.cover && (
      <ParallaxMedia className="generic-page-cover" scale={1.5} ariaLabel={content.cover.caption.en} media={<BannerMedia src={content.cover.image} alt={content.title.en} fetchPriority="high" />} overlay={content.cover.caption.en ? <span>{content.cover.caption.en}</span> : undefined} />
    )}

    {content.body.en && <div className="generic-page-body"><BreakableParagraphs text={content.body.en} /></div>}
  </main>;
}
