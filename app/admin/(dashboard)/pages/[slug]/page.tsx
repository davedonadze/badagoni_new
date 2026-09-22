import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/pages/service";
import { EMPTY_GENERIC_PAGE, type GenericPageContent } from "@/lib/pages/generic";
import { GenericPageForm } from "./generic-page-form";
import { DeletePageButton } from "./delete-page-button";

export const dynamic = "force-dynamic";

type EditPageProps = { params: Promise<{ slug: string }> };

export default async function EditGenericPage({ params }: EditPageProps) {
  const { slug } = await params;
  const content = await getPageContent<GenericPageContent>(slug);
  if (!content) notFound();

  const title = content.title.en || slug;

  return <div className="flex flex-col gap-6">
    <div>
      <Link href="/admin/pages" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to pages</Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <DeletePageButton slug={slug} title={title} />
      </div>
    </div>
    <GenericPageForm slug={slug} content={{ ...EMPTY_GENERIC_PAGE, ...content }} />
  </div>;
}
