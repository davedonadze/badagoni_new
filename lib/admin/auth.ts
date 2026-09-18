import { cookies } from "next/headers";
import { env } from "cloudflare:workers";

export const ADMIN_SESSION_COOKIE = "badagoni_admin_session";

function getConfiguredPassword(): string {
  const password = env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error(
      "ADMIN_PASSWORD is not configured. Set it as a Cloudflare Worker secret (wrangler secret put ADMIN_PASSWORD) or in .dev.vars for local development."
    );
  }
  return password;
}

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// The session cookie is a stable hash derived from the admin password, not
// the password itself. It stays valid until the password changes; there is
// no separate session store. This is intentionally a lightweight gate, not
// a full auth system.
export async function sessionTokenForConfiguredPassword(): Promise<string> {
  return sha256Hex(`badagoni-admin:${getConfiguredPassword()}`);
}

export async function verifyPassword(candidate: string): Promise<boolean> {
  return candidate === getConfiguredPassword();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const cookie = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (!cookie) return false;
  try {
    const expected = await sessionTokenForConfiguredPassword();
    return cookie === expected;
  } catch {
    return false;
  }
}
