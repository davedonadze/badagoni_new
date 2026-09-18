import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { LogoutButton } from "../wines/logout-button";

export const dynamic = "force-dynamic";

export default async function AdminMenuLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/login");

  return <div className="admin-shell">
    <header className="admin-topbar">
      <Link href="/admin/wines" className="admin-brand">Badagoni admin</Link>
      <nav className="admin-topbar-nav">
        <Link href="/admin/wines">Wines</Link>
        <Link href="/admin/menu">Menu</Link>
        <Link href="/admin/menu/new">+ Add menu item</Link>
        <LogoutButton />
      </nav>
    </header>
    <div className="admin-content">{children}</div>
  </div>;
}
