import type { Localized } from "@/db/schema";

export const TERROIR_SLUG = "terroir";

export type VineyardPlaceContent = { name: Localized; grape: Localized; text: Localized; image: string };

export type TerroirContent = {
  heading: { eyebrow: Localized; title: Localized; subtitle: Localized };
  cover: { image: string; caption: Localized };
  intro: { eyebrow: Localized; heading: Localized; body: Localized };
  listHeading: { label: Localized; subtitle: Localized };
  places: [VineyardPlaceContent, VineyardPlaceContent, VineyardPlaceContent, VineyardPlaceContent];
  closing: { image: string; eyebrow: Localized; heading: Localized };
};

function en(value: string): Localized {
  return { en: value, ka: "" };
}

// The terroir page's original hardcoded copy. Place ids, alt text, and the
// closing link text stay fixed in app/terroir/page.tsx.
export const TERROIR_DEFAULT: TerroirContent = {
  heading: {
    eyebrow: en("Our vineyards / Kakheti, Georgia"),
    title: en("A place\nlike no other."),
    subtitle: en("Every soil, every slope, every season.\nA different voice in the glass."),
  },
  cover: {
    image: "/images/vineyard.webp",
    caption: en("Alazani Valley / Kakheti"),
  },
  intro: {
    eyebrow: en("The character of Kakheti"),
    heading: en("One region.\nMany expressions."),
    body: en("Our vineyards extend across Kakheti, with holdings of up to 500 hectares. Changing altitudes, soils and microclimates create a rich range of expressions from Georgia’s native grapes."),
  },
  listHeading: {
    label: en("Selected locations"),
    subtitle: en("The soil. The grape. The character."),
  },
  places: [
    { name: en("Alaverdi"), grape: en("Saperavi"), text: en("Alluvial soils and yellow clay in a landscape shaped by the Alazani Valley."), image: "/images/vineyards/alaverdi.webp" },
    { name: en("Mukuzani"), grape: en("Saperavi"), text: en("Gravel and red clay bring their character to deeply expressive dry red wines."), image: "/images/vineyards/mukuzani.webp" },
    { name: en("Maghraani"), grape: en("Kisi · Saperavi"), text: en("Forest-derived soils and rich biodiversity give this place a distinctive voice."), image: "/images/vineyards/maghraani.webp" },
    { name: en("Tsinandali"), grape: en("Rkatsiteli"), text: en("The limestone and clay soils of Akura are home to vineyards for dry white wines."), image: "/images/vineyards/tsinandali.webp" },
  ],
  closing: {
    image: "/images/vineyard.webp",
    eyebrow: en("From the land to the glass"),
    heading: en("Take a little\nGeorgia with you."),
  },
};
