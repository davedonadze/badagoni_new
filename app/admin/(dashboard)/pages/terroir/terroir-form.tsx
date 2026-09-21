"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualField } from "../../../bilingual-field";
import { ImagePicker } from "../../../image-picker";
import type { TerroirContent } from "@/lib/pages/terroir";

const PLACE_TITLES = ["Location 1 — Alaverdi", "Location 2 — Mukuzani", "Location 3 — Maghraani", "Location 4 — Tsinandali"];
const wideImagePreview = "flex h-20 w-36 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border bg-muted/40";

export function TerroirForm({ content: initial }: { content: TerroirContent }) {
  const router = useRouter();
  const [heading, setHeading] = useState(initial.heading);
  const [cover, setCover] = useState(initial.cover);
  const [intro, setIntro] = useState(initial.intro);
  const [listHeading, setListHeading] = useState(initial.listHeading);
  const [places, setPlaces] = useState(initial.places);
  const [closing, setClosing] = useState(initial.closing);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timeout = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(timeout);
  }, [saved]);

  function updatePlace(index: number, patch: Partial<TerroirContent["places"][number]>) {
    setPlaces(current => {
      const next = [...current] as TerroirContent["places"];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const content: TerroirContent = { heading, cover, intro, listHeading, places, closing };

    try {
      const response = await fetch("/api/admin/pages/terroir", {
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
      <p className="text-sm text-muted-foreground">Changes apply to the live /terroir page once saved.</p>
      <div className="flex items-center gap-3">
        {saved && <span className="text-sm text-muted-foreground">Saved</span>}
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>

    {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

    <Card>
      <CardHeader><CardTitle>Heading</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="terroir-eyebrow" label="Eyebrow" value={heading.eyebrow} onChange={v => setHeading({ ...heading, eyebrow: v })} />
        <BilingualField id="terroir-title" label="Title" hint="Use a new line for a manual line break." multiline rows={2} value={heading.title} onChange={v => setHeading({ ...heading, title: v })} />
        <BilingualField id="terroir-subtitle" label="Subtitle" hint="Use a new line for a manual line break." multiline rows={2} value={heading.subtitle} onChange={v => setHeading({ ...heading, subtitle: v })} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Cover media</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ImagePicker id="terroir-cover-image" label="Photo or video" value={cover.image} onChange={v => setCover({ ...cover, image: v })} previewClassName={wideImagePreview} allowVideo recommendedResolution="1920×1080px or larger, landscape" />
        <BilingualField id="terroir-cover-caption" label="Caption" value={cover.caption} onChange={v => setCover({ ...cover, caption: v })} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Intro</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="terroir-intro-eyebrow" label="Eyebrow" value={intro.eyebrow} onChange={v => setIntro({ ...intro, eyebrow: v })} />
        <BilingualField id="terroir-intro-heading" label="Heading" hint="Use a new line for a manual line break." multiline rows={2} value={intro.heading} onChange={v => setIntro({ ...intro, heading: v })} />
        <BilingualField id="terroir-intro-body" label="Body" multiline value={intro.body} onChange={v => setIntro({ ...intro, body: v })} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Vineyard list heading</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="terroir-list-label" label="Label" value={listHeading.label} onChange={v => setListHeading({ ...listHeading, label: v })} />
        <BilingualField id="terroir-list-subtitle" label="Subtitle" value={listHeading.subtitle} onChange={v => setListHeading({ ...listHeading, subtitle: v })} />
      </CardContent>
    </Card>

    {places.map((place, i) => <Card key={i}>
      <CardHeader><CardTitle>{PLACE_TITLES[i]}</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ImagePicker id={`terroir-place-${i}-image`} label="Image" value={place.image} onChange={v => updatePlace(i, { image: v })} recommendedResolution="1200×1200px or larger" />
        <BilingualField id={`terroir-place-${i}-name`} label="Name" value={place.name} onChange={v => updatePlace(i, { name: v })} />
        <BilingualField id={`terroir-place-${i}-grape`} label="Grape variety" value={place.grape} onChange={v => updatePlace(i, { grape: v })} />
        <BilingualField id={`terroir-place-${i}-text`} label="Text" multiline value={place.text} onChange={v => updatePlace(i, { text: v })} />
      </CardContent>
    </Card>)}

    <Card>
      <CardHeader><CardTitle>Closing</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ImagePicker id="terroir-closing-image" label="Photo or video" value={closing.image} onChange={v => setClosing({ ...closing, image: v })} previewClassName={wideImagePreview} allowVideo recommendedResolution="1920×1080px or larger, landscape" />
        <BilingualField id="terroir-closing-eyebrow" label="Eyebrow" value={closing.eyebrow} onChange={v => setClosing({ ...closing, eyebrow: v })} />
        <BilingualField id="terroir-closing-heading" label="Heading" hint="Use a new line for a manual line break." multiline rows={2} value={closing.heading} onChange={v => setClosing({ ...closing, heading: v })} />
      </CardContent>
    </Card>
  </form>;
}
