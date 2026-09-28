import type { Localized } from "@/db/schema";
import type { TextSection } from "./generic";

export const LEGALS_SLUG = "legals";

// Terms and Privacy share the same shape: a numbered eyebrow, title, a
// "Draft for review"-style revision line, and a reorderable list of
// heading+body sections (reusing the generic page template's TextSection
// type/admin UI) - unlike other registered pages, legal documents
// genuinely need sections addable over time (a new clause, a new law),
// so this is a deliberate exception to "fixed sections" for registered
// pages.
export type LegalDocument = {
  eyebrow: Localized;
  title: Localized;
  revisionLabel: Localized;
  revisionDate: string;
  sections: TextSection[];
};

export type LegalsContent = {
  heading: { eyebrow: Localized; title: Localized; subtitle: Localized };
  terms: LegalDocument;
  privacy: LegalDocument;
};

function en(value: string): Localized {
  return { en: value, ka: "" };
}

function section(id: string, heading: string, body: string): TextSection {
  return { id, type: "text", heading: en(heading), body: en(body) };
}

// Seeded from a reference build's real "Legals" page content (Terms and
// Privacy), marked there as "Draft for review" - worth an actual legal
// review before treating it as final, not fabricated copy.
export const LEGALS_DEFAULT: LegalsContent = {
  heading: {
    eyebrow: en("Badagoni / Website information"),
    title: en("Legals"),
    subtitle: en("Terms for using this website and information about your privacy."),
  },
  terms: {
    eyebrow: en("01 / Website information"),
    title: en("Terms and conditions"),
    revisionLabel: en("Draft for review"),
    revisionDate: "2026-09-22",
    sections: [
      section("about-this-website", "About this website", "This website introduces Badagoni, our wines, vineyards, and winemaking heritage. Badagoni’s contact details are JSC Badagoni, 4 Liberty Square, 0105 Tbilisi, Georgia, and office@badagoni.ge."),
      section("age-and-responsible-enjoyment", "Age and responsible enjoyment", "Our wine content is intended for people of legal drinking age in their country of residence. Please enjoy alcohol responsibly and observe the rules that apply where you are."),
      section("wine-information-and-enquiries", "Wine information and enquiries", "Wine descriptions, photographs, vintages, and awards are presented for information. Availability, packaging, and specifications may change. Please contact our team to confirm current details. This website does not accept online orders or payments, and sending an enquiry does not confirm a purchase, booking, or other agreement."),
      section("content-and-intellectual-property", "Content and intellectual property", "The Badagoni name, logos, text, photographs, and other materials belong to their respective rights holders. You may browse the website and share links to its pages. Reuse of content must comply with any stated licence, permission from the relevant rights holder, and applicable law. Any specific image credit or licence remains applicable to that image."),
      section("using-the-website", "Using the website", "Please use the website lawfully. Do not attempt to gain unauthorised access, interfere with its operation, introduce malicious software, or misuse the contact details and content published here."),
      section("links-and-availability", "Links and availability", "Some links lead to other websites, including map services and original news sources. Those websites have their own terms and privacy practices. We aim to keep this website useful and accurate, but information and availability may change. Please let us know if you notice an error."),
      section("your-rights-and-these-terms", "Your rights and these terms", "Nothing in these terms is intended to exclude rights or protections that cannot be excluded under applicable law. These terms may be updated as the website develops. For questions about the website or these terms, write to office@badagoni.ge."),
    ],
  },
  privacy: {
    eyebrow: en("02 / Website information"),
    title: en("Privacy policy"),
    revisionLabel: en("Draft for review"),
    revisionDate: "2026-09-22",
    sections: [
      section("scope-and-contact", "Scope and contact", "This notice concerns this Badagoni website and enquiries sent using its contact links. For questions about your information, contact JSC Badagoni at office@badagoni.ge or 4 Liberty Square, 0105 Tbilisi, Georgia."),
      section("information-you-choose-to-share", "Information you choose to share", "If you contact us by email or telephone, you may provide your name, contact details, and the information in your enquiry. These details are used to respond to your request and manage the related correspondence. Please share only information needed for your enquiry. The website itself does not provide customer accounts, payment forms, or an online checkout."),
      section("browsing-information-and-cookies", "Browsing information and cookies", "Hosting and security services may process technical information such as an IP address, browser or device details, requested pages, and access times to deliver and protect the website. We have not added advertising trackers or optional analytics to these pages. The hosting platform may use essential cookies or similar technologies. You can manage cookies through your browser settings."),
      section("external-services-and-photographs", "External services and photographs", "Some photographs are loaded from Wikimedia Commons, so your browser sends connection information to that service when requesting an image. Map, news-source, and other external links take you to separately operated websites. Email and telephone links open your own applications. Those services may process information under their own privacy policies."),
      section("purposes-and-legal-grounds", "Purposes and legal grounds", "Information is used to answer enquiries, take steps you request before an agreement, operate and secure the website, and meet legal obligations. The relevant legal ground depends on the activity and may include a requested agreement, legitimate interests, a legal obligation, or consent. Where processing relies on consent, you may withdraw it."),
      section("service-providers-and-retention", "Service providers and retention", "Website hosting and email services may involve service providers processing information outside Georgia. Contact us for details of the providers, destinations, and safeguards relevant to your enquiry.\n\nInformation should be retained only as long as needed for its purpose or applicable legal obligations. The nature of an enquiry, any ongoing relationship, and record-keeping requirements determine the relevant period."),
      section("your-privacy-rights", "Your privacy rights", "Subject to applicable law, you may request information about processing, access to your data, correction, erasure or blocking, and a portable copy where available. You may also withdraw consent and raise a complaint with the competent data protection authority or a court. Send requests to office@badagoni.ge; information to verify your identity may be needed."),
      section("changes-to-this-notice", "Changes to this notice", "This notice may be updated when the website or relevant practices change. The date shown beside this policy identifies its latest revision. Please contact us if you need further information about a particular use of your data."),
    ],
  },
};
