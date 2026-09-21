import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EnologistList } from "./enologist-list";
import { getPageContent } from "@/lib/pages/service";
import { ENOLOGISTS_SLUG, ENOLOGISTS_DEFAULT, type EnologistsContent } from "@/lib/pages/enologists";

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
  const content = (await getPageContent<EnologistsContent>(ENOLOGISTS_SLUG)) ?? ENOLOGISTS_DEFAULT;
  const { heading, people, closing } = content;

  const enologists = people.map((person, i) => ({
    id: PERSON_META[i].id,
    firstName: person.firstName.en,
    lastName: person.lastName.en,
    role: person.role.en,
    image: person.image,
    description: person.description.en,
  }));

  return <main className="enologists-page">
    <div className="editorial-heading enologists-heading">
      <p className="eyebrow">{heading.eyebrow.en}</p>
      <h1>{heading.title.en}</h1>
      <p>{heading.subtitle.en}</p>
    </div>

    <nav className="enologists-index" aria-label="Meet the enologists">
      {enologists.map((person, index) => <a key={person.id} href={`#${person.id}`}><span>0{index + 1}</span>{person.firstName} {person.lastName}</a>)}
    </nav>

    <EnologistList enologists={enologists} />

    <section className="enologists-closing" aria-labelledby="enologists-closing-title">
      <div><p className="eyebrow">{closing.eyebrow.en}</p><h2 id="enologists-closing-title">{closing.heading.en}</h2></div>
      <Link href="/catalogue" className="underlined-link">Explore the collection <ArrowUpRight size={18} /></Link>
    </section>
  </main>;
}
