"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualField } from "../../../bilingual-field";
import { ImagePicker } from "../../../image-picker";
import type { StoryContent } from "@/lib/pages/story";
import { STORY_SLUG } from "@/lib/pages/story";

export function StoryForm({ content: initial }: { content: StoryContent }) {
  const router = useRouter();
  const [heading, setHeading] = useState(initial.heading);
  const [cover, setCover] = useState(initial.cover);
  const [intro, setIntro] = useState(initial.intro);
  const [qvevri, setQvevri] = useState(initial.qvevri);
  const [winery, setWinery] = useState(initial.winery);
  const [science, setScience] = useState(initial.science);
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

    const content: StoryContent = { heading, cover, intro, qvevri, winery, science };

    try {
      const response = await fetch(`/api/admin/pages/${STORY_SLUG}`, {
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

  const wideImagePreview = "flex h-20 w-36 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border bg-muted/40";

  return <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-6">
    <div className="flex items-center justify-between rounded-[10px] border bg-card px-4 py-3">
      <p className="text-sm text-muted-foreground">Changes apply to the live /story page once saved.</p>
      <div className="flex items-center gap-3">
        {saved && <span className="text-sm text-muted-foreground">Saved</span>}
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>

    {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

    <Card>
      <CardHeader><CardTitle>Heading</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="story-heading-eyebrow" label="Eyebrow" value={heading.eyebrow} onChange={v => setHeading({ ...heading, eyebrow: v })} />
        <BilingualField id="story-heading-title" label="Title" hint="Use a new line for a manual line break." multiline rows={2} value={heading.title} onChange={v => setHeading({ ...heading, title: v })} />
        <BilingualField id="story-heading-subtitle" label="Subtitle" multiline rows={2} value={heading.subtitle} onChange={v => setHeading({ ...heading, subtitle: v })} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Cover media</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ImagePicker id="story-cover-image" label="Photo or video" value={cover.image} onChange={v => setCover({ ...cover, image: v })} previewClassName={wideImagePreview} allowVideo recommendedResolution="1920×1080px or larger, landscape" />
        <BilingualField id="story-cover-caption" label="Caption" value={cover.caption} onChange={v => setCover({ ...cover, caption: v })} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>01 — The beginning</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="story-intro-eyebrow" label="Eyebrow" value={intro.eyebrow} onChange={v => setIntro({ ...intro, eyebrow: v })} />
        <BilingualField id="story-intro-heading" label="Heading" hint="Use a new line for a manual line break." multiline rows={2} value={intro.heading} onChange={v => setIntro({ ...intro, heading: v })} />
        <BilingualField id="story-intro-p1" label="Paragraph 1" multiline value={intro.paragraph1} onChange={v => setIntro({ ...intro, paragraph1: v })} />
        <BilingualField id="story-intro-p2" label="Paragraph 2" multiline value={intro.paragraph2} onChange={v => setIntro({ ...intro, paragraph2: v })} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>02 — The craft</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ImagePicker id="story-qvevri-image" label="Photo or video" value={qvevri.image} onChange={v => setQvevri({ ...qvevri, image: v })} previewClassName={wideImagePreview} allowVideo recommendedResolution="1920×1080px or larger, landscape" />
        <BilingualField id="story-qvevri-eyebrow" label="Eyebrow" value={qvevri.eyebrow} onChange={v => setQvevri({ ...qvevri, eyebrow: v })} />
        <BilingualField id="story-qvevri-heading" label="Heading" hint="Use a new line for a manual line break." multiline rows={2} value={qvevri.heading} onChange={v => setQvevri({ ...qvevri, heading: v })} />
        <BilingualField id="story-qvevri-p1" label="Paragraph 1" multiline value={qvevri.paragraph1} onChange={v => setQvevri({ ...qvevri, paragraph1: v })} />
        <BilingualField id="story-qvevri-p2" label="Paragraph 2" multiline value={qvevri.paragraph2} onChange={v => setQvevri({ ...qvevri, paragraph2: v })} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>03 — The winery</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <p className="text-sm text-muted-foreground -mt-2">This section's scroll animation and layout are fixed in code — only the text below is editable.</p>
        <BilingualField id="story-winery-eyebrow" label="Eyebrow" value={winery.eyebrow} onChange={v => setWinery({ ...winery, eyebrow: v })} />
        <BilingualField id="story-winery-heading" label="Heading" hint="Use a new line for a manual line break." multiline rows={2} value={winery.heading} onChange={v => setWinery({ ...winery, heading: v })} />
        <BilingualField id="story-winery-p1" label="Paragraph 1" multiline value={winery.paragraph1} onChange={v => setWinery({ ...winery, paragraph1: v })} />
        <BilingualField id="story-winery-p2" label="Paragraph 2" multiline value={winery.paragraph2} onChange={v => setWinery({ ...winery, paragraph2: v })} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>04 — The perspective</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="story-science-eyebrow" label="Eyebrow" value={science.eyebrow} onChange={v => setScience({ ...science, eyebrow: v })} />
        <BilingualField id="story-science-heading" label="Heading" hint="Use a new line for a manual line break." multiline rows={2} value={science.heading} onChange={v => setScience({ ...science, heading: v })} />
        <BilingualField id="story-science-p" label="Paragraph" multiline value={science.paragraph} onChange={v => setScience({ ...science, paragraph: v })} />
      </CardContent>
    </Card>
  </form>;
}
