import { env } from "cloudflare:workers";
import { isAdminAuthenticated } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set(["image/webp", "image/png", "image/jpeg", "image/avif"]);
const MAX_BYTES = 8 * 1024 * 1024;

function extensionFor(type: string): string {
  return { "image/webp": "webp", "image/png": "png", "image/jpeg": "jpg", "image/avif": "avif" }[type] ?? "bin";
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }
  if (!env.BUCKET) {
    return Response.json({ error: "Image storage is not configured. See docs/admin-panel.md for setting up the R2 bucket." }, { status: 502 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No file uploaded." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return Response.json({ error: "Only WEBP, PNG, JPEG, or AVIF images are allowed." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "Image must be under 8 MB." }, { status: 400 });
  }

  const key = `wines/${crypto.randomUUID()}.${extensionFor(file.type)}`;
  await env.BUCKET.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });

  return Response.json({ url: `/media/${key}` }, { status: 201 });
}
