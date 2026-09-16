"use client";

import { ArrowUpRight, X } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";

export type WineAward = {
  name: string;
  year: string;
  image: string;
};

export function ReserveAwards({ awards }: { awards: WineAward[] }) {
  return <Sheet>
    <SheetTrigger asChild>
      <button type="button" className="underlined-link reserve-awards-trigger">Awards <ArrowUpRight size={18} aria-hidden="true" /></button>
    </SheetTrigger>
    <SheetContent side="right" className="wine-panel reserve-awards-panel" showCloseButton={false}>
      <div className="wine-panel-top">
        <span className="eyebrow">Saperavi Reserve</span>
        <SheetClose aria-label="Close awards" className="panel-close"><X size={23} strokeWidth={1.3} aria-hidden="true" /></SheetClose>
      </div>
      <SheetTitle className="reserve-awards-title">Awards</SheetTitle>
      <SheetDescription className="sr-only">Medals awarded to Badagoni Saperavi Reserve, with the year of each award.</SheetDescription>
      <ul className="reserve-awards-list">
        {awards.map((award, index) => <li key={`${award.name}-${award.year}`} className="reserve-award">
          <img className="reserve-award-medal" src={award.image} alt={`${award.name} medal`} width={240} height={240} loading={index === 0 ? "eager" : "lazy"} />
          <h3>{award.name}</h3>
          <time className="reserve-award-year" dateTime={award.year}>{award.year}</time>
        </li>)}
      </ul>
    </SheetContent>
  </Sheet>;
}
