import Link from "next/link";
import { MenuForm } from "../menu-form";

export const dynamic = "force-dynamic";

export default function NewMenuItem() {
  return <main className="admin-page">
    <div className="admin-page-heading">
      <h1>Add a menu item</h1>
      <Link href="/admin/menu" className="admin-secondary-link">Back to menu</Link>
    </div>
    <MenuForm mode="create" />
  </main>;
}
