// Pure formatting helper, kept separate from service.ts (which imports the
// D1 binding) so client components can import it without pulling
// server-only code into the browser bundle.
export function formatNewsDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}
