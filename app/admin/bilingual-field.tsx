"use client";
import { useState } from "react";
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
  const Field = multiline ? "textarea" : "input";

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

  return <div className="admin-bilingual-field">
    <div className="admin-form-row">
      <label htmlFor={`${id}-en`}>{label} (English)</label>
      <Field id={`${id}-en`} value={value.en} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...value, en: e.target.value })} {...(multiline ? { rows: 4 } : {})} />
    </div>
    <div className="admin-form-row">
      <div className="admin-bilingual-header">
        <label htmlFor={`${id}-ka`}>{label} (Georgian)</label>
        <button type="button" className="admin-secondary-link" onClick={handleTranslate} disabled={translating || !value.en.trim()}>
          {translating ? "Translating…" : "Translate from English"}
        </button>
      </div>
      <Field id={`${id}-ka`} value={value.ka} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...value, ka: e.target.value })} {...(multiline ? { rows: 4 } : {})} />
    </div>
    {error && <p className="admin-form-error" role="alert">{error}</p>}
  </div>;
}
