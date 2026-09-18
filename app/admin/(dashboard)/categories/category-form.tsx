"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualField } from "../../bilingual-field";
import type { Category } from "@/lib/categories/service";
import type { Localized } from "@/db/schema";

const EMPTY_LOCALIZED: Localized = { en: "", ka: "" };

type CategoryFormProps =
  | { mode: "create" }
  | { mode: "edit"; category: Category };

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CategoryForm(props: CategoryFormProps) {
  const router = useRouter();
  const initial = props.mode === "edit" ? props.category : undefined;

  const [id, setId] = useState(initial?.id ?? "");
  const [idTouched, setIdTouched] = useState(props.mode === "edit");
  const [label, setLabel] = useState<Localized>(initial?.label ?? EMPTY_LOCALIZED);
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timeout = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(timeout);
  }, [saved]);

  function handleLabelChange(value: Localized) {
    setLabel(value);
    if (!idTouched) setId(slugify(value.en));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const payload = { id, label, order };

    try {
      const url = props.mode === "create" ? "/api/admin/categories" : `/api/admin/categories/${props.category.id}`;
      const method = props.mode === "create" ? "POST" : "PATCH";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || "Failed to save category.");
        setSaving(false);
        return;
      }
      if (props.mode === "create") {
        router.replace(`/admin/categories/${id}`);
      }
      setSaved(true);
      setSaving(false);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return <Card className="max-w-2xl">
    <form onSubmit={handleSubmit}>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>{props.mode === "create" ? "New category" : "Category"}</CardTitle>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-muted-foreground">Saved</span>}
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : props.mode === "create" ? "Add category" : "Save changes"}</Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="category-label" label="Label" value={label} onChange={handleLabelChange} />

        <div className="grid gap-1.5">
          <Label htmlFor="category-id">ID (used internally, e.g. in wine categories)</Label>
          <Input
            id="category-id"
            value={id}
            onChange={e => { setId(e.target.value); setIdTouched(true); }}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            title="Lowercase letters, numbers, and hyphens only"
            disabled={props.mode === "edit"}
            required
          />
          {props.mode === "edit" && <p className="text-xs text-muted-foreground">Can't be changed after creation — wines already reference this ID.</p>}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="category-order">Order (lower numbers appear first)</Label>
          <Input id="category-order" type="number" value={order} onChange={e => setOrder(Number(e.target.value))} />
        </div>

        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      </CardContent>
    </form>
  </Card>;
}
