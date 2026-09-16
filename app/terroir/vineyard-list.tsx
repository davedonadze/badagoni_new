"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { Accordion, AccordionItem } from "@/components/ui/accordion";

type VineyardPlace = {
  id: string;
  name: string;
  grape: string;
  text: string;
  image: string;
  imageAlt: string;
};

export function VineyardList({ places }: { places: VineyardPlace[] }) {
  const [expanded, setExpanded] = useState("");

  return <Accordion
    type="single"
    collapsible
    value={expanded}
    onValueChange={setExpanded}
    className="vineyard-accordion"
    onKeyDown={(event) => {
      if (event.key === "Escape" && expanded) {
        event.currentTarget.querySelector<HTMLButtonElement>(".vineyard-location-trigger[data-state='open']")?.focus();
        setExpanded("");
        event.preventDefault();
      }
    }}
  >
    {places.map((place, index) => <AccordionItem key={place.id} value={place.id} className="vineyard-row">
      <AccordionPrimitive.Header className="vineyard-location-heading">
        <AccordionPrimitive.Trigger className="vineyard-location-trigger">
          <span className="row-number" aria-hidden="true">0{index + 1}</span>
          <span className="vineyard-location-name"><span>{place.name}</span><Plus size={18} strokeWidth={1.4} aria-hidden="true" /></span>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content forceMount className="vineyard-content" aria-hidden={expanded !== place.id} inert={expanded !== place.id}>
        <div className="vineyard-reveal">
          <div className="vineyard-reveal-clip">
            <div className="vineyard-detail-grid">
              <div className="vineyard-copy">
                <p>{place.text}</p>
                <div className="vineyard-grape"><span className="eyebrow">Grape varieties</span><p>{place.grape}</p></div>
              </div>
              <div className="vineyard-location-photo"><img src={place.image} alt={place.imageAlt} loading="lazy" /></div>
            </div>
          </div>
        </div>
      </AccordionPrimitive.Content>
    </AccordionItem>)}
  </Accordion>;
}
