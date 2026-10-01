"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { TitleStyle } from "@/db/schema";
import { DEFAULT_TITLE_STYLE } from "@/lib/title-style";

// Sits next to a page's main title field. `defaultPx` is that title's own
// built-in size (shown so the admin always sees a concrete number, not a
// blank input) - saving a size here replaces the title's responsive
// scaling with a single fixed size on every screen, including mobile.
export function TitleStyleField({ id, value, onChange, defaultPx }: {
  id: string;
  value: TitleStyle;
  onChange: (value: TitleStyle) => void;
  defaultPx: number;
}) {
  const hasOverride = value.fontSize !== null || value.case !== null;

  return <div className="flex flex-wrap items-end gap-4 rounded-[10px] border bg-muted/30 p-3">
    <div className="grid w-28 gap-1.5">
      <Label htmlFor={`${id}-fontsize`}>Title size (px)</Label>
      <Input
        id={`${id}-fontsize`}
        type="number"
        min={8}
        max={300}
        value={value.fontSize ?? defaultPx}
        onChange={e => onChange({ ...value, fontSize: e.target.value === "" ? null : Number(e.target.value) })}
      />
    </div>
    <div className="grid gap-1.5">
      <Label>Case</Label>
      <div className="flex gap-1">
        <Button type="button" variant={value.case === null ? "default" : "outline"} size="sm" onClick={() => onChange({ ...value, case: null })}>Default</Button>
        <Button type="button" variant={value.case === "upper" ? "default" : "outline"} size="sm" onClick={() => onChange({ ...value, case: "upper" })}>UPPER</Button>
        <Button type="button" variant={value.case === "lower" ? "default" : "outline"} size="sm" onClick={() => onChange({ ...value, case: "lower" })}>lower</Button>
      </div>
    </div>
    {hasOverride && <Button type="button" variant="ghost" size="sm" onClick={() => onChange(DEFAULT_TITLE_STYLE)}>Reset to default</Button>}
    <p className="w-full text-xs text-muted-foreground">Default size is {defaultPx}px. A size set here applies on every screen, including mobile, instead of scaling with it. Case only visibly affects English - Georgian script has no uppercase/lowercase.</p>
  </div>;
}
