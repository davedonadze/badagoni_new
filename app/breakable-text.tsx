import { Fragment } from "react";

// Renders admin-entered text with manual line breaks (typed as literal
// newlines in a textarea) as <br /> tags, for headings that want a specific
// wrap point rather than the browser's natural word-wrap.
export function BreakableText({ text }: { text: string }) {
  const lines = text.split("\n");
  return lines.map((line, i) => <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>);
}
