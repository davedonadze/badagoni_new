import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getCategory } from "@/lib/categories/service";
import { CategoryForm } from "../category-form";
import { DeleteCategoryButton } from "../delete-category-button";

type EditCategoryProps = { params: Promise<{ id: string }> };

export default async function EditCategory({ params }: EditCategoryProps) {
  const { id } = await params;
  const category = await getCategory(id);
  if (!category) notFound();

  return <div className="flex flex-col gap-6">
    <div>
      <Link href="/admin/categories" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to categories</Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Edit {category.label.en}</h1>
        <DeleteCategoryButton id={category.id} label={category.label.en} />
      </div>
    </div>
    <CategoryForm mode="edit" category={category} />
  </div>;
}
