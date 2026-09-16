"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const links = [
  { href: "/catalogue", label: "Wine catalogue" },
  { href: "/story", label: "Our story" },
  { href: "/terroir", label: "Vineyards" },
  { href: "/contact", label: "Contact" },
];
const enologistsLink = { href: "/enologists", label: "Enologists" };
const cellarLink = { href: "/alaverdi-monastery-cellar", label: "Alaverdi Monastery Cellar" };
const newsroomLink = { href: "/newsroom", label: "Newsroom" };
const mobileLinks = [...links.slice(0, 3), cellarLink, enologistsLink, newsroomLink, links[3]];

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const isNewsroom = path === newsroomLink.href || path.startsWith(`${newsroomLink.href}/`);
  return <header className={"site-header" + (path === "/" ? " header-over-photo" : "")}>
    <Link href="/" className="brand" aria-label="Badagoni home"><img src="/images/badagoni-logo.svg" alt="Badagoni — Est. 2006" width="328" height="75" /></Link>
    <nav className="header-nav" aria-label="Main navigation">{links.slice(0, 3).map(link => <Link key={link.href} href={link.href} aria-current={path === link.href ? "page" : undefined}>{link.label}</Link>)}</nav>
    <nav className="header-secondary" aria-label="More about Badagoni"><Link href={cellarLink.href} className="header-cellar" aria-current={path === cellarLink.href ? "page" : undefined}>Alaverdi Cellar</Link><Link href={enologistsLink.href} className="header-enologists" aria-current={path === enologistsLink.href ? "page" : undefined}>{enologistsLink.label}</Link><Link href={newsroomLink.href} className="header-newsroom" aria-current={isNewsroom ? "page" : undefined}>{newsroomLink.label}</Link><Link href="/contact" aria-current={path === "/contact" ? "page" : undefined}>Contact</Link></nav>
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild><button className="mobile-menu-button" aria-label="Open navigation"><Menu size={23} strokeWidth={1.4} /><span>Menu</span></button></SheetTrigger>
      <SheetContent side="right" className="menu-panel">
        <SheetTitle>Badagoni</SheetTitle>
        <SheetDescription>Georgian wine. A different point of view.</SheetDescription>
        <nav aria-label="Mobile navigation"><Link href="/" onClick={() => setOpen(false)}>Home</Link>{mobileLinks.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={(path === link.href || (link.href === newsroomLink.href && isNewsroom)) ? "page" : undefined}>{link.label}</Link>)}</nav>
        <a className="menu-contact" href="mailto:office@badagoni.ge">office@badagoni.ge</a>
      </SheetContent>
    </Sheet>
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-top"><p className="footer-statement">Good wine.<br />Good company.</p><div className="footer-invitation"><p>From Kakheti to your table.</p><Link href="/contact" className="underlined-link">Let’s start a conversation <ArrowUpRight size={17} /></Link></div><nav className="footer-nav" aria-label="Footer navigation">{links.map(link => <Link key={link.href} href={link.href}>{link.label}<ArrowUpRight size={15} /></Link>)}</nav></div>
    <div className="footer-details"><div><span className="eyebrow">Our home</span><p>Zemo Khodasheni<br />Kakheti, Georgia</p></div><div><span className="eyebrow">Say hello</span><a href="mailto:office@badagoni.ge">office@badagoni.ge</a><a href="tel:+995322936243">+995 32 293 62 43</a></div><div><span className="eyebrow">Badagoni</span><p>Native Georgian grapes.<br />A contemporary perspective.</p></div></div>
    <div className="footer-legal"><span>© {new Date().getFullYear()} Badagoni</span><span>Enjoy responsibly.</span><a href="#main-content">Back to top ↑</a></div>
    <Link href="/" className="footer-wordmark" aria-label="Badagoni home"><img src="/images/badagoni-wordmark.svg" alt="Badagoni" width="328" height="40" loading="lazy" /></Link>
  </footer>;
}
