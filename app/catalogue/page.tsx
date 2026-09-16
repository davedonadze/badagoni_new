import type { Metadata } from "next";
import { WineCollection } from "../wine-collection";

export const metadata: Metadata = { title: "Wine catalogue", description: "Find your expression of Georgia. Explore Badagoni red, white, rosé, qvevri and sparkling wines." };
export default function Catalogue() {
  return <main className="catalogue-page"><div className="catalogue-heading"><div className="heading-meta"><span>Badagoni / The collection</span><span>Native grapes. Distinctive characters.</span></div><h1>Find your<br /><span>character.</span></h1><p>From the depth of Saperavi to the brightness of Mtsvane.<br />A Georgian expression for every kind of gathering.</p></div><section className="catalog-section" aria-label="Wine catalogue"><WineCollection /></section></main>;
}
