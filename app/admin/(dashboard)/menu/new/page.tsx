import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MenuForm } from "../menu-form";

export const dynamic = "force-dynamic";

export default function NewMenuItem() {
  return <div className="flex flex-col gap-6">
    <div>
      <Link href="/admin/menu" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to menu</Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Add a menu item</h1>
    </div>
    <MenuForm mode="create" />
  </div>;
}
