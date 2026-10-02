"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BreakableParagraphs } from "../breakable-paragraphs";
import { localize, type Locale } from "@/lib/i18n";
import type { LegalDocument } from "@/lib/pages/legals";
import type { Localized } from "@/db/schema";
import { titleStyleCss } from "@/lib/title-style";

function formatRevisionDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}

function LegalDocumentView({ number, document, locale }: { number: string; document: LegalDocument; locale: Locale }) {
  return <article className="legal-document" aria-labelledby={`legal-title-${number}`}>
    <header className="legal-document-heading">
      <p className="eyebrow">{localize(document.eyebrow, locale)}</p>
      <h2 id={`legal-title-${number}`} style={titleStyleCss(document.titleStyle)}>{localize(document.title, locale)}</h2>
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

export function LegalsTabs({ terms, privacy, locale, t }: { terms: LegalDocument; privacy: LegalDocument; locale: Locale; t: Record<string, Localized> }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") === "privacy-policy" ? "privacy-policy" : "terms-and-conditions";

  return <Tabs value={activeTab} onValueChange={value => router.push(`${pathname}?tab=${value}`, { scroll: false })} activationMode="manual" className="heritage-tabs legals-tabs">
    <TabsList variant="line" className="heritage-index" aria-label="Legal information">
      <TabsTrigger value="terms-and-conditions" className="heritage-tab"><span aria-hidden="true">01</span>{localize(t["legals.termsAndConditionsTab"], locale)}</TabsTrigger>
      <TabsTrigger value="privacy-policy" className="heritage-tab"><span aria-hidden="true">02</span>{localize(t["legals.privacyPolicyTab"], locale)}</TabsTrigger>
    </TabsList>
    <TabsContent value="terms-and-conditions" className="heritage-panel"><LegalDocumentView number="01" document={terms} locale={locale} /></TabsContent>
    <TabsContent value="privacy-policy" className="heritage-panel"><LegalDocumentView number="02" document={privacy} locale={locale} /></TabsContent>
  </Tabs>;
}
