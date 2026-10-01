import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EnologistList } from "./enologist-list";
import { getPageContent } from "@/lib/pages/service";
import { ENOLOGISTS_SLUG, ENOLOGISTS_DEFAULT, type EnologistsContent } from "@/lib/pages/enologists";
import { getLocale, localize, localizeHref } from "@/lib/i18n";
import { getUiStrings } from "@/lib/ui-strings/service";
import { titleStyleCss } from "@/lib/title-style";

// Fixed ids for anchor navigation (#donato-lanati, etc.) that stay in code -
// only the people's names/role/image/description are DB-driven.
const PERSON_META = [
  { id: "donato-lanati" },
  { id: "sandro-kumsiashvili" },
  { id: "salome-salakaia" },
  { id: "paolo-lavagna" },
];

export const metadata: Metadata = {
  title: "Enologists",
  description: "Meet the people behind Badagoni’s wines: Donato Lanati, Sandro Kumsiashvili, Salome Salakaia, and Paolo Lavagna.",
};

export default async function Enologists() {
  const [content, locale, t] = await Promise.all([
    getPageContent<EnologistsContent>(ENOLOGISTS_SLUG),
    getLocale(),
    getUiStrings(),
  ]);
  const { heading, people, closing } = content ?? ENOLOGISTS_DEFAULT;

  const enologists = people.map((person, i) => ({
    id: PERSON_META[i].id,
    firstName: localize(person.firstName, locale),
    lastName: localize(person.lastName, locale),
    role: localize(person.role, locale),
    image: person.image,
    description: localize(person.description, locale),
  }));

  return <main className="enologists-page">
    <div className="editorial-heading enologists-heading">
      <p className="eyebrow">{localize(heading.eyebrow, locale)}</p>
      <h1 style={titleStyleCss(heading.titleStyle)}>{localize(heading.title, locale)}</h1>
      <p>{localize(heading.subtitle, locale)}</p>
    </div>

    <nav className="enologists-index" aria-label="Meet the enologists">
      {enologists.map((person, index) => <a key={person.id} href={`#${person.id}`}><span>0{index + 1}</span>{person.firstName} {person.lastName}</a>)}
    </nav>

    <EnologistList enologists={enologists} />

    <section className="enologists-closing" aria-labelledby="enologists-closing-title">
      <div><p className="eyebrow">{localize(closing.eyebrow, locale)}</p><h2 id="enologists-closing-title">{localize(closing.heading, locale)}</h2></div>
      <Link href={localizeHref("/catalogue", locale)} className="underlined-link">{localize(t["cta.exploreCollection"], locale)} <ArrowUpRight size={18} /></Link>
    </section>
  </main>;
}
