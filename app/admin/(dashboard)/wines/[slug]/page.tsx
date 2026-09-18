import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getWineBySlug } from "@/lib/wines/service";
import { listCategories } from "@/lib/categories/service";
import { WineForm } from "../wine-form";
import { DeleteWineButton } from "../delete-wine-button";

type EditWineProps = { params: Promise<{ slug: string }> };

export default async function EditWine({ params }: EditWineProps) {
  const { slug } = await params;
  const [wine, categories] = await Promise.all([getWineBySlug(slug), listCategories()]);
  if (!wine) notFound();

  return <div className="flex flex-col gap-6">
    <div>
      <Link href="/admin/wines" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to wines</Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Edit {wine.name.en}</h1>
        <DeleteWineButton slug={wine.slug} name={wine.name.en} />
      </div>
    </div>
    <WineForm mode="edit" wine={wine} categories={categories} />
  </div>;
}
