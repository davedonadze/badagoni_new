import type { Localized } from "@/db/schema";

export const ALAVERDI_SLUG = "alaverdi-monastery-cellar";

export type AlaverdiLandmark = { label: Localized; value: Localized };

export type AlaverdiContent = {
  heading: { eyebrow: Localized; title: Localized; subtitle: Localized };
  cover: { image: string; captionLine1: Localized; captionLine2: Localized };
  landmarks: [AlaverdiLandmark, AlaverdiLandmark, AlaverdiLandmark];
  story: { eyebrow: Localized; heading: Localized; paragraph1: Localized; paragraph2: Localized; subheading: Localized; paragraph3: Localized };
  qvevri: { image: string; eyebrow: Localized; heading: Localized; body: Localized };
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
  landmarks: [
    { label: en("Historic cellar"), value: en("11th century") },
    { label: en("Qvevri discovered"), value: en("40+") },
    { label: en("Restored with Badagoni"), value: en("2006") },
  ],
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
    eyebrow: en("The qvevri tradition"),
    heading: en("Earth. Grapes.\nTime."),
    body: en("Qvevri are large clay vessels buried in the ground, used to ferment and store wine. At Alaverdi, this craft is kept alive through the knowledge and daily work of the monks."),
  },
  closing: {
    eyebrow: en("From the cellar to the glass"),
    heading: en("The tradition,\nin the glass."),
    body: en("The restored cellar is home to Badagoni qvevri wines including Alaverdi Tradition, Saperavi, Kisi, and Khikhvi."),
  },
};
