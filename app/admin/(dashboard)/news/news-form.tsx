"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualField } from "../../bilingual-field";
import { ImagePicker } from "../../image-picker";
import type { NewsArticle } from "@/lib/news/service";
import type { Localized } from "@/db/schema";

const EMPTY_LOCALIZED: Localized = { en: "", ka: "" };

type NewsFormProps =
  | { mode: "create" }
  | { mode: "edit"; article: NewsArticle };

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function NewsForm(props: NewsFormProps) {
  const router = useRouter();
  const initial = props.mode === "edit" ? props.article : undefined;

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(props.mode === "edit");
  const [title, setTitle] = useState<Localized>(initial?.title ?? EMPTY_LOCALIZED);
  const [category, setCategory] = useState<Localized>(initial?.category ?? EMPTY_LOCALIZED);
  const [date, setDate] = useState(initial?.date ?? todayIso());
  const [excerpt, setExcerpt] = useState<Localized>(initial?.excerpt ?? EMPTY_LOCALIZED);
  const [body, setBody] = useState<Localized>(initial?.body ?? EMPTY_LOCALIZED);
  const [image, setImage] = useState(initial?.image ?? "");
  const [imageFit, setImageFit] = useState<"cover" | "contain">(initial?.imageFit ?? "cover");
  const [sourceUrl, setSourceUrl] = useState(initial?.sourceUrl ?? "");
  const [relatedHref, setRelatedHref] = useState(initial?.relatedHref ?? "");
  const [relatedLabel, setRelatedLabel] = useState<Localized>(initial?.relatedLabel ?? EMPTY_LOCALIZED);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timeout = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(timeout);
  }, [saved]);

  function handleTitleChange(value: Localized) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value.en));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const payload = {
      slug,
      title,
      category,
      date,
      excerpt,
      body,
      image,
      imageFit,
      sourceUrl: sourceUrl.trim() || null,
      relatedHref: relatedHref.trim() || null,
      relatedLabel: relatedLabel.en.trim() || relatedLabel.ka.trim() ? relatedLabel : null,
    };

    try {
      const url = props.mode === "create" ? "/api/admin/news" : `/api/admin/news/${props.article.slug}`;
      const method = props.mode === "create" ? "POST" : "PATCH";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || "Failed to save article.");
        setSaving(false);
        return;
      }
      if (props.mode === "create") {
        router.replace(`/admin/news/${slug}`);
      }
      setSaved(true);
      setSaving(false);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return <Card className="max-w-3xl">
    <form onSubmit={handleSubmit}>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>{props.mode === "create" ? "New article" : "Article details"}</CardTitle>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-muted-foreground">Saved</span>}
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : props.mode === "create" ? "Add article" : "Save changes"}</Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="news-title" label="Title" value={title} onChange={handleTitleChange} />

        <div className="grid gap-1.5">
          <Label htmlFor="news-slug">Slug (used in the URL: /newsroom/…)</Label>
          <Input
            id="news-slug"
            value={slug}
            onChange={e => { setSlug(e.target.value); setSlugTouched(true); }}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            title="Lowercase letters, numbers, and hyphens only"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <BilingualField id="news-category" label="Category" hint="e.g. Awards, In the press" value={category} onChange={setCategory} />
          <div className="grid gap-1.5">
            <Label htmlFor="news-date">Date</Label>
            <Input id="news-date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
        </div>

        <BilingualField id="news-excerpt" label="Excerpt" hint="Shown on the newsroom list and as the article's summary." multiline rows={2} value={excerpt} onChange={setExcerpt} />

        <ImagePicker id="news-image" label="Photo or video" value={image} onChange={setImage} allowVideo recommendedResolution="1600×1600px or larger, square" />

        <div className="grid gap-1.5">
          <Label htmlFor="news-image-fit">Image fit on the featured story &amp; article page</Label>
          <select
            id="news-image-fit"
            value={imageFit}
            onChange={e => setImageFit(e.target.value === "contain" ? "contain" : "cover")}
            className="h-9 border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="cover">Cover (crop to fill)</option>
            <option value="contain">Contain (show whole image)</option>
          </select>
          <p className="text-xs text-muted-foreground">The newsroom grid thumbnail always crops to fill, regardless of this setting.</p>
        </div>

        <BilingualField id="news-body" label="Body" hint="Leave a blank line between paragraphs." multiline rows={8} value={body} onChange={setBody} />

        <div className="grid gap-1.5">
          <Label htmlFor="news-source-url">Source URL (optional)</Label>
          <Input id="news-source-url" type="url" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="Link to the original announcement, if any" />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="news-related-href">Related link (optional)</Label>
          <Input id="news-related-href" value={relatedHref} onChange={e => setRelatedHref(e.target.value)} placeholder="e.g. /catalogue or /wines/saperavi-reserve" />
        </div>
        {relatedHref.trim() && <BilingualField id="news-related-label" label="Related link text" value={relatedLabel} onChange={setRelatedLabel} />}

        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      </CardContent>
    </form>
  </Card>;
}
