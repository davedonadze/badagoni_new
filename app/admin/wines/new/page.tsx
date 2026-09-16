import Link from "next/link";
import { WineForm } from "../wine-form";

export const dynamic = "force-dynamic";

export default function NewWine() {
  return <main className="admin-page">
    <div className="admin-page-heading">
      <h1>Add a wine</h1>
      <Link href="/admin/wines" className="admin-secondary-link">Back to wines</Link>
    </div>
    <WineForm mode="create" />
  </main>;
}
