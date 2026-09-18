"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualField } from "../../bilingual-field";
import type { MenuItem, MenuLocation } from "@/lib/menu/service";

const LOCATION_OPTIONS: { value: MenuLocation; label: string }[] = [
  { value: "header_primary", label: "Header — primary" },
  { value: "header_secondary", label: "Header — secondary" },
  { value: "footer", label: "Footer" },
];

type MenuFormProps =
  | { mode: "create" }
  | { mode: "edit"; item: MenuItem };

export function MenuForm(props: MenuFormProps) {
  const router = useRouter();
  const initial = props.mode === "edit" ? props.item : undefined;

  const [label, setLabel] = useState(initial?.label ?? { en: "", ka: "" });
  const [href, setHref] = useState(initial?.href ?? "/");
  const [location, setLocation] = useState<MenuLocation>(initial?.location ?? "header_primary");
  const [order, setOrder] = useState(initial?.order ?? 0);
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

    const payload = { label, href, location, order };

    try {
      const url = props.mode === "create" ? "/api/admin/menu" : `/api/admin/menu/${props.item.id}`;
      const method = props.mode === "create" ? "POST" : "PATCH";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { item?: { id: number }; error?: string };
      if (!response.ok) {
        setError(data.error || "Failed to save menu item.");
        setSaving(false);
        return;
      }
      if (props.mode === "create" && data.item) {
        router.replace(`/admin/menu/${data.item.id}`);
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
        <CardTitle>{props.mode === "create" ? "New menu item" : "Menu item"}</CardTitle>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-muted-foreground">Saved</span>}
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : props.mode === "create" ? "Add menu item" : "Save changes"}</Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <BilingualField id="menu-label" label="Label" value={label} onChange={setLabel} />

        <div className="grid gap-1.5">
          <Label htmlFor="menu-href">Link (e.g. /story or https://…)</Label>
          <Input id="menu-href" value={href} onChange={e => setHref(e.target.value)} required />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="menu-location">Location</Label>
          <select
            id="menu-location"
            value={location}
            onChange={e => setLocation(e.target.value as MenuLocation)}
            className="h-9 border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {LOCATION_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="menu-order">Order (lower numbers appear first)</Label>
          <Input id="menu-order" type="number" value={order} onChange={e => setOrder(Number(e.target.value))} />
        </div>

        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      </CardContent>
    </form>
  </Card>;
}
