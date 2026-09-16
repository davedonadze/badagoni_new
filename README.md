# Badagoni

Contemporary website for Badagoni, built with the Sites Vinext starter.

## Pages

- `/`: editorial homepage and four featured wines
- `/catalogue`: all 41 catalogue products, category tabs and wine detail panels
- `/wines`: redirects to `/catalogue`
- `/story`: brand history and qvevri heritage
- `/terroir`: Kakhetian vineyards
- `/contact`: direct email, phone and office map links

Content and image provenance are recorded in `docs/`. Wine records are stored in `app/wine-data.json`. Images and fonts are self-hosted in `public/`.

The site is in English. Contact actions open the visitor’s email or phone application. There is no checkout, contact database or newsletter backend.

## Local commands

Use the Sites plugin lifecycle scripts for installation, build and publication. `npm run build` builds the Cloudflare-compatible output.

Validation: successful production build, TypeScript check, and complete route/image/font reference checks. Browser QA was not requested.
