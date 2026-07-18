# TheOzLabs New App Integration Contract

This file is the canonical handoff for every future TheOzLabs app. Read it before changing the public website.

## Core rule

Every new app must be added as a sibling of SerialFlow, PosterTile, BookletFlow, and SheetNest. The new app should feel like part of the same family, while keeping its own subject, icon, copy, and public page.

## Never break existing review infrastructure

Before any website change:

- Do not rename or delete existing repositories.
- Do not change existing app IDs, deployment URLs, GitHub Pages settings, Canva review URLs, or stable public paths.
- Do not redirect or repurpose an existing app page.
- Confirm the change is presentation-only unless the user explicitly requests infrastructure changes.

## Required inputs for a new app

Collect or confirm:

- App name
- Stable slug, for example `newapp.html`
- One-sentence purpose
- Subject/category label
- Three main features
- Original app icon
- Current internal lifecycle status
- Public support needs
- Any app ID, repository, deployment, or Canva review URL that must be frozen

## Required website integration

For every new app:

1. Create a dedicated public page using the existing product-page structure.
2. Add the app card to both `index.html` and `apps.html`.
3. Add a separate row to `status.html`; never group multiple apps under one generic row.
4. Add the page to `site.js` prefetching and app metadata.
5. Add the app to `APP_REGISTRY.json` with its real internal status and frozen infrastructure details.
6. Add its stable public path to `PROJECT_STATE.md`.
7. Update all relevant cache-busting version references after shared JavaScript or assets change.

## Brand and presentation rules

- Shared TheOzLabs logo: orange tie.
- Every app uses its own original product icon.
- Do not redraw, crop, stretch, or heavily recompress user-provided icons.
- Display icons with `object-fit: contain`, centered, with consistent padding and corner radius.
- Public badge text: `For Canva users`.
- Status middle-column text: `Canva workflow`.
- Keep real internal states, such as Canva review, separate in `APP_REGISTRY.json`; do not expose them as the public marketing label unless explicitly requested.
- Preserve the existing typography, spacing, card style, responsive behavior, footer, privacy, terms, support, and status language.

## Copy structure for each app

Each app needs:

- A specific category label
- A clear product name
- A one-sentence explanation of the exact job it performs
- Three distinct feature blocks
- A dedicated original icon
- Links to Support, Status, Privacy, Terms, and the full app suite

Avoid generic copy that could describe every app. The subject and benefits must match the app's actual workflow.

## Validation checklist

Before publishing:

- Verify Home, Apps, Status, Support, Privacy, Terms, and every app page load.
- Verify all app-card links and footer links.
- Verify the new icon appears correctly on Home, Apps, Status, and its product page.
- Verify no icon is cropped, stretched, blurry, or replaced by a broken-image symbol.
- Verify desktop, tablet, mobile, light mode, and dark mode.
- Verify the orange tie remains the shared brand mark and favicon.
- Verify existing stable URLs and reviewed app infrastructure remain unchanged.
- Verify public labels say `For Canva users` and status detail says `Canva workflow`.
- Verify `APP_REGISTRY.json` and `PROJECT_STATE.md` match the shipped website.

## Future-chat handoff phrase

In a new ChatGPT conversation, the user can say:

`Continue the TheOzLabs project. Read PROJECT_STATE.md, APP_REGISTRY.json, and NEW_APP_INTEGRATION.md in ozgurkilinc/theozlabs-site before making changes.`

Those repository files are the source of truth if chat memory is incomplete or conflicts with the repository.
