import { isAdminAuthenticated } from "@/lib/admin/auth";
import { createWine, getWineBySlug, validateWineInput } from "@/lib/wines/service";
import { parseWineInput } from "@/lib/wines/parse-input";

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

  const input = parseWineInput(body);
  const validationError = validateWineInput(input);
  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  const existing = await getWineBySlug(input.slug);
  if (existing) {
    return Response.json({ error: `A wine with slug "${input.slug}" already exists.` }, { status: 409 });
  }

  const wine = await createWine(input);
  return Response.json({ wine }, { status: 201 });
}
