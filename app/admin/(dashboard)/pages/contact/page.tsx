import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getPageContent } from "@/lib/pages/service";
import { CONTACT_SLUG, CONTACT_DEFAULT, type ContactContent } from "@/lib/pages/contact";
import { ContactForm } from "./contact-form";

export const dynamic = "force-dynamic";

export default async function EditContactPage() {
  const content = (await getPageContent<ContactContent>(CONTACT_SLUG)) ?? CONTACT_DEFAULT;

  return <div className="flex flex-col gap-6">
    <div>
      <Link href="/admin/pages" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4" />Back to pages</Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Contact page</h1>
    </div>
    <ContactForm content={content} />
  </div>;
}
