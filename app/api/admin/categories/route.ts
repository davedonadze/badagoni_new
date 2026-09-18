import { isAdminAuthenticated } from "@/lib/admin/auth";
import { createCategory, getCategory, validateCategoryInput } from "@/lib/categories/service";
import { parseCategoryInput } from "@/lib/categories/parse-input";

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

  const input = parseCategoryInput(body);
  const validationError = validateCategoryInput(input);
  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  const existing = await getCategory(input.id);
  if (existing) {
    return Response.json({ error: `A category with id "${input.id}" already exists.` }, { status: 409 });
  }

  const category = await createCategory(input);
  return Response.json({ category }, { status: 201 });
}
