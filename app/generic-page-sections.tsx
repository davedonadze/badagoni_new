"use client";
import { useState } from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { ParallaxMedia } from "./parallax-media";
import { BannerMedia } from "./banner-media";
import { BreakableParagraphs } from "./breakable-paragraphs";
import { localize, type Locale } from "@/lib/i18n";
import type { PageSection } from "@/lib/pages/generic";

// Renders the repeatable content blocks an admin can add to a generic page
// (see lib/pages/generic.ts), below its fixed heading/cover/body.
export function PageSections({ sections, locale }: { sections: PageSection[]; locale: Locale }) {
  return <>{sections.map(section => {
    switch (section.type) {
      case "text": return <TextSection key={section.id} section={section} locale={locale} />;
      case "media": return <MediaSection key={section.id} section={section} locale={locale} />;
      case "cards": return <CardsSection key={section.id} section={section} locale={locale} />;
      case "profiles": return <ProfilesSection key={section.id} section={section} locale={locale} />;
    }
  })}</>;
}

function SectionHeading({ text }: { text: string }) {
  if (!text) return null;
  return <h2 className="generic-section-heading">{text}</h2>;
}

function TextSection({ section, locale }: { section: Extract<PageSection, { type: "text" }>; locale: Locale }) {
  const heading = localize(section.heading, locale);
  const body = localize(section.body, locale);
  if (!heading && !body) return null;
  return <section className="generic-section generic-text-section">
    <SectionHeading text={heading} />
    {body && <div className="generic-page-body"><BreakableParagraphs text={body} /></div>}
  </section>;
}

function MediaSection({ section, locale }: { section: Extract<PageSection, { type: "media" }>; locale: Locale }) {
  if (!section.media) return null;
  const heading = localize(section.heading, locale);
  const caption = localize(section.caption, locale);
  return <section className="generic-section generic-media-section">
    <SectionHeading text={heading} />
    <ParallaxMedia
      className="generic-media-cover"
      scale={1.4}
      ariaLabel={caption || heading}
      media={<BannerMedia src={section.media} alt={heading || caption} loading="lazy" />}
      overlay={caption ? <span>{caption}</span> : undefined}
    />
  </section>;
}

function CardsSection({ section, locale }: { section: Extract<PageSection, { type: "cards" }>; locale: Locale }) {
  if (section.cards.length === 0) return null;
  return <section className="generic-section generic-cards-section">
    <SectionHeading text={localize(section.heading, locale)} />
    <div className="generic-cards-grid">
      {section.cards.map((card, index) => {
        const title = localize(card.title, locale);
        const subtitle = localize(card.subtitle, locale);
        const text = localize(card.text, locale);
        return <div key={card.id} className="generic-card">
        {card.image && <div className="generic-card-image"><img src={card.image} alt="" loading="lazy" /></div>}
        <span className="generic-card-number" aria-hidden="true">0{index + 1}</span>
        {title && <p className="generic-card-title">{title}</p>}
        {subtitle && <p className="generic-card-subtitle eyebrow">{subtitle}</p>}
        {text && <p className="generic-card-text">{text}</p>}
      </div>;
      })}
    </div>
  </section>;
}

function ProfilesSection({ section, locale }: { section: Extract<PageSection, { type: "profiles" }>; locale: Locale }) {
  const [expanded, setExpanded] = useState("");
  if (section.items.length === 0) return null;
  const heading = localize(section.heading, locale);
  return <section className="generic-section enologists-selection" aria-label={heading || "Profiles"}>
    <SectionHeading text={heading} />
    <Accordion type="single" collapsible value={expanded} onValueChange={setExpanded} className="enologists-list">
      {section.items.map(item => {
        const name = localize(item.name, locale);
        const role = localize(item.role, locale);
        const text = localize(item.text, locale);
        return <AccordionItem key={item.id} value={item.id} className="enologist-row">
        <AccordionPrimitive.Header asChild>
          <h3 className="enologist-name">
            <AccordionPrimitive.Trigger className="enologist-trigger">{name}</AccordionPrimitive.Trigger>
          </h3>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content className="enologist-content">
          <div className="enologist-detail-grid">
            <div className="enologist-biography">
              {role && <p className="eyebrow">{role}</p>}
              {text && <p className="enologist-description">{text}</p>}
            </div>
            {item.image && <div className="enologist-portrait"><img src={item.image} alt={name} /></div>}
          </div>
        </AccordionPrimitive.Content>
      </AccordionItem>;
      })}
    </Accordion>
  </section>;
}
