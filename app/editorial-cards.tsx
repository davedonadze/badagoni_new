"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { Accordion, AccordionItem } from "@/components/ui/accordion";

const cards = [
  {
    id: "craft",
    label: "The craft",
    title: "A tradition, still alive",
    image: "/images/cellar.webp",
    alt: "A monk tending qvevri in Alaverdi’s historic cellar",
    description: "Clay vessels, native grapes, and knowledge passed from one generation to the next. Discover the traditions that continue to shape our wines.",
    href: "/alaverdi-monastery-cellar",
    link: "Discover the craft",
  },
  {
    id: "place",
    label: "The place",
    title: "Where it all begins",
    image: "/images/vineyard.webp",
    alt: "Kakheti vineyards and Alaverdi Monastery",
    description: "Between the Caucasus Mountains and the Alazani Valley, our vineyards give every wine a sense of belonging. This is Kakheti, our home.",
    href: "/terroir",
    link: "Explore our vineyards",
  },
  {
    id: "expression",
    label: "The expression",
    title: "Find your character",
    image: "/images/kisi-qvevri.webp",
    alt: "Badagoni Kisi Qvevri bottle",
    description: "From qvevri wines to fresh whites, expressive reds, and sparkling wines. Explore the collection and find your own expression of Georgia.",
    href: "/catalogue",
    link: "Explore the collection",
  },
];

export function EditorialCards() {
  const [expanded, setExpanded] = useState("");

  return <section className="editorial-section" aria-label="The world of Badagoni">
    <Accordion type="single" collapsible orientation="horizontal" value={expanded} onValueChange={setExpanded} className="editorial-gallery" data-expanded={expanded}>
      {cards.map((card, index) => <AccordionItem key={card.id} value={card.id} className="editorial-card">
        <AccordionPrimitive.Header className="editorial-card-heading" style={{ gridColumn: index + 1 }}>
          <AccordionPrimitive.Trigger className="editorial-card-trigger" aria-label={`${card.label}: ${card.title}`}>
            <span className="editorial-card-label"><span>{card.label}</span><span className="editorial-card-number">0{index + 1}</span></span>
            <span className={`editorial-image editorial-image-${card.id}`}><img src={card.image} alt={card.alt} loading="lazy" /></span>
            <span className="editorial-card-caption"><span>{card.title}</span>{expanded === card.id ? <Minus size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}</span>
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content className="editorial-details">
          <div className="editorial-details-inner">
            <p className="eyebrow">{card.label} / 0{index + 1}</p>
            <div><p className="editorial-description">{card.description}</p><Link href={card.href} className="underlined-link">{card.link}<ArrowUpRight size={17} /></Link></div>
          </div>
        </AccordionPrimitive.Content>
      </AccordionItem>)}
    </Accordion>
  </section>;
}
