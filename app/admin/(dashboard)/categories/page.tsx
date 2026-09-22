import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listCategories } from "@/lib/categories/service";
import { DeleteCategoryButton } from "./delete-category-button";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesList() {
  const categories = await listCategories();

  return <div className="flex flex-col gap-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Categories <span className="text-muted-foreground font-normal">({categories.length})</span></h1>
      <Button asChild><Link href="/admin/categories/new"><Plus />Add category</Link></Button>
    </div>
    <div className="overflow-hidden rounded-[10px] border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Order</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>ID</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map(category => <TableRow key={category.id}>
            <TableCell className="text-muted-foreground">{category.order}</TableCell>
            <TableCell>
              <Link href={`/admin/categories/${category.id}`} className="font-medium hover:underline">{category.label.en}</Link>
              {!category.label.ka && <Badge variant="outline" className="ml-2 text-[10px] text-destructive">no Georgian</Badge>}
            </TableCell>
            <TableCell className="text-muted-foreground">{category.id}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-3">
                <Link href={`/admin/categories/${category.id}`} className="text-sm underline underline-offset-4">Edit</Link>
                <DeleteCategoryButton id={category.id} label={category.label.en} />
              </div>
            </TableCell>
          </TableRow>)}
        </TableBody>
      </Table>
    </div>
  </div>;
}
