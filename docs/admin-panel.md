# Wine database and admin panel

Wines used to live in a static `app/wine-data.json` file. They now live in a
Cloudflare D1 database (`db/schema.ts`, table `wines`), and can be added,
edited, and deleted through a password-protected admin panel at `/admin`
instead of a code push. `app/wine-data.json` is kept only as the historical
source for the seed migration (`drizzle/0001_seed_wines.sql`) — nothing at
runtime reads it anymore.

## How it fits together

- `db/schema.ts` — the `wines`, `categories`, `menu_items`, `pages`, and `news_articles` tables (Drizzle ORM / SQLite dialect, since D1 is SQLite).
- `drizzle/0000_*.sql` — creates the wines table. `drizzle/0001_seed_wines.sql` — inserts the original 41 wines. `drizzle/0002_*.sql` — creates `menu_items`. `drizzle/0003_seed_menu_items.sql` — inserts the current header/footer navigation. `drizzle/0004_wines_bilingual.sql` — converts `wines.name`/`style`/`description` from plain text to bilingual `{en, ka}` JSON. `drizzle/0005_*.sql` — creates `categories`. `drizzle/0006_seed_categories.sql` — inserts the original 6 wine categories. `drizzle/0007_wines_grapes_bilingual.sql` — converts `wines.grapes` from a plain string array to bilingual `{en, ka}` JSON (one comma-separated field, same as name/style/description). `drizzle/0008_*.sql` — creates `pages`. `drizzle/0009_seed_story_page.sql` — inserts the Story page's original copy as its starting content. `drizzle/0010_seed_home_page.sql` — same, for the homepage. `drizzle/0011_seed_contact_page.sql` — same, for the contact page. `drizzle/0012_seed_terroir_page.sql` — same, for the terroir page. `drizzle/0013_seed_alaverdi_page.sql` — same, for the Alaverdi Monastery Cellar page. `drizzle/0014_seed_enologists_page.sql` — same, for the enologists page. `drizzle/0015_seed_catalogue_page.sql` — same, for the catalogue page. `drizzle/0016_*.sql` — creates `news_articles`. `drizzle/0017_seed_news_articles.sql` — inserts the original 3 newsroom stories (bilingual, English filled, Georgian blank), converted from the old static `app/newsroom/articles.ts` (now removed). `drizzle/0018_*.sql` — creates `admin_sessions`, used by the new random-token login session (replacing the old password-derived cookie). `drizzle/0019_seed_footer_redesign.sql` — seeds the `legals` page (Terms and Conditions / Privacy Policy) and a `georgian-wine` placeholder page, seeds the new `footer_primary`/`footer_secondary` menu items, and deletes the old `footer`-location rows the redesigned footer no longer reads. `drizzle/0020_seed_georgian_wine_page.sql` — replaces that `georgian-wine` placeholder with its real content (the Badagoni figure and Qvevri tradition chapters), once the page got its own dedicated editor. `drizzle/0021_update_alaverdi_qvevri.sql` — updates the Alaverdi Monastery Cellar page's content for its qvevri section redesign (dropped the "landmarks" facts strip and the qvevri section's eyebrow/body fields, to match a reference build's current page). `drizzle/0022_add_wine_specs.sql` — adds `wines.specs`, a nullable bilingual `{label, value}[]` for admin-addable extra facts on a wine's detail panel (Vintage, Ageing, Serving temperature, …), shown below the fixed Origin/Grape variety/Alcohol rows. `drizzle/0023_add_ui_strings.sql` — creates `ui_strings` (`key` → bilingual `value`), for hardcoded UI copy edited at `/admin/translations`. `drizzle/0024_add_wine_awards.sql` — adds `wines.awards`, a nullable `{image, name, year}[]` (medal logo, bilingual award title, year) for admin-addable medals shown in a wine's "Awards" panel. `drizzle/0025_seed_saperavi_reserve_awards.sql` — seeds Saperavi Reserve's 4 real awards (previously hardcoded in its bespoke page component) into the new column, so the generalized feature doesn't regress its only page that used to show awards.
- `lib/wines/service.ts` — the only place that talks to the wines table (`listWines`, `getWineBySlug`, `createWine`, `updateWine`, `deleteWine`). Public pages (`/`, `/catalogue`, `/wines/[slug]`) and the admin panel both call this. Beyond the fixed Style/Grapes/Alcohol/Description fields, a wine can carry any number of admin-added `specs` (label + value, both bilingual) — reorderable in the admin form the same way as `legals`'s document sections. Shown on both the catalogue detail sheet (`app/wine-collection.tsx`) and the standalone `/wines/[slug]` page, after the fixed Origin/Grape variety/Alcohol rows; the catalogue sheet's outer `[data-slot=sheet-content]` already scrolls (`.wine-panel {overflow:auto}` over the base Sheet's `h-full`), so a wine with many specs just becomes a scrollable panel rather than overflowing off-screen.
  - **Awards** (`wines.awards`): the same add/remove/reorder pattern as `specs`, one Card per award with a medal-logo `ImagePicker`, a bilingual award-title `BilingualField`, and a plain-text year `Input` (`app/admin/(dashboard)/wines/wine-form.tsx`). Public display is the shared `WineAwards` component (`app/wine-awards.tsx`) — an "Awards ↗" trigger opening a `Sheet` listing each medal image/name/year — reused on the standalone `/wines/[slug]` page and the bespoke `/wines/saperavi-reserve` page, conditional on `wine.awards?.length`. Deliberately not shown in the catalogue quick-view sheet (`app/wine-collection.tsx`) — that panel already links to the full wine page, where Awards lives. This replaced an older `ReserveAwards` component that only existed on the Saperavi Reserve page with a hardcoded array; `drizzle/0025_seed_saperavi_reserve_awards.sql` carries that wine's real award data into the new DB column so it keeps showing them.
- `lib/categories/service.ts` — the same, for `categories` (wine categories like red/white/qvevri — `id` is the slug stored in `wines.category`/`categories`, immutable after creation in the admin UI). Public pages resolve category labels through this instead of a hardcoded map.
- `lib/menu/service.ts` — the same, for `menu_items`. `app/layout.tsx` calls `listMenuItems()` and passes the header/footer links down to `<SiteHeader>`/`<SiteFooter>` (`app/site-shell.tsx`) as props — the nav is no longer hardcoded. Locations: `header_primary`/`header_secondary` (header nav), `footer_primary`/`footer_secondary` (the footer's two link columns — independent of the header nav, not reused from it), and `footer_social` (the footer's Social column; empty by default, footer shows "Coming soon" until items are added). The footer's Legals column (Terms and Conditions / Privacy Policy) and Language row (English / ქართული, the latter non-functional until Georgian rendering ships) are hardcoded in `SiteFooter`, not menu-managed.
- `lib/pages/service.ts` — generic get/save (plus `listGenericPages`/`deletePage`) for the `pages` table (`slug` → JSON `content`).
  - **Registered pages** (`home`, `story`, `contact`, `terroir`, `alaverdi-monastery-cellar`, `enologists`, `catalogue`, `legals`, `georgian-wine` — every page on the site now has one) have their own fixed, code-defined content shape and dedicated editor — e.g. `lib/pages/story.ts` defines `StoryContent` and `STORY_DEFAULT` (the fallback if the DB row is ever missing). A page's layout, animations, and structure stay in its `page.tsx` component; only its specific text/image fields come from the DB. To bring a new page onto this pattern: add a `lib/pages/<slug>.ts` content type + default, a form + route under `app/admin/(dashboard)/pages/<slug>/`, register it in both `REGISTERED_PAGES` (`app/admin/(dashboard)/pages/page.tsx`) and `RESERVED_SLUGS` (`lib/pages/generic.ts`, so an admin-created page can't collide with it), and thread `getPageContent` into the page component.
  - **Admin-created pages** (any slug not in `RESERVED_SLUGS`, `lib/pages/generic.ts`) use one fixed generic template — eyebrow, title, subtitle, an optional photo/video cover banner, a body text field (blank line = new paragraph) — plus a repeatable `sections` array (`PageSection` in `lib/pages/generic.ts`) that the admin can add to, remove from, and reorder freely. Four section types: `text` (heading + paragraphs), `media` (photo/video + caption, styled like the fixed cover), `cards` (a static numbered grid — title/subtitle/text, no links), and `profiles` (an accordion list — photo/name/role/bio, visually matching the Enologists page). Editor UI is in `app/admin/(dashboard)/pages/[slug]/generic-page-form.tsx`; public rendering is `app/generic-page-sections.tsx`. Existing rows saved before `sections` existed just render with none (`content.sections ?? []`) — no migration needed. Created via "+ Add page" at `/admin/pages` (`app/api/admin/pages/route.ts` POST), edited at `/admin/pages/<slug>` (`app/admin/(dashboard)/pages/[slug]/`), rendered publicly by the catch-all `app/[slug]/page.tsx`. Next.js resolves static routes (`/`, `/story`, `/contact`, …) before this dynamic one, so there's no collision with registered or hardcoded pages. Adding a page here doesn't add it to the site navigation — do that separately from Menu.
  - **`legals`** (`/legals`, `lib/pages/legals.ts`) is a registered page but a deliberate exception to "fixed sections": Terms and Conditions and Privacy Policy each hold a reorderable list of heading+body sections (reusing generic pages' `TextSection` type and the same add/remove/reorder UI pattern), since legal documents genuinely need new sections addable over time in a way marketing pages don't. Rendered as a two-tab page (`app/legals/legals-tabs.tsx`, `components/ui/tabs.tsx`) with the initial tab read from `?tab=terms-and-conditions`/`?tab=privacy-policy` and kept in sync on tab switches via `router.replace`. Seeded content (`drizzle/0019_seed_footer_redesign.sql`) is real Terms/Privacy copy pulled from a reference build — still marked "Draft for review" there, so treat it as a starting point for actual legal review, not final text.
  - **`georgian-wine`** (`/georgian-wine`, `lib/pages/georgian-wine.ts`) is a two-tab page (`app/georgian-wine/heritage-tabs.tsx`) covering the Badagoni figure and the qvevri winemaking tradition, each rendered through the same scroll-driven photo/text component as the Story page's winery section (`app/story/winery-scroll-scene.tsx`, now generalized to take an `image`/`imageOverlay`/`className` instead of always showing the winery photo — the Story page's own usage is unaffected, since those props default to its original image). Each chapter's photo is admin-uploaded and has an optional photo credit (shown as a small info-button popover) for cases like the Badagoni figure's Wikimedia Commons photograph — left blank, no credit button appears. Seeded content (`drizzle/0020_seed_georgian_wine_page.sql`) is real copy pulled from a reference build. Both tab triggers and their two `TabsContent` panels also read/write the `?tab=` query param via `useSearchParams`/`router.push` (wrapped in `<Suspense>`, same pattern as `legals` below), so the Alaverdi Monastery Cellar page's "The Qvevri Tradition" link (`/georgian-wine?tab=qvevri-tradition#qvevri-tradition`) actually opens the right tab.
  - **`legals`**'s tab row (`app/legals/legals-tabs.tsx`) reuses `georgian-wine`'s `heritage-tabs`/`heritage-index`/`heritage-tab`/`heritage-panel` classes rather than its own — same `?tab=` query-param pattern (`useSearchParams`/`router.push`, wrapped in `<Suspense>` in `app/legals/page.tsx`, with a `.legal-loading` fallback) instead of the earlier server-side `defaultTab` prop.
  - **`alaverdi-monastery-cellar`**'s qvevri section (`app/alaverdi-monastery-cellar/page.tsx`) is a full-bleed `WineryScrollScene` with the heading and a fixed link overlaid on the photo (`imageOverlay`, `intro={null}`) rather than a side-by-side photo/copy grid — matches a reference build's current page. The earlier three-fact "landmarks" strip below the cover photo was removed (not in that reference); `lib/pages/alaverdi.ts`'s `qvevri` field dropped its `eyebrow`/`body` fields to match.
- `lib/ui-strings/` — the site's other hardcoded copy: button/link labels, section eyebrows, and fallback text that don't belong to any single page's own content (e.g. "Explore the collection", "Enquire about this wine", the footer's fixed labels). `defaults.ts` has the English default and admin-panel display group for every key; `service.ts`'s `getUiStrings()` (React `cache()`-wrapped, so multiple components on one request share a single DB round trip) merges those defaults with any admin-saved rows in the `ui_strings` table (`key` → bilingual `value`, only written once a key is actually edited). Server components call `getUiStrings()` directly; client components (`app/site-shell.tsx`, `app/wine-collection.tsx`, etc.) take the resolved map as a `t` prop from their server-rendered parent, same as they already take `locale`, and look values up with the existing `localize(t["some.key"], locale)`. Deliberately left out, to keep the list to what visitors actually read: pure screen-reader-only aria-labels, `<title>`/meta description text, and the Saperavi Reserve page's bespoke long-form tasting notes and award names. Managed at `/admin/translations` (`app/admin/(dashboard)/translations/`) — one page, all keys grouped by area, a Translate button per row plus a "Translate all" bulk action that runs the same per-string Claude API call (`/api/admin/translate`) across every still-English key in sequence, and a single bulk save (`PATCH /api/admin/ui-strings`).
- `lib/news/service.ts` — the same, for `news_articles` (`listNewsArticles`, `getNewsArticleBySlug`, `createNewsArticle`, `updateNewsArticle`, `deleteNewsArticle`), sorted by `date` descending everywhere — no separate ordering field; the newest article is automatically the "Featured story" at the top of `/newsroom`. `lib/news/format.ts` holds `formatNewsDate` on its own (not in service.ts) so client components (`app/newsroom/news-cards.tsx`) can import it without pulling the D1-binding code into the browser bundle. Article images support photo or video (`ImagePicker allowVideo`, rendered via `BannerMedia`), plus a per-article `imageFit` (cover/contain) that applies to the featured story and article page — the newsroom grid thumbnail always crops to fill regardless.
- `app/admin/` — the admin UI: `/admin/wines` (list, new, edit), `/admin/categories` (list, new, edit), `/admin/menu` (list grouped by location, new, edit), `/admin/pages` (registered pages + admin-created pages, new, edit/delete for the latter), `/admin/news` (list, new, edit/delete), and `/admin/translations` (all UI string keys, grouped, one bulk save).
- `app/api/admin/` — the API routes the admin UI calls: `login`, `logout`, `wines` create, `wines/[slug]` update/delete, `categories` create, `categories/[id]` update/delete, `menu` create, `menu/[id]` update/delete, `pages` create, `pages/[slug]` update/delete, `news` create, `news/[slug]` update/delete, `ui-strings` bulk update, `upload` (images to R2), and `translate`.
- `lib/admin/auth.ts` — the password gate. One shared `ADMIN_PASSWORD`, checked with a timing-safe comparison of its SHA-256 hash (not the raw string). On success it creates a random session token in the `admin_sessions` table (30-day expiry) and sets it as an httpOnly cookie — logout (or letting a session expire) deletes just that row, so it actually revokes that one login rather than every past login staying valid until the password changes. Still intentionally lightweight for a small team, not a full multi-user auth system.
- `middleware.ts` (repo root) — sets security headers (CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, HSTS, `Permissions-Policy`) on every response. `next.config.ts`'s `headers()` option is *not* used for this — vinext only wires it into the generated static-asset `_headers` file, not actual page/API responses; middleware is the mechanism that reliably runs on every request in this stack.
- `lib/translate.ts` — calls the Claude API to translate English to Georgian, used by the "Translate" button (`app/admin/bilingual-field.tsx`) next to every bilingual field. Requires `ANTHROPIC_API_KEY` (get one at https://console.anthropic.com); without it, the button shows a clear error rather than failing silently. Every bilingual field — wine name/style/description, menu item labels — is stored as `{en, ka}` JSON (see the `Localized` type in `db/schema.ts`).
- `lib/i18n.ts` + `proxy.ts` — the public site's language switcher. `/ka/<path>` serves the exact same route as `/<path>`; `proxy.ts` (the Next.js 16 successor to `middleware.ts`, which now also carries the security headers) rewrites the request internally (stripping the `/ka` prefix) and tags it with a `x-badagoni-locale` request header, so no route files are duplicated under a `[locale]` segment. Server components call `getLocale()` (reads that header) and `localize(field, locale)` on every bilingual field instead of hardcoding `.en`; `localize` falls back to English whenever the Georgian side is empty, since most fields haven't been translated yet — use the "Translate" button per-field from admin to fill them in gradually, the page just keeps working (in English) in the meantime. Every internal `<Link href>` on the public site goes through `localizeHref(path, locale)` so navigation stays in the current language; `SiteHeader`/`SiteFooter` (`app/site-shell.tsx`) derive the "other" language's link to the current page by stripping any `/ka` prefix from the pathname first. The admin panel itself is not localized (still English-only, intentionally — it's an internal tool).
- `app/api/admin/upload/route.ts` + `app/media/[...key]/route.ts` — wine bottle images upload to an R2 bucket (binding `BUCKET`) and are served back at `/media/<key>`. See "Setting up image uploads (R2)" below.

## Local development

1. Copy `.dev.vars.example` to `.dev.vars` and set a real `ADMIN_PASSWORD`. Add `ANTHROPIC_API_KEY` too if you want to test the translate button locally — it's optional; everything else works without it. This file is gitignored — never commit it.
2. Run the install and build once so `dist/server/wrangler.json` exists (it declares the local D1 binding):
   ```sh
   npm run install:ci
   npm run build
   ```
3. Apply the migrations to the local D1 simulation (Wrangler persists this under `.wrangler/state`, so you only need to do this once — or again after `wrangler.json` regenerates from a clean `dist/`):
   ```sh
   npx wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state \
     --config dist/server/wrangler.json --file=drizzle/0000_faulty_masked_marvel.sql
   npx wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state \
     --config dist/server/wrangler.json --file=drizzle/0001_seed_wines.sql
   npx wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state \
     --config dist/server/wrangler.json --file=drizzle/0002_steady_mantis.sql
   npx wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state \
     --config dist/server/wrangler.json --file=drizzle/0003_seed_menu_items.sql
   npx wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state \
     --config dist/server/wrangler.json --file=drizzle/0004_wines_bilingual.sql
   npx wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state \
     --config dist/server/wrangler.json --file=drizzle/0005_brave_moira_mactaggert.sql
   npx wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state \
     --config dist/server/wrangler.json --file=drizzle/0006_seed_categories.sql
   npx wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state \
     --config dist/server/wrangler.json --file=drizzle/0007_wines_grapes_bilingual.sql
   npx wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state \
     --config dist/server/wrangler.json --file=drizzle/0008_powerful_romulus.sql
   npx wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state \
     --config dist/server/wrangler.json --file=drizzle/0009_seed_story_page.sql
   npx wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state \
     --config dist/server/wrangler.json --file=drizzle/0010_seed_home_page.sql
   npx wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state \
     --config dist/server/wrangler.json --file=drizzle/0011_seed_contact_page.sql
   npx wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state \
     --config dist/server/wrangler.json --file=drizzle/0012_seed_terroir_page.sql
   npx wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state \
     --config dist/server/wrangler.json --file=drizzle/0013_seed_alaverdi_page.sql
   npx wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state \
     --config dist/server/wrangler.json --file=drizzle/0014_seed_enologists_page.sql
   npx wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state \
     --config dist/server/wrangler.json --file=drizzle/0015_seed_catalogue_page.sql
   npx wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state \
     --config dist/server/wrangler.json --file=drizzle/0016_common_quicksilver.sql
   npx wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state \
     --config dist/server/wrangler.json --file=drizzle/0017_seed_news_articles.sql
   npx wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state \
     --config dist/server/wrangler.json --file=drizzle/0018_clean_stryfe.sql
   npx wrangler d1 execute site-creator-d1 --local --persist-to .wrangler/state \
     --config dist/server/wrangler.json --file=drizzle/0019_seed_footer_redesign.sql
   ```
4. `npm run dev` (Vite) or `npm start` (production build via local Wrangler) as usual, then sign in at `/admin` with the password from step 1. To test image uploads locally, also set `CLOUDFLARE_R2_BUCKET_NAME` (any name) in your shell before running dev/build — Miniflare will simulate that bucket on disk, same as it does for D1. Without it, the upload button shows "Image storage is not configured"; everything else works normally.

Note: `npm start` runs Wrangler directly against `dist/server/wrangler.json`, and Wrangler resolves `.dev.vars` **next to that config file**, not the repo root. If `ADMIN_PASSWORD` isn't picked up under `npm start`, also copy `.dev.vars` to `dist/server/.dev.vars` (this is build output and never committed). `npm run dev` (the Cloudflare Vite plugin) reads `.dev.vars` from the repo root as expected.

## Deploying for real (Cloudflare Workers Builds / dashboard)

`vite.config.ts` bakes a placeholder D1 database (`database_id`
`00000000-0000-4000-8000-000000000000`) into every build — that's what
Miniflare simulates locally. It's also what ships in `dist/server/wrangler.json`
by default, which is fine for local dev but **will not deploy**: Cloudflare
rejects a D1 binding that points at a nonexistent database ID.

Do **not** try to fix this by adding the binding through the dashboard's
**Settings → Bindings** UI after deploying — that only patches the currently
running version. The next build (the very next commit, or a manual retry)
regenerates `dist/server/wrangler.json` from scratch and reverts straight
back to the placeholder, silently breaking deploy again. `vite.config.ts`
supports an environment variable override specifically to avoid this trap;
use it instead.

1. **Create the real D1 database** (via the dashboard: Storage & Databases →
   D1 SQL Database → Create database → name it e.g. `badagoni-wines`; or via
   Wrangler CLI: `npx wrangler d1 create badagoni-wines`). Note its
   **Database ID** (shown on the database's Overview tab, or printed by the
   CLI command).
2. **Apply the migrations** to it, in order — either paste each file's
   contents into the database's dashboard **Console** tab, or via CLI:
   ```sh
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0000_faulty_masked_marvel.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0001_seed_wines.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0002_steady_mantis.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0003_seed_menu_items.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0004_wines_bilingual.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0005_brave_moira_mactaggert.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0006_seed_categories.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0007_wines_grapes_bilingual.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0008_powerful_romulus.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0009_seed_story_page.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0010_seed_home_page.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0011_seed_contact_page.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0012_seed_terroir_page.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0013_seed_alaverdi_page.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0014_seed_enologists_page.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0015_seed_catalogue_page.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0016_common_quicksilver.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0017_seed_news_articles.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0018_clean_stryfe.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0019_seed_footer_redesign.sql
   ```

   Note: migrations that use `json_object()`/`json_each()` (0004, 0006, 0007)
   must be pasted into the D1 dashboard's **Console** tab rather than run as
   `wrangler d1 execute --remote` if the CLI errors — the Console reliably
   supports these SQLite JSON functions; run each file's SQL once, not twice
   (running the same conversion migration a second time double-encodes the
   JSON — if that happens, it's fixable with a corrective unwrap query, no
   need to restore from backup).
3. In the Worker's **Build configuration** (Cloudflare Workers Builds / Git
   integration), add these as **build variables** (type "Variable", not "Secret"):
   - `CLOUDFLARE_D1_DATABASE_ID` — the real database ID from step 1
   - `CLOUDFLARE_D1_DATABASE_NAME` — optional, e.g. `badagoni-wines` (cosmetic only, defaults to `site-creator-d1`)
   - `CLOUDFLARE_R2_BUCKET_NAME` — see "Setting up image uploads (R2)" below
4. **Set `ADMIN_PASSWORD` and `ANTHROPIC_API_KEY` via the Wrangler CLI, not the dashboard's "Secret" row type.** The dashboard's build-config "Variables and secrets" panel *looks* like it supports secrets (type "Secret", value shown as "encrypted"), but for a Git-integrated Worker whose non-production branches only ever run `wrangler versions upload` (never a full `wrangler deploy`), a *new* secret added there silently never attaches — Cloudflare's secret-versioning system requires an actively deployed version to attach a secret to, and this project intentionally never deploys the feature branch. The CLI bypasses this:
   ```sh
   npx wrangler login
   npx wrangler versions secret put ADMIN_PASSWORD --name badagoni-new
   npx wrangler versions secret put ANTHROPIC_API_KEY --name badagoni-new
   ```
   Paste the value when prompted. This attaches the secret without deploying anything (do **not** run the `wrangler versions deploy` command it suggests afterward — that pushes to production traffic). After running this, push any commit (or retry the last build) so the branch's next `wrangler versions upload` picks up the newly attached secret — the CLI command alone only updates the Worker's secret store, not what's currently served at the preview URL.

   `ANTHROPIC_API_KEY` — get one at https://console.anthropic.com → API Keys → **Create Key**. The full key value (`sk-ant-api03-...`) is shown **only once**, in the creation popup — copy it from there via its Copy button. The console's key list afterward only ever shows a truncated value and a separate `apikey_...` ID (not usable as the key itself); if you didn't copy it at creation time, make a new key.
5. Trigger a rebuild (push a commit, or retry the last build). This time the
   generated config bakes in the real database ID and bucket name from step 3,
   so it deploys cleanly — and stays correct on every future rebuild, unlike
   the dashboard-binding approach.

Without step 4, `/admin` login will fail with "ADMIN_PASSWORD is not configured" — the same error you'd see locally without `.dev.vars`. Without `ANTHROPIC_API_KEY`, everything else in the admin panel works normally; only the "Translate" button shows an error.

## Setting up image/video uploads (R2)

Wine bottle images, and (where a picker has `allowVideo`, like Story's cover
and qvevri media) photos or short looping videos, upload through the admin
panel's `ImagePicker` (`app/admin/image-picker.tsx`) to an R2 bucket
(binding `BUCKET`) — see `app/api/admin/upload/route.ts` (accepts the
upload; images up to 8 MB, video up to 50 MB) and `app/media/[...key]/route.ts`
(serves it back out). A banner page component picks `<video>` vs `<img>` by
the uploaded file's extension (`lib/media.ts`'s `isVideoUrl`, wrapped by
`app/banner-media.tsx` for `ParallaxMedia` spots) — no separate "is this a
video" field is stored. Unlike D1, there's no placeholder fallback here: a
`bucket_name` that doesn't actually exist fails deploy outright, so
`vite.config.ts` omits the binding entirely until `CLOUDFLARE_R2_BUCKET_NAME`
is set, rather than risk breaking every deploy the way a bad D1 ID would.
For a real deploy:

1. **Create the bucket** via the CLI (the dashboard's Storage & Databases → R2
   works too): `npx wrangler r2 bucket create badagoni-media`.
2. Add `CLOUDFLARE_R2_BUCKET_NAME=badagoni-media` as a build **Variable**
   (not a secret — bucket names aren't sensitive) in the same Build
   configuration panel as `CLOUDFLARE_D1_DATABASE_ID`.
3. Trigger a rebuild. Unlike the runtime secrets above, this binds cleanly
   through the normal build process — `r2_buckets` (like `d1_databases`) is
   declared directly in the generated `wrangler.json` that `wrangler versions
   upload`/`wrangler deploy` reads, so it isn't subject to the
   deployed-version restriction that runtime secrets hit.

Without this, the upload button shows "Image storage is not configured" —
everything else in the admin panel still works.
