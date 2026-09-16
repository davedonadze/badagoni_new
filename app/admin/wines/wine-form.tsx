"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

  return <form className="admin-wine-form" onSubmit={handleSubmit}>
    <div className="admin-form-row">
      <label htmlFor="wine-name">Name</label>
      <input id="wine-name" value={name} onChange={e => handleNameChange(e.target.value)} required />
    </div>

    <div className="admin-form-row">
      <label htmlFor="wine-slug">Slug (used in the URL: /wines/…)</label>
      <input
        id="wine-slug"
        value={slug}
        onChange={e => { setSlug(e.target.value); setSlugTouched(true); }}
        pattern="[a-z0-9]+(-[a-z0-9]+)*"
        title="Lowercase letters, numbers, and hyphens only"
        required
      />
    </div>

    <div className="admin-form-row">
      <label htmlFor="wine-category">Primary category</label>
      <select id="wine-category" value={category} onChange={e => setCategory(e.target.value)}>
        {CATEGORY_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>

    <div className="admin-form-row">
      <span className="admin-form-label">Filter categories</span>
      <div className="admin-checkbox-group">
        {CATEGORY_OPTIONS.map(option => <label key={option} className="admin-checkbox">
          <input type="checkbox" checked={categories.includes(option)} onChange={() => toggleCategory(option)} />
          {option}
        </label>)}
      </div>
    </div>

    <div className="admin-form-row">
      <label htmlFor="wine-image">Image path (e.g. /images/wine-name.webp)</label>
      <input id="wine-image" value={image} onChange={e => setImage(e.target.value)} required />
    </div>

    <div className="admin-form-row">
      <label htmlFor="wine-style">Style (e.g. Dry, Semi-sweet, Brut)</label>
      <input id="wine-style" value={style} onChange={e => setStyle(e.target.value)} />
    </div>

    <div className="admin-form-row">
      <label htmlFor="wine-grapes">Grapes (comma-separated, e.g. Saperavi, Rkatsiteli)</label>
      <input id="wine-grapes" value={grapes} onChange={e => setGrapes(e.target.value)} />
    </div>

    <div className="admin-form-row">
      <label htmlFor="wine-alcohol">Alcohol (e.g. 14%)</label>
      <input id="wine-alcohol" value={alcohol} onChange={e => setAlcohol(e.target.value)} />
    </div>

    <div className="admin-form-row">
      <label htmlFor="wine-description">Description</label>
      <textarea id="wine-description" rows={4} value={description} onChange={e => setDescription(e.target.value)} />
    </div>

    {error && <p className="admin-form-error" role="alert">{error}</p>}

    <div className="admin-form-actions">
      <button type="submit" className="admin-primary-button" disabled={saving}>
        {saving ? "Saving…" : props.mode === "create" ? "Add wine" : "Save changes"}
      </button>
    </div>
  </form>;
}
