import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getPageContent } from "@/lib/pages/service";
import { GEORGIAN_WINE_SLUG, GEORGIAN_WINE_DEFAULT, type GeorgianWineContent } from "@/lib/pages/georgian-wine";
import { GeorgianWineForm } from "./georgian-wine-form";

export const dynamic = "force-dynamic";

export default async function EditGeorgianWinePage() {
  const content = (await getPageContent<GeorgianWineContent>(GEORGIAN_WINE_SLUG)) ?? GEORGIAN_WINE_DEFAULT;

  return <div className="flex flex-col gap-6">
    <div>
      <Link href="/admin/pages" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to pages</Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Georgian wine page</h1>
    </div>
    <GeorgianWineForm content={content} />
  </div>;
}
