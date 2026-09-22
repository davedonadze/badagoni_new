import type { Localized } from "@/db/schema";

export const STORY_SLUG = "story";

export type StoryContent = {
  heading: { eyebrow: Localized; title: Localized; subtitle: Localized };
  cover: { image: string; caption: Localized };
  intro: { eyebrow: Localized; heading: Localized; paragraph1: Localized; paragraph2: Localized };
  qvevri: { image: string; eyebrow: Localized; heading: Localized; paragraph1: Localized; paragraph2: Localized };
  winery: { eyebrow: Localized; heading: Localized; paragraph1: Localized; paragraph2: Localized };
  science: { eyebrow: Localized; heading: Localized; paragraph: Localized };
};

function en(value: string): Localized {
  return { en: value, ka: "" };
}

// The page's original hardcoded copy, used as a fallback if the DB row is
// ever missing (e.g. before the seed migration runs) so the page never
// breaks, and as the starting point that migration seeds.
export const STORY_DEFAULT: StoryContent = {
  heading: {
    eyebrow: en("Our story / Since 2006"),
    title: en("Old roots.\nNew rituals."),
    subtitle: en("A Georgian point of view.\nFrom our vineyards to your table."),
  },
  cover: {
    image: "/images/vineyard.webp",
    caption: en("Kakheti, Georgia"),
  },
  intro: {
    eyebrow: en("01 / The beginning"),
    heading: en("It started\nwith a place."),
    paragraph1: en("In 2006, Giorgi Salakaia founded Badagoni in Zemo Khodasheni, in the heart of Kakheti. The ambition was clear: make Georgian wine that could express the full character of its place."),
    paragraph2: en("Today, that idea guides everything we do. We work with native Georgian grape varieties, connecting an enduring winemaking heritage with contemporary research and knowledge."),
  },
  qvevri: {
    image: "/images/cellar.webp",
    eyebrow: en("02 / The craft"),
    heading: en("Of earth.\nOf time."),
    paragraph1: en("At Alaverdi Monastery, wine is part of a living heritage. Badagoni helped restore the historic cellar in 2006, supporting the continuation of its winemaking tradition."),
    paragraph2: en("Our qvevri wines are made in clay vessels buried in the earth, connecting each harvest to generations of Georgian craft."),
  },
  winery: {
    eyebrow: en("03 / The winery"),
    heading: en("Inside\nour winery."),
    paragraph1: en("In Zemo Khodasheni, Kakheti, our winery brings Georgian grapes together with Italian winemaking technology. Fermentation takes place in stainless steel tanks, while selected wines mature in American, French and Slovenian oak."),
    paragraph2: en("Laboratory analysis begins with the soil and continues throughout winemaking. Our own laboratory and Enosis Meraviglia in Italy provide the research and testing behind each bottle."),
  },
  science: {
    eyebrow: en("04 / The perspective"),
    heading: en("Tradition has\na future."),
    paragraph: en("Our collaboration with oenologist Dr. Donato Lanati and the Enosis Meraviglia research centre brings a scientific perspective to the vineyard and the cellar. The aim is always the same: allow each Georgian variety to speak clearly."),
  },
};
