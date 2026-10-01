"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualField } from "../../../bilingual-field";
import { ImagePicker } from "../../../image-picker";
import { TitleStyleField } from "../../../title-style-field";
import type { AlaverdiContent } from "@/lib/pages/alaverdi";
import { DEFAULT_TITLE_STYLE } from "@/lib/title-style";

const wideImagePreview = "flex h-20 w-36 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border bg-muted/40";

export function AlaverdiForm({ content: initial }: { content: AlaverdiContent }) {
  const router = useRouter();
  const [heading, setHeading] = useState(initial.heading);
  const [cover, setCover] = useState(initial.cover);
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const content: AlaverdiContent = { heading, cover, story, qvevri, closing };

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
        <TitleStyleField id="alaverdi-title" value={heading.titleStyle ?? DEFAULT_TITLE_STYLE} onChange={v => setHeading({ ...heading, titleStyle: v })} defaultPx={164} />
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
        <p className="text-sm text-muted-foreground">Full-bleed photo with the heading overlaid; the link below it (to the Georgian wine page) is fixed in code.</p>
        <ImagePicker id="alaverdi-qvevri-image" label="Photo or video" value={qvevri.image} onChange={v => setQvevri({ ...qvevri, image: v })} previewClassName={wideImagePreview} allowVideo recommendedResolution="1920×1080px or larger, landscape" />
        <BilingualField id="alaverdi-qvevri-heading" label="Heading" value={qvevri.heading} onChange={v => setQvevri({ ...qvevri, heading: v })} />
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

    <div className="flex items-center justify-between rounded-[10px] border bg-card px-4 py-3">
      <p className="text-sm text-muted-foreground">Changes apply to the live /alaverdi-monastery-cellar page once saved.</p>
      <div className="flex items-center gap-3">
        {saved && <span className="text-sm text-muted-foreground">Saved</span>}
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>
  </form>;
}
