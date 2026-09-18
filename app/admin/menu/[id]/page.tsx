import Link from "next/link";
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

  return <main className="admin-page">
    <div className="admin-page-heading">
      <h1>Edit {item.label.en}</h1>
      <div className="admin-page-heading-actions">
        <Link href="/admin/menu" className="admin-secondary-link">Back to menu</Link>
        <DeleteMenuItemButton id={item.id} label={item.label.en} />
      </div>
    </div>
    <MenuForm mode="edit" item={item} />
  </main>;
}
