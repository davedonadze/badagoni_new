import type { Localized } from "@/db/schema";

// Every hardcoded, user-visible English string in the codebase that isn't
// already backed by an admin-editable `pages`/`wines`/etc. row - button and
// link labels, section eyebrows, fallback text. Each key's English default
// here is a straight copy of the literal that used to sit directly in the
// component; components now look values up by key (see lib/ui-strings/t.ts)
// instead of hardcoding the string, falling back to this default until an
// admin fills in a translation (or edits the English) at /admin/translations.
//
// Deliberately NOT included, to keep this list to what visitors actually
// read: pure screen-reader-only aria-labels/titles, <title>/meta description
// text (browser tab/search only), and the Saperavi Reserve page's bespoke
// long-form tasting notes and award names (a one-off editorial page, not
// part of the reusable UI).
export const UI_STRING_DEFAULTS: Record<string, Localized> = {
  // Header & footer chrome
  "footer.statement": en("From Kakheti.\nTo Your Table."),
  "footer.startConversation": en("Let’s start a conversation"),
  "footer.legals": en("Legals"),
  "footer.termsAndConditions": en("Terms and Conditions"),
  "footer.privacyPolicy": en("Privacy Policy"),
  "footer.social": en("Social"),
  "footer.comingSoon": en("Coming soon"),
  "footer.language": en("Language"),
  "footer.english": en("English"),
  "footer.enjoyResponsibly": en("Enjoy responsibly."),
  "footer.backToTop": en("Back to top ↑"),
  "nav.menu": en("Menu"),
  "nav.mobileTagline": en("Georgian wine. A different point of view."),
  "nav.home": en("Home"),
  "layout.skipToContent": en("Skip to content"),

  // Buttons & links reused across pages
  "cta.exploreCollection": en("Explore the collection"),
  "cta.discoverCollection": en("Discover the collection"),
  "cta.viewAllWines": en("View all wines"),
  "cta.ourStory": en("Our story"),
  "cta.exploreOurVineyards": en("Explore our vineyards"),
  "cta.discoverTheCraft": en("Discover the craft"),
  "cta.meetBadagoni": en("Meet Badagoni"),
  "cta.exploreTheWines": en("Explore the wines"),
  "cta.ourVineyards": en("Our vineyards"),
  "cta.theQvevriTradition": en("The Qvevri Tradition"),
  "cta.readStory": en("Read story"),
  "cta.readFullStory": en("Read full story"),
  "cta.returnHome": en("Return home"),
  "contact.findOurOffice": en("Find our office"),
  "contact.findOurWinery": en("Find our winery"),

  // Wine catalogue & detail panel
  "wine.discoverWine": en("Discover wine"),
  "wine.theBadagoniCollection": en("The Badagoni collection"),
  "wine.fallbackDescription": en("Discover this expression from the Badagoni collection. Contact our team for current vintages and further information."),
  "wine.origin": en("Origin"),
  "wine.georgia": en("Georgia"),
  "wine.kakhetiGeorgia": en("Kakheti, Georgia"),
  "wine.grapeVariety": en("Grape variety"),
  "wine.grapeVarieties": en("Grape varieties"),
  "wine.alcohol": en("Alcohol"),
  "wine.style": en("Style"),
  "wine.allFilter": en("All"),
  "wine.expressionsSuffix": en("expressions"),
  "wine.catalogueBreadcrumb": en("Wine catalogue"),
  "wine.exploreMore": en("Explore more."),
  "wine.enquireAboutThisWine": en("Enquire about this wine"),
  "wine.viewFullWinePage": en("View full wine page"),
  "wine.backToFullCatalogue": en("Back to the full wine catalogue"),
  "wine.awards": en("Awards"),
  "wine.awardsDescription": en("Medals and awards received, with the year of each award."),
  "wine.aboutThisWine": en("About this wine"),
  "wine.inTheGlass": en("In the glass."),
  "wine.colour": en("Colour"),
  "wine.aromas": en("Aromas"),
  "wine.palate": en("Palate"),

  // Newsroom
  "newsroom.newsAndStories": en("News & stories"),
  "newsroom.heading": en("Newsroom."),
  "newsroom.subheadLine1": en("From our home in Kakheti"),
  "newsroom.subheadLine2": en("to the wider world of wine."),
  "newsroom.featuredStory": en("Featured story"),
  "newsroom.moreFromBadagoni": en("More from Badagoni"),
  "newsroom.backToNewsroom": en("Back to newsroom"),
  "newsroom.publishedByBadagoni": en("Published by Badagoni"),
  "newsroom.originalAnnouncement": en("Original announcement"),
  "newsroom.learnMore": en("Learn more"),
  "newsroom.allNewsAndStories": en("All news & stories"),

  // Legals & Georgian wine tabs
  "legals.termsAndConditionsTab": en("Terms and conditions"),
  "legals.privacyPolicyTab": en("Privacy policy"),
  "legals.loading": en("Loading legal information…"),
  "georgianWine.loading": en("Loading…"),
  "georgianWine.photoCredit": en("Photo credit"),
  "georgianWine.croppedForDisplay": en("Cropped for display."),

  // Contact
  "contact.headquartersEyebrow": en("01 / Headquarters"),
  "contact.wineryEyebrow": en("02 / Winery"),

  // 404
  "notFound.pageNotFound": en("Page not found"),
  "notFound.aDifferentPath": en("A different path"),
  "notFound.backToBadagoni": en("back to Badagoni."),
};

function en(value: string): Localized {
  return { en: value, ka: "" };
}

export type UiStringGroup = { title: string; keys: string[] };

export const UI_STRING_GROUPS: UiStringGroup[] = [
  {
    title: "Header & footer",
    keys: [
      "nav.menu", "nav.mobileTagline", "nav.home", "layout.skipToContent",
      "footer.statement", "footer.startConversation", "footer.legals", "footer.termsAndConditions", "footer.privacyPolicy",
      "footer.social", "footer.comingSoon", "footer.language", "footer.english", "footer.enjoyResponsibly", "footer.backToTop",
    ],
  },
  {
    title: "Buttons & links",
    keys: [
      "cta.exploreCollection", "cta.discoverCollection", "cta.viewAllWines", "cta.ourStory",
      "cta.exploreOurVineyards", "cta.discoverTheCraft", "cta.meetBadagoni", "cta.exploreTheWines", "cta.ourVineyards",
      "cta.theQvevriTradition", "cta.readStory", "cta.readFullStory", "cta.returnHome",
      "contact.findOurOffice", "contact.findOurWinery",
    ],
  },
  {
    title: "Wine catalogue & detail panel",
    keys: [
      "wine.discoverWine", "wine.theBadagoniCollection", "wine.fallbackDescription",
      "wine.origin", "wine.georgia", "wine.kakhetiGeorgia", "wine.grapeVariety", "wine.grapeVarieties",
      "wine.alcohol", "wine.style", "wine.allFilter", "wine.expressionsSuffix", "wine.catalogueBreadcrumb",
      "wine.exploreMore", "wine.enquireAboutThisWine", "wine.viewFullWinePage", "wine.backToFullCatalogue", "wine.awards", "wine.awardsDescription",
      "wine.aboutThisWine", "wine.inTheGlass", "wine.colour", "wine.aromas", "wine.palate",
    ],
  },
  {
    title: "Newsroom",
    keys: [
      "newsroom.newsAndStories", "newsroom.heading", "newsroom.subheadLine1", "newsroom.subheadLine2",
      "newsroom.featuredStory", "newsroom.moreFromBadagoni", "newsroom.backToNewsroom",
      "newsroom.publishedByBadagoni", "newsroom.originalAnnouncement", "newsroom.learnMore", "newsroom.allNewsAndStories",
    ],
  },
  {
    title: "Legals & Georgian wine",
    keys: [
      "legals.termsAndConditionsTab", "legals.privacyPolicyTab", "legals.loading",
      "georgianWine.loading", "georgianWine.photoCredit", "georgianWine.croppedForDisplay",
    ],
  },
  {
    title: "Contact",
    keys: ["contact.headquartersEyebrow", "contact.wineryEyebrow"],
  },
  {
    title: "Other",
    keys: ["notFound.pageNotFound", "notFound.aDifferentPath", "notFound.backToBadagoni"],
  },
];
