import type { Localized } from "@/db/schema";

export const ALAVERDI_SLUG = "alaverdi-monastery-cellar";

export type AlaverdiContent = {
  heading: { eyebrow: Localized; title: Localized; subtitle: Localized };
  cover: { image: string; captionLine1: Localized; captionLine2: Localized };
  story: { eyebrow: Localized; heading: Localized; paragraph1: Localized; paragraph2: Localized; subheading: Localized; paragraph3: Localized };
  // Full-bleed photo with the heading and a fixed link to the Georgian
  // wine page's qvevri chapter overlaid on top - see app/story/winery-scroll-scene.tsx.
  qvevri: { image: string; heading: Localized };
  closing: { eyebrow: Localized; heading: Localized; body: Localized };
};

function en(value: string): Localized {
  return { en: value, ka: "" };
}

// The Alaverdi Monastery Cellar page's original hardcoded copy. The closing
// section's link text/href stay fixed in app/alaverdi-monastery-cellar/page.tsx.
export const ALAVERDI_DEFAULT: AlaverdiContent = {
  heading: {
    eyebrow: en("Alaverdi / Kakheti, Georgia"),
    title: en("Alaverdi\nMonastery Cellar."),
    subtitle: en("Inside Alaverdi’s historic walls, Georgian monastic winemaking continues in clay vessels buried in the earth."),
  },
  cover: {
    image: "/images/cellar.webp",
    captionLine1: en("Within the monastery walls"),
    captionLine2: en("Alaverdi, Georgia"),
  },
  story: {
    eyebrow: en("A living heritage"),
    heading: en("A cellar,\nstill alive."),
    paragraph1: en("In the Alazani Valley, beneath the Caucasus Mountains, Alaverdi Monastery has long been a place of faith, learning, and winemaking."),
    paragraph2: en("Archaeological work revealed an 11th-century cellar with more than 40 qvevri. These earthenware vessels record a tradition safeguarded by generations of Georgian monks."),
    subheading: en("A new chapter in 2006."),
    paragraph3: en("Badagoni supported the restoration of the monastery’s cellar, enabling Alaverdi’s monks to resume winemaking there and bringing the historic space back into use."),
  },
  qvevri: {
    image: "/images/vineyard.webp",
    heading: en("Earth. Grapes. Time."),
  },
  closing: {
    eyebrow: en("From the cellar to the glass"),
    heading: en("The tradition,\nin the glass."),
    body: en("The restored cellar is home to Badagoni qvevri wines including Alaverdi Tradition, Saperavi, Kisi, and Khikhvi."),
  },
};
