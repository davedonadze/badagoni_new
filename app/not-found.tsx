import Link from "next/link";
import { getLocale, localizeHref } from "@/lib/i18n";

export default async function NotFound(){
  const locale = await getLocale();
  return <main className="not-found"><p className="eyebrow">Page not found</p><h1>A different path<br/><em>back to Badagoni.</em></h1><Link href={localizeHref("/", locale)} className="text-link">Return home</Link></main>;
}
