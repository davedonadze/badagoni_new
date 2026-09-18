import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getPageContent } from "@/lib/pages/service";
import { STORY_SLUG, STORY_DEFAULT, type StoryContent } from "@/lib/pages/story";
import { StoryForm } from "./story-form";

export const dynamic = "force-dynamic";

export default async function EditStoryPage() {
  const content = (await getPageContent<StoryContent>(STORY_SLUG)) ?? STORY_DEFAULT;

  return <div className="flex flex-col gap-6">
    <div>
      <Link href="/admin/pages" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to pages</Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Story page</h1>
    </div>
    <StoryForm content={content} />
  </div>;
}
