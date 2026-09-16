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

## Deploying for real (Cloudflare dashboard)

If you're connecting this repo to Cloudflare Workers via Git (see the main deploy instructions), two things need to be set up once, outside the Git-connected build:

1. **Create the real D1 database** and update the binding's `database_id`:
   ```sh
   npx wrangler d1 create badagoni-wines
   ```
   Take the `database_id` it prints and set it in `.openai/hosting.json` is not where IDs live for this generated config — instead, after your first Cloudflare deploy, open the Worker's **Settings → Bindings** in the dashboard and either bind the D1 database there directly, or re-run `wrangler d1 create` locally and update the `database_id` wherever your deploy pipeline sources it from (this starter generates `dist/server/wrangler.json` at build time from `.openai/hosting.json`'s `d1`/`r2` fields plus a placeholder ID — production deploys should bind the real database explicitly in the Cloudflare dashboard rather than relying on the placeholder).
2. **Apply migrations to the real database**:
   ```sh
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0000_faulty_masked_marvel.sql
   npx wrangler d1 execute badagoni-wines --remote --file=drizzle/0001_seed_wines.sql
   ```
3. **Set the admin password as a secret** (never as a plain build environment variable):
   ```sh
   npx wrangler secret put ADMIN_PASSWORD
   ```
   Or set it as an encrypted variable in the Cloudflare dashboard under the Worker's Settings → Variables.

Without step 3, `/admin` login will fail with "ADMIN_PASSWORD is not configured" — the same error you'd see locally without `.dev.vars`.
