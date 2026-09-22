"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualField } from "../../../bilingual-field";
import { ImagePicker } from "../../../image-picker";
import {
  createCardItem,
  createProfileItem,
  createSection,
  type CardItem,
  type CardsSection,
  type GenericPageContent,
  type MediaSection,
  type PageSection,
  type ProfileItem,
  type ProfilesSection,
  type TextSection,
} from "@/lib/pages/generic";
import type { Localized } from "@/db/schema";

const EMPTY_LOCALIZED: Localized = { en: "", ka: "" };
const wideImagePreview = "flex h-20 w-36 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border bg-muted/40";

const SECTION_TYPES: { type: PageSection["type"]; label: string }[] = [
  { type: "text", label: "Text" },
  { type: "media", label: "Image or video" },
  { type: "cards", label: "Card list" },
  { type: "profiles", label: "Profile list" },
];

const SECTION_LABELS: Record<PageSection["type"], string> = {
  text: "Text",
  media: "Image or video",
  cards: "Card list",
  profiles: "Profile list",
};

export function GenericPageForm({ slug, content: initial }: { slug: string; content: GenericPageContent }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [eyebrow, setEyebrow] = useState(initial.eyebrow);
  const [subtitle, setSubtitle] = useState(initial.subtitle);
  const [hasCover, setHasCover] = useState(initial.cover !== null);
  const [coverImage, setCoverImage] = useState(initial.cover?.image ?? "");
  const [coverCaption, setCoverCaption] = useState(initial.cover?.caption ?? EMPTY_LOCALIZED);
  const [body, setBody] = useState(initial.body);
  const [sections, setSections] = useState<PageSection[]>(initial.sections ?? []);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timeout = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(timeout);
  }, [saved]);

  function addSection(type: PageSection["type"]) {
    setSections(prev => [...prev, createSection(type)]);
  }

  function updateSection(id: string, updated: PageSection) {
    setSections(prev => prev.map(section => section.id === id ? updated : section));
  }

  function removeSection(id: string) {
    setSections(prev => prev.filter(section => section.id !== id));
  }

  function moveSection(id: string, direction: -1 | 1) {
    setSections(prev => {
      const index = prev.findIndex(section => section.id === id);
      const target = index + direction;
      if (index === -1 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const content: GenericPageContent = {
      title,
      eyebrow,
      subtitle,
      cover: hasCover && coverImage ? { image: coverImage, caption: coverCaption } : null,
      body,
      sections,
    };

    try {
      const response = await fetch(`/api/admin/pages/${slug}`, {
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
      <p className="text-sm text-muted-foreground">Live at /{slug} once saved. Add it to the site navigation from Menu.</p>
      <div className="flex items-center gap-3">
        {saved && <span className="text-sm text-muted-foreground">Saved</span>}
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>

    {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

    <Card>
      <CardHeader><CardTitle>Heading</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="page-eyebrow" label="Eyebrow" value={eyebrow} onChange={setEyebrow} />
        <BilingualField id="page-title" label="Title" value={title} onChange={setTitle} />
        <BilingualField id="page-subtitle" label="Subtitle" multiline value={subtitle} onChange={setSubtitle} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Cover media</CardTitle>
        <label className="flex items-center gap-2 text-sm font-normal">
          <input type="checkbox" checked={hasCover} onChange={e => setHasCover(e.target.checked)} className="size-4 rounded border" />
          Show a cover banner
        </label>
      </CardHeader>
      {hasCover && <CardContent className="flex flex-col gap-6">
        <ImagePicker id="page-cover-image" label="Photo or video" value={coverImage} onChange={setCoverImage} previewClassName={wideImagePreview} allowVideo recommendedResolution="1920×1080px or larger, landscape" />
        <BilingualField id="page-cover-caption" label="Caption" value={coverCaption} onChange={setCoverCaption} />
      </CardContent>}
    </Card>

    <Card>
      <CardHeader><CardTitle>Body</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="page-body" label="Text" hint="Leave a blank line between paragraphs." multiline rows={8} value={body} onChange={setBody} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Sections</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-5">
        {sections.length === 0 && <p className="text-sm text-muted-foreground">No sections yet — add one below to build out the rest of the page.</p>}

        {sections.map((section, index) => <div key={section.id} className="flex flex-col gap-4 rounded-[10px] border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{SECTION_LABELS[section.type]}</span>
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" disabled={index === 0} onClick={() => moveSection(section.id, -1)} aria-label="Move section up"><ChevronUp className="size-4" /></Button>
              <Button type="button" variant="ghost" size="icon" disabled={index === sections.length - 1} onClick={() => moveSection(section.id, 1)} aria-label="Move section down"><ChevronDown className="size-4" /></Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeSection(section.id)} aria-label="Remove section"><Trash2 className="size-4 text-destructive" /></Button>
            </div>
          </div>
          <SectionFields section={section} onChange={updated => updateSection(section.id, updated)} />
        </div>)}

        <div className="flex flex-wrap gap-2 pt-1">
          {SECTION_TYPES.map(({ type, label }) => (
            <Button key={type} type="button" variant="outline" size="sm" onClick={() => addSection(type)}><Plus className="size-4" />{label}</Button>
          ))}
        </div>
      </CardContent>
    </Card>
  </form>;
}

function SectionFields({ section, onChange }: { section: PageSection; onChange: (section: PageSection) => void }) {
  switch (section.type) {
    case "text": return <TextSectionFields section={section} onChange={onChange} />;
    case "media": return <MediaSectionFields section={section} onChange={onChange} />;
    case "cards": return <CardsSectionFields section={section} onChange={onChange} />;
    case "profiles": return <ProfilesSectionFields section={section} onChange={onChange} />;
  }
}

function TextSectionFields({ section, onChange }: { section: TextSection; onChange: (section: TextSection) => void }) {
  return <div className="flex flex-col gap-4">
    <BilingualField id={`section-${section.id}-heading`} label="Heading" value={section.heading} onChange={heading => onChange({ ...section, heading })} />
    <BilingualField id={`section-${section.id}-body`} label="Text" hint="Leave a blank line between paragraphs." multiline rows={5} value={section.body} onChange={body => onChange({ ...section, body })} />
  </div>;
}

function MediaSectionFields({ section, onChange }: { section: MediaSection; onChange: (section: MediaSection) => void }) {
  return <div className="flex flex-col gap-4">
    <BilingualField id={`section-${section.id}-heading`} label="Heading (optional)" value={section.heading} onChange={heading => onChange({ ...section, heading })} />
    <ImagePicker id={`section-${section.id}-media`} label="Photo or video" value={section.media} onChange={media => onChange({ ...section, media })} previewClassName={wideImagePreview} allowVideo recommendedResolution="1920×1080px or larger, landscape" />
    <BilingualField id={`section-${section.id}-caption`} label="Caption" value={section.caption} onChange={caption => onChange({ ...section, caption })} />
  </div>;
}

function CardsSectionFields({ section, onChange }: { section: CardsSection; onChange: (section: CardsSection) => void }) {
  function updateCard(id: string, updated: CardItem) {
    onChange({ ...section, cards: section.cards.map(card => card.id === id ? updated : card) });
  }
  function removeCard(id: string) {
    onChange({ ...section, cards: section.cards.filter(card => card.id !== id) });
  }

  return <div className="flex flex-col gap-4">
    <BilingualField id={`section-${section.id}-heading`} label="Heading (optional)" value={section.heading} onChange={heading => onChange({ ...section, heading })} />
    {section.cards.map((card, index) => <div key={card.id} className="flex flex-col gap-3 rounded-[10px] border bg-muted/20 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Card {index + 1}</span>
        <Button type="button" variant="ghost" size="icon" onClick={() => removeCard(card.id)} aria-label="Remove card"><Trash2 className="size-4 text-destructive" /></Button>
      </div>
      <ImagePicker id={`card-${card.id}-image`} label="Photo (optional)" value={card.image} onChange={image => updateCard(card.id, { ...card, image })} recommendedResolution="At least 800×800px, square or landscape" />
      <BilingualField id={`card-${card.id}-title`} label="Title" value={card.title} onChange={title => updateCard(card.id, { ...card, title })} />
      <BilingualField id={`card-${card.id}-subtitle`} label="Subtitle" value={card.subtitle} onChange={subtitle => updateCard(card.id, { ...card, subtitle })} />
      <BilingualField id={`card-${card.id}-text`} label="Text" multiline rows={3} value={card.text} onChange={text => updateCard(card.id, { ...card, text })} />
    </div>)}
    <Button type="button" variant="outline" size="sm" className="self-start" onClick={() => onChange({ ...section, cards: [...section.cards, createCardItem()] })}><Plus className="size-4" />Add card</Button>
  </div>;
}

function ProfilesSectionFields({ section, onChange }: { section: ProfilesSection; onChange: (section: ProfilesSection) => void }) {
  function updateItem(id: string, updated: ProfileItem) {
    onChange({ ...section, items: section.items.map(item => item.id === id ? updated : item) });
  }
  function removeItem(id: string) {
    onChange({ ...section, items: section.items.filter(item => item.id !== id) });
  }

  return <div className="flex flex-col gap-4">
    <BilingualField id={`section-${section.id}-heading`} label="Heading (optional)" value={section.heading} onChange={heading => onChange({ ...section, heading })} />
    {section.items.map((item, index) => <div key={item.id} className="flex flex-col gap-3 rounded-[10px] border bg-muted/20 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Profile {index + 1}</span>
        <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(item.id)} aria-label="Remove profile"><Trash2 className="size-4 text-destructive" /></Button>
      </div>
      <ImagePicker id={`profile-${item.id}-image`} label="Photo" value={item.image} onChange={image => updateItem(item.id, { ...item, image })} recommendedResolution="Portrait, at least 800×1000px" />
      <BilingualField id={`profile-${item.id}-name`} label="Name" value={item.name} onChange={name => updateItem(item.id, { ...item, name })} />
      <BilingualField id={`profile-${item.id}-role`} label="Role" value={item.role} onChange={role => updateItem(item.id, { ...item, role })} />
      <BilingualField id={`profile-${item.id}-text`} label="Bio" multiline rows={3} value={item.text} onChange={text => updateItem(item.id, { ...item, text })} />
    </div>)}
    <Button type="button" variant="outline" size="sm" className="self-start" onClick={() => onChange({ ...section, items: [...section.items, createProfileItem()] })}><Plus className="size-4" />Add profile</Button>
  </div>;
}
