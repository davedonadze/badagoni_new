import { NextResponse } from "next/server";

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

export function middleware() {
  const response = NextResponse.next();
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
