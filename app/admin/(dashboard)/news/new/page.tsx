import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { NewsForm } from "../news-form";

export default function NewNewsArticle() {
  return <div className="flex flex-col gap-6">
    <div>
      <Link href="/admin/news" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to news</Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Add an article</h1>
    </div>
    <NewsForm mode="create" />
  </div>;
}
