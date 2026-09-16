# Wine database and admin panel

Wines used to live in a static `app/wine-data.json` file. They now live in a
Cloudflare D1 database (`db/schema.ts`, table `wines`), and can be added,
edited, and deleted through a password-protected admin panel at `/admin`
instead of a code push. `app/wine-data.json` is kept only as the historical
source for the seed migration (`drizzle/0001_seed_wines.sql`) — nothing at
runtime reads it anymore.

## How it fits together

- `db/schema.ts` — the `wines` table (Drizzle ORM / SQLite dialect, since D1 is SQLite).
- `drizzle/0000_*.sql` — creates the table. `drizzle/0001_seed_wines.sql` — inserts the original 41 wines.
- `lib/wines/service.ts` — the only place that talks to the database (`listWines`, `getWineBySlug`, `createWine`, `updateWine`, `deleteWine`). Public pages (`/`, `/catalogue`, `/wines/[slug]`) and the admin panel both call this.
- `app/admin/` — the admin UI (`/admin/wines` list, `/admin/wines/new`, `/admin/wines/[slug]` edit form).
- `app/api/admin/` — the API routes the admin UI calls (`login`, `logout`, `wines` create, `wines/[slug]` update/delete).
- `lib/admin/auth.ts` — the password gate. One shared `ADMIN_PASSWORD`; on success it sets an httpOnly cookie holding a SHA-256 hash of the password (not the password itself). There is no separate user/session table — this is intentionally a lightweight gate for a small team, not a full auth system.

## Local development

1. Copy `.dev.vars.example` to `.dev.vars` and set a real `ADMIN_PASSWORD`. This file is gitignored — never commit it.
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
   ```
4. `npm run dev` (Vite) or `npm start` (production build via local Wrangler) as usual, then sign in at `/admin` with the password from step 1.

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
2. **Apply the migrations** to it — either paste the contents of
   `drizzle/0000_faulty_masked_marvel.sql` then `drizzle/0001_seed_wines.sql`
   into the database's dashboard **Console** tab, or via CLI:
   ```sh
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0000_faulty_masked_marvel.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0001_seed_wines.sql
   ```
3. In the Worker's **Build configuration** (Cloudflare Workers Builds / Git
   integration), add these as **build variables**, not bindings:
   - `CLOUDFLARE_D1_DATABASE_ID` — the real database ID from step 1
   - `CLOUDFLARE_D1_DATABASE_NAME` — optional, e.g. `badagoni-wines` (cosmetic only, defaults to `site-creator-d1`)
4. **Set the admin password as an encrypted build variable** too:
   `ADMIN_PASSWORD` — your chosen password, with "Encrypt" turned on. (Via
   CLI instead: `npx wrangler secret put ADMIN_PASSWORD`.)
5. Trigger a rebuild (push a commit, or retry the last build). This time the
   generated config bakes in the real database ID from step 3, so it deploys
   cleanly — and stays correct on every future rebuild, unlike the
   dashboard-binding approach.

Without step 3, `/admin` login will fail with "ADMIN_PASSWORD is not configured" — the same error you'd see locally without `.dev.vars`.
