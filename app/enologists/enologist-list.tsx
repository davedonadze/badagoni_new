"use client";

import { useEffect, useRef, useState } from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { Accordion, AccordionItem } from "@/components/ui/accordion";

type Enologist = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  image: string;
  description: string;
};

export function EnologistList({ enologists }: { enologists: Enologist[] }) {
  const [expanded, setExpanded] = useState("");
  const scrollTarget = useRef<string | null>(null);

  useEffect(() => {
    const openProfile = (id: string) => {
      if (!enologists.some((person) => person.id === id)) return;
      scrollTarget.current = id;
      setExpanded(id);
    };
    const followHash = () => openProfile(window.location.hash.slice(1));
    const followIndexLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a") : null;
      if (link) openProfile(link.hash.slice(1));
    };
    const index = document.querySelector(".enologists-index");

    followHash();
    window.addEventListener("hashchange", followHash);
    index?.addEventListener("click", followIndexLink as EventListener);
    return () => {
      window.removeEventListener("hashchange", followHash);
      index?.removeEventListener("click", followIndexLink as EventListener);
    };
  }, [enologists]);

  useEffect(() => {
    if (!expanded || scrollTarget.current !== expanded) return;
    document.getElementById(expanded)?.scrollIntoView({ block: "start" });
    scrollTarget.current = null;
  }, [expanded]);

  return <section className="enologists-selection" aria-label="Our enologists and winemakers">
    <Accordion type="single" collapsible value={expanded} onValueChange={setExpanded} className="enologists-list">
      {enologists.map((person, index) => <AccordionItem key={person.id} id={person.id} value={person.id} className="enologist-row">
        <AccordionPrimitive.Header asChild>
          <h2 className="enologist-name">
            <AccordionPrimitive.Trigger className="enologist-trigger">
              {person.firstName} {person.lastName}
            </AccordionPrimitive.Trigger>
          </h2>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content className="enologist-content">
          <div className="enologist-detail-grid">
            <div className="enologist-biography">
              <p className="eyebrow">{person.role}</p>
              <p className="enologist-description">{person.description}</p>
            </div>
            <div className="enologist-portrait">
              <img src={person.image} alt={`${person.firstName} ${person.lastName}`} width={index === 0 ? 1000 : 700} height={index === 0 ? 900 : 700} />
            </div>
          </div>
        </AccordionPrimitive.Content>
      </AccordionItem>)}
    </Accordion>
  </section>;
}
