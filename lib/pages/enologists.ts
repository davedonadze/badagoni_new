import type { Localized, TitleStyle } from "@/db/schema";

export const ENOLOGISTS_SLUG = "enologists";

export type EnologistContent = { id: string; firstName: Localized; lastName: Localized; role: Localized; image: string; description: Localized; hidden?: boolean };

export type EnologistsContent = {
  heading: { eyebrow: Localized; title: Localized; titleStyle?: TitleStyle; subtitle: Localized };
  people: EnologistContent[];
  closing: { eyebrow: Localized; heading: Localized; headingStyle?: TitleStyle };
};

function en(value: string): Localized {
  return { en: value, ka: "" };
}

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// A person saved (e.g. via an admin form the browser had cached from before
// `id` existed on this type) without an id breaks the public page's
// accordion - every item shares the same empty value, so clicking does
// nothing. Patch in a stable id at read time so a stray save like that can't
// silently break the page; a subsequent admin save persists it for good.
export function ensureEnologistIds(content: EnologistsContent): EnologistsContent {
  let changed = false;
  const people = content.people.map((person, i) => {
    if (person.id) return person;
    changed = true;
    const slug = slugify(`${person.firstName.en} ${person.lastName.en}`);
    return { ...person, id: slug || `person-${i}` };
  });
  return changed ? { ...content, people } : content;
}

// The enologists page's original hardcoded copy. Each person's id (used for
// the index nav's #anchor links) is now stored alongside the content so
// admins can add/remove/reorder people; the closing link text stays fixed in
// app/enologists/page.tsx.
export const ENOLOGISTS_DEFAULT: EnologistsContent = {
  heading: {
    eyebrow: en("The people of Badagoni"),
    title: en("Enologists."),
    subtitle: en("Georgian wine is a shared craft. Meet the people whose knowledge, research, and daily work shape the character of every bottle."),
  },
  people: [
    {
      id: "donato-lanati",
      firstName: en("Dr. Donato"),
      lastName: en("Lanati"),
      role: en("Chief enologist"),
      image: "/images/donato-lanati.webp",
      description: en("Badagoni’s chief enologist and head of Italy’s Enosis Meraviglia research centre. His work brings scientific research into the vineyard and cellar, with a focus on preserving the character of each Georgian grape variety."),
    },
    {
      id: "sandro-kumsiashvili",
      firstName: en("Sandro"),
      lastName: en("Kumsiashvili"),
      role: en("Chief winemaker"),
      image: "/images/sandro-kumsiashvili.webp",
      description: en("Sandro oversees every stage of production, from vinification and fermentation to laboratory control and bottling. His work connects daily precision with the character of both contemporary and traditional qvevri wines."),
    },
    {
      id: "salome-salakaia",
      firstName: en("Salome"),
      lastName: en("Salakaia"),
      role: en("Enologist"),
      image: "/images/salome-salakaia.webp",
      description: en("An enologist trained at the University of Turin, with practical experience in Italian wineries and at Enosis Meraviglia. Her work combines laboratory analysis and sensory evaluation across white, rosé, sparkling, and red wines."),
    },
    {
      id: "paolo-lavagna",
      firstName: en("Paolo"),
      lastName: en("Lavagna"),
      role: en("Enologist"),
      image: "/images/paolo-lavagna.webp",
      description: en("Educated at the Oenological School of Alba and the University of Turin, Paolo brings experience in cellar work and laboratory analysis. His approach connects technical knowledge, respect for tradition, and an understanding of wine drinkers."),
    },
  ],
  closing: {
    eyebrow: en("From the cellar to the table"),
    heading: en("Meet the wines."),
  },
};
