import { isAdminAuthenticated } from "@/lib/admin/auth";
import { createNewsArticle, getNewsArticleBySlug, validateNewsArticleInput } from "@/lib/news/service";
import { parseNewsArticleInput } from "@/lib/news/parse-input";

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

  const input = parseNewsArticleInput(body);
  const validationError = validateNewsArticleInput(input);
  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  const existing = await getNewsArticleBySlug(input.slug);
  if (existing) {
    return Response.json({ error: `An article with slug "${input.slug}" already exists.` }, { status: 409 });
  }

  const article = await createNewsArticle(input);
  return Response.json({ article }, { status: 201 });
}
