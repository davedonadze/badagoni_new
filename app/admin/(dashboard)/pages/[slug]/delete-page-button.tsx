"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeletePageButton({ slug, title }: { slug: string; title: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setPending(true);
    const response = await fetch(`/api/admin/pages/${slug}`, { method: "DELETE" });
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      alert(data.error || "Failed to delete page.");
      setPending(false);
      return;
    }
    router.push("/admin/pages");
    router.refresh();
  }

  return <button type="button" className="inline-flex items-center gap-1 text-sm text-destructive underline underline-offset-4 disabled:opacity-50" onClick={handleDelete} disabled={pending}>
    <Trash2 className="size-3.5" />{pending ? "Deleting…" : "Delete"}
  </button>;
}
