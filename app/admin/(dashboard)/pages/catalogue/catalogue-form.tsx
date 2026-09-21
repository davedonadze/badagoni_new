"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualField } from "../../../bilingual-field";
import type { CatalogueContent } from "@/lib/pages/catalogue";

export function CatalogueForm({ content: initial }: { content: CatalogueContent }) {
  const router = useRouter();
  const [eyebrow, setEyebrow] = useState(initial.eyebrow);
  const [tagline, setTagline] = useState(initial.tagline);
  const [title, setTitle] = useState(initial.title);
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

    const content: CatalogueContent = { eyebrow, tagline, title, body };

    try {
      const response = await fetch("/api/admin/pages/catalogue", {
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
      <p className="text-sm text-muted-foreground">Changes apply to the live /catalogue page once saved. The wine grid itself is managed from Wines.</p>
      <div className="flex items-center gap-3">
        {saved && <span className="text-sm text-muted-foreground">Saved</span>}
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>

    {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

    <Card>
      <CardHeader><CardTitle>Heading</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="catalogue-eyebrow" label="Eyebrow" value={eyebrow} onChange={setEyebrow} />
        <BilingualField id="catalogue-tagline" label="Tagline" value={tagline} onChange={setTagline} />
        <BilingualField id="catalogue-title" label="Title" hint="Use a new line for each indented line." multiline rows={2} value={title} onChange={setTitle} />
        <BilingualField id="catalogue-body" label="Body" hint="Use a new line for a manual line break." multiline rows={2} value={body} onChange={setBody} />
      </CardContent>
    </Card>
  </form>;
}
