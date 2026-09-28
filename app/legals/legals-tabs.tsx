"use client";
import { useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BreakableParagraphs } from "../breakable-paragraphs";
import { localize, type Locale } from "@/lib/i18n";
import type { LegalDocument } from "@/lib/pages/legals";

function formatRevisionDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}

function LegalDocumentView({ number, document, locale }: { number: string; document: LegalDocument; locale: Locale }) {
  return <article className="legal-document" aria-labelledby={`legal-title-${number}`}>
    <header className="legal-document-heading">
      <p className="eyebrow">{localize(document.eyebrow, locale)}</p>
      <h2 id={`legal-title-${number}`}>{localize(document.title, locale)}</h2>
      <p className="legal-revision">{localize(document.revisionLabel, locale)}<br /><time dateTime={document.revisionDate}>{formatRevisionDate(document.revisionDate)}</time></p>
    </header>
    <div className="legal-copy">
      {document.sections.map(section => <section key={section.id} aria-labelledby={`legal-${section.id}`}>
        <h3 id={`legal-${section.id}`}>{localize(section.heading, locale)}</h3>
        <BreakableParagraphs text={localize(section.body, locale)} />
      </section>)}
    </div>
  </article>;
}

export function LegalsTabs({ defaultTab, terms, privacy, locale }: { defaultTab: string; terms: LegalDocument; privacy: LegalDocument; locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();

  return <Tabs defaultValue={defaultTab} className="legals-tabs" onValueChange={value => router.replace(`${pathname}?tab=${value}`, { scroll: false })}>
    <TabsList variant="line" className="legals-tab-list" aria-label="Legal information">
      <TabsTrigger value="terms-and-conditions" className="legals-tab"><span aria-hidden="true">01</span>Terms and conditions</TabsTrigger>
      <TabsTrigger value="privacy-policy" className="legals-tab"><span aria-hidden="true">02</span>Privacy policy</TabsTrigger>
    </TabsList>
    <TabsContent value="terms-and-conditions"><LegalDocumentView number="01" document={terms} locale={locale} /></TabsContent>
    <TabsContent value="privacy-policy"><LegalDocumentView number="02" document={privacy} locale={locale} /></TabsContent>
  </Tabs>;
}
