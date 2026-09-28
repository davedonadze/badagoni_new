import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { listNewsArticles } from "@/lib/news/service";
import { formatNewsDate } from "@/lib/news/format";
import { BannerMedia } from "../banner-media";
import { getLocale, localize, localizeHref } from "@/lib/i18n";
import { NewsCards } from "./news-cards";

export const metadata: Metadata = {
  title: "Newsroom",
  description: "News, awards, and stories from Badagoni and the world of Georgian wine.",
};

export default async function Newsroom() {
  const [articles, locale] = await Promise.all([listNewsArticles(), getLocale()]);
  const [featured, ...stories] = articles;

  if (!featured) {
    return <main className="newsroom-page">
      <div className="editorial-heading newsroom-heading">
        <p className="eyebrow">News & stories</p>
        <h1>Newsroom.</h1>
        <p>From our home in Kakheti<br />to the wider world of wine.</p>
      </div>
    </main>;
  }

  return <main className="newsroom-page">
    <div className="editorial-heading newsroom-heading">
      <p className="eyebrow">News & stories</p>
      <h1>Newsroom.</h1>
      <p>From our home in Kakheti<br />to the wider world of wine.</p>
    </div>

    <section className="newsroom-featured" aria-labelledby="featured-news-title">
      <Link href={localizeHref(`/newsroom/${featured.slug}`, locale)} className="newsroom-featured-link" aria-labelledby="featured-news-title">
        <div className={`news-media newsroom-featured-image${featured.imageFit === "contain" ? " news-media-contain" : ""}`}>
          <BannerMedia src={featured.image} alt={localize(featured.title, locale)} fetchPriority="high" />
        </div>
        <div className="newsroom-featured-copy">
          <p className="eyebrow">Featured story</p>
          <div className="news-meta"><span>{localize(featured.category, locale)}</span><time dateTime={featured.date}>{formatNewsDate(featured.date)}</time></div>
          <h2 id="featured-news-title">{localize(featured.title, locale)}</h2>
          <p className="news-excerpt">{localize(featured.excerpt, locale)}</p>
          <span className="underlined-link">Read story <ArrowUpRight size={18} aria-hidden="true" /></span>
        </div>
      </Link>
    </section>

    <section id="more-from-badagoni" className="newsroom-stories" aria-labelledby="newsroom-stories-title">
      <div className="newsroom-list-heading"><h2 id="newsroom-stories-title" className="eyebrow">More from Badagoni</h2></div>
      <NewsCards stories={[...stories, featured]} locale={locale} />
    </section>
  </main>;
}
