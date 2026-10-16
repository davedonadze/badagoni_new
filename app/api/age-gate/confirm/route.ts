import { cookies } from "next/headers";
import { AGE_GATE_COOKIE, AGE_GATE_MAX_AGE } from "@/lib/age-gate";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const store = await cookies();
  store.set(AGE_GATE_COOKIE, "true", {
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: AGE_GATE_MAX_AGE,
  });

  return Response.json({ ok: true });
}
