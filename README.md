# Badagoni

Contemporary website for Badagoni, built with the Sites Vinext starter.

## Pages

- `/`: editorial homepage and four featured wines
- `/catalogue`: all 41 catalogue products, category tabs and wine detail panels
- `/wines`: redirects to `/catalogue`
- `/story`: brand history and qvevri heritage
- `/terroir`: Kakhetian vineyards
- `/contact`: direct email, phone and office map links

Content and image provenance are recorded in `docs/`. Images and fonts are self-hosted in `public/`.

The site is in English. Contact actions open the visitor’s email or phone application. There is no checkout or newsletter backend.

## Content, navigation, and the admin panel

Wines and site navigation are stored in a Cloudflare D1 database (`db/schema.ts`: `wines`, `menu_items`), not hardcoded. `app/wine-data.json` is kept only as the historical seed source for `drizzle/0001_seed_wines.sql` — it is not read at runtime.

`/admin` is a password-protected panel (see `app/admin/`) for managing wines (`/admin/wines`) and the header/footer navigation (`/admin/menu`) without a code deploy. Every bilingual field has an English/Georgian pair and a "Translate from English" button backed by the Claude API; the public site currently renders the English side only. Full setup instructions — local dev, provisioning the real D1 database, and setting `ADMIN_PASSWORD`/`ANTHROPIC_API_KEY` — are in `docs/admin-panel.md`.

## Local commands

Use the Sites plugin lifecycle scripts for installation, build and publication. `npm run build` builds the Cloudflare-compatible output. See `docs/admin-panel.md` before your first `npm run dev`/`npm start` — the admin panel and wine pages need a database migration and an `ADMIN_PASSWORD` to work locally.

Validation: successful production build, TypeScript check, and complete route/image/font reference checks. Browser QA was not requested.
