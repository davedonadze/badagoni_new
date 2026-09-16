import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { articles, formatNewsDate } from "./articles";
import { NewsCards } from "./news-cards";

export const metadata: Metadata = {
  title: "Newsroom",
  description: "News, awards, and stories from Badagoni and the world of Georgian wine.",
};

export default function Newsroom() {
  const [featured, ...stories] = articles;

  return <main className="newsroom-page">
    <div className="editorial-heading newsroom-heading">
      <p className="eyebrow">News & stories</p>
      <h1>Newsroom.</h1>
      <p>From our home in Kakheti<br />to the wider world of wine.</p>
    </div>

    <section className="newsroom-featured" aria-labelledby="featured-news-title">
      <Link href={`/newsroom/${featured.slug}`} className="newsroom-featured-link" aria-labelledby="featured-news-title">
        <div className="news-media newsroom-featured-image"><img src={featured.image} alt={featured.imageAlt} width={featured.imageWidth} height={featured.imageHeight} style={{ objectFit: featured.imageFit }} fetchPriority="high" /></div>
        <div className="newsroom-featured-copy">
          <p className="eyebrow">Featured story</p>
          <div className="news-meta"><span>{featured.category}</span><time dateTime={featured.date}>{formatNewsDate(featured.date)}</time></div>
          <h2 id="featured-news-title">{featured.title}</h2>
          <p className="news-excerpt">{featured.excerpt}</p>
          <span className="underlined-link">Read story <ArrowUpRight size={18} aria-hidden="true" /></span>
        </div>
      </Link>
    </section>

    <section id="more-from-badagoni" className="newsroom-stories" aria-labelledby="newsroom-stories-title">
      <div className="newsroom-list-heading"><h2 id="newsroom-stories-title" className="eyebrow">More from Badagoni</h2></div>
      <NewsCards stories={[...stories, featured]} />
    </section>
  </main>;
}
