"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualField } from "../../bilingual-field";
import { ImagePicker } from "../../image-picker";
import type { Wine, WineSpec, WineAward, WineTastingNotes } from "@/lib/wines/service";
import type { Category } from "@/lib/categories/service";
import type { Localized } from "@/db/schema";

const EMPTY_LOCALIZED: Localized = { en: "", ka: "" };
const EMPTY_TASTING_NOTES: WineTastingNotes = { colour: EMPTY_LOCALIZED, aromas: EMPTY_LOCALIZED, palate: EMPTY_LOCALIZED };

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

type WineFormProps =
  | { mode: "create"; categories: Category[] }
  | { mode: "edit"; wine: Wine; categories: Category[] };

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
  const categoryOptions = props.categories;
  const defaultCategory = categoryOptions[0]?.id ?? "";

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(props.mode === "edit");
  const [name, setName] = useState<Localized>(initial?.name ?? EMPTY_LOCALIZED);
  const [category, setCategory] = useState(initial?.category ?? defaultCategory);
  const [categories, setCategories] = useState<string[]>(initial?.categories ?? (defaultCategory ? [defaultCategory] : []));
  const [image, setImage] = useState(initial?.image ?? "");
  const [style, setStyle] = useState<Localized>(initial?.style ?? EMPTY_LOCALIZED);
  const [grapes, setGrapes] = useState<Localized>(initial?.grapes ?? EMPTY_LOCALIZED);
  const [alcohol, setAlcohol] = useState(initial?.alcohol ?? "");
  const [description, setDescription] = useState<Localized>(initial?.description ?? EMPTY_LOCALIZED);
  const [specs, setSpecs] = useState<WineSpec[]>(initial?.specs ?? []);
  const [awards, setAwards] = useState<WineAward[]>(initial?.awards ?? []);
  const [tastingNotes, setTastingNotes] = useState<WineTastingNotes>(initial?.tastingNotes ?? EMPTY_TASTING_NOTES);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timeout = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(timeout);
  }, [saved]);

  function addSpec() {
    setSpecs(current => [...current, { label: EMPTY_LOCALIZED, value: EMPTY_LOCALIZED }]);
  }
  function updateSpec(index: number, patch: Partial<WineSpec>) {
    setSpecs(current => current.map((spec, i) => i === index ? { ...spec, ...patch } : spec));
  }
  function removeSpec(index: number) {
    setSpecs(current => current.filter((_, i) => i !== index));
  }
  function moveSpec(index: number, direction: -1 | 1) {
    setSpecs(current => moveItem(current, index, direction));
  }

  function addAward() {
    setAwards(current => [...current, { image: "", name: EMPTY_LOCALIZED, year: "" }]);
  }
  function updateAward(index: number, patch: Partial<WineAward>) {
    setAwards(current => current.map((award, i) => i === index ? { ...award, ...patch } : award));
  }
  function removeAward(index: number) {
    setAwards(current => current.filter((_, i) => i !== index));
  }
  function moveAward(index: number, direction: -1 | 1) {
    setAwards(current => moveItem(current, index, direction));
  }

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
    setSaved(false);

    const payload = {
      slug,
      name,
      category,
      categories: categories.length ? categories : [category],
      image,
      style: style.en.trim() || style.ka.trim() ? style : null,
      grapes: grapes.en.trim() || grapes.ka.trim() ? grapes : null,
      alcohol: alcohol.trim() || null,
      description: description.en.trim() || description.ka.trim() ? description : null,
      specs: specs.filter(spec => (spec.label.en.trim() || spec.label.ka.trim()) && (spec.value.en.trim() || spec.value.ka.trim())),
      awards: awards.filter(award => award.image.trim() && (award.name.en.trim() || award.name.ka.trim()) && award.year.trim()),
      tastingNotes: Object.values(tastingNotes).some(field => field.en.trim() || field.ka.trim()) ? tastingNotes : null,
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
      if (props.mode === "create") {
        router.replace(`/admin/wines/${slug}`);
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
        <CardTitle>{props.mode === "create" ? "New wine" : "Wine details"}</CardTitle>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-muted-foreground">Saved</span>}
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : props.mode === "create" ? "Add wine" : "Save changes"}</Button>
        </div>
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

        <ImagePicker id="wine-image" label="Bottle image" value={image} onChange={setImage} recommendedResolution="600×2000px, portrait, transparent background" />

        <div className="grid gap-1.5">
          <Label htmlFor="wine-category">Primary category</Label>
          <select
            id="wine-category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="h-9 border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {categoryOptions.map(option => <option key={option.id} value={option.id}>{option.label.en}</option>)}
          </select>
        </div>

        <div className="grid gap-2">
          <Label>Filter categories</Label>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {categoryOptions.map(option => <label key={option.id} className="flex items-center gap-2 text-sm font-normal">
              <input type="checkbox" checked={categories.includes(option.id)} onChange={() => toggleCategory(option.id)} className="size-4 rounded border" />
              {option.label.en}
            </label>)}
          </div>
          {categoryOptions.length === 0 && <p className="text-sm text-muted-foreground">No categories yet — <a href="/admin/categories/new" className="underline underline-offset-4">add one first</a>.</p>}
        </div>

        <BilingualField id="wine-style" label="Style" value={style} onChange={setStyle} />

        <BilingualField id="wine-grapes" label="Grapes" hint="Comma-separated, e.g. Saperavi, Rkatsiteli" value={grapes} onChange={setGrapes} />

        <div className="grid gap-1.5">
          <Label htmlFor="wine-alcohol">Alcohol (e.g. 14%)</Label>
          <Input id="wine-alcohol" value={alcohol} onChange={e => setAlcohol(e.target.value)} />
        </div>

        <BilingualField id="wine-description" label="Description" value={description} onChange={setDescription} multiline />

        <div className="grid gap-3">
          <Label>Additional specs</Label>
          <p className="text-sm text-muted-foreground">Shown below Origin, Grape variety, and Alcohol on the wine detail panel — e.g. Ageing, Vintage, Serving temperature.</p>
          {specs.map((spec, i) => <div key={i} className="flex flex-col gap-4 rounded-[10px] border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Spec {i + 1}</span>
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon" disabled={i === 0} onClick={() => moveSpec(i, -1)} aria-label="Move spec up"><ChevronUp className="size-4" /></Button>
                <Button type="button" variant="ghost" size="icon" disabled={i === specs.length - 1} onClick={() => moveSpec(i, 1)} aria-label="Move spec down"><ChevronDown className="size-4" /></Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeSpec(i)} aria-label="Remove spec"><Trash2 className="size-4 text-destructive" /></Button>
              </div>
            </div>
            <BilingualField id={`wine-spec-${i}-label`} label="Label" hint="e.g. Ageing" value={spec.label} onChange={label => updateSpec(i, { label })} />
            <BilingualField id={`wine-spec-${i}-value`} label="Value" hint="e.g. 12 months in French oak" value={spec.value} onChange={value => updateSpec(i, { value })} />
          </div>)}
          <Button type="button" variant="outline" size="sm" className="self-start" onClick={addSpec}><Plus className="size-4" />Add spec</Button>
        </div>

        <div className="grid gap-3">
          <Label>Awards</Label>
          <p className="text-sm text-muted-foreground">Medals and awards shown in the "Awards" panel on the wine's detail page.</p>
          {awards.map((award, i) => <div key={i} className="flex flex-col gap-4 rounded-[10px] border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Award {i + 1}</span>
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon" disabled={i === 0} onClick={() => moveAward(i, -1)} aria-label="Move award up"><ChevronUp className="size-4" /></Button>
                <Button type="button" variant="ghost" size="icon" disabled={i === awards.length - 1} onClick={() => moveAward(i, 1)} aria-label="Move award down"><ChevronDown className="size-4" /></Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeAward(i)} aria-label="Remove award"><Trash2 className="size-4 text-destructive" /></Button>
              </div>
            </div>
            <ImagePicker id={`wine-award-${i}-image`} label="Award logo" value={award.image} onChange={image => updateAward(i, { image })} recommendedResolution="240×240px, square" />
            <BilingualField id={`wine-award-${i}-name`} label="Award title" hint="e.g. Decanter World Wine Awards — Platinum" value={award.name} onChange={name => updateAward(i, { name })} />
            <div className="grid gap-1.5">
              <Label htmlFor={`wine-award-${i}-year`}>Year</Label>
              <Input id={`wine-award-${i}-year`} value={award.year} onChange={e => updateAward(i, { year: e.target.value })} />
            </div>
          </div>)}
          <Button type="button" variant="outline" size="sm" className="self-start" onClick={addAward}><Plus className="size-4" />Add award</Button>
        </div>

        <div className="grid gap-3">
          <Label>Tasting notes</Label>
          <p className="text-sm text-muted-foreground">Shown in the "In the glass." section on the wine's detail page. Leave blank to hide the section.</p>
          <BilingualField id="wine-tasting-colour" label="Colour" value={tastingNotes.colour} onChange={colour => setTastingNotes({ ...tastingNotes, colour })} />
          <BilingualField id="wine-tasting-aromas" label="Aromas" value={tastingNotes.aromas} onChange={aromas => setTastingNotes({ ...tastingNotes, aromas })} />
          <BilingualField id="wine-tasting-palate" label="Palate" value={tastingNotes.palate} onChange={palate => setTastingNotes({ ...tastingNotes, palate })} />
        </div>

        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

        <div className="flex items-center justify-end gap-3 rounded-[10px] border bg-card px-4 py-3">
          {saved && <span className="text-sm text-muted-foreground">Saved</span>}
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : props.mode === "create" ? "Add wine" : "Save changes"}</Button>
        </div>
      </CardContent>
    </form>
  </Card>;
}
