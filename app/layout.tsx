import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader, SiteFooter } from "./site-shell";
export const metadata: Metadata = {
 title: { default: "Badagoni — A Georgian state of mind.", template: "%s — Badagoni" },
 description: "Discover Badagoni. Native Georgian grapes, remarkable Kakhetian vineyards, and a contemporary expression of an enduring winemaking tradition.",
 icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" }
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader/><div id="main-content">{children}</div><SiteFooter/></body></html>}
