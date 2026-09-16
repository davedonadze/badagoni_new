"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { formatNewsDate, type NewsArticle } from "./articles";

export function NewsCards({ stories }: { stories: NewsArticle[] }) {
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

      return <AccordionItem key={story.slug} value={story.slug} className="news-card">
        <AccordionPrimitive.Header className="news-card-heading">
          <AccordionPrimitive.Trigger className="news-card-trigger" aria-label={story.title}>
            <span className="news-card-stage">
              <span className="news-card-artwork"><img src={story.image} alt={story.imageAlt} width={story.imageWidth} height={story.imageHeight} loading="lazy" /></span>
              <span className="news-card-toggle" aria-hidden="true"><Plus size={20} strokeWidth={1.4} /></span>
            </span>
            <span className="news-card-title">{story.title}</span>
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content forceMount className="news-card-details" aria-hidden={!isOpen} inert={!isOpen}>
          <div className="news-card-details-inner">
            <div className="news-meta"><span>{story.category}</span><time dateTime={story.date}>{formatNewsDate(story.date)}</time></div>
            <h3 className="news-card-detail-title">{story.title}</h3>
            <div className="news-card-copy">{story.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            <Link href={`/newsroom/${story.slug}`} className="underlined-link">Read full story <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
        </AccordionPrimitive.Content>
      </AccordionItem>;
    })}
  </Accordion>;
}
