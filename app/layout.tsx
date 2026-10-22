import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { SiteHeader, SiteFooter } from "./site-shell";
import { LocaleSync } from "./locale-sync";
import { AgeGate } from "./age-gate";
import { listMenuItems } from "@/lib/menu/service";
import { getLocale, localize } from "@/lib/i18n";
import { getUiStrings } from "@/lib/ui-strings/service";
import { AGE_GATE_COOKIE } from "@/lib/age-gate";
import { getPageContent } from "@/lib/pages/service";
import { SITE_SETTINGS_SLUG, SITE_SETTINGS_DEFAULT, type SiteSettingsContent } from "@/lib/pages/site-settings";
const SITE_NAME = "Badagoni";
const DEFAULT_DESCRIPTION = "Discover Badagoni. Native Georgian grapes, remarkable Kakhetian vineyards, and a contemporary expression of an enduring winemaking tradition.";
const DEFAULT_OG_IMAGE = "/images/hero.webp";

export const metadata: Metadata = {
 metadataBase: new URL("https://badagoni.com"),
 title: { default: "Badagoni — A Georgian state of mind.", template: "%s — Badagoni" },
 description: DEFAULT_DESCRIPTION,
 icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
 openGraph: {
   siteName: SITE_NAME,
   type: "website",
   title: "Badagoni — A Georgian state of mind.",
   description: DEFAULT_DESCRIPTION,
   images: [{ url: DEFAULT_OG_IMAGE, width: 2048, height: 1152 }],
 },
 twitter: {
   card: "summary_large_image",
   title: "Badagoni — A Georgian state of mind.",
   description: DEFAULT_DESCRIPTION,
   images: [DEFAULT_OG_IMAGE],
 },
};
export default async function RootLayout({children}:Readonly<{children:React.ReactNode}>){
  const [menuItems, locale, t, cookieStore, siteSettings] = await Promise.all([listMenuItems(), getLocale(), getUiStrings(), cookies(), getPageContent<SiteSettingsContent>(SITE_SETTINGS_SLUG)]);
  const ageConfirmed = cookieStore.get(AGE_GATE_COOKIE)?.value === "true";
  const hideGeorgianLanguage = (siteSettings ?? SITE_SETTINGS_DEFAULT).hideGeorgianLanguage;
  const primaryLinks = menuItems.filter(item => item.location === "header_primary");
  const secondaryLinks = menuItems.filter(item => item.location === "header_secondary");
  const footerPrimaryLinks = menuItems.filter(item => item.location === "footer_primary");
  const footerSecondaryLinks = menuItems.filter(item => item.location === "footer_secondary");
  const footerSocialLinks = menuItems.filter(item => item.location === "footer_social");
  return <html lang={locale}><body><AgeGate locale={locale} initiallyConfirmed={ageConfirmed} hideGeorgianLanguage={hideGeorgianLanguage}/><LocaleSync/><a className="skip-link" href="#main-content">{localize(t["layout.skipToContent"], locale)}</a><SiteHeader primaryLinks={primaryLinks} secondaryLinks={secondaryLinks} t={t}/><div id="main-content">{children}</div><SiteFooter footerPrimaryLinks={footerPrimaryLinks} footerSecondaryLinks={footerSecondaryLinks} footerSocialLinks={footerSocialLinks} t={t} hideGeorgianLanguage={hideGeorgianLanguage}/></body></html>;
}
