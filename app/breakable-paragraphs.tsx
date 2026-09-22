// Renders admin-entered body text as separate <p> tags, split on blank
// lines (a double newline), for the generic page template's free-text body.
export function BreakableParagraphs({ text, className }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  return paragraphs.map((paragraph, i) => <p key={i} className={className}>{paragraph}</p>);
}
