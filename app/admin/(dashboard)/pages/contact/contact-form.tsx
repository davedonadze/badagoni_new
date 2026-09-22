"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualField } from "../../../bilingual-field";
import type { ContactContent } from "@/lib/pages/contact";

const METHOD_TITLES = ["Email", "Phone"];
const LOCATION_TITLES = ["Location 1 — Headquarters", "Location 2 — Winery"];

export function ContactForm({ content: initial }: { content: ContactContent }) {
  const router = useRouter();
  const [heading, setHeading] = useState(initial.heading);
  const [methods, setMethods] = useState(initial.methods);
  const [locations, setLocations] = useState(initial.locations);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timeout = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(timeout);
  }, [saved]);

  function updateMethod(index: number, patch: Partial<ContactContent["methods"][number]>) {
    setMethods(current => {
      const next = [...current] as ContactContent["methods"];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }

  function updateLocation(index: number, patch: Partial<ContactContent["locations"][number]>) {
    setLocations(current => {
      const next = [...current] as ContactContent["locations"];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const content: ContactContent = { heading, methods, locations };

    try {
      const response = await fetch("/api/admin/pages/contact", {
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
      <p className="text-sm text-muted-foreground">Changes apply to the live /contact page once saved.</p>
      <div className="flex items-center gap-3">
        {saved && <span className="text-sm text-muted-foreground">Saved</span>}
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>

    {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

    <Card>
      <CardHeader><CardTitle>Heading</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="contact-eyebrow" label="Eyebrow" value={heading.eyebrow} onChange={v => setHeading({ ...heading, eyebrow: v })} />
        <BilingualField id="contact-title" label="Title" value={heading.title} onChange={v => setHeading({ ...heading, title: v })} />
        <BilingualField id="contact-subtitle" label="Subtitle" hint="Use a new line for a manual line break." multiline rows={2} value={heading.subtitle} onChange={v => setHeading({ ...heading, subtitle: v })} />
      </CardContent>
    </Card>

    {methods.map((method, i) => <Card key={i}>
      <CardHeader><CardTitle>{METHOD_TITLES[i]}</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id={`contact-method-${i}-label`} label="Label" value={method.label} onChange={v => updateMethod(i, { label: v })} />
        <div className="grid gap-1.5">
          <Label htmlFor={`contact-method-${i}-value`}>{METHOD_TITLES[i] === "Email" ? "Email address" : "Phone number"}</Label>
          <Input id={`contact-method-${i}-value`} value={method.value} onChange={e => updateMethod(i, { value: e.target.value })} />
        </div>
      </CardContent>
    </Card>)}

    {locations.map((location, i) => <Card key={i}>
      <CardHeader><CardTitle>{LOCATION_TITLES[i]}</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id={`contact-location-${i}-title`} label="Title" value={location.title} onChange={v => updateLocation(i, { title: v })} />
        <BilingualField id={`contact-location-${i}-address`} label="Address" hint="Use a new line for each address line." multiline rows={3} value={location.address} onChange={v => updateLocation(i, { address: v })} />
        <div className="grid gap-1.5">
          <Label htmlFor={`contact-location-${i}-map`}>Map link</Label>
          <Input id={`contact-location-${i}-map`} value={location.mapUrl} onChange={e => updateLocation(i, { mapUrl: e.target.value })} />
        </div>
      </CardContent>
    </Card>)}
  </form>;
}
