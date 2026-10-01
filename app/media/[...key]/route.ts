import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

// Serves images and videos uploaded through the admin panel's image picker
// (see app/api/admin/upload/route.ts) straight out of the R2 bucket.
export async function GET(request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  if (!env.BUCKET) return new Response("Not found", { status: 404 });

  const { key } = await params;
  const object = await env.BUCKET.get(key.join("/"), { range: request.headers });
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  // Safari's <video> element refuses to play anything served without range
  // support - it won't fall back to loading the whole file like Chrome and
  // Firefox do, so it shows a blank player instead.
  headers.set("accept-ranges", "bytes");

  if (object.range) {
    const range = object.range as { offset?: number; length?: number; suffix?: number };
    const offset = range.offset ?? (range.suffix !== undefined ? object.size - range.suffix : 0);
    const length = range.length ?? object.size - offset;
    headers.set("content-range", `bytes ${offset}-${offset + length - 1}/${object.size}`);
    headers.set("content-length", String(length));
    return new Response(object.body, { status: 206, headers });
  }

  return new Response(object.body, { headers });
}
