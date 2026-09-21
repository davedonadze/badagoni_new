"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualField } from "../../../bilingual-field";
import { ImagePicker } from "../../../image-picker";
import type { GenericPageContent } from "@/lib/pages/generic";
import type { Localized } from "@/db/schema";

const EMPTY_LOCALIZED: Localized = { en: "", ka: "" };
const wideImagePreview = "flex h-20 w-36 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border bg-muted/40";

export function GenericPageForm({ slug, content: initial }: { slug: string; content: GenericPageContent }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [eyebrow, setEyebrow] = useState(initial.eyebrow);
  const [subtitle, setSubtitle] = useState(initial.subtitle);
  const [hasCover, setHasCover] = useState(initial.cover !== null);
  const [coverImage, setCoverImage] = useState(initial.cover?.image ?? "");
  const [coverCaption, setCoverCaption] = useState(initial.cover?.caption ?? EMPTY_LOCALIZED);
  const [body, setBody] = useState(initial.body);
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

    const content: GenericPageContent = {
      title,
      eyebrow,
      subtitle,
      cover: hasCover && coverImage ? { image: coverImage, caption: coverCaption } : null,
      body,
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
  </form>;
}
