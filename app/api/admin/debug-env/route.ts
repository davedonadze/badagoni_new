import { env } from "cloudflare:workers";
import { isAdminAuthenticated } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

// Temporary diagnostic endpoint for the ANTHROPIC_API_KEY binding issue.
// Reports presence/length only, never the secret value. Remove once resolved.
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  function describe(name: string, value: string | undefined) {
    return {
      present: value !== undefined,
      length: value?.length ?? 0,
      trimmedLength: value?.trim().length ?? 0,
    };
  }

  return Response.json({
    ADMIN_PASSWORD: describe("ADMIN_PASSWORD", env.ADMIN_PASSWORD),
    ANTHROPIC_API_KEY: describe("ANTHROPIC_API_KEY", env.ANTHROPIC_API_KEY),
  });
}
