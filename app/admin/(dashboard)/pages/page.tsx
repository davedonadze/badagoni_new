import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { listGenericPages } from "@/lib/pages/service";
import type { GenericPageContent } from "@/lib/pages/generic";

// Pages with their own dedicated content type + editor (see lib/pages/ and
// app/admin/(dashboard)/pages/<slug>/) — not generic template pages.
const REGISTERED_PAGES = [
  { slug: "home", title: "Home", description: "/ — hero, opening note, editorial cards, manifesto, and world section." },
  { slug: "story", title: "Story", description: "/story — heading, cover, and the four editorial sections." },
  { slug: "contact", title: "Contact", description: "/contact — heading, contact methods, and locations." },
  { slug: "terroir", title: "Terroir", description: "/terroir — heading, cover, intro, four vineyard locations, and closing." },
  { slug: "alaverdi-monastery-cellar", title: "Alaverdi Monastery Cellar", description: "/alaverdi-monastery-cellar — heading, cover, landmarks, story, qvevri tradition, and closing." },
  { slug: "enologists", title: "Enologists", description: "/enologists — heading, the four team profiles, and closing." },
];

export const dynamic = "force-dynamic";

export default async function AdminPagesList() {
  const genericPages = await listGenericPages();

  return <div className="flex flex-col gap-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pages</h1>
        <p className="mt-1 text-sm text-muted-foreground">Edit the text and images on specific site pages. Layout and animations stay as built.</p>
      </div>
      <Button asChild><Link href="/admin/pages/new"><Plus />Add page</Link></Button>
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {REGISTERED_PAGES.map(page => <Link key={page.slug} href={`/admin/pages/${page.slug}`}>
        <Card className="transition-colors hover:bg-accent/50">
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <FileText className="size-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-base">{page.title}</CardTitle>
              <CardDescription>{page.description}</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </Link>)}
      {genericPages.map(page => {
        const content = page.content as GenericPageContent;
        return <Link key={page.slug} href={`/admin/pages/${page.slug}`}>
          <Card className="transition-colors hover:bg-accent/50">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <FileText className="size-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-base">{content.title.en || page.slug}</CardTitle>
                <CardDescription>/{page.slug}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>;
      })}
    </div>
    {genericPages.length === 0 && <p className="text-sm text-muted-foreground">No custom pages yet — click "Add page" to create one, or add it to your navigation afterward from Menu.</p>}
  </div>;
}
