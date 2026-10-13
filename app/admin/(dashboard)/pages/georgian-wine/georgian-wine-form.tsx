"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BilingualField } from "../../../bilingual-field";
import { ImagePicker } from "../../../image-picker";
import { TitleStyleField } from "../../../title-style-field";
import type { Localized } from "@/db/schema";
import type { GeorgianWineContent, HeritageChapter, HeritagePhotoCredit } from "@/lib/pages/georgian-wine";
import { DEFAULT_TITLE_STYLE } from "@/lib/title-style";

const EMPTY: Localized = { en: "", ka: "" };
const EMPTY_CREDIT: HeritagePhotoCredit = { label: EMPTY, url: "", license: EMPTY, licenseUrl: "" };

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function newChapter(): HeritageChapter {
  return { id: crypto.randomUUID(), tabLabel: EMPTY, eyebrow: EMPTY, title: EMPTY, body: EMPTY, image: "", imageTitle: EMPTY, imageCaption: EMPTY, credit: null };
}

function ChapterFields({ idPrefix, chapter, onChange }: { idPrefix: string; chapter: HeritageChapter; onChange: (chapter: HeritageChapter) => void }) {
  const credit = chapter.credit ?? EMPTY_CREDIT;

  function updateCredit(patch: Partial<HeritagePhotoCredit>) {
    const next = { ...credit, ...patch };
    // A credit only gets saved once there's something to attribute -
    // otherwise the site would show an empty "photo credit" popover.
    onChange({ ...chapter, credit: next.label.en.trim() || next.url.trim() ? next : null });
  }

  return <div className="flex flex-col gap-6">
    <BilingualField id={`${idPrefix}-tab-label`} label="Tab label" value={chapter.tabLabel} onChange={tabLabel => onChange({ ...chapter, tabLabel })} />
    <BilingualField id={`${idPrefix}-eyebrow`} label="Eyebrow" value={chapter.eyebrow} onChange={eyebrow => onChange({ ...chapter, eyebrow })} />
    <BilingualField id={`${idPrefix}-title`} label="Title" value={chapter.title} onChange={title => onChange({ ...chapter, title })} />
    <TitleStyleField id={`${idPrefix}-title`} value={chapter.titleStyle ?? DEFAULT_TITLE_STYLE} onChange={titleStyle => onChange({ ...chapter, titleStyle })} defaultPx={122} defaultMobilePx={64} />
    <BilingualField id={`${idPrefix}-body`} label="Text" hint="Leave a blank line between paragraphs." multiline rows={5} value={chapter.body} onChange={body => onChange({ ...chapter, body })} />

    <ImagePicker id={`${idPrefix}-image`} label="Photo" value={chapter.image} onChange={image => onChange({ ...chapter, image })} recommendedResolution="1600px or larger on the long edge" />
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <BilingualField id={`${idPrefix}-image-title`} label="Photo caption — title" hint="e.g. Bronze figure from Melaani" value={chapter.imageTitle} onChange={imageTitle => onChange({ ...chapter, imageTitle })} />
      <BilingualField id={`${idPrefix}-image-caption`} label="Photo caption — detail" hint="e.g. Georgian National Museum" value={chapter.imageCaption} onChange={imageCaption => onChange({ ...chapter, imageCaption })} />
    </div>

    <div className="flex flex-col gap-4 rounded-[10px] border p-4">
      <span className="text-sm font-medium">Photo credit (optional)</span>
      <p className="text-sm text-muted-foreground">Shown as a small info button on the photo. Leave blank if none is needed.</p>
      <BilingualField id={`${idPrefix}-credit-label`} label="Credit text" hint="e.g. Photographer name / Wikimedia Commons" value={credit.label} onChange={label => updateCredit({ label })} />
      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-credit-url`}>Credit link</Label>
        <Input id={`${idPrefix}-credit-url`} type="url" value={credit.url} onChange={e => updateCredit({ url: e.target.value })} placeholder="https://…" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <BilingualField id={`${idPrefix}-credit-license`} label="License text" hint="e.g. CC BY-SA 4.0" value={credit.license} onChange={license => updateCredit({ license })} />
        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-credit-license-url`}>License link</Label>
          <Input id={`${idPrefix}-credit-license-url`} type="url" value={credit.licenseUrl} onChange={e => updateCredit({ licenseUrl: e.target.value })} placeholder="https://…" />
        </div>
      </div>
    </div>
  </div>;
}

export function GeorgianWineForm({ content: initial }: { content: GeorgianWineContent }) {
  const router = useRouter();
  const [eyebrow, setEyebrow] = useState(initial.heading.eyebrow);
  const [title, setTitle] = useState(initial.heading.title);
  const [titleStyle, setTitleStyle] = useState(initial.heading.titleStyle ?? DEFAULT_TITLE_STYLE);
  const [subtitle, setSubtitle] = useState(initial.heading.subtitle);
  const [chapters, setChapters] = useState<HeritageChapter[]>(initial.chapters);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timeout = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(timeout);
  }, [saved]);

  function updateChapter(index: number, chapter: HeritageChapter) {
    setChapters(current => current.map((c, i) => i === index ? chapter : c));
  }
  function addChapter() {
    setChapters(current => [...current, newChapter()]);
  }
  function removeChapter(index: number) {
    setChapters(current => current.filter((_, i) => i !== index));
  }
  function moveChapter(index: number, direction: -1 | 1) {
    setChapters(current => moveItem(current, index, direction));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const content: GeorgianWineContent = { heading: { eyebrow, title, titleStyle, subtitle }, chapters };

    try {
      const response = await fetch("/api/admin/pages/georgian-wine", {
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
      <p className="text-sm text-muted-foreground">Live at /georgian-wine once saved.</p>
      <div className="flex items-center gap-3">
        {saved && <span className="text-sm text-muted-foreground">Saved</span>}
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>

    {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

    <Card>
      <CardHeader><CardTitle>Heading</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="georgian-wine-eyebrow" label="Eyebrow" value={eyebrow} onChange={setEyebrow} />
        <BilingualField id="georgian-wine-title" label="Title" value={title} onChange={setTitle} />
        <TitleStyleField id="georgian-wine-title" value={titleStyle} onChange={setTitleStyle} defaultPx={164} defaultMobilePx={50} />
        <BilingualField id="georgian-wine-subtitle" label="Subtitle" multiline value={subtitle} onChange={setSubtitle} />
      </CardContent>
    </Card>

    <div className="flex flex-col gap-6">
      {chapters.map((chapter, i) => <Card key={chapter.id}>
        <CardHeader>
          <CardTitle>{String(i + 1).padStart(2, "0")} — {chapter.tabLabel.en || "Untitled chapter"}</CardTitle>
          <CardAction className="flex items-center gap-1">
            <Button type="button" variant="ghost" size="icon" disabled={i === 0} onClick={() => moveChapter(i, -1)} aria-label="Move chapter up"><ChevronUp className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" disabled={i === chapters.length - 1} onClick={() => moveChapter(i, 1)} aria-label="Move chapter down"><ChevronDown className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeChapter(i)} aria-label="Remove chapter"><Trash2 className="size-4 text-destructive" /></Button>
          </CardAction>
        </CardHeader>
        <CardContent><ChapterFields idPrefix={`chapter-${i}`} chapter={chapter} onChange={next => updateChapter(i, next)} /></CardContent>
      </Card>)}
      <Button type="button" variant="outline" size="sm" className="self-start" onClick={addChapter}><Plus className="size-4" />Add chapter</Button>
    </div>

    <div className="flex items-center justify-between rounded-[10px] border bg-card px-4 py-3">
      <p className="text-sm text-muted-foreground">Live at /georgian-wine once saved.</p>
      <div className="flex items-center gap-3">
        {saved && <span className="text-sm text-muted-foreground">Saved</span>}
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>
  </form>;
}
