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
// still hand-edit the result before saving. Label and input sit on a
// shared two-row grid (not two independent columns) so a longer label on
// one side - e.g. from the Translate button crowding it onto two lines -
// can't push that side's input out of alignment with the other.
export function BilingualField({
  id,
  label,
  hint,
  value,
  onChange,
  multiline,
  rows,
}: {
  id: string;
  label: string;
  hint?: string;
  value: Localized;
  onChange: (value: Localized) => void;
  multiline?: boolean;
  rows?: number;
}) {
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const Field = multiline ? Textarea : Input;
  const fieldRows = multiline ? (rows ?? 4) : undefined;

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

  return <div className="grid gap-1.5">
    <div className="grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2 sm:grid-rows-[auto_auto]">
      <Label htmlFor={`${id}-en`} className="sm:col-start-1 sm:row-start-1">{label} (English)</Label>
      <div className="flex items-center justify-between gap-2 sm:col-start-2 sm:row-start-1">
        <Label htmlFor={`${id}-ka`}>{label} (Georgian)</Label>
        <Button type="button" variant="ghost" size="sm" className="h-7 shrink-0 gap-1.5 px-2 text-xs text-[var(--admin-accent)] hover:text-[var(--admin-accent)]" onClick={handleTranslate} disabled={translating || !value.en.trim()}>
          <Languages className="size-3.5" />
          {translating ? "Translating…" : "Translate"}
        </Button>
      </div>
      <Field id={`${id}-en`} rows={fieldRows} value={value.en} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...value, en: e.target.value })} className="sm:col-start-1 sm:row-start-2" />
      <Field id={`${id}-ka`} rows={fieldRows} value={value.ka} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...value, ka: e.target.value })} className="sm:col-start-2 sm:row-start-2" />
    </div>
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
  </div>;
}
