import type { Localized } from "@/db/schema";

export const ENOLOGISTS_SLUG = "enologists";

export type EnologistContent = { firstName: Localized; lastName: Localized; role: Localized; image: string; description: Localized };

export type EnologistsContent = {
  heading: { eyebrow: Localized; title: Localized; subtitle: Localized };
  people: [EnologistContent, EnologistContent, EnologistContent, EnologistContent];
  closing: { eyebrow: Localized; heading: Localized };
};

function en(value: string): Localized {
  return { en: value, ka: "" };
}

// The enologists page's original hardcoded copy. Person ids (used for the
// index nav's #anchor links) and the closing link text stay fixed in
// app/enologists/page.tsx.
export const ENOLOGISTS_DEFAULT: EnologistsContent = {
  heading: {
    eyebrow: en("The people of Badagoni"),
    title: en("Enologists."),
    subtitle: en("Georgian wine is a shared craft. Meet the people whose knowledge, research, and daily work shape the character of every bottle."),
  },
  people: [
    {
      firstName: en("Dr. Donato"),
      lastName: en("Lanati"),
      role: en("Chief enologist"),
      image: "/images/donato-lanati.webp",
      description: en("Badagoni’s chief enologist and head of Italy’s Enosis Meraviglia research centre. His work brings scientific research into the vineyard and cellar, with a focus on preserving the character of each Georgian grape variety."),
    },
    {
      firstName: en("Sandro"),
      lastName: en("Kumsiashvili"),
      role: en("Chief winemaker"),
      image: "/images/sandro-kumsiashvili.webp",
      description: en("Sandro oversees every stage of production, from vinification and fermentation to laboratory control and bottling. His work connects daily precision with the character of both contemporary and traditional qvevri wines."),
    },
    {
      firstName: en("Salome"),
      lastName: en("Salakaia"),
      role: en("Enologist"),
      image: "/images/salome-salakaia.webp",
      description: en("An enologist trained at the University of Turin, with practical experience in Italian wineries and at Enosis Meraviglia. Her work combines laboratory analysis and sensory evaluation across white, rosé, sparkling, and red wines."),
    },
    {
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
