import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

// Serves images uploaded through the admin panel's image picker
// (see app/api/admin/upload/route.ts) straight out of the R2 bucket.
export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  if (!env.BUCKET) return new Response("Not found", { status: 404 });

  const { key } = await params;
  const object = await env.BUCKET.get(key.join("/"));
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
}
