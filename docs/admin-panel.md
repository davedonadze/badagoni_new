# Wine database and admin panel

Wines used to live in a static `app/wine-data.json` file. They now live in a
Cloudflare D1 database (`db/schema.ts`, table `wines`), and can be added,
edited, and deleted through a password-protected admin panel at `/admin`
instead of a code push. `app/wine-data.json` is kept only as the historical
source for the seed migration (`drizzle/0001_seed_wines.sql`) — nothing at
runtime reads it anymore.

## How it fits together

- `db/schema.ts` — the `wines`, `categories`, `menu_items`, and `pages` tables (Drizzle ORM / SQLite dialect, since D1 is SQLite).
- `drizzle/0000_*.sql` — creates the wines table. `drizzle/0001_seed_wines.sql` — inserts the original 41 wines. `drizzle/0002_*.sql` — creates `menu_items`. `drizzle/0003_seed_menu_items.sql` — inserts the current header/footer navigation. `drizzle/0004_wines_bilingual.sql` — converts `wines.name`/`style`/`description` from plain text to bilingual `{en, ka}` JSON. `drizzle/0005_*.sql` — creates `categories`. `drizzle/0006_seed_categories.sql` — inserts the original 6 wine categories. `drizzle/0007_wines_grapes_bilingual.sql` — converts `wines.grapes` from a plain string array to bilingual `{en, ka}` JSON (one comma-separated field, same as name/style/description). `drizzle/0008_*.sql` — creates `pages`. `drizzle/0009_seed_story_page.sql` — inserts the Story page's original copy as its starting content. `drizzle/0010_seed_home_page.sql` — same, for the homepage.
- `lib/wines/service.ts` — the only place that talks to the wines table (`listWines`, `getWineBySlug`, `createWine`, `updateWine`, `deleteWine`). Public pages (`/`, `/catalogue`, `/wines/[slug]`) and the admin panel both call this.
- `lib/categories/service.ts` — the same, for `categories` (wine categories like red/white/qvevri — `id` is the slug stored in `wines.category`/`categories`, immutable after creation in the admin UI). Public pages resolve category labels through this instead of a hardcoded map.
- `lib/menu/service.ts` — the same, for `menu_items`. `app/layout.tsx` calls `listMenuItems()` and passes the header/footer links down to `<SiteHeader>`/`<SiteFooter>` (`app/site-shell.tsx`) as props — the nav is no longer hardcoded.
- `lib/pages/service.ts` — generic get/save for the `pages` table (`slug` → JSON `content`). **Not a block builder**: each page's content shape is fixed and typed by its own module (e.g. `lib/pages/story.ts` defines `StoryContent` and `STORY_DEFAULT`, the fallback used if the DB row is ever missing) — the admin UI only lets you edit that page's specific fields, not add/remove/reorder sections. A page's layout, animations, and structure stay in its `page.tsx` component; only text and images come from the DB. To bring a new page onto this pattern: add a `lib/pages/<slug>.ts` content type + default, a form component under `app/admin/(dashboard)/pages/<slug>/`, register it in `app/admin/(dashboard)/pages/page.tsx`, and thread `getPageContent` into the page component. Home (`/`) and Story (`/story`) are the only pages migrated so far — terroir/contact/alaverdi-monastery-cellar/enologists otherwise stay fully hardcoded.
- `app/admin/` — the admin UI: `/admin/wines` (list, new, edit), `/admin/categories` (list, new, edit), `/admin/menu` (list grouped by location, new, edit), and `/admin/pages` (list of registered pages, each with its own fixed-field editor).
- `app/api/admin/` — the API routes the admin UI calls: `login`, `logout`, `wines` create, `wines/[slug]` update/delete, `categories` create, `categories/[id]` update/delete, `menu` create, `menu/[id]` update/delete, `pages/[slug]` update, `upload` (images to R2), and `translate`.
- `lib/admin/auth.ts` — the password gate. One shared `ADMIN_PASSWORD`; on success it sets an httpOnly cookie holding a SHA-256 hash of the password (not the password itself). There is no separate user/session table — this is intentionally a lightweight gate for a small team, not a full auth system.
- `lib/translate.ts` — calls the Claude API to translate English to Georgian, used by the "Translate" button (`app/admin/bilingual-field.tsx`) next to every bilingual field. Requires `ANTHROPIC_API_KEY` (get one at https://console.anthropic.com); without it, the button shows a clear error rather than failing silently. Every bilingual field — wine name/style/description, menu item labels — is stored as `{en, ka}` JSON (see the `Localized` type in `db/schema.ts`) — the public site currently only renders the English side; Georgian pages are a later phase.
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
