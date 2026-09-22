import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { WineForm } from "../wine-form";
import { listCategories } from "@/lib/categories/service";

export const dynamic = "force-dynamic";

export default async function NewWine() {
  const categories = await listCategories();
  return <div className="flex flex-col gap-6">
    <div>
      <Link href="/admin/wines" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to wines</Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Add a wine</h1>
    </div>
    <WineForm mode="create" categories={categories} />
  </div>;
}
