import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EnologistList } from "./enologist-list";

export const metadata: Metadata = {
  title: "Enologists",
  description: "Meet the people behind Badagoni’s wines: Donato Lanati, Sandro Kumsiashvili, Salome Salakaia, and Paolo Lavagna.",
};

const enologists = [
  {
    id: "donato-lanati",
    firstName: "Dr. Donato",
    lastName: "Lanati",
    role: "Chief enologist",
    image: "/images/donato-lanati.webp",
    description: "Badagoni’s chief enologist and head of Italy’s Enosis Meraviglia research centre. His work brings scientific research into the vineyard and cellar, with a focus on preserving the character of each Georgian grape variety.",
  },
  {
    id: "sandro-kumsiashvili",
    firstName: "Sandro",
    lastName: "Kumsiashvili",
    role: "Chief winemaker",
    image: "/images/sandro-kumsiashvili.webp",
    description: "Sandro oversees every stage of production, from vinification and fermentation to laboratory control and bottling. His work connects daily precision with the character of both contemporary and traditional qvevri wines.",
  },
  {
    id: "salome-salakaia",
    firstName: "Salome",
    lastName: "Salakaia",
    role: "Enologist",
    image: "/images/salome-salakaia.webp",
    description: "An enologist trained at the University of Turin, with practical experience in Italian wineries and at Enosis Meraviglia. Her work combines laboratory analysis and sensory evaluation across white, rosé, sparkling, and red wines.",
  },
  {
    id: "paolo-lavagna",
    firstName: "Paolo",
    lastName: "Lavagna",
    role: "Enologist",
    image: "/images/paolo-lavagna.webp",
    description: "Educated at the Oenological School of Alba and the University of Turin, Paolo brings experience in cellar work and laboratory analysis. His approach connects technical knowledge, respect for tradition, and an understanding of wine drinkers.",
  },
];

export default function Enologists() {
  return <main className="enologists-page">
    <div className="editorial-heading enologists-heading">
      <p className="eyebrow">The people of Badagoni</p>
      <h1>Enologists.</h1>
      <p>Georgian wine is a shared craft. Meet the people whose knowledge, research, and daily work shape the character of every bottle.</p>
    </div>

    <nav className="enologists-index" aria-label="Meet the enologists">
      {enologists.map((person, index) => <a key={person.id} href={`#${person.id}`}><span>0{index + 1}</span>{person.firstName} {person.lastName}</a>)}
    </nav>

    <EnologistList enologists={enologists} />

    <section className="enologists-closing" aria-labelledby="enologists-closing-title">
      <div><p className="eyebrow">From the cellar to the table</p><h2 id="enologists-closing-title">Meet the wines.</h2></div>
      <Link href="/catalogue" className="underlined-link">Explore the collection <ArrowUpRight size={18} /></Link>
    </section>
  </main>;
}
