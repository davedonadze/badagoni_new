import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getPageContent } from "@/lib/pages/service";
import { CATALOGUE_SLUG, CATALOGUE_DEFAULT, type CatalogueContent } from "@/lib/pages/catalogue";
import { CatalogueForm } from "./catalogue-form";

export const dynamic = "force-dynamic";

export default async function EditCataloguePage() {
  const content = (await getPageContent<CatalogueContent>(CATALOGUE_SLUG)) ?? CATALOGUE_DEFAULT;

  return <div className="flex flex-col gap-6">
    <div>
      <Link href="/admin/pages" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to pages</Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Wine catalogue page</h1>
    </div>
    <CatalogueForm content={content} />
  </div>;
}
