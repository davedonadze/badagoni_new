"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualField } from "../../bilingual-field";
import { UI_STRING_GROUPS } from "@/lib/ui-strings/defaults";
import type { Localized } from "@/db/schema";

function humanizeKey(key: string): string {
  const [, name] = key.split(".");
  return (name ?? key)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/(\d+)/g, " $1")
    .replace(/^./, c => c.toUpperCase())
    .trim();
}

export function TranslationsForm({ strings: initial }: { strings: Record<string, Localized> }) {
  const router = useRouter();
  const [strings, setStrings] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [translatingAll, setTranslatingAll] = useState(false);
  const [translateProgress, setTranslateProgress] = useState<{ done: number; total: number } | null>(null);

  useEffect(() => {
    if (!saved) return;
    const timeout = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(timeout);
  }, [saved]);

  function updateKey(key: string, value: Localized) {
    setStrings(current => ({ ...current, [key]: value }));
  }

  async function translateAll() {
    const keys = Object.keys(strings).filter(key => strings[key].en.trim() && !strings[key].ka.trim());
    if (keys.length === 0) return;
    setTranslatingAll(true);
    setTranslateProgress({ done: 0, total: keys.length });
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      try {
        const response = await fetch("/api/admin/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: strings[key].en }),
        });
        const data = (await response.json()) as { translation?: string };
        if (response.ok && data.translation) {
          setStrings(current => ({ ...current, [key]: { ...current[key], ka: data.translation! } }));
        }
      } catch {
        // Skip this one; the per-row Translate button can retry it individually.
      }
      setTranslateProgress({ done: i + 1, total: keys.length });
    }
    setTranslatingAll(false);
    setTranslateProgress(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const response = await fetch("/api/admin/ui-strings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(strings),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || "Failed to save translations.");
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

  const untranslatedCount = Object.values(strings).filter(v => v.en.trim() && !v.ka.trim()).length;

  return <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-6">
    <div className="flex items-center justify-between rounded-[10px] border bg-card px-4 py-3">
      <p className="text-sm text-muted-foreground">
        {translateProgress ? `Translating ${translateProgress.done}/${translateProgress.total}…` : `${untranslatedCount} of ${Object.keys(strings).length} without a Georgian translation.`}
      </p>
      <div className="flex items-center gap-3">
        {saved && <span className="text-sm text-muted-foreground">Saved</span>}
        <Button type="button" variant="outline" onClick={translateAll} disabled={translatingAll || untranslatedCount === 0}>
          <Languages className="size-4" />
          {translatingAll ? "Translating…" : "Translate all"}
        </Button>
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>

    {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

    {UI_STRING_GROUPS.map(group => <Card key={group.title}>
      <CardHeader><CardTitle>{group.title}</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        {group.keys.map(key => strings[key] && <BilingualField key={key} id={`ui-string-${key}`} label={humanizeKey(key)} value={strings[key]} onChange={value => updateKey(key, value)} />)}
      </CardContent>
    </Card>)}
  </form>;
}
