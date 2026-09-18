import { isAdminAuthenticated } from "@/lib/admin/auth";
import { createMenuItem, validateMenuItemInput, type MenuItemInput } from "@/lib/menu/service";

export const dynamic = "force-dynamic";

function parseMenuItemInput(body: Record<string, unknown>): Partial<MenuItemInput> {
  const label = body.label as { en?: unknown; ka?: unknown } | undefined;
  return {
    label: { en: typeof label?.en === "string" ? label.en : "", ka: typeof label?.ka === "string" ? label.ka : "" },
    href: typeof body.href === "string" ? body.href : "",
    location: body.location as MenuItemInput["location"],
    order: typeof body.order === "number" ? body.order : 0,
  };
}

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

  const input = parseMenuItemInput(body);
  const validationError = validateMenuItemInput(input);
  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  const item = await createMenuItem(input as MenuItemInput);
  return Response.json({ item }, { status: 201 });
}
