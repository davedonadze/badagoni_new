import { isAdminAuthenticated } from "@/lib/admin/auth";
import { deleteCategory, updateCategory, validateCategoryInput } from "@/lib/categories/service";
import { parseCategoryInput } from "@/lib/categories/parse-input";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteParams) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const input = parseCategoryInput({ ...body, id });
  const validationError = validateCategoryInput(input);
  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  const category = await updateCategory(id, input);
  if (!category) {
    return Response.json({ error: `No category found with id "${id}".` }, { status: 404 });
  }

  return Response.json({ category });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteCategory(id);
  if (!deleted) {
    return Response.json({ error: `No category found with id "${id}".` }, { status: 404 });
  }

  return Response.json({ ok: true });
}
