# Badagoni — complete website source

This is one complete project containing the current published Badagoni Ritual website, with every tracked source file copied unchanged. All pages share the same application, navigation, components, styles and assets.

## Snapshot

- Website: https://badagoni-ritual.l-lomsadze18.chatgpt.site
- Published version: 23
- Source commit: 7d783fd1f9b1ba4c7b65f4c3094cf2b836a33eac
- Export date: 2026-09-16 (UTC)
- Source files: 196, verified byte-for-byte against this commit

The export did not modify or redeploy the website. The existing live URL remains unchanged.

## Run locally

Use Node.js 22.13.0 or newer with npm. Extract the ZIP, open a terminal in the `badagoni-website` folder, then run:

```sh
npm run install:ci
npm run dev
```

Open http://localhost:5173. The installer restores the exact dependencies from `package-lock.json`; internet access is needed to download them. The bundled scripts automatically use the portable execution profile in this clean export.

To make a production build and preview it locally:

```sh
npm run build
npm start
```

`npm start` runs the generated application through a local Wrangler preview; use the local address printed in the terminal. These commands do not publish the site.

## Project structure

The project uses React 19, TypeScript, Vinext, Vite, Tailwind CSS and Radix/shadcn components, with Cloudflare build support. Keep the existing scripts and lockfile; this is the original application structure.

| Location | Contents |
| --- | --- |
| `app/` | All page routes, layouts, content, shared site shell and page interactions |
| `app/globals.css`, `app/fonts.css` | Global styling, responsive layouts, transitions and fonts |
| `app/site-shell.tsx` | Shared header, mobile navigation and footer |
| `app/wine-data.json`, `app/wine-collection.tsx` | Wine data, catalogue and wine information drawer |
| `components/ui/`, `hooks/`, `lib/` | Shared interface components and utilities |
| `public/` | Images, wine bottles, logos, awards, portraits and local fonts |
| `docs/` | Existing image and content source notes |
| `scripts/`, `build/`, `vendor/` | Included install/build support and bundled styles |
| `db/`, `drizzle/`, `examples/` | Existing starter database support and examples |

## Pages

| URL | Source |
| --- | --- |
| `/` | `app/page.tsx` |
| `/catalogue` | `app/catalogue/page.tsx` |
| `/story` | `app/story/page.tsx` |
| `/terroir` | `app/terroir/page.tsx` |
| `/enologists` | `app/enologists/page.tsx` |
| `/wines/saperavi-reserve` | `app/wines/saperavi-reserve/page.tsx` |
| `/alaverdi-monastery-cellar` | `app/alaverdi-monastery-cellar/page.tsx` |
| `/newsroom` | `app/newsroom/page.tsx` |
| `/newsroom/mundus-vini-gold-medals` | `app/newsroom/[slug]/page.tsx` |
| `/newsroom/saperavi-reserve-best-of-show` | `app/newsroom/[slug]/page.tsx` |
| `/newsroom/sanlian-lifeweek-georgian-wine` | `app/newsroom/[slug]/page.tsx` |
| `/contact` | `app/contact/page.tsx` |
| `/wines` | Redirects to `/catalogue` |

News articles share `app/newsroom/articles.ts`. The custom 404 page is `app/not-found.tsx`.

## Interactions and presentation

All current interactive behavior is preserved in source, including mobile navigation; catalogue filters and the wine detail drawer; homepage expanding cards with sibling dimming; homepage overlapping parallax images; vineyard and enologist selection panels; the Saperavi Reserve awards drawer; animated newsroom cards; and the story page's full-width sticky/parallax winery image. Existing responsive rules, reduced-motion behavior, brand logos and local Instrument Serif font are included.

## Hosting and included files

The existing `.openai/hosting.json` is retained because the build imports it. It contains the original project identity, not credentials. No D1 or R2 service is configured for this snapshot. A developer hosting a separate copy should configure their own destination. Exporting and running this copy locally does not change the live site.

The ZIP contains all versioned project files, including the dependency lockfile and build configuration. Generated dependency folders, build output, local runtime caches and Git history are not needed to reproduce the project and are not included. No source file was rewritten for export.

`DEVELOPER-HANDOFF.md` and `EXPORT-MANIFEST.json` are the two added export documents. The original `README.md` is retained unchanged; this handoff describes the current snapshot. The manifest lists each original file's size and SHA-256 hash for verification.
