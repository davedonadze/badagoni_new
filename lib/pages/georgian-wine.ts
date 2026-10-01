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
  tabLabel: Localized;
  eyebrow: Localized;
  title: Localized;
  body: Localized;
  image: string;
  imageTitle: Localized;
  imageCaption: Localized;
  credit: HeritagePhotoCredit | null;
};

export type GeorgianWineContent = {
  heading: { eyebrow: Localized; title: Localized; titleStyle?: TitleStyle; subtitle: Localized };
  figure: HeritageChapter;
  qvevri: HeritageChapter;
};

function en(value: string): Localized {
  return { en: value, ka: "" };
}

// Seeded from a reference build's real "Georgian wine" page content.
export const GEORGIAN_WINE_DEFAULT: GeorgianWineContent = {
  heading: {
    eyebrow: en("Georgia / Our heritage"),
    title: en("Georgian wine."),
    subtitle: en("The character behind Badagoni. The traditions that connect our wines to their place."),
  },
  figure: {
    tabLabel: en("Badagoni figure"),
    eyebrow: en("01 / Badagoni figure"),
    title: en("Badagoni Figure"),
    body: en("Discovered in 1958 at an ancient pagan sanctuary in Melaani, Kakheti, this bronze figure dates to approximately the 10th–9th centuries BC. Depicted holding a drinking horn, the figure has been associated by researchers with Badagoni — an ancient Georgian deity connected with wine, fertility, and viticulture. It stands as a remarkable symbol of the deep relationship between wine and Georgian culture."),
    image: "/images/badagoni-figure-melaani.jpg",
    imageTitle: en("Bronze figure from Melaani"),
    imageCaption: en("Georgian National Museum"),
    credit: {
      label: en("三猎 / Wikimedia Commons"),
      url: "https://commons.wikimedia.org/wiki/File:%E6%A2%85%E6%8B%89%E9%98%BF%E5%B0%BC%E9%9D%92%E9%93%9C%E7%94%B7%E5%AD%90%E5%83%8F.jpg",
      license: en("CC BY-SA 4.0"),
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  },
  qvevri: {
    tabLabel: en("Qvevri tradition"),
    eyebrow: en("02 / Qvevri tradition"),
    title: en("Qvevri Tradition."),
    body: en("A qvevri is a clay vessel buried in the ground, used for fermenting and ageing wine. It lies at the heart of a Georgian winemaking tradition passed from one generation to the next.\n\nGrape skins and seeds stay in contact with the wine during and after fermentation, giving it colour, texture, and depth. The vessel, the harvest, and time shape each expression.\n\nAt Alaverdi Monastery, this craft remains part of everyday life. Badagoni supported the restoration of the historic cellar in 2006, helping continue a tradition that lives on in our qvevri wines."),
    image: "/images/cellar.webp",
    imageTitle: en("Alaverdi Monastery"),
    imageCaption: en("The qvevri cellar / Kakheti, Georgia"),
    credit: null,
  },
};
