import { isAdminAuthenticated } from "@/lib/admin/auth";
import { deleteNewsArticle, getNewsArticleBySlug, updateNewsArticle, validateNewsArticleInput } from "@/lib/news/service";
import { parseNewsArticleInput } from "@/lib/news/parse-input";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ slug: string }> };

export async function PATCH(request: Request, { params }: RouteParams) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { slug: currentSlug } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const input = parseNewsArticleInput(body);
  const validationError = validateNewsArticleInput(input);
  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  if (input.slug !== currentSlug) {
    const clashing = await getNewsArticleBySlug(input.slug);
    if (clashing) {
      return Response.json({ error: `An article with slug "${input.slug}" already exists.` }, { status: 409 });
    }
  }

  const article = await updateNewsArticle(currentSlug, input);
  if (!article) {
    return Response.json({ error: `No article found with slug "${currentSlug}".` }, { status: 404 });
  }

  return Response.json({ article });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { slug } = await params;
  const deleted = await deleteNewsArticle(slug);
  if (!deleted) {
    return Response.json({ error: `No article found with slug "${slug}".` }, { status: 404 });
  }

  return Response.json({ ok: true });
}
