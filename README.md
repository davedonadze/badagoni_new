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

Wines, wine categories, site navigation, and every page's content are stored in a Cloudflare D1 database (`db/schema.ts`: `wines`, `categories`, `menu_items`, `pages`), not hardcoded. `app/wine-data.json` is kept only as the historical seed source for `drizzle/0001_seed_wines.sql` — it is not read at runtime.

`/admin` is a password-protected panel (see `app/admin/`) for managing wines (`/admin/wines`, including bottle images uploaded to R2), wine categories (`/admin/categories`), the header/footer navigation (`/admin/menu`), every page's text/images (`/admin/pages` — home, story, contact, terroir, the Alaverdi Monastery Cellar page, enologists, the catalogue heading, legals (Terms and Conditions / Privacy Policy), and Georgian wine (the Badagoni figure and Qvevri tradition tabs) each have a dedicated editor for their own fields; a page's layout and animations stay in code, only its fields are editable; "+ Add page" creates new pages on a generic template that also supports adding, removing, and reordering text/media/card/profile sections), and news & stories (`/admin/news` — add, edit, and delete articles shown at `/newsroom`, with a photo or video image, cover fit, body text, and optional source/related links) without a code deploy. The footer's two link columns and social links are managed from `/admin/menu` (locations `footer_primary`/`footer_secondary`/`footer_social`), independent of the header nav. Every bilingual field has an English/Georgian pair and a "Translate" button backed by the Claude API. The public site has a working language switcher (`/ka/...` URLs — see `lib/i18n.ts`/`proxy.ts`) that falls back to English wherever a Georgian field is still empty, so translating content is a gradual, per-field process rather than an all-or-nothing launch. Full setup instructions — local dev, provisioning the real D1 database and R2 bucket, and setting `ADMIN_PASSWORD`/`ANTHROPIC_API_KEY` — are in `docs/admin-panel.md`.

## Local commands

Use the Sites plugin lifecycle scripts for installation, build and publication. `npm run build` builds the Cloudflare-compatible output. See `docs/admin-panel.md` before your first `npm run dev`/`npm start` — the admin panel and wine pages need a database migration and an `ADMIN_PASSWORD` to work locally.

Validation: successful production build, TypeScript check, and complete route/image/font reference checks. Browser QA was not requested.
