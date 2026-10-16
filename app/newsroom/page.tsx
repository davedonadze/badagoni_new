import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { listNewsArticles } from "@/lib/news/service";
import { getLocale, localize, localizeHref } from "@/lib/i18n";
import { getUiStrings } from "@/lib/ui-strings/service";
import { NewsCards } from "./news-cards";

export const metadata: Metadata = {
  title: "Newsroom",
  description: "News, awards, and stories from Badagoni and the world of Georgian wine.",
};

const PREVIEW_COUNT = 3;

export default async function Newsroom() {
  const [articles, locale, t] = await Promise.all([listNewsArticles(), getLocale(), getUiStrings()]);
  const preview = articles.slice(0, PREVIEW_COUNT);

  return <main className="newsroom-page">
    <div className="editorial-heading newsroom-heading">
      <p className="eyebrow">{localize(t["newsroom.newsAndStories"], locale)}</p>
      <h1>{localize(t["newsroom.heading"], locale)}</h1>
      <p>{localize(t["newsroom.subheadLine1"], locale)}<br />{localize(t["newsroom.subheadLine2"], locale)}</p>
    </div>

    {preview.length > 0 && <section id="more-from-badagoni" className="newsroom-stories" aria-label={localize(t["newsroom.newsAndStories"], locale)}>
      <NewsCards stories={preview} locale={locale} t={t} />
      {articles.length > PREVIEW_COUNT && <div className="newsroom-more"><Link href={localizeHref("/newsroom/all", locale)} className="underlined-link">{localize(t["newsroom.more"], locale)} <ArrowUpRight size={18} aria-hidden="true" /></Link></div>}
    </section>}
  </main>;
}
