import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { BreakableText } from "../breakable-text";
import { getPageContent } from "@/lib/pages/service";
import { CONTACT_SLUG, CONTACT_DEFAULT, type ContactContent } from "@/lib/pages/contact";

const METHOD_HREF = [
  (value: string) => `mailto:${value}`,
  (value: string) => `tel:${value.replace(/\s/g, "")}`,
];

const LOCATION_META = [
  { eyebrow: "01 / Headquarters", linkText: "Find our office" },
  { eyebrow: "02 / Winery", linkText: "Find our winery" },
];

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Badagoni for wine enquiries and partnerships. Email or call our team, and find directions to our Tbilisi office and winery in Kakheti.",
};

export default async function Contact() {
  const content = (await getPageContent<ContactContent>(CONTACT_SLUG)) ?? CONTACT_DEFAULT;
  const { heading, methods, locations } = content;

  return <main className="contact-page">
    <header className="editorial-heading contact-heading">
      <p className="eyebrow">{heading.eyebrow.en}</p>
      <h1>{heading.title.en}</h1>
      <p><BreakableText text={heading.subtitle.en} /></p>
    </header>

    <section className="contact-methods" aria-label="Contact our team">
      {methods.map((method, i) => <div key={i} className="contact-direct-line">
        <p className="eyebrow">{method.label.en}</p>
        <a className="contact-method-link" href={METHOD_HREF[i](method.value)}><span>{method.value}</span><ArrowUpRight size={22} strokeWidth={1.4} aria-hidden="true" /></a>
      </div>)}
    </section>

    <section className="contact-grid contact-details" aria-label="Our locations">
      {locations.map((location, i) => <section key={i} aria-labelledby={`contact-location-${i}-title`}>
        <p className="eyebrow">{LOCATION_META[i].eyebrow}</p>
        <h2 id={`contact-location-${i}-title`}>{location.title.en}</h2>
        <address><BreakableText text={location.address.en} /></address>
        <a className="underlined-link" href={location.mapUrl} target="_blank" rel="noreferrer">{LOCATION_META[i].linkText} <ArrowUpRight size={17} aria-hidden="true" /></a>
      </section>)}
    </section>
  </main>;
}
