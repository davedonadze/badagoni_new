"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualField } from "../../bilingual-field";
import { ImagePicker } from "./image-picker";
import type { Wine } from "@/lib/wines/service";
import type { Localized } from "@/db/schema";

const CATEGORY_OPTIONS = ["red", "white", "qvevri", "rose", "sparkling", "chacha"];
const EMPTY_LOCALIZED: Localized = { en: "", ka: "" };

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
  const [name, setName] = useState<Localized>(initial?.name ?? EMPTY_LOCALIZED);
  const [category, setCategory] = useState(initial?.category ?? "red");
  const [categories, setCategories] = useState<string[]>(initial?.categories ?? ["red"]);
  const [image, setImage] = useState(initial?.image ?? "");
  const [style, setStyle] = useState<Localized>(initial?.style ?? EMPTY_LOCALIZED);
  const [grapes, setGrapes] = useState(initial?.grapes?.join(", ") ?? "");
  const [alcohol, setAlcohol] = useState(initial?.alcohol ?? "");
  const [description, setDescription] = useState<Localized>(initial?.description ?? EMPTY_LOCALIZED);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleNameChange(value: Localized) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value.en));
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
      style: style.en.trim() || style.ka.trim() ? style : null,
      grapes: grapes.trim() || null,
      alcohol: alcohol.trim() || null,
      description: description.en.trim() || description.ka.trim() ? description : null,
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

  return <Card className="max-w-3xl">
    <form onSubmit={handleSubmit}>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>{props.mode === "create" ? "New wine" : "Wine details"}</CardTitle>
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : props.mode === "create" ? "Add wine" : "Save changes"}</Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="wine-name" label="Name" value={name} onChange={handleNameChange} />

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

        <ImagePicker id="wine-image" label="Bottle image" value={image} onChange={setImage} />

        <div className="grid gap-1.5">
          <Label htmlFor="wine-category">Primary category</Label>
          <select
            id="wine-category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="h-9 border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
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

        <BilingualField id="wine-style" label="Style" value={style} onChange={setStyle} />

        <div className="grid gap-1.5">
          <Label htmlFor="wine-grapes">Grapes (comma-separated, e.g. Saperavi, Rkatsiteli)</Label>
          <Input id="wine-grapes" value={grapes} onChange={e => setGrapes(e.target.value)} />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="wine-alcohol">Alcohol (e.g. 14%)</Label>
          <Input id="wine-alcohol" value={alcohol} onChange={e => setAlcohol(e.target.value)} />
        </div>

        <BilingualField id="wine-description" label="Description" value={description} onChange={setDescription} multiline />

        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      </CardContent>
    </form>
  </Card>;
}
