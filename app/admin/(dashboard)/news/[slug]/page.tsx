import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getNewsArticleBySlug } from "@/lib/news/service";
import { NewsForm } from "../news-form";
import { DeleteNewsButton } from "../delete-news-button";

type EditNewsProps = { params: Promise<{ slug: string }> };

export default async function EditNewsArticle({ params }: EditNewsProps) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);
  if (!article) notFound();

  return <div className="flex flex-col gap-6">
    <div>
      <Link href="/admin/news" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to news</Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Edit {article.title.en}</h1>
        <DeleteNewsButton slug={article.slug} title={article.title.en} />
      </div>
    </div>
    <NewsForm mode="edit" article={article} />
  </div>;
}
