import { isAdminAuthenticated } from "@/lib/admin/auth";
import { saveUiStrings } from "@/lib/ui-strings/service";
import { UI_STRING_DEFAULTS } from "@/lib/ui-strings/defaults";
import type { Localized } from "@/db/schema";

export const dynamic = "force-dynamic";

function isLocalized(value: unknown): value is Localized {
  return !!value && typeof value === "object" && typeof (value as Localized).en === "string" && typeof (value as Localized).ka === "string";
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const entries: Record<string, Localized> = {};
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    if (!(key in UI_STRING_DEFAULTS)) continue;
    if (!isLocalized(value)) {
      return Response.json({ error: `Invalid value for "${key}".` }, { status: 400 });
    }
    entries[key] = { en: value.en.trim(), ka: value.ka.trim() };
  }

  await saveUiStrings(entries);
  return Response.json({ ok: true });
}
