import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getPageContent } from "@/lib/pages/service";
import { ENOLOGISTS_SLUG, ENOLOGISTS_DEFAULT, type EnologistsContent } from "@/lib/pages/enologists";
import { EnologistsForm } from "./enologists-form";

export const dynamic = "force-dynamic";

export default async function EditEnologistsPage() {
  const content = (await getPageContent<EnologistsContent>(ENOLOGISTS_SLUG)) ?? ENOLOGISTS_DEFAULT;

  return <div className="flex flex-col gap-6">
    <div>
      <Link href="/admin/pages" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to pages</Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Enologists page</h1>
    </div>
    <EnologistsForm content={content} />
  </div>;
}
