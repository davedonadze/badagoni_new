import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listNewsArticles } from "@/lib/news/service";
import { formatNewsDate } from "@/lib/news/format";
import { getLocale, localize, localizeHref } from "@/lib/i18n";
import { getUiStrings } from "@/lib/ui-strings/service";

export const metadata: Metadata = {
  title: "All news",
  description: "Browse Badagoni news, wine awards, and stories, with short introductions and links to every announcement.",
};

export default async function AllNews() {
  const [articles, locale, t] = await Promise.all([listNewsArticles(), getLocale(), getUiStrings()]);
  const [, ...stories] = articles;

  return <main className="all-news-page">
    <nav className="news-article-back" aria-label="Newsroom navigation">
      <Link href={localizeHref("/newsroom", locale)} className="underlined-link"><ArrowLeft size={17} aria-hidden="true" />{localize(t["newsroom.backToNewsroom"], locale)}</Link>
    </nav>

    <div className="editorial-heading newsroom-heading all-news-heading">
      <p className="eyebrow">{localize(t["newsroom.newsAndStories"], locale)}</p>
      <h1>{localize(t["newsroom.allNewsHeading"], locale)}</h1>
      <p>{localize(t["newsroom.allNewsSubheadLine1"], locale)}<br />{localize(t["newsroom.allNewsSubheadLine2"], locale)}</p>
    </div>

    <section className="all-news-index" aria-labelledby="all-news-list-title">
      <div className="all-news-index-heading">
        <h2 id="all-news-list-title" className="eyebrow">{localize(t["newsroom.latestFirst"], locale)}</h2>
        <span>{stories.length} {localize(t["newsroom.storiesSuffix"], locale)}</span>
      </div>
      <ol className="all-news-list">
        {stories.map(story => <li key={story.slug}>
          <article className="all-news-row">
            <time dateTime={story.date}>{formatNewsDate(story.date)}</time>
            <h2><Link href={localizeHref(`/newsroom/${story.slug}`, locale)}>{localize(story.title, locale)}</Link></h2>
            <p>{localize(story.excerpt, locale)}</p>
            <Link href={localizeHref(`/newsroom/${story.slug}`, locale)} className="underlined-link all-news-read" aria-label={`${localize(t["cta.readStory"], locale)}: ${localize(story.title, locale)}`}>{localize(t["cta.readStory"], locale)}</Link>
          </article>
        </li>)}
      </ol>
    </section>
  </main>;
}
