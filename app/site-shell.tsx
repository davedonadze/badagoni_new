"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { localize, localizeHref, type Locale } from "@/lib/i18n";
import type { MenuItem } from "@/lib/menu/service";
import type { Localized } from "@/db/schema";

type UiStrings = Record<string, Localized>;

function isCurrent(canonicalPath: string, href: string): boolean {
  return canonicalPath === href || (href !== "/" && canonicalPath.startsWith(`${href}/`));
}

// The path proxy.ts rewrote /ka/<path> from - i.e. the same path with any
// /ka prefix removed, for comparing against nav hrefs (which are always
// unprefixed) and for building the other language's link to this same page.
function canonicalPathOf(path: string): string {
  if (path === "/ka") return "/";
  if (path.startsWith("/ka/")) return path.slice(3);
  return path;
}

// Derived from the live pathname rather than taken as a prop: App Router
// keeps the root layout mounted across client-side navigations (only the
// page below it re-renders), so a locale prop threaded down from there
// would go stale the moment someone clicks a link instead of hard-loading
// the page - usePathname() is what already updates correctly on every
// navigation, client-side included.
function localeOf(path: string): Locale {
  return path === "/ka" || path.startsWith("/ka/") ? "ka" : "en";
}

export function SiteHeader({ primaryLinks, secondaryLinks, t }: { primaryLinks: MenuItem[]; secondaryLinks: MenuItem[]; t: UiStrings }) {
  const path = usePathname();
  const locale = localeOf(path);
  const canonicalPath = canonicalPathOf(path);
  const [open, setOpen] = useState(false);
  const mobileLinks = [...primaryLinks, ...secondaryLinks];

  if (path.startsWith("/admin")) return null;

  return <header className={"site-header" + (canonicalPath === "/" ? " header-over-photo" : "")}>
    <Link href={localizeHref("/", locale)} className="brand" aria-label="Badagoni home"><img src="/images/badagoni-logo.svg" alt="Badagoni — Est. 2006" width="328" height="75" /></Link>
    <nav className="header-nav" aria-label="Main navigation">{primaryLinks.map(link => <Link key={link.id} href={localizeHref(link.href, locale)} aria-current={isCurrent(canonicalPath, link.href) ? "page" : undefined}>{localize(link.label, locale)}</Link>)}</nav>
    <nav className="header-secondary" aria-label="More about Badagoni">{secondaryLinks.map(link => <Link key={link.id} href={localizeHref(link.href, locale)} aria-current={isCurrent(canonicalPath, link.href) ? "page" : undefined}>{localize(link.label, locale)}</Link>)}</nav>
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild><button className="mobile-menu-button" aria-label="Open navigation"><Menu size={23} strokeWidth={1.4} /><span>{localize(t["nav.menu"], locale)}</span></button></SheetTrigger>
      <SheetContent side="right" className="menu-panel">
        <SheetTitle>Badagoni</SheetTitle>
        <SheetDescription>{localize(t["nav.mobileTagline"], locale)}</SheetDescription>
        <nav aria-label="Mobile navigation"><Link href={localizeHref("/", locale)} onClick={() => setOpen(false)}>{localize(t["nav.home"], locale)}</Link>{mobileLinks.map(link => <Link key={link.id} href={localizeHref(link.href, locale)} onClick={() => setOpen(false)} aria-current={isCurrent(canonicalPath, link.href) ? "page" : undefined}>{localize(link.label, locale)}</Link>)}</nav>
        <a className="menu-contact" href="mailto:office@badagoni.ge">office@badagoni.ge</a>
      </SheetContent>
    </Sheet>
  </header>;
}

export function SiteFooter({ footerPrimaryLinks, footerSecondaryLinks, footerSocialLinks, t }: { footerPrimaryLinks: MenuItem[]; footerSecondaryLinks: MenuItem[]; footerSocialLinks: MenuItem[]; t: UiStrings }) {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;
  const locale = localeOf(path);
  const canonicalPath = canonicalPathOf(path);

  return <footer className="site-footer">
    <div className="footer-top">
      <div>
        <p className="footer-statement">From Kakheti.<br />To Your Table.</p>
        <Link href={localizeHref("/contact", locale)} className="underlined-link footer-invitation-link">{localize(t["footer.startConversation"], locale)} <ArrowUpRight size={17} /></Link>
      </div>
      <nav className="footer-nav" aria-label="Footer navigation, part 1">{footerPrimaryLinks.map(link => <Link key={link.id} href={localizeHref(link.href, locale)}>{localize(link.label, locale)}<ArrowUpRight size={15} /></Link>)}</nav>
      <nav className="footer-nav" aria-label="Footer navigation, part 2">{footerSecondaryLinks.map(link => <Link key={link.id} href={localizeHref(link.href, locale)}>{localize(link.label, locale)}<ArrowUpRight size={15} /></Link>)}</nav>
    </div>
    <div className="footer-details">
      <div><span className="eyebrow">{localize(t["footer.legals"], locale)}</span><Link href={localizeHref("/legals?tab=terms-and-conditions", locale)}>{localize(t["footer.termsAndConditions"], locale)}</Link><Link href={localizeHref("/legals?tab=privacy-policy", locale)}>{localize(t["footer.privacyPolicy"], locale)}</Link></div>
      <div><span className="eyebrow">{localize(t["footer.social"], locale)}</span>{footerSocialLinks.length === 0 && <span className="footer-placeholder">{localize(t["footer.comingSoon"], locale)}</span>}{footerSocialLinks.map(link => <a key={link.id} href={link.href} target="_blank" rel="noreferrer">{localize(link.label, locale)}</a>)}</div>
      <div>
        <span className="eyebrow">{localize(t["footer.language"], locale)}</span>
        <Link href={canonicalPath} aria-current={locale === "en" ? "true" : undefined} className={locale !== "en" ? "footer-language-muted" : undefined}>{localize(t["footer.english"], locale)}</Link>
        <Link href={localizeHref(canonicalPath, "ka")} aria-current={locale === "ka" ? "true" : undefined} className={locale !== "ka" ? "footer-language-muted" : undefined}>ქართული</Link>
      </div>
    </div>
    <div className="footer-legal"><span>© {new Date().getFullYear()} Badagoni</span><span>{localize(t["footer.enjoyResponsibly"], locale)}</span><a href="#main-content">{localize(t["footer.backToTop"], locale)}</a></div>
    <Link href={localizeHref("/", locale)} className="footer-wordmark" aria-label="Badagoni home"><img src="/images/badagoni-wordmark.svg" alt="Badagoni" width="328" height="40" loading="lazy" /></Link>
  </footer>;
}
