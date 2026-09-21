import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getPageContent } from "@/lib/pages/service";
import { ALAVERDI_SLUG, ALAVERDI_DEFAULT, type AlaverdiContent } from "@/lib/pages/alaverdi";
import { AlaverdiForm } from "./alaverdi-form";

export const dynamic = "force-dynamic";

export default async function EditAlaverdiPage() {
  const content = (await getPageContent<AlaverdiContent>(ALAVERDI_SLUG)) ?? ALAVERDI_DEFAULT;

  return <div className="flex flex-col gap-6">
    <div>
      <Link href="/admin/pages" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to pages</Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Alaverdi Monastery Cellar page</h1>
    </div>
    <AlaverdiForm content={content} />
  </div>;
}
