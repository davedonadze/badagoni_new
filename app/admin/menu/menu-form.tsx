"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BilingualField } from "../bilingual-field";
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = { label, href, location, order };

    try {
      const url = props.mode === "create" ? "/api/admin/menu" : `/api/admin/menu/${props.item.id}`;
      const method = props.mode === "create" ? "POST" : "PATCH";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || "Failed to save menu item.");
        setSaving(false);
        return;
      }
      router.push("/admin/menu");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return <form className="admin-wine-form" onSubmit={handleSubmit}>
    <BilingualField id="menu-label" label="Label" value={label} onChange={setLabel} />

    <div className="admin-form-row">
      <label htmlFor="menu-href">Link (e.g. /story or https://…)</label>
      <input id="menu-href" value={href} onChange={e => setHref(e.target.value)} required />
    </div>

    <div className="admin-form-row">
      <label htmlFor="menu-location">Location</label>
      <select id="menu-location" value={location} onChange={e => setLocation(e.target.value as MenuLocation)}>
        {LOCATION_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>

    <div className="admin-form-row">
      <label htmlFor="menu-order">Order (lower numbers appear first)</label>
      <input id="menu-order" type="number" value={order} onChange={e => setOrder(Number(e.target.value))} />
    </div>

    {error && <p className="admin-form-error" role="alert">{error}</p>}

    <div className="admin-form-actions">
      <button type="submit" className="admin-primary-button" disabled={saving}>
        {saving ? "Saving…" : props.mode === "create" ? "Add menu item" : "Save changes"}
      </button>
    </div>
  </form>;
}
