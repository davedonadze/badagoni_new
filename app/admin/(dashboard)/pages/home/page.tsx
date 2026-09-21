import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getPageContent } from "@/lib/pages/service";
import { HOME_SLUG, HOME_DEFAULT, type HomeContent } from "@/lib/pages/home";
import { HomeForm } from "./home-form";

export const dynamic = "force-dynamic";

export default async function EditHomePage() {
  const content = (await getPageContent<HomeContent>(HOME_SLUG)) ?? HOME_DEFAULT;

  return <div className="flex flex-col gap-6">
    <div>
      <Link href="/admin/pages" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to pages</Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Home page</h1>
    </div>
    <HomeForm content={content} />
  </div>;
}
