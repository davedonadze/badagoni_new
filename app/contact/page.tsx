import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { BreakableText } from "../breakable-text";
import { getPageContent } from "@/lib/pages/service";
import { CONTACT_SLUG, CONTACT_DEFAULT, type ContactContent } from "@/lib/pages/contact";
import { getLocale, localize } from "@/lib/i18n";
import { getUiStrings } from "@/lib/ui-strings/service";
import { titleStyleCss } from "@/lib/title-style";

const METHOD_HREF = [
  (value: string) => `mailto:${value}`,
  (value: string) => `tel:${value.replace(/\s/g, "")}`,
];

const LOCATION_META = [
  { eyebrowKey: "contact.headquartersEyebrow", linkKey: "contact.findOurOffice" },
  { eyebrowKey: "contact.wineryEyebrow", linkKey: "contact.findOurWinery" },
];

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Badagoni for wine enquiries and partnerships. Email or call our team, and find directions to our Tbilisi office and winery in Kakheti.",
};

export default async function Contact() {
  const [content, locale, t] = await Promise.all([
    getPageContent<ContactContent>(CONTACT_SLUG),
    getLocale(),
    getUiStrings(),
  ]);
  const { heading, methods, locations } = content ?? CONTACT_DEFAULT;

  return <main className="contact-page">
    <header className="editorial-heading contact-heading">
      <p className="eyebrow">{localize(heading.eyebrow, locale)}</p>
      <h1 style={titleStyleCss(heading.titleStyle)}>{localize(heading.title, locale)}</h1>
      <p><BreakableText text={localize(heading.subtitle, locale)} /></p>
    </header>

    <section className="contact-methods" aria-label="Contact our team">
      {methods.map((method, i) => <div key={i} className="contact-direct-line">
        <p className="eyebrow">{localize(method.label, locale)}</p>
        <a className="contact-method-link" href={METHOD_HREF[i](method.value)}><span>{method.value}</span><ArrowUpRight size={22} strokeWidth={1.4} aria-hidden="true" /></a>
      </div>)}
    </section>

    <section className="contact-grid contact-details" aria-label="Our locations">
      {locations.map((location, i) => <section key={i} aria-labelledby={`contact-location-${i}-title`}>
        <p className="eyebrow">{localize(t[LOCATION_META[i].eyebrowKey], locale)}</p>
        <h2 id={`contact-location-${i}-title`} style={titleStyleCss(location.titleStyle)}>{localize(location.title, locale)}</h2>
        <address><BreakableText text={localize(location.address, locale)} /></address>
        <a className="underlined-link" href={location.mapUrl} target="_blank" rel="noreferrer">{localize(t[LOCATION_META[i].linkKey], locale)} <ArrowUpRight size={17} aria-hidden="true" /></a>
      </section>)}
    </section>
  </main>;
}
