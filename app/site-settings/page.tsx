import { notFound } from "next/navigation";

// "site-settings" is a reserved slug (see lib/pages/generic.ts) backed by
// the same `pages` table as admin-created pages, but it holds sitewide
// config, not renderable content - this static route exists only to take
// routing precedence over app/[slug]/page.tsx's catch-all and keep it from
// ever being rendered as a public page.
export default function SiteSettingsPage() {
  notFound();
}
