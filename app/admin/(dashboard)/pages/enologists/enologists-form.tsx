"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualField } from "../../../bilingual-field";
import { ImagePicker } from "../../../image-picker";
import type { EnologistsContent } from "@/lib/pages/enologists";

const PERSON_TITLES = ["Person 1 — Chief enologist", "Person 2 — Chief winemaker", "Person 3", "Person 4"];

export function EnologistsForm({ content: initial }: { content: EnologistsContent }) {
  const router = useRouter();
  const [heading, setHeading] = useState(initial.heading);
  const [people, setPeople] = useState(initial.people);
  const [closing, setClosing] = useState(initial.closing);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timeout = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(timeout);
  }, [saved]);

  function updatePerson(index: number, patch: Partial<EnologistsContent["people"][number]>) {
    setPeople(current => {
      const next = [...current] as EnologistsContent["people"];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const content: EnologistsContent = { heading, people, closing };

    try {
      const response = await fetch("/api/admin/pages/enologists", {
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
      <p className="text-sm text-muted-foreground">Changes apply to the live /enologists page once saved.</p>
      <div className="flex items-center gap-3">
        {saved && <span className="text-sm text-muted-foreground">Saved</span>}
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>

    {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

    <Card>
      <CardHeader><CardTitle>Heading</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="enologists-eyebrow" label="Eyebrow" value={heading.eyebrow} onChange={v => setHeading({ ...heading, eyebrow: v })} />
        <BilingualField id="enologists-title" label="Title" value={heading.title} onChange={v => setHeading({ ...heading, title: v })} />
        <BilingualField id="enologists-subtitle" label="Subtitle" multiline value={heading.subtitle} onChange={v => setHeading({ ...heading, subtitle: v })} />
      </CardContent>
    </Card>

    {people.map((person, i) => <Card key={i}>
      <CardHeader><CardTitle>{PERSON_TITLES[i]}</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ImagePicker id={`enologist-${i}-image`} label="Portrait" value={person.image} onChange={v => updatePerson(i, { image: v })} recommendedResolution="800×900px or larger, portrait" />
        <BilingualField id={`enologist-${i}-first`} label="First name" value={person.firstName} onChange={v => updatePerson(i, { firstName: v })} />
        <BilingualField id={`enologist-${i}-last`} label="Last name" value={person.lastName} onChange={v => updatePerson(i, { lastName: v })} />
        <BilingualField id={`enologist-${i}-role`} label="Role" value={person.role} onChange={v => updatePerson(i, { role: v })} />
        <BilingualField id={`enologist-${i}-description`} label="Description" multiline value={person.description} onChange={v => updatePerson(i, { description: v })} />
      </CardContent>
    </Card>)}

    <Card>
      <CardHeader><CardTitle>Closing</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="enologists-closing-eyebrow" label="Eyebrow" value={closing.eyebrow} onChange={v => setClosing({ ...closing, eyebrow: v })} />
        <BilingualField id="enologists-closing-heading" label="Heading" value={closing.heading} onChange={v => setClosing({ ...closing, heading: v })} />
      </CardContent>
    </Card>
  </form>;
}
