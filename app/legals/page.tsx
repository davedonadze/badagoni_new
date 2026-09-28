import type { Metadata } from "next";
import { Suspense } from "react";
import { getPageContent } from "@/lib/pages/service";
import { LEGALS_SLUG, LEGALS_DEFAULT, type LegalsContent } from "@/lib/pages/legals";
import { getLocale, localize } from "@/lib/i18n";
import { LegalsTabs } from "./legals-tabs";

export const metadata: Metadata = {
  title: "Legals",
  description: "Badagoni website terms and conditions and privacy policy.",
};

export default async function LegalsPage() {
  const [content, locale] = await Promise.all([
    getPageContent<LegalsContent>(LEGALS_SLUG),
    getLocale(),
  ]);
  const { heading, terms, privacy } = content ?? LEGALS_DEFAULT;

  return <main className="legals-page">
    <div className="editorial-heading enologists-heading heritage-heading">
      <p className="eyebrow">{localize(heading.eyebrow, locale)}</p>
      <h1>{localize(heading.title, locale)}</h1>
      <p>{localize(heading.subtitle, locale)}</p>
    </div>
    <Suspense fallback={<p className="legal-loading" role="status">Loading legal information…</p>}>
      <LegalsTabs terms={terms} privacy={privacy} locale={locale} />
    </Suspense>
  </main>;
}
