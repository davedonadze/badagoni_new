"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import type { EditorialCardContent } from "@/lib/pages/home";
import { localize, localizeHref, type Locale } from "@/lib/i18n";

// Fixed metadata that stays in code, zipped with the DB-driven content by
// index (always exactly 3 fixed cards, not addable/reorderable).
const CARD_META = [
  { id: "craft", alt: "A monk tending qvevri in Alaverdi’s historic cellar", href: "/alaverdi-monastery-cellar", link: "Discover the craft" },
  { id: "place", alt: "Kakheti vineyards and Alaverdi Monastery", href: "/terroir", link: "Explore our vineyards" },
  { id: "expression", alt: "Badagoni Kisi Qvevri bottle", href: "/catalogue", link: "Explore the collection" },
];

export function EditorialCards({ cards, locale }: { cards: [EditorialCardContent, EditorialCardContent, EditorialCardContent]; locale: Locale }) {
  const [expanded, setExpanded] = useState("");

  return <section className="editorial-section" aria-label="The world of Badagoni">
    <Accordion type="single" collapsible orientation="horizontal" value={expanded} onValueChange={setExpanded} className="editorial-gallery" data-expanded={expanded}>
      {cards.map((card, index) => {
        const label = localize(card.label, locale);
        const title = localize(card.title, locale);
        return <AccordionItem key={CARD_META[index].id} value={CARD_META[index].id} className="editorial-card">
        <AccordionPrimitive.Header className="editorial-card-heading" style={{ gridColumn: index + 1 }}>
          <AccordionPrimitive.Trigger className="editorial-card-trigger" aria-label={`${label}: ${title}`}>
            <span className="editorial-card-label"><span>{label}</span><span className="editorial-card-number">0{index + 1}</span></span>
            <span className={`editorial-image editorial-image-${CARD_META[index].id}`}><img src={card.image} alt={CARD_META[index].alt} loading="lazy" /></span>
            <span className="editorial-card-caption"><span>{title}</span>{expanded === CARD_META[index].id ? <Minus size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}</span>
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content className="editorial-details">
          <div className="editorial-details-inner">
            <p className="eyebrow">{label} / 0{index + 1}</p>
            <div><p className="editorial-description">{localize(card.description, locale)}</p><Link href={localizeHref(CARD_META[index].href, locale)} className="underlined-link">{CARD_META[index].link}<ArrowUpRight size={17} /></Link></div>
          </div>
        </AccordionPrimitive.Content>
      </AccordionItem>;
      })}
    </Accordion>
  </section>;
}
