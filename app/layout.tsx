import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader, SiteFooter } from "./site-shell";
import { LocaleSync } from "./locale-sync";
import { listMenuItems } from "@/lib/menu/service";
import { getLocale, localize } from "@/lib/i18n";
import { getUiStrings } from "@/lib/ui-strings/service";
export const metadata: Metadata = {
 title: { default: "Badagoni — A Georgian state of mind.", template: "%s — Badagoni" },
 description: "Discover Badagoni. Native Georgian grapes, remarkable Kakhetian vineyards, and a contemporary expression of an enduring winemaking tradition.",
 icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" }
};
export default async function RootLayout({children}:Readonly<{children:React.ReactNode}>){
  const [menuItems, locale, t] = await Promise.all([listMenuItems(), getLocale(), getUiStrings()]);
  const primaryLinks = menuItems.filter(item => item.location === "header_primary");
  const secondaryLinks = menuItems.filter(item => item.location === "header_secondary");
  const footerPrimaryLinks = menuItems.filter(item => item.location === "footer_primary");
  const footerSecondaryLinks = menuItems.filter(item => item.location === "footer_secondary");
  const footerSocialLinks = menuItems.filter(item => item.location === "footer_social");
  return <html lang={locale}><body><LocaleSync/><a className="skip-link" href="#main-content">{localize(t["layout.skipToContent"], locale)}</a><SiteHeader primaryLinks={primaryLinks} secondaryLinks={secondaryLinks} t={t}/><div id="main-content">{children}</div><SiteFooter footerPrimaryLinks={footerPrimaryLinks} footerSecondaryLinks={footerSecondaryLinks} footerSocialLinks={footerSocialLinks} t={t}/></body></html>;
}
