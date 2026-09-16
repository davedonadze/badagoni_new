import type { ReactNode } from "react";
import { WineryScrollScene } from "./winery-scroll-scene";

export function WinerySection({ children }: { children: ReactNode }) {
  return <WineryScrollScene intro={
    <section className="science-section story-winery-copy" id="winery" aria-labelledby="winery-title">
      <p className="eyebrow">03 / The winery</p>
      <h2 id="winery-title">Inside<br />our winery.</h2>
      <div>
        <p>In Zemo Khodasheni, Kakheti, our winery brings Georgian grapes together with Italian winemaking technology. Fermentation takes place in stainless steel tanks, while selected wines mature in American, French and Slovenian oak.</p>
        <p>Laboratory analysis begins with the soil and continues throughout winemaking. Our own laboratory and Enosis Meraviglia in Italy provide the research and testing behind each bottle.</p>
      </div>
    </section>
  }>{children}</WineryScrollScene>;
}
