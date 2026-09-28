import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_HEADER } from "@/lib/i18n";

// next.config.ts's `headers()` only reaches vinext's generated static-asset
// `_headers` file, not actual page/API responses, so security headers are
// applied here instead - the one mechanism that reliably runs on every
// request in this stack.
//
// Every asset (fonts, images, video) is self-hosted and served same-origin
// (static files or /media/<key>); no third-party scripts, styles, or fonts
// are loaded anywhere on the site. 'unsafe-inline' stays on script-src and
// style-src because React Server Components hydration injects an inline
// bootstrap <script>, and at least one component (editorial-cards.tsx) sets
// an inline style attribute - both would need a nonce/hash setup this stack
// doesn't wire up yet. The real value here is blocking any *third-party*
// origin the page could otherwise be tricked into loading from or posting
// to, plus the framing/MIME-sniffing/HTTPS-downgrade protections below.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "media-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

// /ka/<path> serves the exact same route as /<path> - this rewrites the
// request internally (stripping the prefix) and tags it with a request
// header that getLocale() (lib/i18n.ts) reads server-side, so no route
// files need to be duplicated under a [locale] segment.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isGeorgian = pathname === "/ka" || pathname.startsWith("/ka/");

  let response: NextResponse;
  if (isGeorgian) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/ka" ? "/" : pathname.slice("/ka".length);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_HEADER, "ka");
    response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  } else {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_HEADER, "en");
    response = NextResponse.next({ request: { headers: requestHeaders } });
  }

  response.headers.set("Content-Security-Policy", CSP);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}

export const config = {
  matcher: "/:path*",
};
