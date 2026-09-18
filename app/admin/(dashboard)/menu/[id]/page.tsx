import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getMenuItem } from "@/lib/menu/service";
import { MenuForm } from "../menu-form";
import { DeleteMenuItemButton } from "../delete-menu-item-button";

type EditMenuItemProps = { params: Promise<{ id: string }> };

export default async function EditMenuItem({ params }: EditMenuItemProps) {
  const { id } = await params;
  const numericId = Number(id);
  const item = Number.isInteger(numericId) ? await getMenuItem(numericId) : undefined;
  if (!item) notFound();

  return <div className="flex flex-col gap-6">
    <div>
      <Link href="/admin/menu" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to menu</Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Edit {item.label.en}</h1>
        <DeleteMenuItemButton id={item.id} label={item.label.en} />
      </div>
    </div>
    <MenuForm mode="edit" item={item} />
  </div>;
}
