import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CategoryForm } from "../category-form";

export const dynamic = "force-dynamic";

export default function NewCategory() {
  return <div className="flex flex-col gap-6">
    <div>
      <Link href="/admin/categories" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to categories</Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Add a category</h1>
    </div>
    <CategoryForm mode="create" />
  </div>;
}
