import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listMenuItems, type MenuLocation } from "@/lib/menu/service";
import { DeleteMenuItemButton } from "./delete-menu-item-button";

const LOCATION_LABELS: Record<MenuLocation, string> = {
  header_primary: "Header — primary",
  header_secondary: "Header — secondary",
  footer: "Footer",
};

export default async function AdminMenuPage() {
  const items = await listMenuItems();
  const groups = (Object.keys(LOCATION_LABELS) as MenuLocation[]).map(location => ({
    location,
    items: items.filter(item => item.location === location),
  }));

  return <div className="flex flex-col gap-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Menu</h1>
      <Button asChild><Link href="/admin/menu/new"><Plus />Add menu item</Link></Button>
    </div>
    {groups.map(group => <Card key={group.location}>
      <CardHeader>
        <CardTitle className="text-base">{LOCATION_LABELS[group.location]}</CardTitle>
      </CardHeader>
      <CardContent>
        {group.items.length === 0
          ? <p className="text-sm text-muted-foreground">No items yet.</p>
          : <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Order</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.items.map(item => <TableRow key={item.id}>
                  <TableCell className="text-muted-foreground">{item.order}</TableCell>
                  <TableCell>
                    <span className="font-medium">{item.label.en}</span>
                    {!item.label.ka && <Badge variant="outline" className="ml-2 text-[10px] text-destructive">no Georgian</Badge>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.href}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/menu/${item.id}`} className="text-sm underline underline-offset-4">Edit</Link>
                      <DeleteMenuItemButton id={item.id} label={item.label.en} />
                    </div>
                  </TableCell>
                </TableRow>)}
              </TableBody>
            </Table>}
      </CardContent>
    </Card>)}
  </div>;
}
