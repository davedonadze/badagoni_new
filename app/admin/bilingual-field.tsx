"use client";
import { useState } from "react";
import { Languages } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Localized } from "@/db/schema";

// A paired English/Georgian text field. "Translate" fills the Georgian
// side from the current English text via the Claude API; the admin can
// still hand-edit the result before saving.
export function BilingualField({
  id,
  label,
  value,
  onChange,
  multiline,
}: {
  id: string;
  label: string;
  value: Localized;
  onChange: (value: Localized) => void;
  multiline?: boolean;
}) {
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const Field = multiline ? Textarea : Input;

  async function handleTranslate() {
    if (!value.en.trim()) return;
    setTranslating(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value.en }),
      });
      const data = (await response.json()) as { translation?: string; error?: string };
      if (!response.ok || !data.translation) {
        setError(data.error || "Translation failed.");
        return;
      }
      onChange({ ...value, ka: data.translation });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setTranslating(false);
    }
  }

  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div className="grid gap-1.5">
      <Label htmlFor={`${id}-en`}>{label} (English)</Label>
      <Field id={`${id}-en`} rows={multiline ? 4 : undefined} value={value.en} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...value, en: e.target.value })} />
    </div>
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={`${id}-ka`}>{label} (Georgian)</Label>
        <Button type="button" variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-xs text-[var(--admin-accent)] hover:text-[var(--admin-accent)]" onClick={handleTranslate} disabled={translating || !value.en.trim()}>
          <Languages className="size-3.5" />
          {translating ? "Translating…" : "Translate"}
        </Button>
      </div>
      <Field id={`${id}-ka`} rows={multiline ? 4 : undefined} value={value.ka} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...value, ka: e.target.value })} />
    </div>
    {error && <p className="text-sm text-destructive sm:col-span-2" role="alert">{error}</p>}
  </div>;
}
