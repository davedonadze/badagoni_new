import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { articles, formatNewsDate } from "../articles";
import { ParallaxMedia } from "../../parallax-media";

type ArticlePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) return { title: "Story not found" };
  return { title: article.title, description: article.excerpt };
}

export default async function NewsArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();

  return <main className="news-article-page">
    <nav className="news-article-back" aria-label="Newsroom navigation"><Link href="/newsroom" className="underlined-link"><ArrowLeft size={17} aria-hidden="true" />Back to newsroom</Link></nav>
    <article>
      <header className="news-article-heading">
        <div className="news-meta"><span>{article.category}</span><time dateTime={article.date}>{formatNewsDate(article.date)}</time></div>
        <h1>{article.title}</h1>
        <p>{article.excerpt}</p>
      </header>
      <ParallaxMedia className="news-media news-article-image" scale={1.5} media={<img src={article.image} alt={article.imageAlt} width={article.imageWidth} height={article.imageHeight} style={{ objectFit: article.imageFit }} fetchPriority="high" />} />
      <div className="news-article-body">
        <aside className="news-article-credit"><span className="eyebrow">Published by Badagoni</span><a href={article.sourceUrl} target="_blank" rel="noreferrer" className="underlined-link">Original announcement <ArrowUpRight size={16} aria-hidden="true" /></a></aside>
        <div className="news-article-copy">
          {article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <Link href={article.relatedLink.href} className="underlined-link">{article.relatedLink.label}<ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </div>
    </article>
    <div className="news-article-return"><Link href="/newsroom" className="underlined-link"><ArrowLeft size={17} aria-hidden="true" />All news & stories</Link></div>
  </main>;
}
