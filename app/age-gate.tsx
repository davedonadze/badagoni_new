"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { localizeHref, type Locale } from "@/lib/i18n";

const COPY: Record<Locale, { eyebrow: string; message: string; confirm: string; enter: string; invalid: string; entering: string; languageLabel: string }> = {
  en: {
    eyebrow: "Welcome to Badagoni",
    message: "Please confirm that you are of legal drinking age in your country of residence.",
    confirm: "I am of legal drinking age.",
    enter: "Enter site",
    invalid: "Please confirm that you are of legal drinking age before entering.",
    entering: "Opening Badagoni…",
    languageLabel: "Language",
  },
  ka: {
    eyebrow: "კეთილი იყოს თქვენი მობრძანება",
    message: "გთხოვთ, დაადასტუროთ, რომ მიაღწიეთ თქვენს ქვეყანაში ალკოჰოლის მოხმარებისთვის კანონით დაშვებულ ასაკს.",
    confirm: "ვადასტურებ, რომ დაშვებული ასაკის ვარ.",
    enter: "საიტზე შესვლა",
    invalid: "გასაგრძელებლად დაადასტურეთ, რომ დაშვებული ასაკის ხართ.",
    entering: "ბადაგონის საიტი იხსნება…",
    languageLabel: "ენა",
  },
};

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function AgeGate({ locale, initiallyConfirmed, hideGeorgianLanguage }: { locale: Locale; initiallyConfirmed: boolean; hideGeorgianLanguage?: boolean }) {
  const pathname = usePathname();
  const [confirmed, setConfirmed] = useState(initiallyConfirmed);
  const [leaving, setLeaving] = useState(false);
  const [checked, setChecked] = useState(false);
  const [language, setLanguage] = useState<Locale>(locale);
  const [invalid, setInvalid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (confirmed) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [confirmed]);

  useEffect(() => {
    if (confirmed) return;
    checkboxRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || !overlayRef.current) return;
      const focusable = Array.from(overlayRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [confirmed]);

  if (confirmed) return null;

  const t = COPY[language];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!checked) {
      setInvalid(true);
      checkboxRef.current?.focus();
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    try {
      await fetch("/api/age-gate/confirm", { method: "POST" });
    } catch {
      // The cookie write failing just means the gate reappears next visit -
      // not worth blocking entry over.
    }
    if (language !== locale) {
      const canonicalPath = pathname.startsWith("/ka") ? pathname.slice(3) || "/" : pathname;
      window.location.assign(localizeHref(canonicalPath, language));
      return;
    }
    setLeaving(true);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => setConfirmed(true), reducedMotion ? 0 : 500);
  }

  return <div ref={overlayRef} className={"age-gate-overlay" + (leaving ? " is-leaving" : "")} role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
    <div className="age-gate-landscape" aria-hidden="true">
      <img className="age-gate-landscape-image" src="/images/age-gate-bottle.jpg" alt="" width="1365" height="2048" fetchPriority="high" />
      <div className="age-gate-landscape-shade" />
    </div>

    <div className="age-gate">
      <header className="age-gate-header">
        <img className="age-gate-brand" src="/images/badagoni-logo.svg" alt="Badagoni — Est. 2006" width="328" height="75" />
      </header>

      <main className="age-gate-main">
        <section className="age-gate-content" aria-labelledby="age-gate-title">
          <h1 id="age-gate-title" className="age-gate-eyebrow">{t.eyebrow}</h1>
          <p id="age-gate-message" className="age-gate-message">{t.message}</p>

          <form className="age-gate-form" onSubmit={handleSubmit} aria-describedby="age-gate-message">
            <label className="age-gate-confirmation">
              <input ref={checkboxRef} type="checkbox" checked={checked} onChange={e => { setChecked(e.target.checked); setInvalid(false); }} aria-describedby="age-gate-message" />
              <span className="age-gate-checkbox-mark" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none"><path d="m3.5 8 3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              <span>{t.confirm}</span>
            </label>
            {!hideGeorgianLanguage && <label className="age-gate-language" htmlFor="age-gate-site-language">
              <span id="age-gate-language-label">{t.languageLabel}</span>
              <span className="age-gate-language-value">
                <select id="age-gate-site-language" aria-labelledby="age-gate-language-label" value={language} onChange={e => setLanguage(e.target.value as Locale)}>
                  <option value="en" lang="en">English</option>
                  <option value="ka" lang="ka">ქართული</option>
                </select>
                <svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true"><path d="m1 1 6 6 6-6" stroke="currentColor" strokeWidth="1.2" /></svg>
              </span>
            </label>}
            <button className="age-gate-enter" type="submit" disabled={submitting}>
              <span>{t.enter}</span>
              <svg className="age-gate-enter-arrow" width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true"><path d="M1 8h19M13.5 1.5 20 8l-6.5 6.5" stroke="currentColor" strokeWidth="1.2" /></svg>
            </button>
            <p className="age-gate-status" role="status" aria-live="polite">{submitting ? t.entering : invalid ? t.invalid : ""}</p>
          </form>
        </section>
      </main>
    </div>
  </div>;
}
