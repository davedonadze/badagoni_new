"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { SiteSettingsContent } from "@/lib/pages/site-settings";

export function SettingsForm({ content: initial }: { content: SiteSettingsContent }) {
  const router = useRouter();
  const [hideGeorgianLanguage, setHideGeorgianLanguage] = useState(initial.hideGeorgianLanguage);
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

    const content: SiteSettingsContent = { hideGeorgianLanguage };

    try {
      const response = await fetch("/api/admin/pages/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || "Failed to save settings.");
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

  return <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
    <div className="flex items-center justify-between rounded-[10px] border bg-card px-4 py-3">
      <p className="text-sm text-muted-foreground">Changes apply to the live site once saved.</p>
      <div className="flex items-center gap-3">
        {saved && <span className="text-sm text-muted-foreground">Saved</span>}
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>

    {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

    <Card>
      <CardHeader><CardTitle>Language</CardTitle></CardHeader>
      <CardContent>
        <label className="flex items-center justify-between gap-4">
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">Hide Georgian language switch</span>
            <span className="text-sm text-muted-foreground">Removes the EN / ქართული switcher from the footer and age gate until Georgian translations are ready. Pages already saved in Georgian, and direct /ka/... links, are unaffected.</span>
          </span>
          <Switch checked={hideGeorgianLanguage} onCheckedChange={setHideGeorgianLanguage} />
        </label>
      </CardContent>
    </Card>
  </form>;
}
