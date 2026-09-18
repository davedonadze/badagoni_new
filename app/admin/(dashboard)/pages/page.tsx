import Link from "next/link";
import { FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Registered pages: each has fixed, code-defined fields (see lib/pages/) —
// not a generic add-a-page builder. Add a new entry here once a page gets
// its own content type + admin form.
const REGISTERED_PAGES = [
  { slug: "story", title: "Story", description: "/story — heading, cover, and the four editorial sections." },
];

export default function AdminPagesList() {
  return <div className="flex flex-col gap-6">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Pages</h1>
      <p className="mt-1 text-sm text-muted-foreground">Edit the text and images on specific site pages. Layout and animations stay as built.</p>
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
    </div>
  </div>;
}
