"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function NewPageForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug }),
      });
      const data = (await response.json()) as { slug?: string; error?: string };
      if (!response.ok || !data.slug) {
        setError(data.error || "Failed to create page.");
        setSaving(false);
        return;
      }
      router.push(`/admin/pages/${data.slug}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return <Card className="max-w-lg">
    <form onSubmit={handleSubmit}>
      <CardHeader><CardTitle>New page</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid gap-1.5">
          <Label htmlFor="new-page-title">Title (English)</Label>
          <Input id="new-page-title" value={title} onChange={e => handleTitleChange(e.target.value)} required autoFocus />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="new-page-slug">Slug (used in the URL: /…)</Label>
          <Input
            id="new-page-slug"
            value={slug}
            onChange={e => { setSlug(e.target.value); setSlugTouched(true); }}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            title="Lowercase letters, numbers, and hyphens only"
            required
          />
        </div>
        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        <div>
          <Button type="submit" disabled={saving}>{saving ? "Creating…" : "Create page"}</Button>
        </div>
      </CardContent>
    </form>
  </Card>;
}
