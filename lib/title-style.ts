import type { CSSProperties } from "react";
import type { TitleStyle } from "@/db/schema";

export const DEFAULT_TITLE_STYLE: TitleStyle = { fontSize: null, fontSizeMobile: null, case: null };

// `undefined` (not just `null`) covers content read from the DB before this
// field existed, which won't have the key at all despite the TS type
// claiming it's required.
//
// Case always resolves to an explicit value, defaulting to "none" rather
// than omitting the property - several of these titles have a baked-in
// `text-transform: uppercase` in CSS, which would otherwise keep
// overriding the admin's typed capitalization even when they haven't
// chosen UPPER or lower.
//
// fontSize is desktop-only here - see titleStyleMobileRule for why mobile
// needs a separate mechanism rather than just reusing this value.
export function titleStyleCss(style: TitleStyle | null | undefined): CSSProperties {
  const css: CSSProperties = { textTransform: "none" };
  if (style?.fontSize != null) css.fontSize = `${style.fontSize}px`;
  if (style?.case === "upper") css.textTransform = "uppercase";
  else if (style?.case === "lower") css.textTransform = "lowercase";
  return css;
}

// A desktop font-size override is applied as an inline style, which beats
// the site's own responsive CSS at every breakpoint, including mobile -
// without this, a desktop override would also apply on mobile instead of
// the title's normal (usually much smaller) mobile size. When a desktop
// override is set, this returns a scoped mobile-only rule (to be rendered
// in a <style> tag next to the element with this id) that pins the title to
// its own mobile size - the admin's explicit mobile override, or the
// title's own default - overriding the inline style with `!important`
// (the only way to beat an inline style from a stylesheet rule). Returns
// null when there's no desktop override, since mobile is already correct
// via the site's own CSS in that case.
export function titleStyleMobileRule(id: string, style: TitleStyle | null | undefined, defaultMobilePx: number): string | null {
  if (style?.fontSize == null) return null;
  const px = style.fontSizeMobile ?? defaultMobilePx;
  return `@media(max-width:760px){#${id}{font-size:${px}px!important}}`;
}
