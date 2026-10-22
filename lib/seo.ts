import type { Metadata } from "next";

export const SITE_NAME = "Badagoni";
export const SITE_URL = "https://badagoni.com";
export const DEFAULT_OG_IMAGE = "/images/hero.webp";

// Open Graph/Twitter fields aren't deep-merged with the root layout's
// defaults in Next.js - a route that sets its own openGraph/twitter must
// restate every field it wants, or those fields fall back to undefined
// rather than the parent's values. This fills them in consistently so every
// page shared to Slack/iMessage/etc. gets a thumbnail and description.
export function pageMetadata({ title, description, image }: { title: string; description?: string; image?: string }): Metadata {
  const ogTitle = `${title} — ${SITE_NAME}`;
  const ogImage = image || DEFAULT_OG_IMAGE;
  return {
    title,
    description,
    openGraph: { title: ogTitle, description, images: [{ url: ogImage }] },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: [ogImage] },
  };
}
