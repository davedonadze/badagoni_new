import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getNewsArticleBySlug } from "@/lib/news/service";
import { formatNewsDate } from "@/lib/news/format";
import { ParallaxMedia } from "../../parallax-media";
import { BannerMedia } from "../../banner-media";
import { BreakableParagraphs } from "../../breakable-paragraphs";
import { getLocale, localize, localizeHref } from "@/lib/i18n";

type ArticlePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const [article, locale] = await Promise.all([getNewsArticleBySlug(slug), getLocale()]);
  if (!article) return { title: "Story not found" };
  return { title: localize(article.title, locale), description: localize(article.excerpt, locale) };
}

export default async function NewsArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [article, locale] = await Promise.all([getNewsArticleBySlug(slug), getLocale()]);
  if (!article) notFound();

  const title = localize(article.title, locale);

  return <main className="news-article-page">
    <nav className="news-article-back" aria-label="Newsroom navigation"><Link href={localizeHref("/newsroom", locale)} className="underlined-link"><ArrowLeft size={17} aria-hidden="true" />Back to newsroom</Link></nav>
    <article>
      <header className="news-article-heading">
        <div className="news-meta"><span>{localize(article.category, locale)}</span><time dateTime={article.date}>{formatNewsDate(article.date)}</time></div>
        <h1>{title}</h1>
        <p>{localize(article.excerpt, locale)}</p>
      </header>
      <ParallaxMedia
        className={`news-media news-article-image${article.imageFit === "contain" ? " news-media-contain" : ""}`}
        scale={1.5}
        media={<BannerMedia src={article.image} alt={title} fetchPriority="high" />}
      />
      <div className="news-article-body">
        {(article.sourceUrl || article.relatedHref) && <aside className="news-article-credit">
          {article.sourceUrl && <><span className="eyebrow">Published by Badagoni</span><a href={article.sourceUrl} target="_blank" rel="noreferrer" className="underlined-link">Original announcement <ArrowUpRight size={16} aria-hidden="true" /></a></>}
        </aside>}
        <div className="news-article-copy">
          <BreakableParagraphs text={localize(article.body, locale)} />
          {article.relatedHref && <Link href={localizeHref(article.relatedHref, locale)} className="underlined-link">{article.relatedLabel ? localize(article.relatedLabel, locale) : "Learn more"}<ArrowUpRight size={18} aria-hidden="true" /></Link>}
        </div>
      </div>
    </article>
    <div className="news-article-return"><Link href={localizeHref("/newsroom", locale)} className="underlined-link"><ArrowLeft size={17} aria-hidden="true" />All news & stories</Link></div>
  </main>;
}
