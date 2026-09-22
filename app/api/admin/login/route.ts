import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, sessionTokenForConfiguredPassword, verifyPassword } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password ?? "";
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  let valid: boolean;
  try {
    valid = await verifyPassword(password);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Admin login is not configured.";
    return Response.json({ error: message }, { status: 500 });
  }

  if (!valid) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = await sessionTokenForConfiguredPassword();
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return Response.json({ ok: true });
}
