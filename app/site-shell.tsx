"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import type { MenuItem } from "@/lib/menu/service";

function isCurrent(path: string, href: string): boolean {
  return path === href || (href !== "/" && path.startsWith(`${href}/`));
}

export function SiteHeader({ primaryLinks, secondaryLinks }: { primaryLinks: MenuItem[]; secondaryLinks: MenuItem[] }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const mobileLinks = [...primaryLinks, ...secondaryLinks];

  return <header className={"site-header" + (path === "/" ? " header-over-photo" : "")}>
    <Link href="/" className="brand" aria-label="Badagoni home"><img src="/images/badagoni-logo.svg" alt="Badagoni — Est. 2006" width="328" height="75" /></Link>
    <nav className="header-nav" aria-label="Main navigation">{primaryLinks.map(link => <Link key={link.id} href={link.href} aria-current={isCurrent(path, link.href) ? "page" : undefined}>{link.label.en}</Link>)}</nav>
    <nav className="header-secondary" aria-label="More about Badagoni">{secondaryLinks.map(link => <Link key={link.id} href={link.href} aria-current={isCurrent(path, link.href) ? "page" : undefined}>{link.label.en}</Link>)}</nav>
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild><button className="mobile-menu-button" aria-label="Open navigation"><Menu size={23} strokeWidth={1.4} /><span>Menu</span></button></SheetTrigger>
      <SheetContent side="right" className="menu-panel">
        <SheetTitle>Badagoni</SheetTitle>
        <SheetDescription>Georgian wine. A different point of view.</SheetDescription>
        <nav aria-label="Mobile navigation"><Link href="/" onClick={() => setOpen(false)}>Home</Link>{mobileLinks.map(link => <Link key={link.id} href={link.href} onClick={() => setOpen(false)} aria-current={isCurrent(path, link.href) ? "page" : undefined}>{link.label.en}</Link>)}</nav>
        <a className="menu-contact" href="mailto:office@badagoni.ge">office@badagoni.ge</a>
      </SheetContent>
    </Sheet>
  </header>;
}

export function SiteFooter({ footerLinks }: { footerLinks: MenuItem[] }) {
  return <footer className="site-footer">
    <div className="footer-top"><p className="footer-statement">Good wine.<br />Good company.</p><div className="footer-invitation"><p>From Kakheti to your table.</p><Link href="/contact" className="underlined-link">Let’s start a conversation <ArrowUpRight size={17} /></Link></div><nav className="footer-nav" aria-label="Footer navigation">{footerLinks.map(link => <Link key={link.id} href={link.href}>{link.label.en}<ArrowUpRight size={15} /></Link>)}</nav></div>
    <div className="footer-details"><div><span className="eyebrow">Our home</span><p>Zemo Khodasheni<br />Kakheti, Georgia</p></div><div><span className="eyebrow">Say hello</span><a href="mailto:office@badagoni.ge">office@badagoni.ge</a><a href="tel:+995322936243">+995 32 293 62 43</a></div><div><span className="eyebrow">Badagoni</span><p>Native Georgian grapes.<br />A contemporary perspective.</p></div></div>
    <div className="footer-legal"><span>© {new Date().getFullYear()} Badagoni</span><span>Enjoy responsibly.</span><a href="#main-content">Back to top ↑</a></div>
    <Link href="/" className="footer-wordmark" aria-label="Badagoni home"><img src="/images/badagoni-wordmark.svg" alt="Badagoni" width="328" height="40" loading="lazy" /></Link>
  </footer>;
}
