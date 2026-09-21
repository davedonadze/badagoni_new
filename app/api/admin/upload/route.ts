import { env } from "cloudflare:workers";
import { isAdminAuthenticated } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

const IMAGE_TYPES = new Set(["image/webp", "image/png", "image/jpeg", "image/avif"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

function extensionFor(type: string): string {
  return {
    "image/webp": "webp", "image/png": "png", "image/jpeg": "jpg", "image/avif": "avif",
    "video/mp4": "mp4", "video/webm": "webm",
  }[type] ?? "bin";
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

  const isVideo = VIDEO_TYPES.has(file.type);
  if (!isVideo && !IMAGE_TYPES.has(file.type)) {
    return Response.json({ error: "Only WEBP, PNG, JPEG, AVIF images, or MP4/WEBM videos are allowed." }, { status: 400 });
  }
  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    return Response.json({ error: isVideo ? "Video must be under 50 MB." : "Image must be under 8 MB." }, { status: 400 });
  }

  const key = `wines/${crypto.randomUUID()}.${extensionFor(file.type)}`;
  await env.BUCKET.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });

  return Response.json({ url: `/media/${key}` }, { status: 201 });
}
