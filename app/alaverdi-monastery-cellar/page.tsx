import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ParallaxMedia } from "../parallax-media";

export const metadata: Metadata = {
  title: "Alaverdi Monastery Cellar",
  description: "Discover Alaverdi Monastery’s historic wine cellar in Kakheti, its restoration with Badagoni, and the living tradition of Georgian qvevri winemaking.",
};

export default function AlaverdiMonasteryCellar() {
  return <main className="cellar-page">
    <div className="editorial-heading cellar-heading">
      <p className="eyebrow">Alaverdi / Kakheti, Georgia</p>
      <h1>Alaverdi<br />Monastery Cellar.</h1>
      <p>Inside Alaverdi’s historic walls, Georgian monastic winemaking continues in clay vessels buried in the earth.</p>
    </div>

    <figure className="cellar-cover">
      <ParallaxMedia className="cellar-cover-media" media={<img src="/images/cellar.webp" alt="A monk working among buried qvevri in the stone cellar of Alaverdi Monastery" width={1536} height={1024} fetchPriority="high" />} />
      <figcaption><span>Within the monastery walls</span><span>Alaverdi, Georgia</span></figcaption>
    </figure>

    <dl className="cellar-landmarks" aria-label="The cellar through time">
      <div><dt>Historic cellar</dt><dd>11th century</dd></div>
      <div><dt>Qvevri discovered</dt><dd>40+</dd></div>
      <div><dt>Restored with Badagoni</dt><dd>2006</dd></div>
    </dl>

    <section className="cellar-story" aria-labelledby="cellar-story-title">
      <div><p className="eyebrow">A living heritage</p><h2 id="cellar-story-title">A cellar,<br />still alive.</h2></div>
      <div className="cellar-story-copy">
        <p>In the Alazani Valley, beneath the Caucasus Mountains, Alaverdi Monastery has long been a place of faith, learning, and winemaking.</p>
        <p>Archaeological work revealed an 11th-century cellar with more than 40 qvevri. These earthenware vessels record a tradition safeguarded by generations of Georgian monks.</p>
        <h3>A new chapter in 2006.</h3>
        <p>Badagoni supported the restoration of the monastery’s cellar, enabling Alaverdi’s monks to resume winemaking there and bringing the historic space back into use.</p>
      </div>
    </section>

    <section className="cellar-qvevri" aria-labelledby="cellar-qvevri-title">
      <ParallaxMedia className="cellar-qvevri-photo" media={<img src="/images/vineyard.webp" alt="Alaverdi Monastery beside its vineyards, with the Caucasus Mountains in the distance" width={1680} height={1080} loading="lazy" />} />
      <div className="cellar-qvevri-copy">
        <p className="eyebrow">The qvevri tradition</p>
        <h2 id="cellar-qvevri-title">Earth. Grapes.<br />Time.</h2>
        <p>Qvevri are large clay vessels buried in the ground, used to ferment and store wine. At Alaverdi, this craft is kept alive through the knowledge and daily work of the monks.</p>
      </div>
    </section>

    <section className="cellar-closing" aria-labelledby="cellar-wines-title">
      <div><p className="eyebrow">From the cellar to the glass</p><h2 id="cellar-wines-title">The tradition,<br />in the glass.</h2></div>
      <div><p>The restored cellar is home to Badagoni qvevri wines including Alaverdi Tradition, Saperavi, Kisi, and Khikhvi.</p><Link href="/catalogue" className="underlined-link">Explore the collection <ArrowUpRight size={18} /></Link></div>
    </section>
  </main>;
}
