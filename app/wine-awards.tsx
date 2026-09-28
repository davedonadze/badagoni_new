"use client";

import { ArrowUpRight, X } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { localize, type Locale } from "@/lib/i18n";
import type { Localized, WineAward } from "@/db/schema";
export type { WineAward };

export function WineAwards({ awards, wineName, locale, t }: { awards: WineAward[]; wineName: string; locale: Locale; t: Record<string, Localized> }) {
  return <Sheet>
    <SheetTrigger asChild>
      <button type="button" className="underlined-link reserve-awards-trigger">{localize(t["wine.awards"], locale)} <ArrowUpRight size={18} aria-hidden="true" /></button>
    </SheetTrigger>
    <SheetContent side="right" className="wine-panel reserve-awards-panel" showCloseButton={false}>
      <div className="wine-panel-top">
        <span className="eyebrow">{wineName}</span>
        <SheetClose aria-label="Close awards" className="panel-close"><X size={23} strokeWidth={1.3} aria-hidden="true" /></SheetClose>
      </div>
      <SheetTitle className="reserve-awards-title">{localize(t["wine.awards"], locale)}</SheetTitle>
      <SheetDescription className="sr-only">{localize(t["wine.awardsDescription"], locale)}</SheetDescription>
      <ul className="reserve-awards-list">
        {awards.map((award, index) => {
          const name = localize(award.name, locale);
          return <li key={`${name}-${award.year}`} className="reserve-award">
            <img className="reserve-award-medal" src={award.image} alt={`${name} medal`} width={240} height={240} loading={index === 0 ? "eager" : "lazy"} />
            <h3>{name}</h3>
            <time className="reserve-award-year" dateTime={award.year}>{award.year}</time>
          </li>;
        })}
      </ul>
    </SheetContent>
  </Sheet>;
}
