"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualField } from "../../../bilingual-field";
import { ImagePicker } from "../../../image-picker";
import type { AlaverdiContent } from "@/lib/pages/alaverdi";

const LANDMARK_TITLES = ["Landmark 1", "Landmark 2", "Landmark 3"];
const wideImagePreview = "flex h-20 w-36 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border bg-muted/40";

export function AlaverdiForm({ content: initial }: { content: AlaverdiContent }) {
  const router = useRouter();
  const [heading, setHeading] = useState(initial.heading);
  const [cover, setCover] = useState(initial.cover);
  const [landmarks, setLandmarks] = useState(initial.landmarks);
  const [story, setStory] = useState(initial.story);
  const [qvevri, setQvevri] = useState(initial.qvevri);
  const [closing, setClosing] = useState(initial.closing);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timeout = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(timeout);
  }, [saved]);

  function updateLandmark(index: number, patch: Partial<AlaverdiContent["landmarks"][number]>) {
    setLandmarks(current => {
      const next = [...current] as AlaverdiContent["landmarks"];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const content: AlaverdiContent = { heading, cover, landmarks, story, qvevri, closing };

    try {
      const response = await fetch("/api/admin/pages/alaverdi-monastery-cellar", {
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
      <p className="text-sm text-muted-foreground">Changes apply to the live /alaverdi-monastery-cellar page once saved.</p>
      <div className="flex items-center gap-3">
        {saved && <span className="text-sm text-muted-foreground">Saved</span>}
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>

    {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

    <Card>
      <CardHeader><CardTitle>Heading</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="alaverdi-eyebrow" label="Eyebrow" value={heading.eyebrow} onChange={v => setHeading({ ...heading, eyebrow: v })} />
        <BilingualField id="alaverdi-title" label="Title" hint="Use a new line for a manual line break." multiline rows={2} value={heading.title} onChange={v => setHeading({ ...heading, title: v })} />
        <BilingualField id="alaverdi-subtitle" label="Subtitle" multiline value={heading.subtitle} onChange={v => setHeading({ ...heading, subtitle: v })} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Cover media</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ImagePicker id="alaverdi-cover-image" label="Photo or video" value={cover.image} onChange={v => setCover({ ...cover, image: v })} previewClassName={wideImagePreview} allowVideo recommendedResolution="1920×1080px or larger, landscape" />
        <BilingualField id="alaverdi-cover-caption1" label="Caption line 1" value={cover.captionLine1} onChange={v => setCover({ ...cover, captionLine1: v })} />
        <BilingualField id="alaverdi-cover-caption2" label="Caption line 2" value={cover.captionLine2} onChange={v => setCover({ ...cover, captionLine2: v })} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Landmarks</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        {landmarks.map((landmark, i) => <div key={i} className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-start">
          <p className="text-sm font-medium text-muted-foreground sm:col-span-2">{LANDMARK_TITLES[i]}</p>
          <BilingualField id={`alaverdi-landmark-${i}-label`} label="Label" value={landmark.label} onChange={v => updateLandmark(i, { label: v })} />
          <BilingualField id={`alaverdi-landmark-${i}-value`} label="Value" value={landmark.value} onChange={v => updateLandmark(i, { value: v })} />
        </div>)}
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Story</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="alaverdi-story-eyebrow" label="Eyebrow" value={story.eyebrow} onChange={v => setStory({ ...story, eyebrow: v })} />
        <BilingualField id="alaverdi-story-heading" label="Heading" hint="Use a new line for a manual line break." multiline rows={2} value={story.heading} onChange={v => setStory({ ...story, heading: v })} />
        <BilingualField id="alaverdi-story-p1" label="Paragraph 1" multiline value={story.paragraph1} onChange={v => setStory({ ...story, paragraph1: v })} />
        <BilingualField id="alaverdi-story-p2" label="Paragraph 2" multiline value={story.paragraph2} onChange={v => setStory({ ...story, paragraph2: v })} />
        <BilingualField id="alaverdi-story-subheading" label="Subheading" value={story.subheading} onChange={v => setStory({ ...story, subheading: v })} />
        <BilingualField id="alaverdi-story-p3" label="Paragraph 3" multiline value={story.paragraph3} onChange={v => setStory({ ...story, paragraph3: v })} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Qvevri tradition</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ImagePicker id="alaverdi-qvevri-image" label="Photo or video" value={qvevri.image} onChange={v => setQvevri({ ...qvevri, image: v })} previewClassName={wideImagePreview} allowVideo recommendedResolution="1920×1080px or larger, landscape" />
        <BilingualField id="alaverdi-qvevri-eyebrow" label="Eyebrow" value={qvevri.eyebrow} onChange={v => setQvevri({ ...qvevri, eyebrow: v })} />
        <BilingualField id="alaverdi-qvevri-heading" label="Heading" hint="Use a new line for a manual line break." multiline rows={2} value={qvevri.heading} onChange={v => setQvevri({ ...qvevri, heading: v })} />
        <BilingualField id="alaverdi-qvevri-body" label="Body" multiline value={qvevri.body} onChange={v => setQvevri({ ...qvevri, body: v })} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Closing</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="alaverdi-closing-eyebrow" label="Eyebrow" value={closing.eyebrow} onChange={v => setClosing({ ...closing, eyebrow: v })} />
        <BilingualField id="alaverdi-closing-heading" label="Heading" hint="Use a new line for a manual line break." multiline rows={2} value={closing.heading} onChange={v => setClosing({ ...closing, heading: v })} />
        <BilingualField id="alaverdi-closing-body" label="Body" multiline value={closing.body} onChange={v => setClosing({ ...closing, body: v })} />
      </CardContent>
    </Card>
  </form>;
}
