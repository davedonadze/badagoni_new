import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getPageContent } from "@/lib/pages/service";
import { LEGALS_SLUG, LEGALS_DEFAULT, type LegalsContent } from "@/lib/pages/legals";
import { LegalsForm } from "./legals-form";

export const dynamic = "force-dynamic";

export default async function EditLegalsPage() {
  const content = (await getPageContent<LegalsContent>(LEGALS_SLUG)) ?? LEGALS_DEFAULT;

  return <div className="flex flex-col gap-6">
    <div>
      <Link href="/admin/pages" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to pages</Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Legals page</h1>
    </div>
    <LegalsForm content={content} />
  </div>;
}
