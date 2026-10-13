import type { Localized, TitleStyle } from "@/db/schema";

export const GEORGIAN_WINE_SLUG = "georgian-wine";

// The Wikimedia photo credit shown on the Badagoni figure image only —
// the qvevri cellar photo is Badagoni's own and needs none, so this is
// nullable per chapter rather than a fixed field.
export type HeritagePhotoCredit = {
  label: Localized;
  url: string;
  license: Localized;
  licenseUrl: string;
};

export type HeritageChapter = {
  id: string;
  tabLabel: Localized;
  eyebrow: Localized;
  title: Localized;
  titleStyle?: TitleStyle;
  body: Localized;
  image: string;
  // CSS object-position for the chapter's photo, e.g. "60% center" - lets a
  // chapter's focal point be tuned without a dedicated CSS rule per chapter.
  imageFocus?: string;
  imageTitle: Localized;
  imageCaption: Localized;
  credit: HeritagePhotoCredit | null;
};

export type GeorgianWineContent = {
  heading: { eyebrow: Localized; title: Localized; titleStyle?: TitleStyle; subtitle: Localized };
  chapters: HeritageChapter[];
};

function en(value: string): Localized {
  return { en: value, ka: "" };
}

// Tolerates content saved before the `figure`/`qvevri` fields were merged
// into `chapters` (see drizzle/0034_georgian_wine_chapters.sql) - preview and
// production share one D1 database, so a code deploy can briefly run against
// data the migration hasn't reshaped yet.
type LegacyGeorgianWineContent = { heading: GeorgianWineContent["heading"]; figure: HeritageChapter; qvevri: HeritageChapter };

export function normalizeGeorgianWineContent(content: GeorgianWineContent | LegacyGeorgianWineContent | undefined): GeorgianWineContent {
  if (!content) return GEORGIAN_WINE_DEFAULT;
  if ("chapters" in content) return content;
  return {
    heading: content.heading,
    chapters: [
      { ...content.figure, id: content.figure.id ?? "badagoni-figure", imageFocus: content.figure.imageFocus ?? "center 17%" },
      { ...content.qvevri, id: content.qvevri.id ?? "qvevri-tradition", imageFocus: content.qvevri.imageFocus ?? "60% center" },
    ],
  };
}

// Seeded from a reference build's real "Georgian wine" page content.
export const GEORGIAN_WINE_DEFAULT: GeorgianWineContent = {
  heading: {
    eyebrow: en("Georgia / Our heritage"),
    title: en("Georgian wine."),
    subtitle: en("The character behind Badagoni. The traditions that connect our wines to their place."),
  },
  chapters: [
    {
      id: "badagoni-figure",
      tabLabel: en("Badagoni figure"),
      eyebrow: en("01 / Badagoni figure"),
      title: en("Badagoni Figure"),
      body: en("Discovered in 1958 at an ancient pagan sanctuary in Melaani, Kakheti, this bronze figure dates to approximately the 10th–9th centuries BC. Depicted holding a drinking horn, the figure has been associated by researchers with Badagoni — an ancient Georgian deity connected with wine, fertility, and viticulture. It stands as a remarkable symbol of the deep relationship between wine and Georgian culture."),
      image: "/images/badagoni-figure-melaani.jpg",
      imageFocus: "center 17%",
      imageTitle: en("Bronze figure from Melaani"),
      imageCaption: en("Georgian National Museum"),
      credit: {
        label: en("三猎 / Wikimedia Commons"),
        url: "https://commons.wikimedia.org/wiki/File:%E6%A2%85%E6%8B%89%E9%98%BF%E5%B0%BC%E9%9D%92%E9%93%9C%E7%94%B7%E5%AD%90%E5%83%8F.jpg",
        license: en("CC BY-SA 4.0"),
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      },
    },
    {
      id: "qvevri-tradition",
      tabLabel: en("Qvevri tradition"),
      eyebrow: en("02 / Qvevri tradition"),
      title: en("Qvevri Tradition."),
      body: en("A qvevri is a clay vessel buried in the ground, used for fermenting and ageing wine. It lies at the heart of a Georgian winemaking tradition passed from one generation to the next.\n\nGrape skins and seeds stay in contact with the wine during and after fermentation, giving it colour, texture, and depth. The vessel, the harvest, and time shape each expression.\n\nAt Alaverdi Monastery, this craft remains part of everyday life. Badagoni supported the restoration of the historic cellar in 2006, helping continue a tradition that lives on in our qvevri wines."),
      image: "/images/cellar.webp",
      imageFocus: "60% center",
      imageTitle: en("Alaverdi Monastery"),
      imageCaption: en("The qvevri cellar / Kakheti, Georgia"),
      credit: null,
    },
  ],
};
