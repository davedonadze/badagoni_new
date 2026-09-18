import { isAdminAuthenticated } from "@/lib/admin/auth";
import { deleteMenuItem, updateMenuItem, validateMenuItemInput, type MenuItemInput } from "@/lib/menu/service";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

function parseMenuItemInput(body: Record<string, unknown>): Partial<MenuItemInput> {
  const label = body.label as { en?: unknown; ka?: unknown } | undefined;
  return {
    label: { en: typeof label?.en === "string" ? label.en : "", ka: typeof label?.ka === "string" ? label.ka : "" },
    href: typeof body.href === "string" ? body.href : "",
    location: body.location as MenuItemInput["location"],
    order: typeof body.order === "number" ? body.order : 0,
  };
}

export async function PATCH(request: Request, { params }: RouteParams) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return Response.json({ error: "Invalid menu item id." }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const input = parseMenuItemInput(body);
  const validationError = validateMenuItemInput(input);
  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  const item = await updateMenuItem(numericId, input as MenuItemInput);
  if (!item) {
    return Response.json({ error: `No menu item found with id ${numericId}.` }, { status: 404 });
  }

  return Response.json({ item });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return Response.json({ error: "Invalid menu item id." }, { status: 400 });
  }

  const deleted = await deleteMenuItem(numericId);
  if (!deleted) {
    return Response.json({ error: `No menu item found with id ${numericId}.` }, { status: 404 });
  }

  return Response.json({ ok: true });
}
