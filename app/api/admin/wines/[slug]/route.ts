import { isAdminAuthenticated } from "@/lib/admin/auth";
import { deleteWine, getWineBySlug, updateWine, validateWineInput } from "@/lib/wines/service";
import { parseWineInput } from "@/lib/wines/parse-input";

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

  const input = parseWineInput(body);
  const validationError = validateWineInput(input);
  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  if (input.slug !== currentSlug) {
    const clashing = await getWineBySlug(input.slug);
    if (clashing) {
      return Response.json({ error: `A wine with slug "${input.slug}" already exists.` }, { status: 409 });
    }
  }

  const wine = await updateWine(currentSlug, input);
  if (!wine) {
    return Response.json({ error: `No wine found with slug "${currentSlug}".` }, { status: 404 });
  }

  return Response.json({ wine });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { slug } = await params;
  const deleted = await deleteWine(slug);
  if (!deleted) {
    return Response.json({ error: `No wine found with slug "${slug}".` }, { status: 404 });
  }

  return Response.json({ ok: true });
}
