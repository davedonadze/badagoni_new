"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteWineButton({ slug, name }: { slug: string; name: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setPending(true);
    const response = await fetch(`/api/admin/wines/${slug}`, { method: "DELETE" });
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      alert(data.error || "Failed to delete wine.");
      setPending(false);
      return;
    }
    router.refresh();
  }

  return <button type="button" className="admin-delete-button" onClick={handleDelete} disabled={pending}>
    {pending ? "Deleting…" : "Delete"}
  </button>;
}
