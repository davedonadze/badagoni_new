"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { TitleStyle } from "@/db/schema";
import { DEFAULT_TITLE_STYLE } from "@/lib/title-style";

// Sits next to a page's main title field. `defaultPx`/`defaultMobilePx` are
// that title's own built-in desktop/mobile sizes (shown so the admin always
// sees a concrete number, not a blank input). The two sizes are independent:
// setting a desktop size never affects mobile, and vice versa - without a
// mobile size of its own, mobile keeps using its own default rather than
// inheriting the desktop override.
export function TitleStyleField({ id, value, onChange, defaultPx, defaultMobilePx }: {
  id: string;
  value: TitleStyle;
  onChange: (value: TitleStyle) => void;
  defaultPx: number;
  defaultMobilePx: number;
}) {
  const hasOverride = value.fontSize !== null || value.fontSizeMobile !== null || value.case !== null;

  return <div className="flex flex-wrap items-end gap-4 rounded-[10px] border bg-muted/30 p-3">
    <div className="grid w-32 gap-1.5">
      <Label htmlFor={`${id}-fontsize`}>Desktop size (px)</Label>
      <Input
        id={`${id}-fontsize`}
        type="number"
        min={8}
        max={300}
        value={value.fontSize ?? defaultPx}
        onChange={e => onChange({ ...value, fontSize: e.target.value === "" ? null : Number(e.target.value) })}
      />
    </div>
    <div className="grid w-32 gap-1.5">
      <Label htmlFor={`${id}-fontsize-mobile`}>Mobile size (px)</Label>
      <Input
        id={`${id}-fontsize-mobile`}
        type="number"
        min={8}
        max={300}
        value={value.fontSizeMobile ?? defaultMobilePx}
        onChange={e => onChange({ ...value, fontSizeMobile: e.target.value === "" ? null : Number(e.target.value) })}
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
    <p className="w-full text-xs text-muted-foreground">Default sizes are {defaultPx}px desktop, {defaultMobilePx}px mobile. The two sizes are independent, and each applies only at its own screen width. Case only visibly affects English - Georgian script has no uppercase/lowercase.</p>
  </div>;
}
