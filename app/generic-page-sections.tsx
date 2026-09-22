"use client";
import { useState } from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { ParallaxMedia } from "./parallax-media";
import { BannerMedia } from "./banner-media";
import { BreakableParagraphs } from "./breakable-paragraphs";
import type { PageSection } from "@/lib/pages/generic";

// Renders the repeatable content blocks an admin can add to a generic page
// (see lib/pages/generic.ts), below its fixed heading/cover/body.
export function PageSections({ sections }: { sections: PageSection[] }) {
  return <>{sections.map(section => {
    switch (section.type) {
      case "text": return <TextSection key={section.id} section={section} />;
      case "media": return <MediaSection key={section.id} section={section} />;
      case "cards": return <CardsSection key={section.id} section={section} />;
      case "profiles": return <ProfilesSection key={section.id} section={section} />;
    }
  })}</>;
}

function SectionHeading({ text }: { text: string }) {
  if (!text) return null;
  return <h2 className="generic-section-heading">{text}</h2>;
}

function TextSection({ section }: { section: Extract<PageSection, { type: "text" }> }) {
  if (!section.heading.en && !section.body.en) return null;
  return <section className="generic-section generic-text-section">
    <SectionHeading text={section.heading.en} />
    {section.body.en && <div className="generic-page-body"><BreakableParagraphs text={section.body.en} /></div>}
  </section>;
}

function MediaSection({ section }: { section: Extract<PageSection, { type: "media" }> }) {
  if (!section.media) return null;
  return <section className="generic-section generic-media-section">
    <SectionHeading text={section.heading.en} />
    <ParallaxMedia
      className="generic-media-cover"
      scale={1.4}
      ariaLabel={section.caption.en || section.heading.en}
      media={<BannerMedia src={section.media} alt={section.heading.en || section.caption.en} loading="lazy" />}
      overlay={section.caption.en ? <span>{section.caption.en}</span> : undefined}
    />
  </section>;
}

function CardsSection({ section }: { section: Extract<PageSection, { type: "cards" }> }) {
  if (section.cards.length === 0) return null;
  return <section className="generic-section generic-cards-section">
    <SectionHeading text={section.heading.en} />
    <div className="generic-cards-grid">
      {section.cards.map((card, index) => <div key={card.id} className="generic-card">
        {card.image && <div className="generic-card-image"><img src={card.image} alt="" loading="lazy" /></div>}
        <span className="generic-card-number" aria-hidden="true">0{index + 1}</span>
        {card.title.en && <p className="generic-card-title">{card.title.en}</p>}
        {card.subtitle.en && <p className="generic-card-subtitle eyebrow">{card.subtitle.en}</p>}
        {card.text.en && <p className="generic-card-text">{card.text.en}</p>}
      </div>)}
    </div>
  </section>;
}

function ProfilesSection({ section }: { section: Extract<PageSection, { type: "profiles" }> }) {
  const [expanded, setExpanded] = useState("");
  if (section.items.length === 0) return null;
  return <section className="generic-section enologists-selection" aria-label={section.heading.en || "Profiles"}>
    <SectionHeading text={section.heading.en} />
    <Accordion type="single" collapsible value={expanded} onValueChange={setExpanded} className="enologists-list">
      {section.items.map(item => <AccordionItem key={item.id} value={item.id} className="enologist-row">
        <AccordionPrimitive.Header asChild>
          <h3 className="enologist-name">
            <AccordionPrimitive.Trigger className="enologist-trigger">{item.name.en}</AccordionPrimitive.Trigger>
          </h3>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content className="enologist-content">
          <div className="enologist-detail-grid">
            <div className="enologist-biography">
              {item.role.en && <p className="eyebrow">{item.role.en}</p>}
              {item.text.en && <p className="enologist-description">{item.text.en}</p>}
            </div>
            {item.image && <div className="enologist-portrait"><img src={item.image} alt={item.name.en} /></div>}
          </div>
        </AccordionPrimitive.Content>
      </AccordionItem>)}
    </Accordion>
  </section>;
}
