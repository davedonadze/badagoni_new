import { isAdminAuthenticated } from "@/lib/admin/auth";
import { translateToGeorgian } from "@/lib/translate";

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

  const text = body.text;
  if (typeof text !== "string") {
    return Response.json({ error: "A \"text\" string is required." }, { status: 400 });
  }

  try {
    const translation = await translateToGeorgian(text);
    return Response.json({ translation });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Translation failed." }, { status: 502 });
  }
}
