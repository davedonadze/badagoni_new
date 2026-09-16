import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Badagoni for wine enquiries and partnerships. Email or call our team, and find directions to our Tbilisi office and winery in Kakheti.",
};

export default function Contact() {
  return <main className="contact-page">
    <header className="editorial-heading contact-heading">
      <p className="eyebrow">Contact</p>
      <h1>Get in touch.</h1>
      <p>For wine enquiries, partnerships,<br />or a conversation with our team.</p>
    </header>

    <section className="contact-methods" aria-label="Contact our team">
      <div className="contact-direct-line">
        <p className="eyebrow">Email our team</p>
        <a className="contact-method-link" href="mailto:office@badagoni.ge"><span>office@badagoni.ge</span><ArrowUpRight size={22} strokeWidth={1.4} aria-hidden="true" /></a>
      </div>
      <div className="contact-direct-line">
        <p className="eyebrow">Call Badagoni</p>
        <a className="contact-method-link" href="tel:+995322936243"><span>+995 32 293 62 43</span><ArrowUpRight size={22} strokeWidth={1.4} aria-hidden="true" /></a>
      </div>
    </section>

    <section className="contact-grid contact-details" aria-label="Our locations">
        <section aria-labelledby="contact-office-title">
          <p className="eyebrow">01 / Headquarters</p>
          <h2 id="contact-office-title">Tbilisi office</h2>
          <address>JSC Badagoni<br />4 Liberty Square<br />0105 Tbilisi, Georgia</address>
          <a className="underlined-link" href="https://maps.app.goo.gl/NnR25zEn8Hakp3di6" target="_blank" rel="noreferrer">Find our office <ArrowUpRight size={17} aria-hidden="true" /></a>
        </section>
        <section aria-labelledby="contact-winery-title">
          <p className="eyebrow">02 / Winery</p>
          <h2 id="contact-winery-title">At home in Kakheti.</h2>
          <address>Village Zemo Khodasheni<br />0910 Akhmeta<br />Kakheti, Georgia</address>
          <a className="underlined-link" href="https://maps.app.goo.gl/ZW8pU79YskPUNH2G9" target="_blank" rel="noreferrer">Find our winery <ArrowUpRight size={17} aria-hidden="true" /></a>
        </section>
    </section>
  </main>;
}
