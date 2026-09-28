import { getUiStrings } from "@/lib/ui-strings/service";
import { TranslationsForm } from "./translations-form";

export const dynamic = "force-dynamic";

export default async function TranslationsPage() {
  const strings = await getUiStrings();

  return <div className="flex flex-col gap-6">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Translations</h1>
      <p className="mt-1 text-sm text-muted-foreground">Fixed button, link, and label text used across the site that isn’t part of any page’s own content — e.g. “Explore the collection”, “View all wines”. Fill in the Georgian side to have it appear when the site is viewed in Georgian; leave it blank to keep showing the English text as a fallback.</p>
    </div>
    <TranslationsForm strings={strings} />
  </div>;
}
