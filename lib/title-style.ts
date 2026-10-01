import type { CSSProperties } from "react";
import type { TitleStyle } from "@/db/schema";

export const DEFAULT_TITLE_STYLE: TitleStyle = { fontSize: null, case: null };

// `undefined` (not just `null`) covers content read from the DB before this
// field existed, which won't have the key at all despite the TS type
// claiming it's required.
export function titleStyleCss(style: TitleStyle | null | undefined): CSSProperties | undefined {
  if (!style || (style.fontSize == null && !style.case)) return undefined;
  const css: CSSProperties = {};
  if (style.fontSize != null) css.fontSize = `${style.fontSize}px`;
  if (style.case === "upper") css.textTransform = "uppercase";
  else if (style.case === "lower") css.textTransform = "lowercase";
  return css;
}
