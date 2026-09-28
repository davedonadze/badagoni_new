import Link from "next/link";
import { getLocale, localize, localizeHref } from "@/lib/i18n";
import { getUiStrings } from "@/lib/ui-strings/service";

export default async function NotFound(){
  const [locale, t] = await Promise.all([getLocale(), getUiStrings()]);
  return <main className="not-found"><p className="eyebrow">{localize(t["notFound.pageNotFound"], locale)}</p><h1>{localize(t["notFound.aDifferentPath"], locale)}<br/><em>{localize(t["notFound.backToBadagoni"], locale)}</em></h1><Link href={localizeHref("/", locale)} className="text-link">{localize(t["cta.returnHome"], locale)}</Link></main>;
}
