"use client";
import { useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BreakableParagraphs } from "../breakable-paragraphs";
import type { LegalDocument } from "@/lib/pages/legals";

function formatRevisionDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}

function LegalDocumentView({ number, document }: { number: string; document: LegalDocument }) {
  return <article className="legal-document" aria-labelledby={`legal-title-${number}`}>
    <header className="legal-document-heading">
      <p className="eyebrow">{document.eyebrow.en}</p>
      <h2 id={`legal-title-${number}`}>{document.title.en}</h2>
      <p className="legal-revision">{document.revisionLabel.en}<br /><time dateTime={document.revisionDate}>{formatRevisionDate(document.revisionDate)}</time></p>
    </header>
    <div className="legal-copy">
      {document.sections.map(section => <section key={section.id} aria-labelledby={`legal-${section.id}`}>
        <h3 id={`legal-${section.id}`}>{section.heading.en}</h3>
        <BreakableParagraphs text={section.body.en} />
      </section>)}
    </div>
  </article>;
}

export function LegalsTabs({ defaultTab, terms, privacy }: { defaultTab: string; terms: LegalDocument; privacy: LegalDocument }) {
  const router = useRouter();
  const pathname = usePathname();

  return <Tabs defaultValue={defaultTab} className="legals-tabs" onValueChange={value => router.replace(`${pathname}?tab=${value}`, { scroll: false })}>
    <TabsList variant="line" className="legals-tab-list" aria-label="Legal information">
      <TabsTrigger value="terms-and-conditions" className="legals-tab"><span aria-hidden="true">01</span>Terms and conditions</TabsTrigger>
      <TabsTrigger value="privacy-policy" className="legals-tab"><span aria-hidden="true">02</span>Privacy policy</TabsTrigger>
    </TabsList>
    <TabsContent value="terms-and-conditions"><LegalDocumentView number="01" document={terms} /></TabsContent>
    <TabsContent value="privacy-policy"><LegalDocumentView number="02" document={privacy} /></TabsContent>
  </Tabs>;
}
