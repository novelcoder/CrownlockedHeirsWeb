# Crownlocked Heirs

Responsive series website for Jamie McFarlane's _Crownlocked Heirs_ LitRPG fantasy novels.

The homepage's book content is fully database-driven: it resolves the Crownlocked
Heirs series from the shared Appwrite `series` table by its `crownlocked-heirs`
slug, then reads that series' rows from the `books` table, ordered by
`series_number`. There is no local book fallback — if Appwrite is unreachable or
the series has no books, the homepage renders a neutral "unavailable" state
instead of stale or invented book data.

Books and the series are read server-side via `lib/appwrite.ts`, authenticated
with a privileged `CMS_API_KEY` (using the `node-appwrite` server SDK's TablesDB
service) — not from the browser. The key never reaches the client.

## Local preview

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in `CMS_API_KEY` with an Appwrite API
key scoped to `databases.read` + `documents.read` (read-only, no write scopes).
Set `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` to a GA4 web stream ID in the form
`G-XXXXXXXXXX` to enable the consent controls. Leaving it blank or setting an
invalid value leaves the site fully functional without loading Analytics or
showing Cookie settings.

## Analytics and consent

The site uses a custom, first-party consent control and Google’s basic consent
model. The Google tag is not requested and no Analytics event is sent until the
visitor explicitly selects **Allow analytics**. The choice lasts six months and
can be changed from the persistent footer control.

Page views and retailer links are measured explicitly so their parameters stay
consistent. In the GA4 web stream’s Enhanced Measurement settings:

- Under **Page views**, turn off **Page changes based on browser history events**.
- Turn off **Outbound clicks**.

The first setting prevents GA4’s history listener from duplicating the app’s
manual route-change page views. The second prevents its generic `click` event
from duplicating the site’s `retailer_link_click` event. Other Enhanced
Measurement options can remain independently configured.

## Search discovery

Next.js publishes the public search-engine discovery files at `/sitemap.xml`
and `/robots.txt`. Both use `https://crownlockedheirs.com` as the canonical
origin. Keep `app/sitemap.ts` synchronized with any future public routes.

## Appwrite Sites deployment

Connect this repository from **Sites** in the Appwrite Console and use:

- Framework: Next.js
- Rendering: Server-side rendering (SSR)
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `.next`

Add the four CMS variables from `.env.example` (including `CMS_API_KEY`) in the
site's environment settings. Add `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` only when GA4
is configured. These values are needed at build time too, since the homepage
prerenders statically. If Appwrite is unreachable or misconfigured, the homepage
renders a neutral "book details unavailable" state rather than failing or
showing stale data.
