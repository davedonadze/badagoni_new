"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualField } from "../../../bilingual-field";
import { TitleStyleField } from "../../../title-style-field";
import { createSection, type TextSection } from "@/lib/pages/generic";
import type { LegalDocument, LegalsContent } from "@/lib/pages/legals";
import { DEFAULT_TITLE_STYLE } from "@/lib/title-style";

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function LegalDocumentFields({ idPrefix, document, onChange }: { idPrefix: string; document: LegalDocument; onChange: (document: LegalDocument) => void }) {
  function updateSection(id: string, updated: TextSection) {
    onChange({ ...document, sections: document.sections.map(s => s.id === id ? updated : s) });
  }
  function removeSection(id: string) {
    onChange({ ...document, sections: document.sections.filter(s => s.id !== id) });
  }
  function moveSection(id: string, direction: -1 | 1) {
    const index = document.sections.findIndex(s => s.id === id);
    onChange({ ...document, sections: moveItem(document.sections, index, direction) });
  }

  return <div className="flex flex-col gap-6">
    <BilingualField id={`${idPrefix}-eyebrow`} label="Eyebrow" value={document.eyebrow} onChange={eyebrow => onChange({ ...document, eyebrow })} />
    <BilingualField id={`${idPrefix}-title`} label="Title" value={document.title} onChange={title => onChange({ ...document, title })} />
    <TitleStyleField id={`${idPrefix}-title`} value={document.titleStyle ?? DEFAULT_TITLE_STYLE} onChange={titleStyle => onChange({ ...document, titleStyle })} defaultPx={82} defaultMobilePx={52} />
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <BilingualField id={`${idPrefix}-revision-label`} label="Revision label" hint="e.g. Draft for review" value={document.revisionLabel} onChange={revisionLabel => onChange({ ...document, revisionLabel })} />
      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-revision-date`}>Revision date</Label>
        <Input id={`${idPrefix}-revision-date`} type="date" value={document.revisionDate} onChange={e => onChange({ ...document, revisionDate: e.target.value })} required />
      </div>
    </div>

    <div className="flex flex-col gap-4">
      {document.sections.map((section, index) => <div key={section.id} className="flex flex-col gap-4 rounded-[10px] border p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Section {index + 1}</span>
          <div className="flex items-center gap-1">
            <Button type="button" variant="ghost" size="icon" disabled={index === 0} onClick={() => moveSection(section.id, -1)} aria-label="Move section up"><ChevronUp className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" disabled={index === document.sections.length - 1} onClick={() => moveSection(section.id, 1)} aria-label="Move section down"><ChevronDown className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeSection(section.id)} aria-label="Remove section"><Trash2 className="size-4 text-destructive" /></Button>
          </div>
        </div>
        <BilingualField id={`${idPrefix}-${section.id}-heading`} label="Heading" value={section.heading} onChange={heading => updateSection(section.id, { ...section, heading })} />
        <BilingualField id={`${idPrefix}-${section.id}-body`} label="Text" hint="Leave a blank line between paragraphs." multiline rows={4} value={section.body} onChange={body => updateSection(section.id, { ...section, body })} />
      </div>)}
      <Button type="button" variant="outline" size="sm" className="self-start" onClick={() => onChange({ ...document, sections: [...document.sections, createSection("text") as TextSection] })}><Plus className="size-4" />Add section</Button>
    </div>
  </div>;
}

export function LegalsForm({ content: initial }: { content: LegalsContent }) {
  const router = useRouter();
  const [eyebrow, setEyebrow] = useState(initial.heading.eyebrow);
  const [title, setTitle] = useState(initial.heading.title);
  const [titleStyle, setTitleStyle] = useState(initial.heading.titleStyle ?? DEFAULT_TITLE_STYLE);
  const [subtitle, setSubtitle] = useState(initial.heading.subtitle);
  const [terms, setTerms] = useState(initial.terms);
  const [privacy, setPrivacy] = useState(initial.privacy);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timeout = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(timeout);
  }, [saved]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const content: LegalsContent = { heading: { eyebrow, title, titleStyle, subtitle }, terms, privacy };

    try {
      const response = await fetch("/api/admin/pages/legals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || "Failed to save page.");
        setSaving(false);
        return;
      }
      setSaved(true);
      setSaving(false);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-6">
    <div className="flex items-center justify-between rounded-[10px] border bg-card px-4 py-3">
      <p className="text-sm text-muted-foreground">Live at /legals once saved.</p>
      <div className="flex items-center gap-3">
        {saved && <span className="text-sm text-muted-foreground">Saved</span>}
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>

    {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

    <Card>
      <CardHeader><CardTitle>Heading</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="legals-eyebrow" label="Eyebrow" value={eyebrow} onChange={setEyebrow} />
        <BilingualField id="legals-title" label="Title" value={title} onChange={setTitle} />
        <TitleStyleField id="legals-title" value={titleStyle} onChange={setTitleStyle} defaultPx={164} defaultMobilePx={50} />
        <BilingualField id="legals-subtitle" label="Subtitle" multiline value={subtitle} onChange={setSubtitle} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Terms and conditions</CardTitle></CardHeader>
      <CardContent><LegalDocumentFields idPrefix="terms" document={terms} onChange={setTerms} /></CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Privacy policy</CardTitle></CardHeader>
      <CardContent><LegalDocumentFields idPrefix="privacy" document={privacy} onChange={setPrivacy} /></CardContent>
    </Card>

    <div className="flex items-center justify-between rounded-[10px] border bg-card px-4 py-3">
      <p className="text-sm text-muted-foreground">Live at /legals once saved.</p>
      <div className="flex items-center gap-3">
        {saved && <span className="text-sm text-muted-foreground">Saved</span>}
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>
  </form>;
}
