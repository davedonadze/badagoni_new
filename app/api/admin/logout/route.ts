import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, deleteSession } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) await deleteSession(token);
  store.delete(ADMIN_SESSION_COOKIE);
  return Response.json({ ok: true });
}
