import type { Localized } from "@/db/schema";

export const HOME_SLUG = "home";

export type EditorialCardContent = { label: Localized; title: Localized; image: string; description: Localized };
export type WorldItemContent = { title: Localized; subtitle: Localized; text: Localized };

export type HomeContent = {
  hero: { image: string; caption: Localized };
  opening: { heading: Localized; body: Localized };
  collection: { heading: Localized; subtitle: Localized };
  editorialCards: [EditorialCardContent, EditorialCardContent, EditorialCardContent];
  originInterlude: { line: Localized; caption: Localized };
  manifesto: { image: string; overlayCaption: Localized; eyebrow: Localized; heading: Localized; body: Localized };
  worldSection: { heading: Localized; items: [WorldItemContent, WorldItemContent, WorldItemContent] };
};

function en(value: string): Localized {
  return { en: value, ka: "" };
}

// The homepage's original hardcoded copy — seeded by the migration and used
// as a fallback if the DB row is ever missing. Fixed metadata that stays in
// code (ids, hrefs, link text, alt text, world section numbers) lives
// alongside app/page.tsx / app/editorial-cards.tsx, not here.
export const HOME_DEFAULT: HomeContent = {
  hero: {
    image: "/images/ritual-editorial.webp",
    caption: en("Native grapes.\nIndependent character."),
  },
  opening: {
    heading: en("From Georgia, with character."),
    body: en("Born in the heart of Kakheti, we bring a contemporary spirit to Georgian wine. From the soil to the table, it’s a story of character, connection, and a place like nowhere else."),
  },
  collection: {
    heading: en("The collection"),
    subtitle: en("Selected expressions / 01—03"),
  },
  editorialCards: [
    {
      label: en("The craft"),
      title: en("A tradition, still alive"),
      image: "/images/cellar.webp",
      description: en("Clay vessels, native grapes, and knowledge passed from one generation to the next. Discover the traditions that continue to shape our wines."),
    },
    {
      label: en("The place"),
      title: en("Where it all begins"),
      image: "/images/vineyard.webp",
      description: en("Between the Caucasus Mountains and the Alazani Valley, our vineyards give every wine a sense of belonging. This is Kakheti, our home."),
    },
    {
      label: en("The expression"),
      title: en("Find your character"),
      image: "/images/kisi-qvevri.webp",
      description: en("From qvevri wines to fresh whites, expressive reds, and sparkling wines. Explore the collection and find your own expression of Georgia."),
    },
  ],
  originInterlude: {
    line: en("Badagoni\nKakheti, Georgia"),
    caption: en("Local roots. A world of possibilities."),
  },
  manifesto: {
    image: "/images/ritual-editorial.webp",
    overlayCaption: en("Wine is a way of bringing people together."),
    eyebrow: en("A way of looking at the world"),
    heading: en("More than\njust wine."),
    body: en("A bottle can hold a place, a memory, a conversation. Ours begin in Georgia, with the varieties and traditions that make this corner of the world our own."),
  },
  worldSection: {
    heading: en("Our world, in three parts"),
    items: [
      { title: en("Our place"), subtitle: en("Rooted in Kakheti"), text: en("Between the Caucasus Mountains and the Alazani Valley, our vineyards give every wine a sense of belonging.") },
      { title: en("Our craft"), subtitle: en("A living tradition"), text: en("Clay vessels, native grapes, and knowledge passed from one generation to the next. Qvevri is part of who we are.") },
      { title: en("Our perspective"), subtitle: en("Always looking forward"), text: en("Georgian heritage meets contemporary winemaking. An ongoing conversation between the vineyard, the cellar, and the world.") },
    ],
  },
};
