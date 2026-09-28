import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader, SiteFooter } from "./site-shell";
import { listMenuItems } from "@/lib/menu/service";
export const metadata: Metadata = {
 title: { default: "Badagoni — A Georgian state of mind.", template: "%s — Badagoni" },
 description: "Discover Badagoni. Native Georgian grapes, remarkable Kakhetian vineyards, and a contemporary expression of an enduring winemaking tradition.",
 icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" }
};
export default async function RootLayout({children}:Readonly<{children:React.ReactNode}>){
  const menuItems = await listMenuItems();
  const primaryLinks = menuItems.filter(item => item.location === "header_primary");
  const secondaryLinks = menuItems.filter(item => item.location === "header_secondary");
  const footerPrimaryLinks = menuItems.filter(item => item.location === "footer_primary");
  const footerSecondaryLinks = menuItems.filter(item => item.location === "footer_secondary");
  const footerSocialLinks = menuItems.filter(item => item.location === "footer_social");
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader primaryLinks={primaryLinks} secondaryLinks={secondaryLinks}/><div id="main-content">{children}</div><SiteFooter footerPrimaryLinks={footerPrimaryLinks} footerSecondaryLinks={footerSecondaryLinks} footerSocialLinks={footerSocialLinks}/></body></html>;
}
