import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getPageContent } from "@/lib/pages/service";
import { TERROIR_SLUG, TERROIR_DEFAULT, type TerroirContent } from "@/lib/pages/terroir";
import { TerroirForm } from "./terroir-form";

export const dynamic = "force-dynamic";

export default async function EditTerroirPage() {
  const content = (await getPageContent<TerroirContent>(TERROIR_SLUG)) ?? TERROIR_DEFAULT;

  return <div className="flex flex-col gap-6">
    <div>
      <Link href="/admin/pages" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to pages</Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Terroir page</h1>
    </div>
    <TerroirForm content={content} />
  </div>;
}
