import Link from "next/link";
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

  return <div>
    <div className="admin-page-heading">
      <h1>Menu</h1>
      <Link href="/admin/menu/new" className="admin-primary-button">+ Add menu item</Link>
    </div>
    {groups.map(group => <section key={group.location} className="admin-menu-group">
      <h2>{LOCATION_LABELS[group.location]}</h2>
      {group.items.length === 0
        ? <p className="admin-empty-state">No items yet.</p>
        : <table className="admin-table">
            <thead><tr><th>Order</th><th>Label</th><th>Link</th><th /></tr></thead>
            <tbody>
              {group.items.map(item => <tr key={item.id}>
                <td>{item.order}</td>
                <td>{item.label.en}{!item.label.ka && <span className="admin-badge">no Georgian</span>}</td>
                <td>{item.href}</td>
                <td className="admin-table-actions">
                  <Link href={`/admin/menu/${item.id}`}>Edit</Link>
                  <DeleteMenuItemButton id={item.id} label={item.label.en} />
                </td>
              </tr>)}
            </tbody>
          </table>}
    </section>)}
  </div>;
}
