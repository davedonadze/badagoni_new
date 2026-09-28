import type { Metadata } from "next";
import { getPageContent } from "@/lib/pages/service";
import { LEGALS_SLUG, LEGALS_DEFAULT, type LegalsContent } from "@/lib/pages/legals";
import { getLocale, localize } from "@/lib/i18n";
import { LegalsTabs } from "./legals-tabs";

export const metadata: Metadata = {
  title: "Legals",
  description: "Badagoni website terms and conditions and privacy policy.",
};

type LegalsPageProps = { searchParams: Promise<{ tab?: string }> };

export default async function LegalsPage({ searchParams }: LegalsPageProps) {
  const [content, params, locale] = await Promise.all([
    getPageContent<LegalsContent>(LEGALS_SLUG),
    searchParams,
    getLocale(),
  ]);
  const { heading, terms, privacy } = content ?? LEGALS_DEFAULT;
  const defaultTab = params.tab === "privacy-policy" ? "privacy-policy" : "terms-and-conditions";

  return <main className="legals-page">
    <div className="editorial-heading legals-heading">
      <p className="eyebrow">{localize(heading.eyebrow, locale)}</p>
      <h1>{localize(heading.title, locale)}</h1>
      <p>{localize(heading.subtitle, locale)}</p>
    </div>
    <LegalsTabs defaultTab={defaultTab} terms={terms} privacy={privacy} locale={locale} />
  </main>;
}
