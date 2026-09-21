import type { Localized } from "@/db/schema";

export const CONTACT_SLUG = "contact";

export type ContactMethod = { label: Localized; value: string };
export type ContactLocation = { title: Localized; address: Localized; mapUrl: string };

export type ContactContent = {
  heading: { eyebrow: Localized; title: Localized; subtitle: Localized };
  methods: [ContactMethod, ContactMethod];
  locations: [ContactLocation, ContactLocation];
};

function en(value: string): Localized {
  return { en: value, ka: "" };
}

// The contact page's original hardcoded copy. Method/location display
// numbers, link text, and href scheme (mailto:/tel:) stay fixed in
// app/contact/page.tsx - only labels, values, titles, and addresses here.
export const CONTACT_DEFAULT: ContactContent = {
  heading: {
    eyebrow: en("Contact"),
    title: en("Get in touch."),
    subtitle: en("For wine enquiries, partnerships,\nor a conversation with our team."),
  },
  methods: [
    { label: en("Email our team"), value: "office@badagoni.ge" },
    { label: en("Call Badagoni"), value: "+995 32 293 62 43" },
  ],
  locations: [
    { title: en("Tbilisi office"), address: en("JSC Badagoni\n4 Liberty Square\n0105 Tbilisi, Georgia"), mapUrl: "https://maps.app.goo.gl/NnR25zEn8Hakp3di6" },
    { title: en("At home in Kakheti."), address: en("Village Zemo Khodasheni\n0910 Akhmeta\nKakheti, Georgia"), mapUrl: "https://maps.app.goo.gl/ZW8pU79YskPUNH2G9" },
  ],
};
