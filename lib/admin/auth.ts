import { cookies } from "next/headers";
import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { adminSessions } from "@/db/schema";

export const ADMIN_SESSION_COOKIE = "badagoni_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

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

// Comparing fixed-length SHA-256 hex digests byte-by-byte (rather than the
// raw password strings) means the comparison always takes the same number
// of steps regardless of where or whether the candidate first differs from
// the real password, closing the timing side-channel a plain `===` leaves
// open.
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifyPassword(candidate: string): Promise<boolean> {
  const [candidateHash, configuredHash] = await Promise.all([
    sha256Hex(candidate),
    sha256Hex(getConfiguredPassword()),
  ]);
  return timingSafeEqualHex(candidateHash, configuredHash);
}

// Each login gets its own random token, stored in `admin_sessions` with an
// expiry - unlike a token derived from the password itself, this means
// logout (or letting a session expire) actually revokes just that one
// session, instead of every past login staying valid forever until the
// shared password changes.
export async function createSession(): Promise<string> {
  const token = crypto.randomUUID();
  const db = getDb();
  await db.insert(adminSessions).values({
    token,
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
  });
  return token;
}

export async function deleteSession(token: string): Promise<void> {
  const db = getDb();
  await db.delete(adminSessions).where(eq(adminSessions.token, token));
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return false;

  const db = getDb();
  const [session] = await db.select().from(adminSessions).where(eq(adminSessions.token, token)).limit(1);
  if (!session) return false;

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    await db.delete(adminSessions).where(eq(adminSessions.token, token));
    return false;
  }

  return true;
}
