"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualField } from "../../../bilingual-field";
import { ImagePicker } from "../../../image-picker";
import type { HomeContent } from "@/lib/pages/home";
import { HOME_SLUG } from "@/lib/pages/home";

const CARD_TITLES = ["Editorial card 1 — The craft", "Editorial card 2 — The place", "Editorial card 3 — The expression"];
const WORLD_TITLES = ["World row 1 — Our place", "World row 2 — Our craft", "World row 3 — Our perspective"];
const wideImagePreview = "flex h-20 w-36 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border bg-muted/40";

export function HomeForm({ content: initial }: { content: HomeContent }) {
  const router = useRouter();
  const [hero, setHero] = useState(initial.hero);
  const [opening, setOpening] = useState(initial.opening);
  const [collection, setCollection] = useState(initial.collection);
  const [editorialCards, setEditorialCards] = useState(initial.editorialCards);
  const [originInterlude, setOriginInterlude] = useState(initial.originInterlude);
  const [manifesto, setManifesto] = useState(initial.manifesto);
  const [worldSection, setWorldSection] = useState(initial.worldSection);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timeout = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(timeout);
  }, [saved]);

  function updateCard(index: number, patch: Partial<HomeContent["editorialCards"][number]>) {
    setEditorialCards(cards => {
      const next = [...cards] as HomeContent["editorialCards"];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }

  function updateWorldItem(index: number, patch: Partial<HomeContent["worldSection"]["items"][number]>) {
    setWorldSection(section => {
      const items = [...section.items] as HomeContent["worldSection"]["items"];
      items[index] = { ...items[index], ...patch };
      return { ...section, items };
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const content: HomeContent = { hero, opening, collection, editorialCards, originInterlude, manifesto, worldSection };

    try {
      const response = await fetch(`/api/admin/pages/${HOME_SLUG}`, {
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
      <p className="text-sm text-muted-foreground">Changes apply to the live homepage once saved.</p>
      <div className="flex items-center gap-3">
        {saved && <span className="text-sm text-muted-foreground">Saved</span>}
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>

    {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

    <Card>
      <CardHeader><CardTitle>Hero</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ImagePicker id="home-hero-image" label="Photo or video" value={hero.image} onChange={v => setHero({ ...hero, image: v })} previewClassName={wideImagePreview} allowVideo recommendedResolution="1920×1080px or larger, landscape" />
        <BilingualField id="home-hero-caption" label="Caption" hint="Use a new line for a manual line break." multiline rows={2} value={hero.caption} onChange={v => setHero({ ...hero, caption: v })} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Opening note</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="home-opening-heading" label="Heading" value={opening.heading} onChange={v => setOpening({ ...opening, heading: v })} />
        <BilingualField id="home-opening-body" label="Body" multiline value={opening.body} onChange={v => setOpening({ ...opening, body: v })} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Collection section</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="home-collection-heading" label="Heading" value={collection.heading} onChange={v => setCollection({ ...collection, heading: v })} />
        <BilingualField id="home-collection-subtitle" label="Subtitle" value={collection.subtitle} onChange={v => setCollection({ ...collection, subtitle: v })} />
        <p className="text-xs text-muted-foreground">The wines shown here come from the featured wine list — manage them in Wines.</p>
      </CardContent>
    </Card>

    {editorialCards.map((card, i) => <Card key={i}>
      <CardHeader><CardTitle>{CARD_TITLES[i]}</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ImagePicker id={`home-card-${i}-image`} label="Image" value={card.image} onChange={v => updateCard(i, { image: v })} recommendedResolution="1200×1200px or larger, square" />
        <BilingualField id={`home-card-${i}-label`} label="Label" value={card.label} onChange={v => updateCard(i, { label: v })} />
        <BilingualField id={`home-card-${i}-title`} label="Title" value={card.title} onChange={v => updateCard(i, { title: v })} />
        <BilingualField id={`home-card-${i}-description`} label="Description" multiline value={card.description} onChange={v => updateCard(i, { description: v })} />
      </CardContent>
    </Card>)}

    <Card>
      <CardHeader><CardTitle>Origin interlude</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="home-origin-line" label="Line" hint="Use a new line for a manual line break." multiline rows={2} value={originInterlude.line} onChange={v => setOriginInterlude({ ...originInterlude, line: v })} />
        <BilingualField id="home-origin-caption" label="Caption" value={originInterlude.caption} onChange={v => setOriginInterlude({ ...originInterlude, caption: v })} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Manifesto</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ImagePicker id="home-manifesto-image" label="Photo or video" value={manifesto.image} onChange={v => setManifesto({ ...manifesto, image: v })} previewClassName={wideImagePreview} allowVideo recommendedResolution="1920×1080px or larger, landscape" />
        <BilingualField id="home-manifesto-overlay" label="Overlay caption" value={manifesto.overlayCaption} onChange={v => setManifesto({ ...manifesto, overlayCaption: v })} />
        <BilingualField id="home-manifesto-eyebrow" label="Eyebrow" value={manifesto.eyebrow} onChange={v => setManifesto({ ...manifesto, eyebrow: v })} />
        <BilingualField id="home-manifesto-heading" label="Heading" hint="Use a new line for a manual line break." multiline rows={2} value={manifesto.heading} onChange={v => setManifesto({ ...manifesto, heading: v })} />
        <BilingualField id="home-manifesto-body" label="Body" multiline value={manifesto.body} onChange={v => setManifesto({ ...manifesto, body: v })} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>World section</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="home-world-heading" label="Heading" value={worldSection.heading} onChange={v => setWorldSection({ ...worldSection, heading: v })} />
      </CardContent>
    </Card>

    {worldSection.items.map((item, i) => <Card key={i}>
      <CardHeader><CardTitle>{WORLD_TITLES[i]}</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id={`home-world-${i}-title`} label="Small label" value={item.title} onChange={v => updateWorldItem(i, { title: v })} />
        <BilingualField id={`home-world-${i}-subtitle`} label="Heading" value={item.subtitle} onChange={v => updateWorldItem(i, { subtitle: v })} />
        <BilingualField id={`home-world-${i}-text`} label="Text" multiline value={item.text} onChange={v => updateWorldItem(i, { text: v })} />
      </CardContent>
    </Card>)}
  </form>;
}
