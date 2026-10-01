import type { CSSProperties } from "react";
import type { TitleStyle } from "@/db/schema";

export const DEFAULT_TITLE_STYLE: TitleStyle = { fontSize: null, case: null };

// `undefined` (not just `null`) covers content read from the DB before this
// field existed, which won't have the key at all despite the TS type
// claiming it's required.
//
// Case always resolves to an explicit value, defaulting to "none" rather
// than omitting the property - several of these titles have a baked-in
// `text-transform: uppercase` in CSS, which would otherwise keep
// overriding the admin's typed capitalization even when they haven't
// chosen UPPER or lower.
export function titleStyleCss(style: TitleStyle | null | undefined): CSSProperties {
  const css: CSSProperties = { textTransform: "none" };
  if (style?.fontSize != null) css.fontSize = `${style.fontSize}px`;
  if (style?.case === "upper") css.textTransform = "uppercase";
  else if (style?.case === "lower") css.textTransform = "lowercase";
  return css;
}
