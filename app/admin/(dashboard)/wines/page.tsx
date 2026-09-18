import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listWines } from "@/lib/wines/service";
import { listCategories } from "@/lib/categories/service";
import { DeleteWineButton } from "./delete-wine-button";

export const dynamic = "force-dynamic";

export default async function AdminWinesList() {
  const [wines, categories] = await Promise.all([listWines(), listCategories()]);
  const categoryLabel = (id: string) => categories.find(c => c.id === id)?.label.en ?? id;

  return <div className="flex flex-col gap-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Wines <span className="text-muted-foreground font-normal">({wines.length})</span></h1>
      <Button asChild><Link href="/admin/wines/new"><Plus />Add wine</Link></Button>
    </div>
    <div className="overflow-hidden rounded-[10px] border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Style</TableHead>
            <TableHead>Grapes</TableHead>
            <TableHead>Alcohol</TableHead>
            <TableHead className="text-center">Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wines.map(wine => <TableRow key={wine.slug}>
            <TableCell>
              <Link href={`/admin/wines/${wine.slug}`} className="font-medium hover:underline">{wine.name.en}</Link>
              <div className="text-xs text-muted-foreground">{wine.slug}</div>
            </TableCell>
            <TableCell><div className="flex flex-wrap gap-1">{wine.categories.map(c => <Badge key={c} variant="secondary">{categoryLabel(c)}</Badge>)}</div></TableCell>
            <TableCell>{wine.style?.en || "—"}</TableCell>
            <TableCell>{wine.grapes?.en || "—"}</TableCell>
            <TableCell>{wine.alcohol || "—"}</TableCell>
            <TableCell className="text-center">{wine.description ? "✓" : "—"}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-3">
                <Link href={`/admin/wines/${wine.slug}`} className="text-sm underline underline-offset-4">Edit</Link>
                <DeleteWineButton slug={wine.slug} name={wine.name.en} />
              </div>
            </TableCell>
          </TableRow>)}
        </TableBody>
      </Table>
    </div>
  </div>;
}
