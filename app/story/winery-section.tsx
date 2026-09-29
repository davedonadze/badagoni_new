import type { ReactNode } from "react";
import { WineryScrollScene } from "./winery-scroll-scene";
import { BreakableText } from "../breakable-text";

export function WinerySection({ image, eyebrow, heading, paragraph1, paragraph2, children }: {
  image: string;
  eyebrow: string;
  heading: string;
  paragraph1: string;
  paragraph2: string;
  children: ReactNode;
}) {
  return <WineryScrollScene
    image={{ src: image, alt: "Badagoni winery in Zemo Khodasheni, with its illuminated sign and glass facade at dusk", title: "Badagoni winery", caption: "Zemo Khodasheni / Kakheti, Georgia" }}
    intro={
    <section className="science-section story-winery-copy" id="winery" aria-labelledby="winery-title">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id="winery-title"><BreakableText text={heading} /></h2>
      <div>
        <p>{paragraph1}</p>
        <p>{paragraph2}</p>
      </div>
    </section>
  }>{children}</WineryScrollScene>;
}
