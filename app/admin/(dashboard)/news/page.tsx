import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listNewsArticles } from "@/lib/news/service";
import { formatNewsDate } from "@/lib/news/format";
import { isVideoUrl } from "@/lib/media";
import { DeleteNewsButton } from "./delete-news-button";

export const dynamic = "force-dynamic";

export default async function AdminNewsList() {
  const articles = await listNewsArticles();

  return <div className="flex flex-col gap-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">News <span className="text-muted-foreground font-normal">({articles.length})</span></h1>
      <Button asChild><Link href="/admin/news/new"><Plus />Add article</Link></Button>
    </div>
    <div className="overflow-hidden rounded-[10px] border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map(article => <TableRow key={article.slug}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[6px] border bg-muted/40">
                  {article.image && (isVideoUrl(article.image)
                    ? <video src={article.image} className="h-full w-full object-cover" muted playsInline preload="metadata" />
                    : <img src={article.image} alt="" className="h-full w-full object-cover" />)}
                </div>
                <div>
                  <Link href={`/admin/news/${article.slug}`} className="font-medium hover:underline">{article.title.en}</Link>
                  <div className="text-xs text-muted-foreground">{article.slug}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>{article.category.en}</TableCell>
            <TableCell>{formatNewsDate(article.date)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-3">
                <Link href={`/admin/news/${article.slug}`} className="text-sm underline underline-offset-4">Edit</Link>
                <DeleteNewsButton slug={article.slug} title={article.title.en} />
              </div>
            </TableCell>
          </TableRow>)}
        </TableBody>
      </Table>
      {articles.length === 0 && <p className="p-6 text-sm text-muted-foreground">No articles yet — click "Add article" to create one.</p>}
    </div>
  </div>;
}
