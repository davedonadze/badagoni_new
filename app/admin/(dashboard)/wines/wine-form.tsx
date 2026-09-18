"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Wine } from "@/lib/wines/service";

const CATEGORY_OPTIONS = ["red", "white", "qvevri", "rose", "sparkling", "chacha"];

type WineFormProps =
  | { mode: "create" }
  | { mode: "edit"; wine: Wine };

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function WineForm(props: WineFormProps) {
  const router = useRouter();
  const initial = props.mode === "edit" ? props.wine : undefined;

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(props.mode === "edit");
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "red");
  const [categories, setCategories] = useState<string[]>(initial?.categories ?? ["red"]);
  const [image, setImage] = useState(initial?.image ?? "");
  const [style, setStyle] = useState(initial?.style ?? "");
  const [grapes, setGrapes] = useState(initial?.grapes?.join(", ") ?? "");
  const [alcohol, setAlcohol] = useState(initial?.alcohol ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function toggleCategory(id: string) {
    setCategories(current =>
      current.includes(id) ? current.filter(c => c !== id) : [...current, id]
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      slug,
      name,
      category,
      categories: categories.length ? categories : [category],
      image,
      style: style.trim() || null,
      grapes: grapes.trim() || null,
      alcohol: alcohol.trim() || null,
      description: description.trim() || null,
    };

    try {
      const url = props.mode === "create" ? "/api/admin/wines" : `/api/admin/wines/${props.wine.slug}`;
      const method = props.mode === "create" ? "POST" : "PATCH";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || "Failed to save wine.");
        setSaving(false);
        return;
      }
      router.push("/admin/wines");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return <Card className="max-w-2xl">
    <CardContent>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-1.5">
          <Label htmlFor="wine-name">Name</Label>
          <Input id="wine-name" value={name} onChange={e => handleNameChange(e.target.value)} required />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="wine-slug">Slug (used in the URL: /wines/…)</Label>
          <Input
            id="wine-slug"
            value={slug}
            onChange={e => { setSlug(e.target.value); setSlugTouched(true); }}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            title="Lowercase letters, numbers, and hyphens only"
            required
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="wine-category">Primary category</Label>
          <select
            id="wine-category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {CATEGORY_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        <div className="grid gap-2">
          <Label>Filter categories</Label>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {CATEGORY_OPTIONS.map(option => <label key={option} className="flex items-center gap-2 text-sm font-normal">
              <input type="checkbox" checked={categories.includes(option)} onChange={() => toggleCategory(option)} className="size-4 rounded border" />
              {option}
            </label>)}
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="wine-image">Image path (e.g. /images/wine-name.webp)</Label>
          <Input id="wine-image" value={image} onChange={e => setImage(e.target.value)} required />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="wine-style">Style (e.g. Dry, Semi-sweet, Brut)</Label>
          <Input id="wine-style" value={style} onChange={e => setStyle(e.target.value)} />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="wine-grapes">Grapes (comma-separated, e.g. Saperavi, Rkatsiteli)</Label>
          <Input id="wine-grapes" value={grapes} onChange={e => setGrapes(e.target.value)} />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="wine-alcohol">Alcohol (e.g. 14%)</Label>
          <Input id="wine-alcohol" value={alcohol} onChange={e => setAlcohol(e.target.value)} />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="wine-description">Description</Label>
          <Textarea id="wine-description" rows={4} value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

        <div>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : props.mode === "create" ? "Add wine" : "Save changes"}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>;
}
