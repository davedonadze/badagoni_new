"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import type { NewsArticle } from "@/lib/news/service";
import { formatNewsDate } from "@/lib/news/format";
import { BannerMedia } from "../banner-media";
import { BreakableParagraphs } from "../breakable-paragraphs";
import { localize, localizeHref, type Locale } from "@/lib/i18n";
import type { Localized } from "@/db/schema";

export function NewsCards({ stories, locale, t }: { stories: NewsArticle[]; locale: Locale; t: Record<string, Localized> }) {
  const [expanded, setExpanded] = useState("");
  const expandedIndex = stories.findIndex((story) => story.slug === expanded);

  return <Accordion
    type="single"
    collapsible
    orientation="horizontal"
    value={expanded}
    onValueChange={setExpanded}
    className="newsroom-grid"
    data-expanded={expandedIndex < 0 ? "" : expandedIndex}
    onKeyDown={(event) => {
      if (event.key === "Escape" && expanded) {
        event.currentTarget.querySelector<HTMLButtonElement>(".news-card-trigger[data-state='open']")?.focus();
        setExpanded("");
        event.preventDefault();
      }
    }}
  >
    {stories.map((story) => {
      const isOpen = expanded === story.slug;
      const title = localize(story.title, locale);

      return <AccordionItem key={story.slug} value={story.slug} className="news-card">
        <AccordionPrimitive.Header className="news-card-heading">
          <AccordionPrimitive.Trigger className="news-card-trigger" aria-label={title}>
            <span className="news-card-stage">
              <span className="news-card-artwork"><BannerMedia src={story.image} alt={title} loading="lazy" /></span>
              <span className="news-card-toggle" aria-hidden="true"><Plus size={20} strokeWidth={1.4} /></span>
            </span>
            <span className="news-card-title">{title}</span>
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content forceMount className="news-card-details" aria-hidden={!isOpen} inert={!isOpen}>
          <div className="news-card-details-inner">
            <div className="news-meta"><span>{localize(story.category, locale)}</span><time dateTime={story.date}>{formatNewsDate(story.date)}</time></div>
            <h3 className="news-card-detail-title">{title}</h3>
            <div className="news-card-copy"><BreakableParagraphs text={localize(story.body, locale)} /></div>
            <Link href={localizeHref(`/newsroom/${story.slug}`, locale)} className="underlined-link">{localize(t["cta.readFullStory"], locale)} <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
        </AccordionPrimitive.Content>
      </AccordionItem>;
    })}
  </Accordion>;
}
