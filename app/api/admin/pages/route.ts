import { isAdminAuthenticated } from "@/lib/admin/auth";
import { getPageContent, savePageContent } from "@/lib/pages/service";
import { EMPTY_GENERIC_PAGE, validatePageSlug, type GenericPageContent } from "@/lib/pages/generic";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";

  const slugError = validatePageSlug(slug);
  if (slugError) {
    return Response.json({ error: slugError }, { status: 400 });
  }
  if (!title) {
    return Response.json({ error: "Title is required." }, { status: 400 });
  }

  const existing = await getPageContent<GenericPageContent>(slug);
  if (existing) {
    return Response.json({ error: `A page with slug "${slug}" already exists.` }, { status: 409 });
  }

  const content: GenericPageContent = { ...EMPTY_GENERIC_PAGE, title: { en: title, ka: "" } };
  await savePageContent(slug, content);

  return Response.json({ slug }, { status: 201 });
}
