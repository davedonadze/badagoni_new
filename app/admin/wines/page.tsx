import Link from "next/link";
import { listWines } from "@/lib/wines/service";
import { DeleteWineButton } from "./delete-wine-button";

export const dynamic = "force-dynamic";

export default async function AdminWinesList() {
  const wines = await listWines();

  return <main className="admin-page">
    <div className="admin-page-heading">
      <h1>Wines ({wines.length})</h1>
      <Link href="/admin/wines/new" className="admin-primary-button">+ Add wine</Link>
    </div>
    <table className="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Style</th>
          <th>Grapes</th>
          <th>Alcohol</th>
          <th>Description</th>
          <th aria-label="Actions" />
        </tr>
      </thead>
      <tbody>
        {wines.map(wine => <tr key={wine.slug}>
          <td><Link href={`/admin/wines/${wine.slug}`}>{wine.name}</Link><div className="admin-table-slug">{wine.slug}</div></td>
          <td>{wine.categories.join(", ")}</td>
          <td>{wine.style || "—"}</td>
          <td>{wine.grapes?.join(", ") || "—"}</td>
          <td>{wine.alcohol || "—"}</td>
          <td className="admin-table-description">{wine.description ? "✓" : "—"}</td>
          <td className="admin-table-actions">
            <Link href={`/admin/wines/${wine.slug}`}>Edit</Link>
            <DeleteWineButton slug={wine.slug} name={wine.name} />
          </td>
        </tr>)}
      </tbody>
    </table>
  </main>;
}
