import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { NewPageForm } from "./new-page-form";

export const dynamic = "force-dynamic";

export default function NewPage() {
  return <div className="flex flex-col gap-6">
    <div>
      <Link href="/admin/pages" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to pages</Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Add a page</h1>
    </div>
    <NewPageForm />
  </div>;
}
