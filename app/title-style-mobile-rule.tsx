import type { TitleStyle } from "@/db/schema";
import { titleStyleMobileRule } from "@/lib/title-style";

// Renders the scoped mobile-only font-size override (see
// titleStyleMobileRule) as a <style> tag, or nothing when there's no
// desktop override to counteract. Keeps call sites to one line instead of
// computing the same rule twice (once to check, once to render).
export function TitleStyleMobileRule({ id, style, defaultMobilePx }: { id: string; style: TitleStyle | null | undefined; defaultMobilePx: number }) {
  const rule = titleStyleMobileRule(id, style, defaultMobilePx);
  return rule ? <style>{rule}</style> : null;
}
