import Link from "next/link";
import { notFound } from "next/navigation";
import { getWineBySlug } from "@/lib/wines/service";
import { WineForm } from "../wine-form";
import { DeleteWineButton } from "../delete-wine-button";

type EditWineProps = { params: Promise<{ slug: string }> };

export default async function EditWine({ params }: EditWineProps) {
  const { slug } = await params;
  const wine = await getWineBySlug(slug);
  if (!wine) notFound();

  return <main className="admin-page">
    <div className="admin-page-heading">
      <h1>Edit {wine.name}</h1>
      <div className="admin-page-heading-actions">
        <Link href="/admin/wines" className="admin-secondary-link">Back to wines</Link>
        <DeleteWineButton slug={wine.slug} name={wine.name} />
      </div>
    </div>
    <WineForm mode="edit" wine={wine} />
  </main>;
}
